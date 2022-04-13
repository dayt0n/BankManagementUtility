import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import decode from "jwt-decode";
import CurrencyInput from 'react-currency-input-field';
import "./TransferAccountToAccount.css";


function parseUserAccounts(accounts) {

    if (accounts["status"] === 'error') {
        return [];
    }

    var from = []
    var to = []

    for (var account in accounts) {
        account = accounts[account];
        var accountNum = account["accountNum"].toString();
        var len = accountNum.length;
        if (account["accountType"] === "checking" || account["accountType"] === "savings") {
            from.push({key: account["accountName"], 
                       text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1), 
                       value: account["accountNum"]})
        }
        to.push({key: account["accountName"], 
                 text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1), 
                 value: account["accountNum"]})
    }

    var options = [from, to];

    return options;
}

export const TransferAccountToAccount = () => {
    const [from, setFromAccount] = useState("");
    const [to, setToAccount] = useState("");
    const [options, setOptions] = useState([[],[]]);
    const [amount, setAmount] = useState("");
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [accountsLoading, setAccountsLoading] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    var errorMsg = 'Placeholder Error Message';

    // GET TRANSFER OPTIONS HERE

    var name = localStorage.getItem("User");

    if (name === null)
    {
        var user = decode(document.cookie)
        name = user["user"];
    }

    useEffect(() => {
        setAccountsLoading(true);
        fetch("/api/user/accounts/" + name)
            .then(res => res.json())
            .then(data => {
                if (data["status"] === "success") {
                    setOptions(parseUserAccounts(data["data"]))
                }
            })
            .then(() => setAccountsLoading(false))
    }, []);

    return (
        <div className="TransferAccountToAccount">
            <h1>Transfer Funds</h1>
            <hr />
            <Form inverted className="TransferA2AForm" success={success} error={error} >
                <Form.Select
                    fluid
                    label='Transfer From'
                    disabled={accountsLoading}
                    loading={accountsLoading}
                    options={options[0]}
                    placeholder='Account'
                    onChange={(e, {value}) => setFromAccount(value)}
                />

                <Form.Select
                    fluid
                    label='Transfer To'
                    disabled={accountsLoading}
                    loading={accountsLoading}
                    options={options[1]}
                    placeholder='Account'
                    onChange={(e, {value}) => setToAccount(value)}
                />

                <label><b>Amount</b></label>

                <CurrencyInput
                    id="amount-input"
                    name="Amount"
                    placeholder="Amount"
                    decimalsLimit={2}
                    allowNegativeValue={false}
                    defaultValue={0}
                    prefix="$"
                    onValueChange={(value, name) => setAmount(value)}
                />

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { from, to, amount };
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


                        const response = await fetch("/api/money/move/transfer", {
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
                    content='Money transfer was successful!'
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