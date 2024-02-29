# Lens

Your Dashboard platform, your lens to insights.

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

# Features

- Easy to setup (just 1 binary!)
- Simple to config (everything inside single JSON file with autocompletion)
- Built in task scheduler (see `examples/with_tasks.json`)