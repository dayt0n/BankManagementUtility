import React, { useState } from "react";
import { Form, Message } from "semantic-ui-react";
import "./TransferAccountToAccount.css"

export const TransferAccountToAccount = () => {
    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    var errorMsg = 'Placeholder Error Message';

    // GET TRANSFER OPTIONS HERE

    const options = [
        {key: 'c', text: 'Checking', value: 1234},
        {key: 's', text: 'Saving', value: 1234}
    ]

    return (
        <div className="TransferAccountToAccount">
            <h1>Transfer Funds</h1>
            <hr />
            <Form inverted className="TransferA2AForm" success={success} error={error} >
                <Form.Select
                    required
                    fluid
                    label='Transfer From'
                    options={options}
                    placeholder='Account'
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                />

                <Form.Select
                    required
                    fluid
                    label='Transfer To'
                    options={options}
                    placeholder='Account'
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
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