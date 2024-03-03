import { WidgetConfig } from "../types";

interface TableProps {
  config: WidgetConfig
  data: any
}
export default function Table({ data }: TableProps) {
  // Extract headers from the first row in data, if available
  const headers = data?.length ? Object.keys(data[0]) : [];

  return (
    <div className="inline-table" style={{width: '100%', height: '90%', tableLayout: 'fixed', maxHeight: '100%'}}>
      <table className="h-[10%] max-h-[100px] overflow-auto table table-auto">
        <thead>
          <tr>
            {/* Render headers in thead */}
            {headers?.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render rows in tbody */}
          {data?.map((row: any, rowIndex: number) => (
            <tr key={rowIndex}>
              {headers?.map((header, headerIndex) => (
                // Get the value of each header key in the current row
                <td key={headerIndex}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}