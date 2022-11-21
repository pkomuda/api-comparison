package pl.dmcs.grpc;

import io.grpc.ForwardingServerCallListener.SimpleForwardingServerCallListener;
import io.grpc.*;
import lombok.extern.slf4j.Slf4j;
import pl.dmcs.exception.ApplicationException;

import javax.enterprise.context.ApplicationScoped;

@Slf4j
@ApplicationScoped
public class GrpcInterceptor implements ServerInterceptor {

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(ServerCall<ReqT, RespT> serverCall,
                                                                 Metadata metadata,
                                                                 ServerCallHandler<ReqT, RespT> serverCallHandler) {
        log.info(metadata.get(Metadata.Key.of("Authorization", Metadata.ASCII_STRING_MARSHALLER)));
        ServerCall.Listener<ReqT> listener = serverCallHandler.startCall(serverCall, metadata);
        return new SimpleForwardingServerCallListener<>(listener) {
            @Override
            public void onHalfClose() {
                try {
                    super.onHalfClose();
                } catch (Exception e) {
                    log.error("Handled exception", e);
                    if (e instanceof ApplicationException) {
                        serverCall.close(Status.INVALID_ARGUMENT.withDescription(e.getMessage()), metadata);
                    } else {
                        serverCall.close(Status.INTERNAL.withDescription(ApplicationException.DEFAULT_ERROR), metadata);
                    }
                }
            }
        };
    }
}
