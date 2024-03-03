export interface AxisConfig {
    /**
    * Custom format for fields, supported currenly is date with moment format (from / to)
    */
    format?: {
            type: 'date'
            from?: string
            to?: string,
            timezone?: string
    },
    /**
    * Key to use from data returned
    */
    key: string

    /**
    * Text / line colors
    */
    stroke?: string
    /**
    * Bg color
    */
    fill?: string
}

export interface SqliteSource {
    type: 'sqlite'
    path: string
    query: string
}

export interface URLSource {
    type: 'url'
    url: string
}

export interface FSSource {
    type: 'fs'
    path: string
}

export interface WidgetConfig {
    /**
    * Unique ID you want to use
    */
    id: string
    /**
    * Widget title
    */
    title: string
    chart_type: "line" | "area" | "table"

    /**
    * Source for data
    */
    source: SqliteSource | URLSource | FSSource
    /**
    * Left to right axis
    */
    x: AxisConfig
    /**
    * Top to bottom axis
    */
    y: AxisConfig
    /**
    * Item width (css)
    */
    width?: string
    /**
    * Item height (css)
    */
    height?: string
    debug?: boolean
    /**
    * Interval for refresh eg (1s / 1m / 1h 10d)
    */
    refresh_interval?: string
    /**
    * Date range format to send to DB Query / URL
    */
    date_range_format?: string
    /**
    * Default date range filter in UI
    */
    date_range?: "last_1_minutes" | "last_5_minutes" | "last_1_hours" | "last_6_hours" | "last_24_hours" | "yesterday" | "today" | "last_1_week" | "last_1_month" | "last_1_year" | "last_10_years"

    /**
    * Custom user agent for URL source
    */
    user_agent?: string
}

export interface Task {
    every: string
    command: string
    cwd?: string
    verbose?: boolean
}

export interface ServerConfig {
    /**
    * Server port
    */
    port?: number
    /**
    * Server host
    */
    host?: string
}

export interface LensConfig {
    /**
    * Name for dashboard (title)
    */
    title: string
    /**
    * Widgets
    */
    widgets: WidgetConfig[]
    tasks?: Task[]
    server?: ServerConfig
}
