import React, { useState, useEffect, useRef } from "react";

const Navbar = (props) => {
    return (
        <div className='row navbar justify-content-between'>
            <h1 className='col'>ESW-DASH</h1>
            <button className='col btn red m-2'>btn 1</button>
            <button className='col btn red m-2'>btn 2</button>
            <button className='col btn red m-2'>btn 3</button>
        </div>
    )
}

export default Navbar