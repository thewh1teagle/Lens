import moment from "moment"

export const width = "800px"
export const height = "600px"
export const fill = '#8884d8'
export const stroke = '#82ca9d'
export const refreshInterval = '1m'
export const dateRangeFormat = 'YYYY-MM-DDTHH:mm:ss'
export const defaultDateFunc = 'Today'


type DateRangeObject = { [key: string]: () => [moment.Moment, moment.Moment] };
export const dateRangesFuncs = {
    "Last 6 Hours": () => [moment().subtract(6, 'hours'), moment()],
    'Last Day': () => [moment().subtract(1, 'days'), moment()],
    'Last Week': () => [moment().subtract(1, 'weeks'), moment()],
    'Last Month': () => [moment().subtract(1, 'months'), moment()],
    'Last Year': () => [moment().subtract(1, 'years'), moment()],
    'Today': () => [moment().startOf('day'), moment().endOf('day')],
};