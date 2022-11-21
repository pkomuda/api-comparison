package pl.dmcs.grpc;

import io.grpc.ForwardingServerCallListener.SimpleForwardingServerCallListener;
import io.grpc.Metadata;
import io.grpc.ServerCall;
import io.grpc.ServerCallHandler;
import io.grpc.ServerInterceptor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import pl.dmcs.exception.ApplicationException;
import pl.dmcs.exception.AuthorizationException;
import pl.dmcs.util.RequestContext;

import javax.enterprise.context.ApplicationScoped;

import static io.grpc.Metadata.ASCII_STRING_MARSHALLER;
import static io.grpc.Status.*;
import static javax.ws.rs.core.HttpHeaders.AUTHORIZATION;
import static pl.dmcs.exception.ApplicationException.DEFAULT_ERROR;

@Slf4j
@ApplicationScoped
@RequiredArgsConstructor
public class GrpcInterceptor implements ServerInterceptor {

    private final RequestContext requestContext;

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(ServerCall<ReqT, RespT> serverCall,
                                                                 Metadata metadata,
                                                                 ServerCallHandler<ReqT, RespT> serverCallHandler) {
        requestContext.setAuthorization(metadata.get(Metadata.Key.of(AUTHORIZATION, ASCII_STRING_MARSHALLER)));
        ServerCall.Listener<ReqT> listener = serverCallHandler.startCall(serverCall, metadata);
        return new SimpleForwardingServerCallListener<>(listener) {
            @Override
            public void onHalfClose() {
                try {
                    super.onHalfClose();
                } catch (Exception e) {
                    log.error("Handled exception", e);
                    if (e instanceof AuthorizationException) {
                        serverCall.close(PERMISSION_DENIED.withDescription(e.getMessage()), metadata);
                    } else if (e instanceof ApplicationException) {
                        serverCall.close(INVALID_ARGUMENT.withDescription(e.getMessage()), metadata);
                    } else {
                        serverCall.close(INTERNAL.withDescription(DEFAULT_ERROR), metadata);
                    }
                }
            }
        };
    }
}
