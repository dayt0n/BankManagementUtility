import React, { useState } from "react";
import { Form, Message } from "semantic-ui-react";
import "./PayBillFromAccount.css"

export const PayBillFromAccount = () => {
    const [billAccount, setBillAccount] = useState("");
    const [moneyAccount, setMoneyAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    var errorMsg = 'Placeholder Error Message';

    // GET TRANSFER OPTIONS HERE

    const accountOpt = [
        {key: 'c', text: 'Checking', value: 1},
        {key: 's', text: 'Saving', value: 2}
    ]

    const billOpt = [
        {key: 'm', text: 'Mortgage', value: 1},
        {key: 'cc', text: 'Credit Card', value: 2}
    ]

    return (
        <div className="PayBillFromAccount">
            <h1>Pay Bill</h1>
            <hr />
            <Form inverted className="PayBillForm" success={success} error={error} >
                <Form.Select
                    required
                    fluid
                    label='Bill To Pay'
                    options={billOpt}
                    placeholder='Bill'
                    onChange={(e) => setBillAccount(e.target.value)}
                />

                <Form.Select
                    required
                    fluid
                    label='Account To Pay From'
                    options={accountOpt}
                    placeholder='Account'
                    onChange={(e) => setMoneyAccount(e.target.value)}
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
                        const createRequest = { billAccount, moneyAccount, amount };
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


                        const response = await fetch("/api/money/bills/pay", {
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