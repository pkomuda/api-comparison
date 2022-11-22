package pl.dmcs.graphql;

import lombok.RequiredArgsConstructor;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import pl.dmcs.dto.AccountDetailsDto;
import pl.dmcs.dto.LoginDto;
import pl.dmcs.dto.RegisterDto;
import pl.dmcs.service.AccountService;

@GraphQLApi
@RequiredArgsConstructor
public class AccountGraphqlEndpoint {

    private final AccountService accountService;

    @Query
    public String login(LoginDto loginDto) {
        return accountService.login(loginDto);
    }

    @Mutation
    public AccountDetailsDto register(RegisterDto registerDto) {
        return accountService.register(registerDto);
    }
}
