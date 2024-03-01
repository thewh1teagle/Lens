# Lens

Your lens to insights.

# Setup
```console
./lens simple.json
```

<img width=1000 src="https://github.com/thewh1teagle/Lens/assets/61390950/12bc9528-1945-4fbd-a6c3-90cdcef1ddcd" />



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
