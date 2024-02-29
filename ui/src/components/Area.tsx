import { useEffect, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area as RechartsArea } from 'recharts';
import * as api from '../api'


interface LineProps {
  props: ItemConfig
  data: any
}
export default function Area({props, data}: LineProps) {

    return (
      <ResponsiveContainer width="100%" height="100%">
            <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={props.x.key} />
          <YAxis />
          <Tooltip />
          <RechartsArea type="monotone" dataKey={props.y.key} stroke={props.y.stroke} fill={props.y.fill} />
        </AreaChart>
      </ResponsiveContainer>
      </ResponsiveContainer>
    );
}
