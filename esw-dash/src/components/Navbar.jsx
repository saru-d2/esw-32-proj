import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = (props) => {
    return (
        <div className='row navbar justify-content-between'>
            <h1 className='col'>ESW-DASH</h1>
            <Link
                className="btn red col m-2"
                to="/"
                exact>
                Home
            </Link>

            <Link
                className="btn red col m-2"
                to="/TS"
                exact>
                TS
            </Link>

            <Link
                className="btn red col m-2"
                to="/oM2M"
                exact>
                oM2M
            </Link>
        </div>
    )
}

export default Navbar