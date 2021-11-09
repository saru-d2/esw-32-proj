import React, { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line, LineChart}  from 'recharts';


const SampleRTChart = (props) => {
    
    
    const [data, setData] = useState([])

    // { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    useEffect(() => {
        const interval = setInterval(() => {
            setData(cur => [...cur, { time: new Date().getSeconds(), uv: Math.floor(Math.random() * 100), pv: 2400, amt: 2400 }])
            console.log('update')
        }, 4000) 
    }, [])

    return (
        <AreaChart
          width={600}
          height={400}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
           <CartesianGrid />
           <XAxis dataKey="time" />
           <YAxis />
           <Tooltip />
           <Area
             dataKey='uv'
             stroke='#8884d8'
           />
         </AreaChart>
       );
}

export default SampleRTChart