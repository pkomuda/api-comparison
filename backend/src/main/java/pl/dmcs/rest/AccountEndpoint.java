package pl.dmcs.rest;

import lombok.RequiredArgsConstructor;
import pl.dmcs.dto.*;
import pl.dmcs.service.AccountService;
import pl.dmcs.util.Page;

import javax.annotation.security.RolesAllowed;
import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

@Path("/rest")
@ApplicationScoped
@RequiredArgsConstructor
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AccountEndpoint {

    private final AccountService accountService;

    @POST
    @Path("/login")
    public String login(LoginDto loginDto) {
        return accountService.login(loginDto);
    }

    @POST
    @Path("/register")
    public void register(RegisterDto registerDto) {
        accountService.register(registerDto);
    }

    @POST
    @Path("/account")
    @RolesAllowed("admin")
    public void addAccount(AddAccountDto addAccountDto) {
        accountService.addAccount(addAccountDto);
    }

    @GET
    @Path("/account/{username}")
    @RolesAllowed("admin")
    public AccountDetailsDto getAccount(@PathParam("username") String username) {
        return accountService.getAccount(username);
    }

    @GET
    @Path("/account")
    @RolesAllowed({"admin", "client"})
    public AccountDetailsDto getOwnAccount(@Context SecurityContext context) {
        return accountService.getAccount(context.getUserPrincipal().getName());
    }

    @GET
    @Path("/allAccounts")
    @RolesAllowed("admin")
    public List<AccountDetailsDto> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @GET
    @Path("/accounts")
    @RolesAllowed("admin")
    public Page<AccountDetailsDto> getAccounts(@DefaultValue("") @QueryParam("query") String query,
                                               @DefaultValue("") @QueryParam("sort") String sort,
                                               @DefaultValue("asc") @QueryParam("dir") String dir,
                                               @DefaultValue("0") @QueryParam("page") int page,
                                               @DefaultValue("10") @QueryParam("size") int size) {
        return accountService.getAccounts(query, sort, dir, page, size);
    }

    @PUT
    @Path("/account/{username}")
    @RolesAllowed("admin")
    public void editAccount(@PathParam("username") String username, AccountDetailsDto accountDetailsDto) {
        accountService.editAccount(username, accountDetailsDto);
    }

    @PUT
    @Path("/account")
    @RolesAllowed({"admin", "client"})
    public void editOwnAccount(@Context SecurityContext context, AccountDetailsDto accountDetailsDto) {
        accountService.editOwnAccount(context.getUserPrincipal().getName(), accountDetailsDto);
    }

    @PUT
    @Path("/changePassword")
    @RolesAllowed({"admin", "client"})
    public void changePassword(ChangePasswordDto changePasswordDto) {
        accountService.changePassword(changePasswordDto);
    }

    @DELETE
    @Path("/account/{username}")
    @RolesAllowed("admin")
    public void deleteAccount(@PathParam("username") String username) {
        accountService.deleteAccount(username);
    }
}
