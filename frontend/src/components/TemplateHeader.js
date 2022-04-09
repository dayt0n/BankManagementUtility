import React from 'react';
import decode from 'jwt-decode';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function TemplateHeader() {
    const navigate = useNavigate()

    var hiString = "";
    var logOutButton = <></>;
    
    if (document.cookie) {
        var user = decode(document.cookie);
        hiString = "Hi, " + user["user"] + "!";
        logOutButton = 
            <div className="LogOut">
                <h2>{hiString}</h2>
                <Button 
                    onClick= {() => {
                        if (document.cookie) {
                            document.cookie = 'session=; Max-Age=0;';
                        }
                    
                        navigate("/")
                    
                        console.log("Logged out!");
                    }}>
                    Log Out
                </Button>
            </div>
    }



    return (
        <header>
            <div className="Header">
                <span className="dot"></span>
                <h1>Bank</h1>
                {logOutButton}
            </div>
        </header>
    );
}

export default TemplateHeader;