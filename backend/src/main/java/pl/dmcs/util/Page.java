package pl.dmcs.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.function.Function;

@Getter
@AllArgsConstructor
public class Page<T> {

    private List<T> content;
    private int pageCount;

    public <U> Page<U> map(Function<T, U> mapper) {
        return new Page<>(content.stream()
                .map(mapper)
                .toList(), pageCount);
    }
}
