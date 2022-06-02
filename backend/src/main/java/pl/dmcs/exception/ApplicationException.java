package pl.dmcs.exception;

public class ApplicationException extends RuntimeException {

    public static final String KEY_DEFAULT = "error.default";
    public static final String KEY_ACCOUNT_EXISTS = "error.account.exists";
    public static final String KEY_ACCOUNT_NOT_FOUND = "error.account.not.found";

    public ApplicationException() {
        super(KEY_DEFAULT);
    }

    public ApplicationException(String message) {
        super(message);
    }

    public ApplicationException(String message, Throwable cause) {
        super(message, cause);
    }

    public ApplicationException(Throwable cause) {
        super(KEY_DEFAULT, cause);
    }
}
