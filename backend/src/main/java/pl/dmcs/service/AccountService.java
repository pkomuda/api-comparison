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
import pl.dmcs.util.Page;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.PersistenceException;
import javax.transaction.Transactional;
import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static javax.transaction.Transactional.TxType.REQUIRES_NEW;
import static pl.dmcs.entity.AccessLevel.ACCESS_LEVEL_CLIENT;
import static pl.dmcs.entity.AccessLevel.ACCESS_LEVEL_NAMES;
import static pl.dmcs.exception.ApplicationException.*;

@ApplicationScoped
@RequiredArgsConstructor
@Transactional(REQUIRES_NEW)
public class AccountService {

    private final AccountRepository accountRepository;

    public String login(LoginDto loginDto) {
        Account account = findAccount(loginDto.getUsername());
        if (!account.isActive() || !BcryptUtil.matches(loginDto.getPassword(), account.getPassword())) {
            throw new ApplicationException(LOGIN_FAILED);
        }
        return Jwt.issuer("backend")
                .upn(account.getUsername())
                .groups(account.getAccessLevels().stream()
                        .filter(AccessLevel::isActive)
                        .map(AccessLevel::getName)
                        .collect(Collectors.toSet()))
                .expiresIn(Duration.ofHours(1))
                .sign();
    }

    public AccountDetailsDto register(RegisterDto registerDto) {
        if (!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            throw new ApplicationException(PASSWORDS_NOT_MATCHING);
        }
        Account account = AccountMapper.toAccount(registerDto);
        account.setActive(true);
        if (accountRepository.count() == 0) {
            account.addAllAccessLevels(ACCESS_LEVEL_NAMES);
        } else {
            account.addAllAccessLevels(Set.of(ACCESS_LEVEL_CLIENT));
        }
        addAccount(account);
        return AccountMapper.toAccountDetailsDto(account);
    }

    public AccountDetailsDto addAccount(AddAccountDto addAccountDto) {
        if (!addAccountDto.getPassword().equals(addAccountDto.getConfirmPassword())) {
            throw new ApplicationException(PASSWORDS_NOT_MATCHING);
        }
        Account account = AccountMapper.toAccount(addAccountDto);
        account.addAllAccessLevels(addAccountDto.getAccessLevels());
        addAccount(account);
        return AccountMapper.toAccountDetailsDto(account);
    }

    public AccountDetailsDto getAccount(String username) {
        return AccountMapper.toAccountDetailsDto(findAccount(username));
    }

    public List<AccountDetailsDto> getAllAccounts() {
        return AccountMapper.toAccountDetailsDtos(accountRepository.listAll());
    }

    public Page<AccountDetailsDto> getAccounts(String query, String sort, String dir, int page, int size) {
        return accountRepository.find(query, sort, dir, page, size)
                .map(AccountMapper::toAccountDetailsDto);
    }

    public AccountDetailsDto editAccount(String username, AccountDetailsDto accountDetailsDto) {
        if (!username.equals(accountDetailsDto.getUsername())) {
            throw new ApplicationException(USERNAMES_NOT_MATCHING);
        }
        if (accountDetailsDto.getAccessLevels() == null || accountDetailsDto.getAccessLevels().isEmpty()) {
            throw new ApplicationException(ACCESS_LEVELS_EMPTY);
        }
        Account account = findAccount(accountDetailsDto.getUsername());
        account.setFirstName(accountDetailsDto.getFirstName());
        account.setLastName(accountDetailsDto.getLastName());
        account.setActive(accountDetailsDto.isActive());
        account.getAccessLevels().forEach(accessLevel ->
                accessLevel.setActive(accountDetailsDto.getAccessLevels().contains(accessLevel.getName())));
        return AccountMapper.toAccountDetailsDto(account);
    }

    public AccountDetailsDto editOwnAccount(String username, AccountDetailsDto accountDetailsDto) {
        if (!username.equals(accountDetailsDto.getUsername())) {
            throw new ApplicationException(USERNAMES_NOT_MATCHING);
        }
        Account account = findAccount(accountDetailsDto.getUsername());
        account.setFirstName(accountDetailsDto.getFirstName());
        account.setLastName(accountDetailsDto.getLastName());
        return AccountMapper.toAccountDetailsDto(account);
    }

    public AccountDetailsDto changePassword(String username, ChangePasswordDto changePasswordDto) {
        if (!changePasswordDto.getPassword().equals(changePasswordDto.getConfirmPassword())) {
            throw new ApplicationException(PASSWORDS_NOT_MATCHING);
        }
        Account account = findAccount(username);
        if (!BcryptUtil.matches(changePasswordDto.getPreviousPassword(), account.getPassword())) {
            throw new ApplicationException(PASSWORDS_NOT_MATCHING);
        }
        account.setPassword(BcryptUtil.bcryptHash(changePasswordDto.getPassword()));
        return AccountMapper.toAccountDetailsDto(account);
    }

    public String deleteAccount(String username) {
        Account account = findAccount(username);
        account.deleteAllAccessLevels();
        accountRepository.deleteByUsername(username);
        return username;
    }

    private void addAccount(Account account) {
        try {
            accountRepository.persistAndFlush(account);
        } catch (PersistenceException e) {
            if (e.getCause() instanceof ConstraintViolationException) {
                throw new ApplicationException(ACCOUNT_EXISTS, e);
            } else {
                throw new ApplicationException(e);
            }
        }
    }

    private Account findAccount(String username) {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new ApplicationException(ACCOUNT_NOT_FOUND));
    }
}
