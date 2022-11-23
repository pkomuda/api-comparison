package pl.dmcs.dto;

import io.quarkus.resteasy.reactive.jackson.SecureField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDetailsDto {

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private boolean active;

    @SecureField(rolesAllowed = "admin")
    private Set<String> accessLevels;
}
