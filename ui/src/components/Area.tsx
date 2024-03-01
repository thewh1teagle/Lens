import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area as RechartsArea } from 'recharts';


interface LineProps {
  config: WidgetConfig
  data: any
}
export default function Area({config, data}: LineProps) {
  const CustomTooltip = ({ active, payload, label }: {active?: boolean, payload?: any, label?: string}) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip w-full h-full p-1 text-center" style={{background: payload?.[0]?.fill, color: payload?.[0]?.stroke}}>  
          <p className="value">{payload[0].value}</p>
          <p className="label">{label}</p>
        </div>
      );
    }
  
    return null;
  };
  
    return (
      <ResponsiveContainer width="100%" height="100%">
            <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.x.key} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <RechartsArea type="monotone" dataKey={config.y.key} stroke={config.y?.stroke} fill={config.y?.fill} />
        </AreaChart>
      </ResponsiveContainer>
      </ResponsiveContainer>
    );
}
