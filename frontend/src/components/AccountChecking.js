import React, {useState, useEffect} from "react";
import "./Account.css"

function historyCreate(history) {
    var htmlList =[]
    for (var item in history) {
        item = history["item"];
        htmlList.push(<p className="transactionItem">{item}</p>)
    }

    console.log(htmlList)

    return htmlList;
}


function AccountChecking(dataParentToChild) {

    const [history, setHistory] = useState([]);

    var account = dataParentToChild.dataParentToChild;
    console.log(account);

    useEffect(() => {
        fetch("/api/money/account/history/" + account["accountNum"] + "/5")
        .then(res => res.json())
        .then(data => setHistory(historyCreate(data["data"])))
    }, []);

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
                {history}
            </ul>
        </div>
    )
}

export default AccountChecking;