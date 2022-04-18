import React, {useState, useEffect} from "react";
//import { Form } from "semantic-ui-react";
import "./Account.css"

function historyCreate(history, account) {

    var htmlList =[]
    for (var item in history) {
        item = history[item];
        var amount = item["amount"]
        var amountStr="$"+ amount.toLocaleString("en", {'minimumFractionDigits':2,'maximumFractionDigits':2});
        var recipient = item["recipient"];
        if(recipient===(account["accountName"] + " (" + account["accountNum"] + ")")){
            amountStr="+" + amountStr;
        }
        else amountStr="-" + amountStr;
        var date = new Date(Date.parse(item["transactionDate"]));
        var dateStr= date.toLocaleString("en-US", {timeZone: "America/Chicago", dateStyle: 'short', timeStyle: 'long'})
        htmlList.push(
        <table border="0">
            <thead>
                <tr style={{width: '150%'}}>
                    <td style={{width: '38%'}}>{amountStr}</td>
                    <td style={{width: '38%'}}>{recipient}</td>
                    <td style={{width: '38%'}}>{dateStr}</td>
                </tr>
            </thead>
        </table>
        );
    }

    console.log(htmlList);

    return htmlList;
}

function AccountSaving(dataParentToChild) {

    const [history, setHistory] = useState([]);

    var account = dataParentToChild.dataParentToChild;

    var accBal='$' + account["balance"].toLocaleString("en", {'minimumFractionDigits':2,'maximumFractionDigits':2});

    useEffect(() => {
        fetch("/api/money/account/history/" + account["accountNum"] + "/5")
        .then(res => res.json())
        .then(data => setHistory(historyCreate(data["data"], account)))
    }, []);

    return (
        <div className="AccountSaving">
            <h1>
                Savings - {account["accountName"]}
                <hr />
            </h1>
            <table border="0">
                <thead>
                    <tr style={{width: '150%'}}>
                        <td style={{width: '40%'}}>Account Number: {account["accountNum"]}</td>
                        <td style={{width: '40%'}}>Routing Number: {account["routingNumber"]}</td>
                        <td style={{width: '40%'}}>Dividend Rate: {account["dividendRate"]}%</td>
                    </tr>
                    <tr style={{height: '10px'}}></tr>
                    <tr className="AccountBalance">
                        <td colSpan={3}>Balance: {accBal}</td>
                    </tr>
                    <tr style={{height: '10px'}}></tr>
                    <tr>
                        <td colSpan={3}>Recent Transactions</td>
                    </tr>
                </thead>
            </table>
            <hr />
            {history}
            <button onClick={async () => {
            const response = await new Promise(() => {
                fetch("/api/money/account/history/" + account["accountNum"] + "/20")
                .then(res => res.json())
                .then(data => setHistory(historyCreate(data["data"], account)))
            }, []);

            if (!response.ok) {
                console.log("response failed!");
                return;
            }
        } 
        }>More</button>
        </div>
    )
}

export default AccountSaving;