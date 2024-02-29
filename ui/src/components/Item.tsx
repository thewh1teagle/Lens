import { useEffect, useState } from "react";
import Line from "./Line";
import * as api from "../api";
import Area from "./Area";
import * as config from "../config";
import Invalid from "./Invalid";

interface ItemProps {
  props: ItemConfig;
}
export default function Item({ props }: ItemProps) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            setError(JSON.stringify(e))
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
            setError(JSON.stringify(e))
        }

        
      }
      setLoading(false)
    }
    loadData();
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
        ) : !error && (
          <SelectedComponent props={props} data={data} />
        )}
      </div>
    </div>
  );
}
