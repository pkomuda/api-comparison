FROM quay.io/quarkus/ubi-quarkus-graalvmce-builder-image:22.3-java17 AS build
USER root
RUN microdnf --best install openssl
COPY --chown=quarkus:quarkus ./ /code/
USER quarkus
WORKDIR /code
RUN ./mvnw -B org.apache.maven.plugins:maven-dependency-plugin:3.3.0:go-offline
RUN openssl genrsa -out rsaPrivateKey.pem 2048
RUN openssl rsa -pubout -in rsaPrivateKey.pem -out publicKey.pem
RUN openssl pkcs8 -topk8 -nocrypt -inform pem -in rsaPrivateKey.pem -outform pem -out privateKey.pem
RUN mv -t src/main/resources/ publicKey.pem privateKey.pem
RUN ./mvnw package -Pnative

FROM quay.io/quarkus/quarkus-micro-image:2.0
WORKDIR /work/
COPY --from=build /code/target/*-runner /work/application

RUN chmod 775 /work /work/application \
  && chown -R 1001 /work \
  && chmod -R "g+rwX" /work \
  && chown -R 1001:root /work

EXPOSE 8080
USER 1001

CMD ["./application", "-Dquarkus.http.host=0.0.0.0"]
