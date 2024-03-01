import moment from "moment"

export const width = "800px"
export const height = "600px"
export const fill = '#8884d8'
export const stroke = '#82ca9d'
export const refreshInterval = '1m'
export const dateRangeFormat = 'YYYY-MM-DDTHH:mm:ss'
export const defaultDateFunc = 'today'
export const wsURL = import.meta.env.DEV ? 'ws://localhost:8080/api/ws' : 'ws:///api/ws'
export const dateRangesFuncs = {
    "last_1_minutes": {
        label: "Last Minute",
        getValues: () => [moment().subtract(6, 'hours'), moment()]
    },
    "last_5_minutes": {
        label: "Last 5 Minute",
        getValues: () => [moment().subtract(6, 'hours'), moment()]
    },
    "last_1_hours": {
        label: "Last Hour",
        getValues: () => [moment().subtract(6, 'hours'), moment()]
    },
    "last_6_hours": {
        label: "Last 6 Hours",
        getValues: () => [moment().subtract(6, 'hours'), moment()]
    },
    "last_1_day": {
        label: "Last Day",
        getValues: () => [moment().subtract(1, 'days'), moment()]
    },
    "last_1_week": {
        label: "Last Week",
        getValues: () => [moment().subtract(1, 'weeks'), moment()]
    },
    "last_1_month": {
        label: "Last Month",
        getValues: () => [moment().subtract(1, 'months'), moment()]
    },
    "last_1_year": {
        label: "Last Year",
        getValues: () => [moment().subtract(1, 'years'), moment()]
    },
    "last_10_years": {
        label: "Last 10 Years",
        getValues: () => [moment().subtract(10, 'years').startOf('day'), moment()]
    },
    "today": {
        label: "Today",
        getValues: () => [moment().startOf('day'), moment().endOf('day')]
    }
};