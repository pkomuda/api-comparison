package pl.dmcs.dto;

import io.quarkus.resteasy.reactive.jackson.SecureField;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class AccountDto {

    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private boolean active;
    private boolean confirmed;

    @SecureField(rolesAllowed = "admin")
    private Set<String> accessLevels;
}
