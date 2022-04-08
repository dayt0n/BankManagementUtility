import React from 'react';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function logout() {
    if (document.cookie) {
        document.cookie = 'COOKIE_NAME=session; Max-Age=0;';
    }

    console.log("Logged out!");
}

function TemplateHeader() {

    var redirect = <></>;

    if (!document.cookie) {
        redirect = <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
    }


    return (
        <header>
            {redirect}
            <div className="Header">
                <span className="dot"></span>
                <h1>Bank</h1>
                <Link to="/">
                    <Button onClick={logout()}>
                        Log Out
                    </Button>
                </Link>
            </div>
        </header>
    );
}

export default TemplateHeader;