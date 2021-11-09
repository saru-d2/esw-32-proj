import React, { useState, useEffect, useRef } from "react";
import SampleRTChart from "./RTChart";
const MainChartGrid = (props) => {
    return (
        <div>
            <div className='row'>
                <div className='col'>
                    <SampleRTChart />
                </div>
                <div className='col'>
                    <SampleRTChart />
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                    <SampleRTChart />
                </div><div className='col'>
                    <SampleRTChart />
                </div>
            </div>
        </div>
    )
}

export default MainChartGrid