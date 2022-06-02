package pl.dmcs.mapper;

import lombok.experimental.UtilityClass;
import pl.dmcs.dto.AccountDto;
import pl.dmcs.entity.Account;

import java.util.List;

@UtilityClass
public class AccountMapper {

    public Account toEntity(AccountDto dto) {
        return Account.builder()
                .username(dto.getUsername())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .active(dto.isActive())
                .build();
    }

    public AccountDto toDto(Account entity) {
        return AccountDto.builder()
                .username(entity.getUsername())
                .email(entity.getEmail())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .active(entity.isActive())
                .build();
    }

    public List<AccountDto> toDtos(List<Account> entities) {
        return entities.stream()
                .map(AccountMapper::toDto)
                .toList();
    }
}
