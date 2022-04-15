import React from "react";
import "./Account.css"

function AccountChecking(dataParentToChild) {

    var account = dataParentToChild.dataParentToChild;
    console.log(account);

    const history = fetch("/api/money/account/history/" + account["accountNum"] + "/5");

    return (
        <div className="AccountChecking">
            <header>
                {account["accountName"]}
                Routing: {account["routingNumber"]}
                Account: {account["accountNum"]}
            </header>
            <ul>
                Balance: {account["balance"]}
            </ul>
            <ul>
                Dividend: {account["dividendRate"]}
            </ul>
            <ul>
                Recent Transactions
                {history[0]}
                {history[1]}
                {history[2]}
                {history[3]}
                {history[4]}
            </ul>
        </div>
    )
}

export default AccountChecking;