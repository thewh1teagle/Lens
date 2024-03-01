import { useEffect, useRef, useState } from "react";
import Line from "./Line";
import * as api from "../api";
import Area from "./Area";
import * as config from "../config";
import Invalid from "./Invalid";
import { parseDurationString } from "../date";
import DateRange from "./DateRange";

interface ItemProps {
  props: ItemConfig;
}

export default function Item({ props }: ItemProps) {
  // set defaults
  
  props.x.fill = props.x?.fill ?? config?.fill;
  props.y.fill = props.y?.fill ?? config?.fill;
  props.x.stroke = props.x?.stroke ?? config?.stroke;
  props.y.stroke = props.y?.stroke ?? config?.stroke;

  if (props?.refresh_interval !== null) {
    // if explicity set to null, don't refresh
    props.refresh_interval = props?.refresh_interval ?? config.refreshInterval;
  }

  const [dateRangeFuncName, setDateRangeFuncName] = useState(props.date_range ?? config.defaultDateFunc)
  const dateRangeConfig: typeof config.dateRangesFuncs.today = (config.dateRangesFuncs as any)?.[dateRangeFuncName]

  
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refreshIntervalRef = useRef<any>();

  

  async function loadData() {
    if (props.query) {
      let query = props.query;
      if (dateRangeConfig) {
        const dateRangeFormat = props.date_range_format ?? config.dateRangeFormat
        const range  = dateRangeConfig.getValues()
        query = query.replace('$start_date', range[0].format(dateRangeFormat) ?? '')
        query = query.replace('$end_date', range[1].format(dateRangeFormat) ?? '')
      }
      if (props?.debug) {
        console.log('query => ', query)
      }
      
      try {
        const res = await api.query(query);
        if (props?.debug) {
          console.log("config => ", props);
          console.log(`res => `, res);
        }
        setData(res);
      } catch (e) {
        setError(JSON.stringify(e));
      }
    } else if (props.url) {
      try {
        let startDate, endDate
        if (dateRangeConfig) {
          const dateRangeFormat = props.date_range_format ?? config.dateRangeFormat
          const range  = dateRangeConfig.getValues()
          startDate = range[0].format(dateRangeFormat) ?? ''
          endDate = range[1].format(dateRangeFormat) ?? ''
        }
        const res = await api.fetch({url: props.url, startDate, endDate, userAgent: props.user_agent});
        if (props?.debug) {
          console.log("config => ", props);
          console.log(`res => `, res);
        }
        setData(res);
      } catch (e) {
        setError(JSON.stringify(e));
      }
    }
    setLoading(false);
  }
  useEffect(() => {
    loadData();
    const duration = parseDurationString(props?.refresh_interval ?? config.refreshInterval);
    if (!duration) {
      console.error(
        "Failed to parse refresh interval => ",
        props?.refresh_interval
      );
      return;
    }
    if (props?.debug) {
      console.log("refresh interval => ", config.refreshInterval);
      console.log("as milliseconds => ", duration);
    }

    refreshIntervalRef.current = setInterval(
      loadData,
      duration.asMilliseconds()
    );

    return () => clearInterval(refreshIntervalRef.current);
  }, [dateRangeFuncName]);

  const width = props.width ?? config.width;
  const height = props.height ?? config.height;
  const SelectedComponent =
    {
      line: Line,
      area: Area,
    }?.[props.chart_type] ?? Invalid;

  return (
    <div style={{ width, height }} className="mt-auto">
      <div className="w-full h-full flex justify-center items-center bg-base-200 rounded-2xl p-3">
        {error && (
          <div className="text-error overflow-auto w-full h-full">{error}</div>
        )}
        {loading && !error ? (
          <span className="loading loading-spinner loading-lg text-primary"></span>
        ) : (
          !error && (
            <div className="w-full h-full flex flex-col gap-2">
              <DateRange rangeFuncName={dateRangeFuncName} setRangeFuncName={setDateRangeFuncName} />
              <SelectedComponent props={props} data={data} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
