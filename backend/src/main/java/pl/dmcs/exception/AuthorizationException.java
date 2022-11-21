package pl.dmcs.exception;

public class AuthorizationException extends ApplicationException {

    public static final String AUTHORIZATION_FAILED = "Authorization failed";

    public AuthorizationException() {
        super(AUTHORIZATION_FAILED);
    }
}
