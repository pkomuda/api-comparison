package pl.dmcs.mapper;

import io.quarkus.elytron.security.common.BcryptUtil;
import lombok.experimental.UtilityClass;
import pl.dmcs.dto.AccountDetailsDto;
import pl.dmcs.dto.AddAccountDto;
import pl.dmcs.dto.RegisterDto;
import pl.dmcs.entity.AccessLevel;
import pl.dmcs.entity.Account;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class AccountMapper {

    public Account toAccount(RegisterDto registerDto) {
        return Account.builder()
                .username(registerDto.getUsername())
                .password(BcryptUtil.bcryptHash(registerDto.getPassword()))
                .email(registerDto.getEmail())
                .firstName(registerDto.getFirstName())
                .lastName(registerDto.getLastName())
                .build();
    }

    public Account toAccount(AddAccountDto addAccountDto) {
        return Account.builder()
                .username(addAccountDto.getUsername())
                .password(BcryptUtil.bcryptHash(addAccountDto.getPassword()))
                .email(addAccountDto.getEmail())
                .firstName(addAccountDto.getFirstName())
                .lastName(addAccountDto.getLastName())
                .active(addAccountDto.isActive())
                .build();
    }

    public AccountDetailsDto toAccountDetailsDto(Account account) {
        return AccountDetailsDto.builder()
                .username(account.getUsername())
                .email(account.getEmail())
                .firstName(account.getFirstName())
                .lastName(account.getLastName())
                .active(account.isActive())
                .confirmed(account.isConfirmed())
                .accessLevels(account.getAccessLevels().stream()
                        .filter(AccessLevel::isActive)
                        .map(AccessLevel::getName)
                        .sorted()
                        .collect(Collectors.toCollection(LinkedHashSet::new)))
                .build();
    }

    public List<AccountDetailsDto> toAccountDetailsDtos(List<Account> accounts) {
        return accounts.stream()
                .map(AccountMapper::toAccountDetailsDto)
                .toList();
    }
}
