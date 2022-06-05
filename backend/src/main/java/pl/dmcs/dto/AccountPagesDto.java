package pl.dmcs.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AccountPagesDto {

    private List<AccountDto> accounts;
    private int pageCount;
}
