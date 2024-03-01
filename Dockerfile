# Build UI
FROM node:alpine as UI

RUN mkdir -p /app/server/ui
COPY ui /app/ui

WORKDIR /app/ui

RUN npm install
RUN npm run build

# Build Server
FROM golang:latest as BUILD

WORKDIR /app

COPY server /app/server
COPY --from=UI /app/server/ui/public /app/server/ui/public
WORKDIR /app/server
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -tags release -o /lens cmd/main.go

# Run Image
FROM alpine:latest
WORKDIR /
COPY --from=BUILD /lens /lens
EXPOSE 8080
# Run
CMD ["/lens"]