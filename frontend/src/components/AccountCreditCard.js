import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./Account.css"

var amountToShow = 5;

function historyCreate(history, account) {

    var htmlList = []
    for (var item in history) {
        item = history[item];
        var amount = item["amount"]
        var amountStr = "$" + amount.toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
        var recipient = item["recipient"];
        var isPositive = item["positive"];
        if (isPositive === true) {
            amountStr = "+" + amountStr;
        }
        else amountStr = "-" + amountStr;
        var date = new Date(Date.parse(item["transactionDate"]));
        var dateStr = date.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: 'short', timeStyle: 'long' })
        htmlList.push(
            <table border="0">
                <thead>
                    <tr style={{ width: '150%' }}>
                        <td style={{ width: '38%' }}>{amountStr}</td>
                        <td style={{ width: '38%' }}>{recipient}</td>
                        <td style={{ width: '38%' }}>{dateStr}</td>
                    </tr>
                </thead>
            </table>
        );
    }

    console.log(htmlList);

    return htmlList;
}


function AccountCreditCard(dataParentToChild) {

    const [history, setHistory] = useState([]);

    var account = dataParentToChild.dataParentToChild;

    var accBal = '$' + account["balance"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });

    var paymentDue = new Date(Date.parse(account["nextPayment"]));

    useEffect(() => {
        fetch("/api/money/account/history/" + account["accountNum"] + "/" + amountToShow)
            .then(res => res.json())
            .then(data => setHistory(historyCreate(data["data"], account)))
    }, []);

    return (
        <div className="AccountCreditCard">
            <h1>
                Credit Card - {account["accountName"]}
                <hr />
            </h1>
            <table border="0">
                <thead>
                    <tr style={{ width: '150%' }}>
                        <td style={{ width: '40%' }}>Account Number: {account["accountNum"]}</td>
                        <td style={{ width: '40%' }}>Routing Number: {account["routingNumber"]}</td>
                        <td style={{ width: '40%' }}>Interest Rate: {account["interestRate"]}%</td>
                    </tr>
                    <tr style={{ width: '150%' }}>
                        <td style={{ width: '40%'}}>Card Number: {account["cardNumber"]}</td>
                        <td style={{ width: '40%'}}>CVV: {account["cvv"]}</td>
                        <td style={{ width: '40%'}}>Credit Limit: ${account["creditLimit"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })}</td>
                    </tr>
                    <tr style={{ width: '150%' }}>
                        <td style={{ width: '40%'}}>Next Payment Due: {paymentDue.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td style={{ width: '40%'}}></td>
                    </tr>
                    <tr style={{ height: '10px' }}></tr>
                    <tr className="AccountBalance">
                        <td colSpan={3}>Balance: {accBal}</td>
                    </tr>
                    <tr style={{ height: '10px' }}></tr>
                    <tr>
                        <td colSpan={3}>Recent Transactions</td>
                    </tr>
                </thead>
            </table>
            <hr />
            {history}
            <Button className="MoreLessButtons" onClick={async () => {
                amountToShow=amountToShow+5;
                console.log(history.length + "bleh");
                if(history.length<amountToShow-5){
                    amountToShow-=5;
                }
                const response = await new Promise(() => {
                    fetch("/api/money/account/history/" + account["accountNum"] + "/" + amountToShow)
                        .then(res => res.json())
                        .then(data => setHistory(historyCreate(data["data"], account)))
                }, []);

                if (!response.ok) {
                    console.log("response failed!");
                    return;
                }


            }
            }>More</Button>

            <Button className="MoreLessButtons" onClick={async () => {
                if(amountToShow>5){
                    amountToShow-=5;
                }
                const response = await new Promise(() => {
                    fetch("/api/money/account/history/" + account["accountNum"] + "/" + amountToShow)
                        .then(res => res.json())
                        .then(data => setHistory(historyCreate(data["data"], account)))
                }, []);

                if (!response.ok) {
                    console.log("response failed!");
                    return;
                }

                console.log(amountToShow);
            }
            }>Less</Button>
        </div>
    )
}

export default AccountCreditCard;