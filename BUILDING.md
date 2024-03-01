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
version="v0.0.4"
git tag -a $version -m "$version"
git push origin "$version"
```

# Repush with same tag
```console
version="v0.0.4"
git tag -d "$version"
git push --delete origin "$version"
git tag -a $version -m "$version"
git push origin "$version"
```


# Docker

### Build docker and push

```console
docker build -t thewh1teagle/lens .
docker tag thewh1teagle/lens:latest thewh1teagle/lens:latest
docker push thewh1teagle/lens:latest
```


### Docker multiplatform

```console
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t thewh1teagle/lens .
```

### In MacOS M1
```console
docker buildx create --name mybuildx --use --driver docker-container
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t thewh1teagle/lens . --builder mybuildx
```

### One linear
```console
docker buildx build --push \
--platform linux/amd64,linux/arm64 \
--tag thewh1teagle/lens:latest .
```

### Gotaches

[cannot-build-multi-platform-images-with-docker-buildx](https://stackoverflow.com/questions/60080264/docker-cannot-build-multi-platform-images-with-docker-buildx)