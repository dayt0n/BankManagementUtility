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
                <br></br>
                Account Number: {account["accountNum"]}
                <br></br>
                Routing Number: {account["routingNumber"]}
            </header>
            <ul>
                Dividend Rate: {account["dividendRate"]}
            </ul>
            <ul>
                Balance: {account["balance"]}
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