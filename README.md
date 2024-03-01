# Lens

Your lens to insights.

# Setup
```console
./lens local.db simple.json
```

<img width=1000 src="https://github.com/thewh1teagle/Lens/assets/61390950/09af85b6-4054-4ade-9c8a-a459679daa62" />



# Variables

Queries can receive the following variables which comes from UI

- `$dt_start` start date
- `$dt_end` end date
Can be used as `SELECT * FROM ... WHERE $dt_start ... AND $dt_end ...`

# Features

- Easy to setup (just 1 binary!)
- Simple to config (everything inside single JSON file with autocompletion)
- Built in task scheduler (see `examples/with_tasks.json`)
- Custom user agent for `URL` data source

# Data source
- `Sqlite` Database
- any `JSON` `URL`
