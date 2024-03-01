interface AxisConfig {
    format?: {
            type: string
            from: string
            to: string
    },
    key: string
    stroke?: string
    fill?: string
}

interface ItemConfig {
    chart_type: "line" | "area"
    x: AxisConfig
    y: AxisConfig
    query?: string
    url?: string
    width?: string
    height?: string
    debug?: boolean
    refresh_interval?: string
    date_range_format?: string
    date_range?: "last_1_minutes" | "last_5_minutes" | "last_1_hours" | "last_6_hours" | "last_1_day" | "last_1_week" | "last_1_month" | "last_1_year" | "last_10_years" | "today"
    user_agent?: string
}

interface DashboardConfig {
    name: string
    items: ItemConfig[]
}
