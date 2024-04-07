import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
function Banner({ toggleSidebar}) {

    function handleClick() {
        toggleSidebar(false);
    }

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "red", height: "20px" }}>
            <p style={{ paddingLeft: "30px", paddingTop: "13px", fontSize: "12px", color: "#fff", width: "50%" }}>Do More |  Be More | Tryin3D | StoreLocator | IND </p>
            <div style={{ display: "flex", alignItems: "center", width: "50%", justifyContent: "flex-end" }}>
                <p style={{ paddingRight: "10px", paddingTop: "13px", fontSize: "12px", color: "#fff" }}>Contact Us</p>
                <i className="fas fa-times" style={{ paddingRight: "10px"}} onClick={handleClick}></i>
            </div>

        </div>
    );
}

export default Banner;