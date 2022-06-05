package pl.dmcs.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Version;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AccessLevel extends PanacheEntity {

    public static final String ACCESS_LEVEL_ADMIN = "admin";
    public static final String ACCESS_LEVEL_USER = "user";
    public static final List<String> ACCESS_LEVEL_NAMES = List.of(ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_USER);

    @NotBlank
    private String name;

    private boolean active;

    @Version
    private Long version;

    @ManyToOne
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "account_id")
    private Account account;
}
