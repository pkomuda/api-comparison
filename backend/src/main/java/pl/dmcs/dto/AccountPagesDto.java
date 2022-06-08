package pl.dmcs.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AccountPagesDto {

    private List<AccountDetailsDto> accounts;
    private int pageCount;
}
