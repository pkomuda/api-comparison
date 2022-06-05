package pl.dmcs.service;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.smallrye.jwt.build.Jwt;
import lombok.RequiredArgsConstructor;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.hibernate.exception.ConstraintViolationException;
import pl.dmcs.dto.*;
import pl.dmcs.entity.AccessLevel;
import pl.dmcs.entity.Account;
import pl.dmcs.exception.ApplicationException;
import pl.dmcs.mapper.AccountMapper;
import pl.dmcs.repository.AccountRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.PersistenceException;
import javax.transaction.Transactional;
import javax.ws.rs.core.SecurityContext;
import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static javax.transaction.Transactional.TxType.REQUIRES_NEW;
import static pl.dmcs.entity.AccessLevel.ACCESS_LEVEL_USER;
import static pl.dmcs.exception.ApplicationException.*;

@ApplicationScoped
@RequiredArgsConstructor
@Transactional(REQUIRES_NEW)
public class AccountService {

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String jwtIssuer;

    private final AccountRepository accountRepository;

    public String login(LoginDto loginDto) {
        Account account = accountRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new ApplicationException(KEY_ACCOUNT_NOT_FOUND));
        if (!account.isActive() || !account.isConfirmed()) {
            throw new ApplicationException(KEY_LOGIN_FAILED);
        }
        if (BcryptUtil.matches(loginDto.getPassword(), account.getPassword())) {
            return Jwt.issuer(jwtIssuer)
                    .upn(account.getUsername())
                    .groups(account.getAccessLevels().stream()
                            .filter(AccessLevel::isActive)
                            .map(AccessLevel::getName)
                            .collect(Collectors.toSet()))
                    .expiresIn(Duration.ofHours(1))
                    .sign();
        } else {
            throw new ApplicationException(KEY_LOGIN_FAILED);
        }
    }

    public void register(RegisterDto registerDto) {
        if (!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            throw new ApplicationException(KEY_PASSWORDS_NOT_MATCHING);
        }
        Account account = AccountMapper.toEntity(registerDto);
        account.setPassword(BcryptUtil.bcryptHash(registerDto.getPassword()));
        account.setConfirmed(false);
        account.addAccessLevels(Set.of(ACCESS_LEVEL_USER));
        doAddAccount(account);
    }

    public void addAccount(AddAccountDto addAccountDto) {
        if (!addAccountDto.getPassword().equals(addAccountDto.getConfirmPassword())) {
            throw new ApplicationException(KEY_PASSWORDS_NOT_MATCHING);
        }
        Account account = AccountMapper.toEntity(addAccountDto);
        account.setPassword(BcryptUtil.bcryptHash(addAccountDto.getPassword()));
        account.setConfirmed(true);
        account.addAccessLevels(addAccountDto.getAccessLevels());
        doAddAccount(account);
    }

    private void doAddAccount(Account account) {
        try {
            accountRepository.persistAndFlush(account);
        } catch (PersistenceException e) {
            if (e.getCause() instanceof ConstraintViolationException) {
                throw new ApplicationException(KEY_ACCOUNT_EXISTS, e);
            }
        }
    }

    public AccountDto getAccount(String username) {
        return AccountMapper.toDto(accountRepository.findByUsername(username)
                .orElseThrow(() -> new ApplicationException(KEY_ACCOUNT_NOT_FOUND)));
    }

    public List<AccountDto> getAllAccounts() {
        return AccountMapper.toDtos(accountRepository.listAll());
    }

    public AccountPagesDto getAccounts(String query, String sort, String dir, int page, int size) {
        return AccountMapper.toDtoPages(accountRepository.find(query, sort, dir, page, size));
    }

    public void editAccount(String username, AccountDto accountDto) {
        if (!username.equals(accountDto.getUsername())) {
            throw new ApplicationException(KEY_USERNAMES_NOT_MATCHING);
        }
        if (accountDto.getAccessLevels().isEmpty()) {
            throw new ApplicationException(KEY_ACCESS_LEVELS_EMPTY);
        }
        Account account = accountRepository.findByUsername(accountDto.getUsername())
                .orElseThrow(() -> new ApplicationException(KEY_ACCOUNT_NOT_FOUND));
        account.setFirstName(accountDto.getFirstName());
        account.setLastName(accountDto.getLastName());
        account.setActive(accountDto.isActive());
        account.getAccessLevels().forEach(accessLevel -> {
            if (accountDto.getAccessLevels().contains(accessLevel.getName()) && !accessLevel.isActive()) {
                accessLevel.setActive(true);
            } else if (!accountDto.getAccessLevels().contains(accessLevel.getName()) && accessLevel.isActive()) {
                accessLevel.setActive(false);
            }
        });
    }

    public void editAccount(SecurityContext context, AccountDto accountDto) {
        if (!context.getUserPrincipal().getName().equals(accountDto.getUsername())) {
            throw new ApplicationException(KEY_USERNAMES_NOT_MATCHING);
        }
        Account account = accountRepository.findByUsername(accountDto.getUsername())
                .orElseThrow(() -> new ApplicationException(KEY_ACCOUNT_NOT_FOUND));
        account.setFirstName(accountDto.getFirstName());
        account.setLastName(accountDto.getLastName());
    }

    public void changePassword(ChangePasswordDto changePasswordDto) {
        if (!changePasswordDto.getPassword().equals(changePasswordDto.getConfirmPassword())) {
            throw new ApplicationException(KEY_PASSWORDS_NOT_MATCHING);
        }
        Account account = accountRepository.findByUsername(changePasswordDto.getUsername())
                .orElseThrow(() -> new ApplicationException(KEY_ACCOUNT_NOT_FOUND));
        account.setPassword(BcryptUtil.bcryptHash(changePasswordDto.getPassword()));
    }
}
