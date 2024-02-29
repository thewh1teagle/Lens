interface ItemConfig {
    chart_type: string;
    query: string;
    url: string,
    x: {
        format: {
                type: string;
                from: string;
                to: string;
        },
        key: string
        stroke: string,
        fill: string
    },
    y: {
        format: {
                type: string;
                from: string;
                to: string;
        },
        key: string
        stroke: string,
        fill: string
    },
    debug: boolean;
    refresh_interval: string;
}

interface DashboardConfig {
    name: string;
    items: ItemConfig[];
}