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

    private boolean confirmed;

    @Version
    private Long version;

    @Builder.Default
    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "account")
    private Set<AccessLevel> accessLevels = new HashSet<>();

    public void addAccessLevels(Set<String> names) {
        AccessLevel.ACCESS_LEVEL_NAMES.stream()
                .filter(names::contains)
                .map(name -> AccessLevel.builder()
                        .name(name)
                        .active(true)
                        .account(this)
                        .build())
                .forEach(accessLevel -> accessLevels.add(accessLevel));
        AccessLevel.ACCESS_LEVEL_NAMES.stream()
                .filter(name -> !names.contains(name))
                .map(name -> AccessLevel.builder()
                        .name(name)
                        .active(false)
                        .account(this)
                        .build())
                .forEach(accessLevel -> accessLevels.add(accessLevel));
    }
}
