interface AxisConfig {
    /**
    * Custom format for fields, supported currenly is date with moment format (from / to)
    */
    format?: {
            
            type: 'date'
            from: string
            to: string
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

interface WidgetConfig {
    title: string
    chart_type: "line" | "area"
    /**
    * Left to right axis
    */
    x: AxisConfig
    /**
    * Top to bottom axis
    */
    y: AxisConfig
    query?: string
    /**
    * URL source (Array of JSON objects)
    */
    url?: string
    /**
    * Item width
    */
    width?: string
    /**
    * Item height
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
    date_range?: "last_1_minutes" | "last_5_minutes" | "last_1_hours" | "last_6_hours" | "last_1_day" | "last_1_week" | "last_1_month" | "last_1_year" | "last_10_years" | "today"

    /**
    * Custom user agent for URL source
    */
    user_agent?: string
}

interface LensConfig {
    /**
    * Name for dashboard (title)
    */
    title: string
    items: WidgetConfig[]
}
