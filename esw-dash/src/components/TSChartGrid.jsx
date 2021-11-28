import React, { useState, useEffect, useRef } from "react";
import SampleRTChart from "./RTChart";

const axios = require('axios')


const TSChartGrid = (props) => {
    let data = useRef({})
    let fieldNames, setfieldNames = useState([])
    useEffect(() => {
        // axios.get('http://127.0.0.1:4000/getThingspeakFieldNames').then(res => {
        //     setfieldNames(res)
        // })

        const interval = setInterval(() => {
            axios.get('http://127.0.0.1:4000/getThingspeak').then(res => {
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
                    <SampleRTChart data={data} thingToPlot='field1' title='Temp' />
                </div>
                <div className='col'>
                <SampleRTChart data={data} thingToPlot= 'field2' title='TDS voltage' />
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                <SampleRTChart data={data} thingToPlot='field3' title='Temp compensation'/>
                </div><div className='col'>
                <SampleRTChart data={data} thingToPlot='field4' title='TDS with temp compenation'/>
                </div>
            </div>
        </div>

        // <div>
        //     <SampleRTChart data={data} thingToPlot='ph' />
        // </div>
    )
}

export default TSChartGrid