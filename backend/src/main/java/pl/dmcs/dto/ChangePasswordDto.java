package pl.dmcs.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChangePasswordDto {

    private String previousPassword;
    private String password;
    private String confirmPassword;
}
