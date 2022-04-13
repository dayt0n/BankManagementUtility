import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import decode from "jwt-decode";
import "./TransferAccountToAccount.css";


function parseUserAccounts(accounts) {

    var from = [];
    var to = [];

    if (accounts["status"] === 'error') {
        return [from, to];
    }
    return [from, to];
}

export const TransferAccountToAccount = () => {
    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");
    const [options, setOptions] = useState([[],[]]);
    const [amount, setAmount] = useState("");
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
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
        fetch("/api/user/accounts/" + name)
            .then(res => res.json())
            .then(data => setOptions(parseUserAccounts(data)))
    }, []);

    return (
        <div className="TransferAccountToAccount">
            <h1>Transfer Funds</h1>
            <hr />
            <Form inverted className="TransferA2AForm" success={success} error={error} >
                <Form.Select
                    required
                    fluid
                    label='Transfer From'
                    options={options[0]}
                    placeholder='Account'
                    onChange={(e, {value}) => setFromAccount(value)}
                />

                <Form.Select
                    required
                    fluid
                    label='Transfer To'
                    options={options[1]}
                    placeholder='Account'
                    onChange={(e, {value}) => setToAccount(value)}
                />

                <Form.Input
                    required
                    fluid
                    label='Amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { fromAccount, toAccount, amount };
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