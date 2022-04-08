import React, { useEffect, useState } from "react";
import TemplatePage from './TemplatePage';
import decode from 'jwt-decode';
import { NoAccounts } from "../NoAccounts";

function parseUserAccounts(accounts) {
    console.log(accounts);

    var items = []
    var key = 0

    if (accounts["status"] === 'error') {
        items.push(<NoAccounts key={"item" + key}/>);
    }
    else {
        for (var account in accounts) {

            // Parse Items

            key += 1;
        }
    }

    return items;
}

function UserSummaryPage() {
    const [items, setItems] = useState();
    const links = ['Summary', '/user/summary',
                   'Transfer Funds', '/user/transfer',
                   'Pay A Bill', '/user/pay-bill',
                   'Edit Account Information', '/user/edit-account',
                   'Open New Account', '/user/open-account',];

    var user;

    if (document.cookie) {
        user = decode(document.cookie);
        console.log(user);
        console.log(document.cookie);
    }

    useEffect(() => {
        fetch("/api/user/accounts/" + user["user"])
            .then(res => res.json())
            .then(data => setItems(parseUserAccounts(data)))
    }, []);

    return (
        <div>
            {items && links && <TemplatePage dataParentToChild={{items, links}} />}
        </div>
    );
}

export default UserSummaryPage;