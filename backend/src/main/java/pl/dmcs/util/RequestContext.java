package pl.dmcs.util;

import lombok.Data;

import javax.enterprise.context.RequestScoped;

@Data
@RequestScoped
public class RequestContext {

    private String authorization;
    private String username;
}
