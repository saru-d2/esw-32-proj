import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line, LineChart } from 'recharts';


const SampleRTChart = (props) => {
  let thingToPlot = props.thingToPlot
  let [chartData, setChartData] = useState([])
  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         setChartData(cur => [...cur, {time: props['data'].current['time']%100, uv: props['data'].current[thingToPlot], pv: 2400, amt: 2400}])
  //         console.log({ time: props['data'].current['time']%100, uv: props['data'].current[thingToPlot], pv: 2400, amt: 2400})
  //         console.log(props['data'].current['ph'])

  //         if (chartData.length > 15){
  //           setChartData(cur => cur.slice(1));
  //         }

  //         console.log(chartData)

  //       }, 4000) 
  // }, [])

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(props['data'].current).length === 0 && props['data'].current.constructor === Object);
      else {
        let thing = props['data'].current.map(function (each) {
          return { time: each['time'] % 100, uv: each[thingToPlot], pv: 2400, amt: 2400 }
        })
        // console.log(thing)
        setChartData(thing)
      }
    }, 2000)
  })

  return (
    <div className='col'>
      <h3>{thingToPlot}</h3>
      <AreaChart
        width={600}
        height={400}
        data={chartData}
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
    </div>
  );
}

export default SampleRTChart