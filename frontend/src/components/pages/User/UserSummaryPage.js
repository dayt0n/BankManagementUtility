import React, { useEffect, useState } from "react";
import { userLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import decode from 'jwt-decode';
import { NoAccounts } from "../../NoAccounts";
import { AccountChecking } from "../../AccountChecking";
import { AccountSaving } from "../../AccountSaving";
import { AccountCreditCard } from "../../AccountCreditCard";
import { AccountMortgage } from "../../AccountMortgage";
import { AccountMoneyMarket } from "../../AccountMoneyMarket";

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
    const links = userLinks;

    var user;

    if (document.cookie) {
        user = decode(document.cookie);
        console.log(user);
        console.log(document.cookie);

        if (user["role"] !== "customer") {
            return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
        }
    }
    else {
        return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
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