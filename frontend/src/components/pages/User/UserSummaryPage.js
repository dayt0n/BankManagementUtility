import React, { useEffect, useState } from "react";
import { userLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";
import { NoAccounts } from "../../NoAccounts";
import AccountChecking from "../../AccountChecking";
import { AccountSaving } from "../../AccountSaving";
import { AccountCreditCard } from "../../AccountCreditCard";
import { AccountMortgage } from "../../AccountMortgage";
import { AccountMoneyMarket } from "../../AccountMoneyMarket";

function parseUserAccounts(accounts) {
    var items = []
    var key = 0

    if (accounts["status"] === 'error') {
        items.push(<NoAccounts key={"item" + key}/>);
    }
    else {
        for (var account in accounts["data"]) {

            account = accounts["data"][account];

            if (account["accountType"] === "checking") {
                items.push(<AccountChecking key={"item" + key } dataParentToChild={account}/>)
            }

            key += 1;
        }
    }

    console.log(items);
    return items;
}

function UserSummaryPage() {
    const [items, setItems] = useState();
    const links = userLinks;

    var user = PermissionCheck("customer");

    if (user === false) {
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