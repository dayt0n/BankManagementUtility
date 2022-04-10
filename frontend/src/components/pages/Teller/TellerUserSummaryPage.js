import React, { useEffect, useState } from "react";
import { tellerUserLinks } from '../../LinkLists';
import PermissionCheck from "../../PermissionCheck";
import TemplatePage from '../TemplatePage';
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

function TellerUserSummaryPage() {
    const [items, setItems] = useState();
    const links = tellerUserLinks;

    var user = PermissionCheck("teller");

    if (user === false) {
        return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
    }

    useEffect(() => {
        fetch("/api/user/accounts/" + localStorage.getItem("User"))
            .then(res => res.json())
            .then(data => setItems(parseUserAccounts(data)))
    }, []);

    return (
        <div>
            {items && links && <TemplatePage dataParentToChild={{items, links}} />}
        </div>
    );
}

export default TellerUserSummaryPage;