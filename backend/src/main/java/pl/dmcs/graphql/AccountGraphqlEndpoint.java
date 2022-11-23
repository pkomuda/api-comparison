package pl.dmcs.graphql;

import io.smallrye.jwt.auth.principal.JWTParser;
import io.vertx.ext.web.RoutingContext;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import pl.dmcs.dto.*;
import pl.dmcs.service.AccountService;
import pl.dmcs.util.Page;

import javax.annotation.security.RolesAllowed;
import java.util.List;

import static javax.ws.rs.core.HttpHeaders.AUTHORIZATION;

@GraphQLApi
@RequiredArgsConstructor
public class AccountGraphqlEndpoint {

    private final AccountService accountService;
    private final RoutingContext routingContext;
    private final JWTParser jwtParser;

    @Query
    public String login(LoginDto loginDto) {
        return accountService.login(loginDto);
    }

    @Mutation
    public AccountDetailsDto register(RegisterDto registerDto) {
        return accountService.register(registerDto);
    }

    @Mutation
    @RolesAllowed("admin")
    public AccountDetailsDto addAccount(AddAccountDto addAccountDto) {
        return accountService.addAccount(addAccountDto);
    }

    @Query
    @RolesAllowed("admin")
    public AccountDetailsDto getAccount(String username) {
        return accountService.getAccount(username);
    }

    @Query
    @RolesAllowed({"admin", "client"})
    public AccountDetailsDto getOwnAccount() {
        return accountService.getAccount(extractUsername(routingContext));
    }

    @Query
    @RolesAllowed("admin")
    public List<AccountDetailsDto> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @Query
    @RolesAllowed("admin")
    public Page<AccountDetailsDto> getAccounts(String query, String sort, String dir, int page, int size) {
        return accountService.getAccounts(query, sort, dir, page, size);
    }

    @Mutation
    @RolesAllowed("admin")
    public AccountDetailsDto editAccount(AccountDetailsDto accountDetailsDto) {
        return accountService.editAccount(accountDetailsDto.getUsername(), accountDetailsDto);
    }

    @Mutation
    @RolesAllowed({"admin", "client"})
    public AccountDetailsDto editOwnAccount(AccountDetailsDto accountDetailsDto) {
        return accountService.editOwnAccount(extractUsername(routingContext), accountDetailsDto);
    }

    @Mutation
    @RolesAllowed({"admin", "client"})
    public AccountDetailsDto changePassword(ChangePasswordDto changePasswordDto) {
        return accountService.changePassword(extractUsername(routingContext), changePasswordDto);
    }

    @Mutation
    @RolesAllowed("admin")
    public String deleteAccount(String username) {
        return accountService.deleteAccount(username);
    }

    @SneakyThrows
    private String extractUsername(RoutingContext routingContext) {
        return jwtParser.parse(routingContext.request().getHeader(AUTHORIZATION).substring(7)).getName();
    }
}
