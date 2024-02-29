# Build lens

# Setup
Server:
```console
go install github.com/cosmtrek/air@latest
```

Client:
```console
npm install
```

# Dev

Server:
```console
air --build.cmd "go build -o bin/serve cmd/serve.go" --build.bin "./bin/serve"
```

Client:
```console
npm run dev
```