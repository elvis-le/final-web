import React from "react";
import "./Verified.scss"
import {Link} from "react-router-dom";

const Verified = () => {
    return(
        <>
            <div className="verified-container">
                <div className="form-box">
                    <h2>Verified</h2>
                    <span>⚠️ Please verified your email before login</span>
                    <button><Link to="/login" className="link">Ok</Link></button>
                </div>
            </div>
        </>
    )
}

export default Verified;