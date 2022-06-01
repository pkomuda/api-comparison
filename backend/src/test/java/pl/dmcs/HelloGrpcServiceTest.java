package pl.dmcs;

import io.quarkus.grpc.GrpcClient;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import pl.dmcs.grpc.HelloGrpc;
import pl.dmcs.grpc.HelloReply;
import pl.dmcs.grpc.HelloRequest;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
public class HelloGrpcServiceTest {

    @GrpcClient
    HelloGrpc helloGrpc;

    @Test
    public void testHello() {
        HelloReply reply = helloGrpc
                .sayHello(HelloRequest.newBuilder().setName("Neo").build()).await().atMost(Duration.ofSeconds(5));
        assertEquals("Hello Neo!", reply.getMessage());
    }
}
