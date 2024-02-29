import { LineChart, Line as ReCharsLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';


interface LineProps {
  props: ItemConfig
  data: any
}
export default function Line({props, data}: LineProps) {

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
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
          <Tooltip />
          <Legend />
          {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
          <ReCharsLine type="monotone" dataKey={props.y.key} stroke={props.y.stroke} />
        </LineChart>
      </ResponsiveContainer>
    );
}
