# Lens

Your Dashboard platform, your lens to insights.

# Docs
https://docs.google.com/document/d/17R-Uaq59hsPztzIFcDS0WYCKDNxHrzLTpUnybeypKxY/edit

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