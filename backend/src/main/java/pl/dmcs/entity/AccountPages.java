package pl.dmcs.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class AccountPages {

    private List<Account> accounts;
    private int pageCount;
}
