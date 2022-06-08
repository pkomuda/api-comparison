package pl.dmcs.service;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
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
import java.util.UUID;
import java.util.stream.Collectors;

import static javax.transaction.Transactional.TxType.REQUIRES_NEW;
import static pl.dmcs.entity.AccessLevel.ACCESS_LEVEL_USER;
import static pl.dmcs.exception.ApplicationException.*;

@ApplicationScoped
@RequiredArgsConstructor
@Transactional(REQUIRES_NEW)
public class AccountService {

    @ConfigProperty(name = "mp.jwt.verify.issuer") String jwtIssuer;
    @ConfigProperty(name = "frontend.url") String frontendUrl;
    private final AccountRepository accountRepository;
    private final Mailer mailer;

    public String login(LoginDto loginDto) {
        Account account = doGetAccount(loginDto.getUsername());
        if (!account.isActive() || !account.isConfirmed()
                || !BcryptUtil.matches(loginDto.getPassword(), account.getPassword())) {
            throw new ApplicationException(KEY_LOGIN_FAILED);
        }
        return Jwt.issuer(jwtIssuer)
                .upn(account.getUsername())
                .groups(account.getAccessLevels().stream()
                        .filter(AccessLevel::isActive)
                        .map(AccessLevel::getName)
                        .collect(Collectors.toSet()))
                .expiresIn(Duration.ofHours(1))
                .sign();
    }

    public void register(RegisterDto registerDto) {
        if (!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            throw new ApplicationException(KEY_PASSWORDS_NOT_MATCHING);
        }
        Account account = AccountMapper.toAccount(registerDto);
        account.setActive(true);
        account.setConfirmed(false);
        account.setConfirmationToken(UUID.randomUUID().toString());
        account.addAccessLevels(Set.of(ACCESS_LEVEL_USER));
        doAddAccount(account);
        mailer.send(Mail.withHtml(registerDto.getEmail(), "Confirm your account", """
                Click <a href="%s/confirm/%s">here</a> to confirm your account
                """.formatted(frontendUrl, account.getConfirmationToken())));
    }

    public void confirmAccount(String token) {
        Account account = accountRepository.findByConfirmationToken(token)
                .orElseThrow(() -> new ApplicationException(KEY_ACCOUNT_NOT_FOUND));
        account.setConfirmed(true);
    }

    public void addAccount(AddAccountDto addAccountDto) {
        if (!addAccountDto.getPassword().equals(addAccountDto.getConfirmPassword())) {
            throw new ApplicationException(KEY_PASSWORDS_NOT_MATCHING);
        }
        Account account = AccountMapper.toAccount(addAccountDto);
        account.setConfirmed(true);
        account.addAccessLevels(addAccountDto.getAccessLevels());
        doAddAccount(account);
    }

    public AccountDetailsDto getAccount(String username) {
        return AccountMapper.toAccountDetailsDto(doGetAccount(username));
    }

    public List<AccountDetailsDto> getAllAccounts() {
        return AccountMapper.toAccountDetailsDtos(accountRepository.listAll());
    }

    public AccountPagesDto getAccounts(String query, String sort, String dir, int page, int size) {
        return AccountMapper.toAccountPagesDto(accountRepository.find(query, sort, dir, page, size));
    }

    public void editAccount(String username, AccountDetailsDto accountDetailsDto) {
        if (!username.equals(accountDetailsDto.getUsername())) {
            throw new ApplicationException(KEY_USERNAMES_NOT_MATCHING);
        }
        if (accountDetailsDto.getAccessLevels().isEmpty()) {
            throw new ApplicationException(KEY_ACCESS_LEVELS_EMPTY);
        }
        Account account = doGetAccount(accountDetailsDto.getUsername());
        account.setFirstName(accountDetailsDto.getFirstName());
        account.setLastName(accountDetailsDto.getLastName());
        account.setActive(accountDetailsDto.isActive());
        account.getAccessLevels().forEach(accessLevel -> {
            if (accountDetailsDto.getAccessLevels().contains(accessLevel.getName()) && !accessLevel.isActive()) {
                accessLevel.setActive(true);
            } else if (!accountDetailsDto.getAccessLevels().contains(accessLevel.getName()) && accessLevel.isActive()) {
                accessLevel.setActive(false);
            }
        });
    }

    public void editAccount(SecurityContext context, AccountDetailsDto accountDetailsDto) {
        if (!context.getUserPrincipal().getName().equals(accountDetailsDto.getUsername())) {
            throw new ApplicationException(KEY_USERNAMES_NOT_MATCHING);
        }
        Account account = doGetAccount(accountDetailsDto.getUsername());
        account.setFirstName(accountDetailsDto.getFirstName());
        account.setLastName(accountDetailsDto.getLastName());
    }

    public void changePassword(ChangePasswordDto changePasswordDto) {
        if (!changePasswordDto.getPassword().equals(changePasswordDto.getConfirmPassword())) {
            throw new ApplicationException(KEY_PASSWORDS_NOT_MATCHING);
        }
        Account account = doGetAccount(changePasswordDto.getUsername());
        account.setPassword(BcryptUtil.bcryptHash(changePasswordDto.getPassword()));
    }

    private void doAddAccount(Account account) {
        try {
            accountRepository.persistAndFlush(account);
        } catch (PersistenceException e) {
            if (e.getCause() instanceof ConstraintViolationException) {
                throw new ApplicationException(KEY_ACCOUNT_EXISTS, e);
            } else {
                throw new ApplicationException(e);
            }
        }
    }

    private Account doGetAccount(String username) {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new ApplicationException(KEY_ACCOUNT_NOT_FOUND));
    }
}
