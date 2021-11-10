import React, { useState, useEffect, useRef } from "react";
import SampleRTChart from "./RTChart";

const axios = require('axios')


const MainChartGrid = (props) => {
    let data = useRef({})

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get('http://127.0.0.1:4000/getAll').then(res => {
                // setData(res.data.data)
                data.current = res.data.data
                console.log(data.current)
            })
        }, 4000) 
    }, [])
    

    return (
        <div>
            <div className='row'>
                <div className='col'>
                    <SampleRTChart data={data} thingToPlot='ph' />
                </div>
                <div className='col'>
                <SampleRTChart data={data} thingToPlot= 'tds' />
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                <SampleRTChart data={data} thingToPlot='temp' />
                </div><div className='col'>
                <SampleRTChart data={data} thingToPlot='orp' />
                </div>
            </div>
        </div>

        // <div>
        //     <SampleRTChart data={data} thingToPlot='ph' />
        // </div>
    )
}

export default MainChartGrid