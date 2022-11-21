package pl.dmcs.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Account extends PanacheEntity {

    @NotBlank
    @Column(unique = true)
    private String username;

    @NotBlank
    private String password;

    @Email
    @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private boolean active;

    @Version
    private Long version;

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "account")
    private Set<AccessLevel> accessLevels = new HashSet<>();

    public void addAccessLevels(Set<String> names) {
        AccessLevel.ACCESS_LEVEL_NAMES.forEach(name -> accessLevels.add(AccessLevel.builder()
                .name(name)
                .active(names.contains(name))
                .account(this)
                .build()));
    }

    public void deleteAccessLevels(Set<String> names) {
        accessLevels.stream()
                .filter(accessLevel -> names.contains(accessLevel.getName()))
                .forEach(accessLevel -> accessLevel.setAccount(null));
        accessLevels.removeIf(accessLevel -> names.contains(accessLevel.getName()));
    }
}
