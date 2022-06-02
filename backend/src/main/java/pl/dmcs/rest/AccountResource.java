package pl.dmcs.rest;

import lombok.RequiredArgsConstructor;
import pl.dmcs.dto.AccountDto;
import pl.dmcs.service.AccountService;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/rest")
@ApplicationScoped
@RequiredArgsConstructor
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AccountResource {

    private final AccountService accountService;

    @POST
    @Path("/account")
    public void addAccount(AccountDto accountDto) {
        accountService.addAccount(accountDto);
    }

    @GET
    @Path("/account/{username}")
    public AccountDto getAccount(@PathParam("username") String username) {
        return accountService.getAccount(username);
    }

    @GET
    @Path("/accounts")
    public List<AccountDto> getAccounts() {
        return accountService.getAccounts();
    }

    @PUT
    @Path("/account")
    public void editAccount(AccountDto accountDto) {
        accountService.editAccount(accountDto);
    }
}
