import { useEffect, useRef, useState } from "react";
import Line from "./Line";
import * as api from "../api";
import Area from "./Area";
import * as config from "../config";
import Invalid from "./Invalid";
import { parseDurationString } from "../date";
interface ItemProps {
  props: ItemConfig;
}

export default function Item({ props }: ItemProps) {
  // set defaults
  props.x.fill = props.x.fill ?? config.fill;
  props.y.fill = props.y.fill ?? config.fill;
  props.x.stroke = props.x.stroke ?? config.stroke;
  props.y.stroke = props.y.stroke ?? config.stroke;

  if (props.refresh_interval !== null) {
    // if explicity set to null, don't refresh
    props.refresh_interval = props.refresh_interval ?? config.refreshInterval;
  }

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refreshIntervalRef = useRef<any>();

  async function loadData() {
    if (props.query) {
      const query = props.query;
      try {
        const res = await api.query(query);
        if (props.debug) {
          console.log("config => ", props);
          console.log(`res => `, res);
        }
        setData(res);
      } catch (e) {
        setError(JSON.stringify(e));
      }
    } else if (props.url) {
      const url = props.url;
      try {
        const res = await api.fetch(url);
        if (props.debug) {
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
    const duration = parseDurationString(props.refresh_interval);
    if (!duration) {
      console.error(
        "Failed to parse refresh interval => ",
        props.refresh_interval
      );
      return;
    }
    if (props.debug) {
      console.log("refresh interval => ", config.refreshInterval);
      console.log("as milliseconds => ", duration);
    }

    refreshIntervalRef.current = setInterval(
      loadData,
      duration.asMilliseconds()
    );

    return () => clearInterval(refreshIntervalRef.current);
  }, []);

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
          !error && <SelectedComponent props={props} data={data} />
        )}
      </div>
    </div>
  );
}
