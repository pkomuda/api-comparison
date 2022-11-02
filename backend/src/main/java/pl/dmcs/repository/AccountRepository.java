package pl.dmcs.repository;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import pl.dmcs.entity.Account;
import pl.dmcs.util.Page;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import java.util.Optional;

import static javax.transaction.Transactional.TxType.MANDATORY;

@ApplicationScoped
@Transactional(MANDATORY)
public class AccountRepository implements PanacheRepository<Account> {

    public Optional<Account> findByUsername(String username) {
        return find("username", username).firstResultOptional();
    }

    public Optional<Account> findByConfirmationToken(String token) {
        return find("confirmationToken", token).firstResultOptional();
    }

    public Page<Account> find(String query, String sort, String dir, int page, int size) {
        Sort.Direction direction = dir.equals("desc") ? Sort.Direction.Descending : Sort.Direction.Ascending;
        Sort sorting = sort.isEmpty() ? Sort.empty() : Sort.by(sort, direction);
        PanacheQuery<Account> panacheQuery = find("lower(username) like concat('%', lower(?1), '%')"
                + " or lower(email) like concat('%', lower(?1), '%')"
                + " or lower(firstName) like concat('%', lower(?1), '%')"
                + " or lower(lastName) like concat('%', lower(?1), '%')", sorting, query).page(page, size);
        return new Page<>(panacheQuery.list(), panacheQuery.pageCount());
    }
}
