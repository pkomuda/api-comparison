FROM node:18-alpine AS build
RUN apk add --update protobuf protobuf-dev
RUN npm install -g protoc-gen-ts@0.8.6-rc1
COPY frontend/ /code/
COPY backend/src/main/proto/account.proto /code/src/grpc/
WORKDIR /code
RUN protoc -I=src/grpc account.proto --ts_out=src/grpc --ts_opt=target=web
RUN npm install
RUN npm run build

FROM nginx:1.23
COPY --from=build /code/dist/ /usr/share/nginx/html/
COPY --from=build /code/nginx.conf /etc/nginx/conf.d/default.conf
