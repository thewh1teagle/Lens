import { formatLabel } from "../date";
import { WidgetConfig } from "../types";

export const Tooltip = ({ active, payload, label, config }: {active?: boolean, payload?: any, label?: string, config: WidgetConfig}) => {
    if (active && payload && payload.length) {
      label = formatLabel(config, label)
      return (
        <div className="custom-tooltip w-full h-full p-1 text-center" style={{background: payload?.[0]?.fill, color: payload?.[0]?.stroke}}>  
          <p className="value">{payload[0].value}</p>
          <p className="label">{label}</p>
        </div>
      );
    }
  
    return null;
  };