package pl.dmcs;

import io.quarkus.grpc.GrpcService;
import io.smallrye.mutiny.Uni;
import pl.dmcs.grpc.HelloGrpc;
import pl.dmcs.grpc.HelloReply;
import pl.dmcs.grpc.HelloRequest;

@GrpcService
public class HelloGrpcService implements HelloGrpc {

    @Override
    public Uni<HelloReply> sayHello(HelloRequest request) {
        return Uni.createFrom().item("Hello " + request.getName() + "!")
                .map(msg -> HelloReply.newBuilder().setMessage(msg).build());
    }
}
