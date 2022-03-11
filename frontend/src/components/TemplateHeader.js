import React from 'react';
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";


function TemplateHeader() {
    return (
        <header>
            <div className="Header">
                <span className="dot"></span>
                <h1>Bank</h1>
                <Button to="/">Log Out</Button>
            </div>
        </header>
    );
}

export default TemplateHeader;