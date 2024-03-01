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

# Build

```console
go build -tags release cmd/serve.go
```

```console
npm run build
```

# Build for Raspberry PI 4
Just set `GOOS=linux GOARCH=arm` when execute build command

# Generate JSON-schema

```console
npm install typescript-json-schema -g
typescript-json-schema ui/src/types.ts LensConfig > schema/default.schema.json
```