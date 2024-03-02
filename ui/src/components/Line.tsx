import { LineChart, Line as ReCharsLine, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatLabel } from '../date';
import { Tooltip } from './Tooltip';


interface LineProps {
  config: WidgetConfig
  data: any
}

export default function Line({config, data}: LineProps) {

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.x.key} tickFormatter={tick => {
            tick = formatLabel(config, tick)
            return tick
          }} />
          <YAxis />
          <RechartTooltip content={<Tooltip config={config} />} />
          <Legend />
          {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
          <ReCharsLine type="monotone" dataKey={config.y.key} stroke={config.y?.stroke} />
        </LineChart>
      </ResponsiveContainer>
    );
}
