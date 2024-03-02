import { XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer, AreaChart, Area as RechartsArea } from 'recharts';
import { Tooltip } from './Tooltip';
import { formatLabel } from '../date';

interface LineProps {
  config: WidgetConfig
  data: any
}
export default function Area({config, data}: LineProps) {
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
          <XAxis dataKey={config.x.key} tickFormatter={tick => {
            tick = formatLabel(config, tick)
            return tick
          }} />
          <YAxis />
          <RechartTooltip content={<Tooltip config={config} />} />
          <RechartsArea type="monotone" dataKey={config.y.key} stroke={config.y?.stroke} fill={config.y?.fill} />
        </AreaChart>
      </ResponsiveContainer>
      </ResponsiveContainer>
    );
}
