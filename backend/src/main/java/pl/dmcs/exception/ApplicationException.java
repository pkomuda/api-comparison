package pl.dmcs.exception;

public class ApplicationException extends RuntimeException {

    public static final String DEFAULT_ERROR = "An unexpected error occurred";
    public static final String ACCOUNT_EXISTS = "Account already exists";
    public static final String ACCOUNT_NOT_FOUND = "Account not found";
    public static final String ACCESS_LEVELS_EMPTY = "Access levels cannot be empty";
    public static final String USERNAMES_NOT_MATCHING = "Usernames are not matching";
    public static final String PASSWORDS_NOT_MATCHING = "Passwords are not matching";
    public static final String LOGIN_FAILED = "Login failed";

    public ApplicationException() {
        super(DEFAULT_ERROR);
    }

    public ApplicationException(String message) {
        super(message);
    }

    public ApplicationException(String message, Throwable cause) {
        super(message, cause);
    }

    public ApplicationException(Throwable cause) {
        super(DEFAULT_ERROR, cause);
    }
}
