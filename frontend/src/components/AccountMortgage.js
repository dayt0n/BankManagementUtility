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


function AccountMortgage(dataParentToChild) {

    const [history, setHistory] = useState([]);

    var account = dataParentToChild.dataParentToChild;

    var accBal = '$' + account["currentAmountOwed"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });

    var startDate = new Date(Date.parse(account["startDate"]));

    var endDate = new Date(Date.parse(account["paymentDueDate"]));

    var nextPayDate = new Date(Date.parse(account["nextPayment"]));

    useEffect(() => {
        fetch("/api/money/account/history/" + account["accountNum"] + "/" + amountToShow)
            .then(res => res.json())
            .then(data => setHistory(historyCreate(data["data"], account)))
    }, []);

    return (
        <div className="AccountMortgage">
            <h1>
                Mortgage - {account["accountName"]}
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
                        <td style={{ width: '40%' }}>Loan Start: {startDate.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td style={{ width: '40%' }}>Loan Finish: {endDate.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td style={{ width: '40%' }}>Loan Amount: ${account["loanAmount"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })}</td>
                    </tr>
                    <tr style={{ width: '150%' }}>
                        <td style={{ width: '40%' }}>Loan Term: {account["loanTerm"]}</td>
                        <td style={{ width: '40%' }}>Monthly Payment: ${account["monthlyPayment"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })}</td>
                        <td style={{ width: '40%' }}>Next Payment Due: {nextPayDate.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: 'short', timeStyle: 'short' })}</td>
                    </tr>
                    <tr style={{ height: '10px' }}></tr>
                    <tr className="AccountBalance">
                        <td colSpan={3}>Amount Owed This Term: {accBal}</td>
                    </tr>
                    <tr style={{ height: '10px' }}></tr>
                    <tr className="AccountBalance">
                        <td colSpan={3}>Total Amount Owed: ${account["totalOwed"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })}</td>
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

export default AccountMortgage;