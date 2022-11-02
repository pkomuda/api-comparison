package pl.dmcs.rest;

import lombok.extern.slf4j.Slf4j;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import pl.dmcs.exception.ApplicationException;

import static org.jboss.resteasy.reactive.RestResponse.Status.BAD_REQUEST;
import static org.jboss.resteasy.reactive.RestResponse.Status.INTERNAL_SERVER_ERROR;
import static pl.dmcs.exception.ApplicationException.DEFAULT_ERROR;

@Slf4j
public class ExceptionMapper {

    @ServerExceptionMapper
    public RestResponse<String> mapException(Throwable t) {
        log.error("Handled exception", t);
        if (t instanceof ApplicationException) {
            return RestResponse.status(BAD_REQUEST, t.getMessage());
        } else {
            return RestResponse.status(INTERNAL_SERVER_ERROR, DEFAULT_ERROR);
        }
    }
}
