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
air --build.cmd "go build -o bin/lens cmd/main.go" --build.bin "./bin/lens"
```

Client:
```console
npm run dev
```

# Build

```console
go build -o lens -tags release server/cmd/main.go
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

# Generate go structs
https://www.codeconvert.ai/typescript-to-golang-converter

# Release new version

```console
version="v0.0.2"
git tag -a $version -m "$version"
git push origin "$version"
```