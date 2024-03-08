# Lens

Your lens to insights.

# Introduction

Lens is a versatile data exploration and dashboard creation tool that provides rapid insights through an intuitive user interface. With Lens, you can effortlessly generate dynamic dashboards from simple JSON configuration files.

# Features

- Easy to setup (just 1 binary!)
- Simple to config (everything inside single JSON file with autocompletion)
- Built in task scheduler (see `examples/with_tasks.json`)
- Custom user agent for `URL` data source
- Hot reload (Changes in JSON reflected immediately)
- Alerts with push notifications

# Setup

Download lens from [releases](https://github.com/thewh1teagle/Lens/releases/latest)

```console
./lens examples/simple.json
```

<img width=1000 src="https://github.com/thewh1teagle/Lens/assets/61390950/12bc9528-1945-4fbd-a6c3-90cdcef1ddcd" />

# Config
It's recommend to edit with an editor which works with `json-schema` for autocompletion, for instance - [vscode](https://code.visualstudio.com/download)

# Examples
Examples available in [Lens/examples](https://github.com/thewh1teagle/Lens/tree/main/examples)

# Variables

Queries can receive the following variables which comes from UI

- `$start_date` start date
- `$end_date` end date
See [examples](examples)

# Data source
- `Sqlite` Database
- `URL`: any `JSON` `URL`
- `FS`: any file in filesystem

# Showcase

- [SpeedLens](https://github.com/thewh1teagle/SpeedLens) - Speedtest monitor with Lens dashboard

# Docker

You only need to mount the `JSON` file and run it.

```yaml
services:
  lens:
    image: thewh1teagle/lens
    command: /lens examples/simple.json
    volumes:
      - ./examples/:/examples
    ports:
      - 0.0.0.0:8080:8080
    environment:
      - LENS_HOST=0.0.0.0
      - LENS_PORT=8080
```

# Dates
Dates are very important in this app. 
Expected dates for UI/Server are UTC dates with the default SQLite format %Y-%m-%d %H:%M:%S. 
This way, we can leverage the power of built-in functions of SQLite.