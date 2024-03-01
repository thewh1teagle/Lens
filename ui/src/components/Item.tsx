import { useEffect, useRef, useState } from "react";
import Line from "./Line";
import * as api from "../api";
import Area from "./Area";
import * as defaults from "../config";
import Invalid from "./Invalid";
import { parseDurationString } from "../date";
import DateRange from "./DateRange";

interface ItemProps {
  config: WidgetConfig;
}

export default function Item({ config }: ItemProps) {
  // set defaults

  config.x.fill = config.x?.fill ?? defaults?.fill;
  config.y.fill = config.y?.fill ?? defaults?.fill;
  config.x.stroke = config.x?.stroke ?? defaults?.stroke;
  config.y.stroke = config.y?.stroke ?? defaults?.stroke;

  if (config?.refresh_interval !== null) {
    // if explicity set to null, don't refresh
    config.refresh_interval = config?.refresh_interval ?? defaults.refreshInterval;
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
    if (config.query) {
      let query = config.query;
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
        const res = await api.query(query);
        if (config?.debug) {
          console.log("config => ", config);
          console.log(`res => `, res);
        }
        setData(res);
      } catch (e) {
        setError(JSON.stringify(e));
      }
    } else if (config.url) {
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
          url: config.url,
          startDate,
          endDate,
          userAgent: config.user_agent,
        });
        if (config?.debug) {
          console.log("config => ", config);
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
  }, [dateRangeFuncName]);

  const width = config.width ?? defaults.width;
  const height = config.height ?? defaults.height;
  const SelectedComponent =
    {
      line: Line,
      area: Area,
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
        </div>
        {error && (
          <div className="text-error overflow-auto w-full h-full">{error}</div>
        )}
        {loading && !error ? (
          <span className="loading loading-spinner loading-lg text-primary"></span>
        ) : (
          !error && (
            <div className="w-full h-full flex flex-col">
              <SelectedComponent props={config} data={data} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
