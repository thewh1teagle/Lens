interface AxisConfig {
    format: {
            type: string;
            from: string;
            to: string;
    },
    key: string
    stroke: string,
    fill: string
}

interface ItemConfig {
    chart_type: string;
    query: string;
    url: string,
    x: AxisConfig,
    y: AxisConfig,
    width: string,
    height: string
    debug: boolean;
    refresh_interval: string;
    date_range_format?: string
    date_range?: string
    user_agent?: string
}

interface DashboardConfig {
    name: string;
    items: ItemConfig[];
}