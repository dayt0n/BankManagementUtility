import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import decode from "jwt-decode";
import "./WithdrawDepositFunds.css"

function parseUserAccounts(accounts) {

    if (accounts["status"] === 'error') {
        return [];
    }

    var accountOpt = []

    for (var account in accounts) {
        account = accounts[account];
        var accountNum = account["accountNum"].toString();
        var len = accountNum.length;
        accountOpt.push({key: account["accountName"], 
                         text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1), 
                         value: account["accountNum"]})
    }

    return accountOpt;
}


export const WithdrawDepositFunds = () => {
    const [account, setAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    const [accountOpt, setAccountOptions] = useState([]);
    var errorMsg = 'Placeholder Error Message';

    var name = localStorage.getItem("User");

    if (name === null)
    {
        var user = decode(document.cookie)
        name = user["user"];
    }

    useEffect(() => {
        fetch("/api/user/accounts/" + name)
            .then(res => res.json())
            .then(data => setAccountOptions(parseUserAccounts(data["data"])))
    }, []);


    return (
        <div className="WithdrawDepositFunds">
            <h1>Withdraw or Deposit Funds</h1>
            <hr />
            <Form inverted className="WithdrawDepositFundsForm" success={success} error={error} >
                <Form.Select
                    required
                    fluid
                    label='Account'
                    options={accountOpt}
                    placeholder='Account'
                    onChange={(e, {value}) => setAccount(value)}
                />

                <Form.Input
                    required
                    fluid
                    label='Amount'
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <Form.Group>
                    <Form.Radio
                        label='Withdraw'
                        name='radioGroup'
                        value='withdraw'
                        checked={type === 'withdraw'}
                        onChange={() => setType("withdraw")}
                    />

                    <Form.Radio
                        label='Deposit'
                        name='radioGroup'
                        value='deposit'
                        checked={type === 'deposit'}
                        onChange={() => setType("deposit")}
                    />
                </Form.Group>

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { account, amount };
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

                        var response = null;

                        if (type === "withdraw") {
                            response = await fetch("/api/money/account/move/withdraw", {
                                method: "POST",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(createRequest),
                            });
                        }
                        else if (type === "deposit") {
                            response = await fetch("/api/money/account/move/deposit", {
                                method: "POST",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(createRequest),
                            });
                        }

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
                    content='Payment went through successfully!'
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