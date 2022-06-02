package pl.dmcs.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import pl.dmcs.entity.Account;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import java.util.Optional;

import static javax.transaction.Transactional.TxType.REQUIRED;

@ApplicationScoped
@Transactional(REQUIRED)
public class AccountRepository implements PanacheRepository<Account> {

    public Optional<Account> findByUsername(String username) {
        return find("username", username).firstResultOptional();
    }
}
