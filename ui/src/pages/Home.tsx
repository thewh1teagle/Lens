import { useState } from "react"
import * as api from '../api'

import React from "react";
import { AxisOptions, Chart } from "react-charts";
import useDemoConfig from "../hooks/useDemoConfig"

function Line() {
  const { data, randomizeData } = useDemoConfig({
    series: 1,
    dataType: "time",
  });

  const primaryAxis = React.useMemo<
    AxisOptions<typeof data[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.primary as unknown as Date,
    }),
    []
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<typeof data[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.secondary,
      },
    ],
    []
  );

  return (
    <>
      <button onClick={randomizeData}>Randomize Data</button>
      <br />
      <br />
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
    </>
  );
}

export default function Home() {
    const [rows, setRows] = useState('')
    const [queryValue, setQueryValue] = useState('SELECT * FROM users')

    async function query() {
        const data = await api.query(queryValue)
        setRows(JSON.stringify(data))
    }

    const { data, randomizeData } = useDemoConfig({
        series: 10,
        dataType: "time",
      });
    
      const primaryAxis = React.useMemo<
        AxisOptions<typeof data[number]["data"][number]>
      >(
        () => ({
          getValue: (datum) => datum.primary as unknown as Date,
        }),
        []
      );
    
      const secondaryAxes = React.useMemo<
        AxisOptions<typeof data[number]["data"][number]>[]
      >(
        () => [
          {
            getValue: (datum) => datum.secondary,
          },
        ],
        []
      );

    return (
        <div>
            <div className="flex items-center justify-center flex-col">
            <textarea value={queryValue} onChange={e => setQueryValue(e.target.value)} className="textarea-primary textarea-bordered w-[500px] h-[200px] p-2" placeholder="SELECT * FROM table"/>
            <button onClick={query} className="btn btn-primary">Query</button>
            </div>
            

            <div className="flex items-center justify-center">
            <textarea value={rows} className="textarea-primary textarea-bordered w-[500px] h-[200px] p-2" readOnly={true}/>
            </div>
        <div className="w-[1000px] h-[500px]">
        <Line />
        </div>
        </div>
    )
}







