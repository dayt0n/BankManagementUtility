import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import CurrencyInput from 'react-currency-input-field';


function parseUserAccounts(accounts) {

    if (accounts["status"] === 'error') {
        return [];
    }

    var from = []

    for (var account in accounts) {
        account = accounts[account];
        var accountNum = account["accountNum"].toString();
        var len = accountNum.length;
        if (account["accountType"] === "checking" || account["accountType"] === "savings") {
            var balance = account["balance"].toString();
            from.push({key: account["accountName"], 
                       text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1) + " - Balance: " + balance, 
                       value: account["accountNum"]})
        }
    }

    var options = from;

    return options;
}


export const OpenAccountMoneyMarket = () => {
    const [name, setName] = useState("");
    const [balanceFrom, setFromAccount] = useState("");
    const [balance, setBalance] = useState("");
    const [options, setOptions] = useState([]);
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    const [accountsLoading, setAccountsLoading] = useState(Boolean);
    var errorMsg = 'Placeholder Error Message';

    var user = localStorage.getItem("User");

    useEffect(() => {
        setAccountsLoading(true);
        fetch("/api/user/accounts/" + user)
            .then(res => res.json())
            .then(data => {
                if (data["status"] === "success") {
                    setOptions(parseUserAccounts(data["data"]))
                }
            })
            .then(() => setAccountsLoading(false))
    }, []);

    return (
        <div className="OpenAccount">
            <h2>Money Market</h2>
            <hr />
            <Form inverted className="OpenAccountMoneyMarketForm" success={success} error={error} >

                <Form.Input
                    fluid
                    label='Account Name'
                    placeholder='Name'
                    onChange={(e) => setName(e.target.value)}
                />

                <h3><b>Must transfer $500 or more into this account to open it. Please choose account to transfer from below.</b></h3>

                <Form.Select
                    fluid
                    label='Transfer From'
                    disabled={accountsLoading}
                    loading={accountsLoading}
                    options={options}
                    placeholder='Account'
                    onChange={(e, {value}) => setFromAccount(value)}
                />

                <label><b>Starting Balance</b></label>

                <CurrencyInput
                    id="amount-input"
                    name="Credit Limit (Total Credit Allowed)"
                    placeholder="Amount"
                    decimalsLimit={2}
                    allowNegativeValue={false}
                    defaultValue={0}
                    prefix="$"
                    onValueChange={(value, name) => setBalance(value)}
                />

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = {username: user, name, balance, balanceFrom, type: "moneyMarket"};
                        var quit = false;
                        for (var field in createRequest) {
                            if (createRequest[field] === "") {
                                errorMsg = document.getElementById('Error Message').getElementsByTagName('p')
                                errorMsg[0].textContent = "All fields must be filled."
                                setError(true);
                                setSuccess(false);
                                quit = true;
                            }
                        }

                        if (quit) { return; }


                        const response = await fetch("/api/money/account/create", {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(createRequest),
                        });

                        if (!response.ok) {
                            console.log("response failed!");
                            errorMsg = document.getElementById('Error Message').getElementsByTagName('p')
                            errorMsg[0].textContent = "No response from server. Check your internet connection and try again."
                            setError(true);
                            setSuccess(false);
                            return;
                        }
                        setRequestLoading(true);
                        let content = await response.json();
                        setRequestLoading(false);

                        if (content.status === 'error') {
                            errorMsg = document.getElementById('Error Message').getElementsByTagName('p')
                            errorMsg[0].textContent = content.data
                            setError(true);
                            setSuccess(false);
                        }
                        else if (content.status === 'success') {
                            setError(false);
                            setSuccess(true);
                        }
                    }}
                >
                    Submit
                </Form.Button>
                <Message
                    success
                    header='Form Completed'
                    content='Account has been opened! Check your summary page to see your new account!'
                />
                <Message id='Error Message'
                    error
                    header='Error!'
                    content='Placeholder Error Message.'
                />
            </Form>
        </div>
    );
};