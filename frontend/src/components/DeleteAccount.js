import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import "./DeleteAccount.css"

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

export const DeleteAccount = () => {
    const [account, setAccount] = useState("");
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [accountsLoading, setAccountsLoading] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    const [accountOpt, setAccountOptions] = useState([]);
    var errorMsg = 'Placeholder Error Message';

    var name = localStorage.getItem("User");

    useEffect(() => {
        setAccountsLoading(true);
        fetch("/api/user/accounts/" + name)
            .then(res => res.json())
            .then(data => {
                if (data["status"] === "success") {
                    setAccountOptions(parseUserAccounts(data["data"]))
                }
            })
            .then(() => setAccountsLoading(false))
    }, []);


    return (
        <div className="DeleteAccount">
            <h1>Delete Account</h1>
            <hr />
            <Form inverted className="DeleteAccountForm" success={success} error={error} >

                <Form.Select
                    required
                    fluid
                    label='Account'
                    disabled={accountsLoading}
                    loading={accountsLoading}
                    options={accountOpt}
                    placeholder='Account'
                    onChange={(e, {value}) => setAccount(value)}
                />

                <Form.Button
                    fluid
                    negative
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {

                        const response = await fetch("/api/money/account/delete/" + account, {
                            method: "GET",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
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
                    Delete Account
                </Form.Button>
                <Message
                    success
                    header='Form Completed'
                    content='Account Deleted!'
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