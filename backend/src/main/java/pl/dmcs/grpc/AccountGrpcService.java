package pl.dmcs.grpc;

import com.google.protobuf.Empty;
import com.google.protobuf.StringValue;
import io.grpc.stub.StreamObserver;
import io.quarkus.grpc.GrpcService;
import io.quarkus.grpc.RegisterInterceptor;
import io.smallrye.common.annotation.Blocking;
import lombok.RequiredArgsConstructor;
import pl.dmcs.service.AccountService;
import pl.dmcs.util.RequestContext;

@Blocking
@GrpcService
@RequiredArgsConstructor
@RegisterInterceptor(GrpcInterceptor.class)
public class AccountGrpcService extends AccountGrpc.AccountImplBase {

    private final AccountService accountService;
    private final RequestContext requestContext;

    @Override
    public void login(LoginRequest request, StreamObserver<StringValue> responseObserver) {
        responseObserver.onNext(StringValue.of(accountService.login(AccountGrpcMapper.toLoginDto(request))));
        responseObserver.onCompleted();
    }

    @Override
    public void register(RegisterRequest request, StreamObserver<Empty> responseObserver) {
        accountService.register(AccountGrpcMapper.toRegisterDto(request));
        responseObserver.onNext(Empty.getDefaultInstance());
        responseObserver.onCompleted();
    }

    @Override
    @GrpcRolesAllowed("admin")
    public void addAccount(AddAccountRequest request, StreamObserver<Empty> responseObserver) {
        accountService.addAccount(AccountGrpcMapper.toAddAccountDto(request));
        responseObserver.onNext(Empty.getDefaultInstance());
        responseObserver.onCompleted();
    }

    @Override
    @GrpcRolesAllowed("admin")
    public void getAccount(StringValue request, StreamObserver<AccountDetails> responseObserver) {
        responseObserver.onNext(AccountGrpcMapper.toAccountDetails(accountService.getAccount(request.getValue())));
        responseObserver.onCompleted();
    }

    @Override
    @GrpcRolesAllowed({"admin", "client"})
    public void getOwnAccount(Empty request, StreamObserver<AccountDetails> responseObserver) {
        responseObserver.onNext(AccountGrpcMapper.toAccountDetails(accountService.getAccount(requestContext.getUsername())));
        responseObserver.onCompleted();
    }

    @Override
    @GrpcRolesAllowed("admin")
    public void getAllAccounts(Empty request, StreamObserver<AccountList> responseObserver) {
        responseObserver.onNext(AccountGrpcMapper.toAccountList(accountService.getAllAccounts()));
        responseObserver.onCompleted();
    }

    @Override
    @GrpcRolesAllowed("admin")
    public void getAccounts(GetAccountsRequest request, StreamObserver<AccountPages> responseObserver) {
        responseObserver.onNext(AccountGrpcMapper.toAccountPages(accountService.getAccounts(request.getQuery(),
                request.getSort(), request.getDir(), request.getPage(), request.getSize())));
        responseObserver.onCompleted();
    }

    @Override
    @GrpcRolesAllowed("admin")
    public void editAccount(AccountDetails request, StreamObserver<Empty> responseObserver) {
        accountService.editAccount(request.getUsername(), AccountGrpcMapper.toAccountDetailsDto(request));
        responseObserver.onNext(Empty.getDefaultInstance());
        responseObserver.onCompleted();
    }

    @Override
    @GrpcRolesAllowed({"admin", "client"})
    public void editOwnAccount(AccountDetails request, StreamObserver<Empty> responseObserver) {
        accountService.editOwnAccount(requestContext.getUsername(), AccountGrpcMapper.toAccountDetailsDto(request));
        responseObserver.onNext(Empty.getDefaultInstance());
        responseObserver.onCompleted();
    }

    @Override
    @GrpcRolesAllowed({"admin", "client"})
    public void changePassword(ChangePasswordRequest request, StreamObserver<Empty> responseObserver) {
        accountService.changePassword(requestContext.getUsername(), AccountGrpcMapper.toChangePasswordDto(request));
        responseObserver.onNext(Empty.getDefaultInstance());
        responseObserver.onCompleted();
    }

    @Override
    @GrpcRolesAllowed("admin")
    public void deleteAccount(StringValue request, StreamObserver<Empty> responseObserver) {
        accountService.deleteAccount(request.getValue());
        responseObserver.onNext(Empty.getDefaultInstance());
        responseObserver.onCompleted();
    }
}
