import { LineChart, Line as ReCharsLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';


interface LineProps {
  props: ItemConfig
  data: any
}

const CustomTooltip = ({ active, payload, label }: {active?: boolean, payload?: any, label?: string}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip w-full h-full p-1 text-center" style={{background: payload?.[0].fill, color: payload?.[0].stroke}}>  
        <p className="value">{payload[0].value}</p>
        <p className="label">{label}</p>
      </div>
    );
  }

  return null;
};

export default function Line({props, data}: LineProps) {

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
          <XAxis dataKey="date" tickFormatter={tick => {
            if (props.x.format?.type === 'date') {
                return moment(tick, props.x.format.from).format(props.x.format.to)
            }
            return tick
          }} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
          <ReCharsLine type="monotone" dataKey={props.y.key} stroke={props.y.stroke} />
        </LineChart>
      </ResponsiveContainer>
    );
}
