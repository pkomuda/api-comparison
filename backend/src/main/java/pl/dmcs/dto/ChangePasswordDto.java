package pl.dmcs.dto;

import lombok.Data;

@Data
public class ChangePasswordDto {

    private String username;
    private String previousPassword;
    private String password;
    private String confirmPassword;
}
