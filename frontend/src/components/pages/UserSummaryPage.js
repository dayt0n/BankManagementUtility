import React from "react";
import TemplatePage from './TemplatePage';
import decode from 'jwt-decode';

async function getUserAccounts() {
    const user = decode(document.cookie);
    console.log(user);
    console.log(document.cookie);

    const response = await fetch("/api/user/accounts/" + user["user"], {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        console.log("response failed!");
    }
    else {
        console.log("response recieved!");
    }

    return response;
}

function parseUserAccounts(accounts) {
    console.log(accounts);
    console.log(accounts.value);
}

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
        getUserAccounts().then(response => { parseUserAccounts(response.json()) });
    }

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default UserSummaryPage;