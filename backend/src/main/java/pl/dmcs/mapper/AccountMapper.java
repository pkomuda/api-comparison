package pl.dmcs.mapper;

import lombok.experimental.UtilityClass;
import pl.dmcs.dto.AccountDto;
import pl.dmcs.dto.AccountPagesDto;
import pl.dmcs.dto.AddAccountDto;
import pl.dmcs.dto.RegisterDto;
import pl.dmcs.entity.AccessLevel;
import pl.dmcs.entity.Account;
import pl.dmcs.entity.AccountPages;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class AccountMapper {

    public Account toEntity(AddAccountDto dto) {
        return Account.builder()
                .username(dto.getUsername())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .active(dto.isActive())
                .build();
    }

    public Account toEntity(RegisterDto dto) {
        return Account.builder()
                .username(dto.getUsername())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .build();
    }

    public AccountDto toDto(Account entity) {
        return AccountDto.builder()
                .username(entity.getUsername())
                .email(entity.getEmail())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .active(entity.isActive())
                .confirmed(entity.isConfirmed())
                .accessLevels(entity.getAccessLevels().stream()
                        .filter(AccessLevel::isActive)
                        .map(AccessLevel::getName)
                        .sorted()
                        .collect(Collectors.toCollection(LinkedHashSet::new)))
                .build();
    }

    public List<AccountDto> toDtos(List<Account> entities) {
        return entities.stream()
                .map(AccountMapper::toDto)
                .toList();
    }

    public AccountPagesDto toDtoPages(AccountPages pages) {
        return new AccountPagesDto(toDtos(pages.getAccounts()), pages.getPageCount());
    }
}
