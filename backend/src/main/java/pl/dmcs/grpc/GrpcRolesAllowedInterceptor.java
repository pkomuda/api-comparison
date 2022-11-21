package pl.dmcs.grpc;

import io.smallrye.jwt.auth.principal.JWTParser;
import lombok.RequiredArgsConstructor;
import org.eclipse.microprofile.jwt.JsonWebToken;
import pl.dmcs.exception.AuthorizationException;
import pl.dmcs.util.RequestContext;

import javax.enterprise.context.RequestScoped;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import java.time.Instant;
import java.util.Arrays;

@Interceptor
@RequestScoped
@GrpcRolesAllowed
@RequiredArgsConstructor
public class GrpcRolesAllowedInterceptor {

    private final JWTParser jwtParser;
    private final RequestContext requestContext;

    @AroundInvoke
    public Object authorize(InvocationContext context) throws Exception {
        GrpcRolesAllowed annotation = context.getMethod().getAnnotation(GrpcRolesAllowed.class);
        if (annotation == null) {
            return context.proceed();
        }

        String auth = requestContext.getAuthorization();
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new AuthorizationException();
        }

        JsonWebToken jwt = jwtParser.parse(auth.substring(7));
        if (Arrays.stream(annotation.value()).noneMatch(jwt.getGroups()::contains)
                || Instant.now().isAfter(Instant.ofEpochSecond(jwt.getExpirationTime()))) {
            throw new AuthorizationException();
        }

        requestContext.setUsername(jwt.getName());
        return context.proceed();
    }
}
