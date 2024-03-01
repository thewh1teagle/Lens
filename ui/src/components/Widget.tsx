import { useEffect, useRef, useState } from "react";
import Line from "./Line";
import * as api from "../api";
import Area from "./Area";
import * as defaults from "../config";
import Invalid from "./Invalid";
import { parseDurationString } from "../date";
import DateRange from "./DateRange";
import Table from "./Table";

interface WidgetProps {
  config: WidgetConfig;
}

export default function Widget({ config }: WidgetProps) {
  // set defaults
  
  config.x.fill = config.x?.fill ?? defaults?.fill;
  config.y.fill = config.y?.fill ?? defaults?.fill;
  config.x.stroke = config.x?.stroke ?? defaults?.stroke;
  config.y.stroke = config.y?.stroke ?? defaults?.stroke;

  if (config?.refresh_interval !== null) {
    // if explicity set to null, don't refresh
    config.refresh_interval =
      config?.refresh_interval || defaults.refreshInterval;
  }

  const [dateRangeFuncName, setDateRangeFuncName] = useState(
    config.date_range ?? defaults.defaultDateFunc
  );
  const dateRangeConfig: typeof defaults.dateRangesFuncs.today = (
    defaults.dateRangesFuncs as any
  )?.[dateRangeFuncName];

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refreshIntervalRef = useRef<any>();

  async function loadData() {
    const source = config.source

    if (config.source.type === 'sqlite') {
      const sqliteSource = source as SqliteSource
      let query = sqliteSource.query
      if (dateRangeConfig) {
        const dateRangeFormat =
          config.date_range_format ?? defaults.dateRangeFormat;
        const range = dateRangeConfig.getValues();
   
        query = query.replace(
          "$start_date",
          range[0].format(dateRangeFormat) ?? ""
        );
        query = query.replace(
          "$end_date",
          range[1].format(dateRangeFormat) ?? ""
        );
      }
      if (config?.debug) {
        console.log("query => ", query);
      }

      try {
        const res = await api.query(query, config.id);
        if (config?.debug) {
          console.log("config => ", config);
          console.log(`res => `, res);
        }
        setData(res);
        setError('')
      } catch (e) {
        setError(JSON.stringify(e));
      }
    } else if (config.source.type === 'url') {
      const source = config.source as URLSource
      try {
        let startDate, endDate;
        if (dateRangeConfig) {
          const dateRangeFormat =
            config.date_range_format ?? defaults.dateRangeFormat;
          const range = dateRangeConfig.getValues();
          startDate = range[0].format(dateRangeFormat) ?? "";
          endDate = range[1].format(dateRangeFormat) ?? "";
        }
        const res = await api.fetch({
          url: source.url,
          startDate,
          endDate,
          userAgent: config.user_agent,
        });
        if (config?.debug) {
          console.log("config => ", config);
          console.log(`res => `, res);
        }
        setError('')
        setData(res);
      } catch (e) {
        setError(JSON.stringify(e));
      }
    }
    setLoading(false);
  }
  useEffect(() => {
    loadData();
    const duration = parseDurationString(
      config?.refresh_interval ?? defaults.refreshInterval
    );
    if (!duration) {
      console.error(
        "Failed to parse refresh interval => ",
        config?.refresh_interval
      );
      return;
    }
    if (config?.debug) {
      console.log("refresh interval => ", defaults.refreshInterval);
      console.log("as milliseconds => ", duration);
    }

    refreshIntervalRef.current = setInterval(
      loadData,
      duration.asMilliseconds()
    );

    return () => clearInterval(refreshIntervalRef.current);
  }, [dateRangeFuncName, config]);

  const width = config.width || defaults.width;
  const height = config.height || defaults.height;
  const SelectedComponent =
    {
      line: Line,
      area: Area,
      table: Table
    }?.[config.chart_type] ?? Invalid;

    
  return (
    <div style={{ width, height }} className="mt-auto">
      <div className="w-full h-full flex flex-col justify-center items-center bg-base-200 rounded-2xl p-3 shadow-md">
        <div className="flex w-full justify-center mb-2">
          <div className="flex-1">
            <DateRange
              rangeFuncName={dateRangeFuncName}
              setRangeFuncName={setDateRangeFuncName}
            />
          </div>
          <div className="text-xl text-base-content flex-1">{config.title}</div>
          <div className="flex text-xs justify-center items-center gap-1">
            <div className="text-xs text-base-content ml-auto">
              {config.refresh_interval}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
        </div>
        {error && (
          <div className="text-error overflow-auto w-full h-full">{error}</div>
        )}
        {loading && !error ? (
          <span className="loading loading-spinner loading-lg text-primary"></span>
        ) : (
          !error && (
            <div className="w-full h-full overflow-auto flex flex-col">
              <SelectedComponent config={config} data={data} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
