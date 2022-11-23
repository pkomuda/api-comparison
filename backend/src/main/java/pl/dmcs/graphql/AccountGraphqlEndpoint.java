package pl.dmcs.graphql;

import io.smallrye.jwt.auth.principal.JWTParser;
import io.vertx.ext.web.RoutingContext;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import pl.dmcs.dto.AccountDetailsDto;
import pl.dmcs.dto.AddAccountDto;
import pl.dmcs.dto.LoginDto;
import pl.dmcs.dto.RegisterDto;
import pl.dmcs.service.AccountService;

import javax.annotation.security.RolesAllowed;

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

    @SneakyThrows
    private String extractUsername(RoutingContext routingContext) {
        return jwtParser.parse(routingContext.request().getHeader(AUTHORIZATION).substring(7)).getName();
    }
}
