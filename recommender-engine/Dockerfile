FROM rust:latest as builder

RUN USER=root cargo new --bin recommender-engine
WORKDIR ./recommender-engine
COPY ./Cargo.toml ./Cargo.toml

# url to connect to db with credentials in url
ENV DATABASE_URL=
# Url to api that provides next auth authentication
ENV AUTH_URL=

RUN cargo build --release
RUN rm src/*.rs

ADD . ./

RUN rm -r ./target/release/deps
RUN cargo build --release


FROM debian:buster-slim
ARG APP=/usr/src/app

RUN apt-get update \
    && apt-get install -y ca-certificates tzdata \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP}

COPY --from=builder /recommender-engine/target/release/recommender-engine ${APP}/recommender-engine

# url to connect to db with credentials in url
ENV DATABASE_URL=
# Url to api that provides next auth authentication
ENV AUTH_URL=


RUN chown -R $APP_USER:$APP_USER ${APP}

USER $APP_USER
WORKDIR ${APP}

CMD ["./recommender-engine"]