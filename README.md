# Lens

Your lens to insights.

# Introduction

Lens is a versatile data exploration and dashboard creation tool that provides rapid insights through an intuitive user interface. With Lens, you can effortlessly generate dynamic dashboards from simple JSON configuration files.

# Setup

Download lens from [releases](https://github.com/thewh1teagle/Lens/releases/latest)

```console
./lens examples/simple.json
```

<img width=1000 src="https://github.com/thewh1teagle/Lens/assets/61390950/12bc9528-1945-4fbd-a6c3-90cdcef1ddcd" />

# Config
It's recommend to edit with an editor which works with `json-schema` for autocompletion, for instance - [vscode](https://code.visualstudio.com/download)

# Variables

Queries can receive the following variables which comes from UI

- `$start_date` start date
- `$end_date` end date
See [examples](examples)

# Features

- Easy to setup (just 1 binary!)
- Simple to config (everything inside single JSON file with autocompletion)
- Built in task scheduler (see `examples/with_tasks.json`)
- Custom user agent for `URL` data source
- Hot reload (Changes in JSON reflected immediately)

# Data source
- `Sqlite` Database
- `URL`: any `JSON` `URL`
- `FS`: any file in filesystem
