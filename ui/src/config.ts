import moment from "moment"

export const repoURL = 'https://github.com/thewh1teagle/lens'
export const width = "800px"
export const height = "600px"
export const fill = '#8884d8'
export const stroke = '#82ca9d'
export const refreshInterval = '1m'
export const dateRangeFormat = 'YYYY-MM-DDTHH:mm:ss'
export const defaultDateFunc = 'last_24_hours'
export const wsURL = import.meta.env.DEV ? 'ws://localhost:8080/api/ws' : 'ws:///api/ws'
export const dateRangesFuncs = {
    "last_1_minutes": {
        label: "Last Minute",
        getValues: () => [moment().utc().subtract(1, 'minutes'), moment().utc()]
    },
    "last_5_minutes": {
        label: "Last 5 Minute",
        getValues: () => [moment().utc().subtract(5, 'minutes'), moment().utc()]
    },
    "last_1_hours": {
        label: "Last Hour",
        getValues: () => [moment().utc().subtract(1, 'hours'), moment().utc()]
    },
    "last_6_hours": {
        label: "Last 6 Hours",
        getValues: () => [moment().utc().subtract(6, 'hours'), moment().utc()]
    },
    "last_24_hours": {
        label: "Last 24 Hours",
        getValues: () => [moment().utc().subtract(24, 'hours'), moment().utc()]
    },
    "yesterday": {
        label: "Yesterday",
        getValues: () => [moment().utc().subtract(1, 'days'), moment().utc()]
    },
    "today": {
        label: "Today",
        getValues: () => [moment().utc().startOf('day'), moment().utc().endOf('day')]
    },
    "last_1_week": {
        label: "Last Week",
        getValues: () => [moment().utc().subtract(1, 'weeks'), moment().utc()]
    },
    "last_1_month": {
        label: "Last Month",
        getValues: () => [moment().utc().subtract(1, 'months'), moment().utc()]
    },
    "last_1_year": {
        label: "Last Year",
        getValues: () => [moment().utc().subtract(1, 'years'), moment().utc()]
    },
    "last_10_years": {
        label: "Last 10 Years",
        getValues: () => [moment().utc().subtract(10, 'years').startOf('day'), moment().utc()]
    }
};