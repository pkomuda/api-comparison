package pl.dmcs.service;

import io.quarkus.elytron.security.common.BcryptUtil;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import pl.dmcs.dto.AccountDto;
import pl.dmcs.entity.Account;
import pl.dmcs.exception.ApplicationException;
import pl.dmcs.mapper.AccountMapper;
import pl.dmcs.repository.AccountRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.PersistenceException;
import javax.transaction.Transactional;
import java.util.List;

import static javax.transaction.Transactional.TxType.REQUIRES_NEW;
import static pl.dmcs.exception.ApplicationException.KEY_ACCOUNT_EXISTS;
import static pl.dmcs.exception.ApplicationException.KEY_ACCOUNT_NOT_FOUND;

@ApplicationScoped
@RequiredArgsConstructor
@Transactional(REQUIRES_NEW)
public class AccountService {

    private final AccountRepository accountRepository;

    public void addAccount(AccountDto accountDto) {
        Account account = AccountMapper.toEntity(accountDto);
        account.setPassword(BcryptUtil.bcryptHash(accountDto.getPassword()));
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

    public AccountDto getAccount(String username) {
        return AccountMapper.toDto(accountRepository.findByUsername(username)
                .orElseThrow(() -> new ApplicationException(KEY_ACCOUNT_NOT_FOUND)));
    }

    public List<AccountDto> getAccounts() {
        return AccountMapper.toDtos(accountRepository.listAll());
    }

    public void editAccount(AccountDto accountDto) {
        Account account = accountRepository.findByUsername(accountDto.getUsername())
                .orElseThrow(() -> new ApplicationException(KEY_ACCOUNT_NOT_FOUND));
        account.setPassword(BcryptUtil.bcryptHash(accountDto.getPassword()));
        account.setFirstName(accountDto.getFirstName());
        account.setLastName(accountDto.getLastName());
        account.setActive(accountDto.isActive());
    }
}
