# Build Server
FROM golang:latest as BUILD

WORKDIR /app
RUN mkdir server
COPY server/go.mod /app/server/go.mod
COPY server/go.sum /app/server/go.sum
WORKDIR /app/server
RUN go mod download

COPY server/ /app/server

RUN CGO_ENABLED=0 GOOS=linux go build -tags release -o /lens cmd/main.go

# Run Image
FROM alpine:latest
WORKDIR /
COPY --from=BUILD /lens /lens
EXPOSE 8080
# Run
CMD ["/lens"]