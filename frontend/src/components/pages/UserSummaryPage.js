import React from "react";
import TemplatePage from './TemplatePage';
import decode from 'jwt-decode';
import { Redirect } from 'react-router-dom';

function UserSummaryPage() {
    const state = {
        'links': ['Summary', '/user/summary',
                  'Transfer Funds', '/user/transfer',
                  'Pay A Bill', '/user/pay-bill',
                  'Edit Account Information', '/user/edit-account',
                  'Open New Account', '/user/open-account',],
        'items': []
    };
    
    if (document.cookie) {
        var redirect = <></>
        const user = decode(document.cookie);
        console.log(user);
        console.log(document.cookie);

        const response = fetch("/api/user/accounts/" + user["user"], {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });
    
        if (!response.ok) {
            console.log("response failed!");
        }
    }
    else {
        var redirect = <Redirect to="/" />
    }

    return (
        <div>
            {redirect}
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default UserSummaryPage;