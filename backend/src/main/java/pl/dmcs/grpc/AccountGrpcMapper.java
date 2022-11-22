package pl.dmcs.grpc;

import com.google.protobuf.ByteString;
import lombok.experimental.UtilityClass;
import pl.dmcs.dto.*;
import pl.dmcs.util.Page;

import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class AccountGrpcMapper {

    public LoginDto toLoginDto(LoginRequest loginRequest) {
        return LoginDto.builder()
                .username(loginRequest.getUsername())
                .password(loginRequest.getPassword())
                .build();
    }

    public RegisterDto toRegisterDto(RegisterRequest registerRequest) {
        return RegisterDto.builder()
                .username(registerRequest.getUsername())
                .password(registerRequest.getPassword())
                .confirmPassword(registerRequest.getConfirmPassword())
                .email(registerRequest.getEmail())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .build();
    }

    public AddAccountDto toAddAccountDto(AddAccountRequest addAccountRequest) {
        return AddAccountDto.builder()
                .username(addAccountRequest.getUsername())
                .password(addAccountRequest.getPassword())
                .confirmPassword(addAccountRequest.getConfirmPassword())
                .email(addAccountRequest.getEmail())
                .firstName(addAccountRequest.getFirstName())
                .lastName(addAccountRequest.getLastName())
                .active(addAccountRequest.getActive())
                .accessLevels(addAccountRequest.getAccessLevelsList()
                        .asByteStringList().stream()
                        .map(ByteString::toStringUtf8)
                        .collect(Collectors.toSet()))
                .build();
    }

    public AccountDetailsDto toAccountDetailsDto(AccountDetails accountDetails) {
        return AccountDetailsDto.builder()
                .username(accountDetails.getUsername())
                .email(accountDetails.getEmail())
                .firstName(accountDetails.getFirstName())
                .lastName(accountDetails.getLastName())
                .active(accountDetails.getActive())
                .accessLevels(accountDetails.getAccessLevelsList()
                        .asByteStringList().stream()
                        .map(ByteString::toStringUtf8)
                        .collect(Collectors.toSet()))
                .build();
    }

    public AccountDetails toAccountDetails(AccountDetailsDto accountDetailsDto) {
        return AccountDetails.newBuilder()
                .setUsername(accountDetailsDto.getUsername())
                .setEmail(accountDetailsDto.getEmail())
                .setFirstName(accountDetailsDto.getFirstName())
                .setLastName(accountDetailsDto.getLastName())
                .setActive(accountDetailsDto.isActive())
                .addAllAccessLevels(accountDetailsDto.getAccessLevels())
                .build();
    }

    public AccountList toAccountList(List<AccountDetailsDto> accountDetailsDtos) {
        return AccountList.newBuilder()
                .addAllAccounts(accountDetailsDtos.stream()
                        .map(AccountGrpcMapper::toAccountDetails)
                        .toList())
                .build();
    }

    public AccountPages toAccountPages(Page<AccountDetailsDto> accountDetailsPages) {
        return AccountPages.newBuilder()
                .addAllContent(accountDetailsPages.getContent().stream()
                        .map(AccountGrpcMapper::toAccountDetails)
                        .toList())
                .setTotalSize(accountDetailsPages.getTotalSize())
                .build();
    }

    public ChangePasswordDto toChangePasswordDto(ChangePasswordRequest changePasswordRequest) {
        return ChangePasswordDto.builder()
                .previousPassword(changePasswordRequest.getPreviousPassword())
                .password(changePasswordRequest.getPassword())
                .confirmPassword(changePasswordRequest.getConfirmPassword())
                .build();
    }
}
