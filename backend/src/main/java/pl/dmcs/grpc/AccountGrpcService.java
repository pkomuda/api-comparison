package pl.dmcs.grpc;

import com.google.protobuf.Empty;
import com.google.protobuf.StringValue;
import io.grpc.stub.StreamObserver;
import io.quarkus.grpc.GrpcService;
import io.smallrye.common.annotation.Blocking;
import lombok.RequiredArgsConstructor;
import pl.dmcs.service.AccountService;

@Blocking
@GrpcService
@RequiredArgsConstructor
public class AccountGrpcService extends AccountGrpc.AccountImplBase {

    private final AccountService accountService;

    @Override
    public void addAccount(AddAccountRequest request, StreamObserver<Empty> responseObserver) {
        accountService.addAccount(AccountGrpcMapper.toAddAccountDto(request));
        responseObserver.onCompleted();
    }

    @Override
    public void getAccount(StringValue request, StreamObserver<AccountDetails> responseObserver) {
        responseObserver.onNext(AccountGrpcMapper.toAccountDetails(accountService.getAccount(request.getValue())));
        responseObserver.onCompleted();
    }

    @Override
    public void getAllAccounts(Empty request, StreamObserver<AccountList> responseObserver) {
        responseObserver.onNext(AccountGrpcMapper.toAccountList(accountService.getAllAccounts()));
        responseObserver.onCompleted();
    }

    @Override
    public void getAccounts(GetAccountsRequest request, StreamObserver<AccountPages> responseObserver) {
        responseObserver.onNext(AccountGrpcMapper.toAccountPages(accountService.getAccounts(request.getQuery(),
                request.getSort(), request.getDir(), request.getPage(), request.getSize())));
        responseObserver.onCompleted();
    }
}
