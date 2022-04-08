import React, { useState } from "react";
import { Form, Message } from "semantic-ui-react";
import "./OpenAccount.css"

export const OpenAccount = () => {
    const [accountType, setAccountType] = useState("");
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    var errorMsg = 'Placeholder Error Message';

    // GET TRANSFER OPTIONS HERE

    const accountTypeOpt = [
        {key: 'c', text: 'Checking', value: 1},
        {key: 's', text: 'Saving', value: 2},
        {key: 'm', text: 'Mortgage', value: 3},
        {key: 'cc', text: 'Credit Card', value: 4},
    ]

    return (
        <div className="OpenAccount">
            <h1>Open New Account</h1>
            <hr />
            <Form inverted className="OpenAccountForm" success={success} error={error} >
                <Form.Select
                    required
                    fluid
                    label='Account Type'
                    options={accountTypeOpt}
                    placeholder='Bill'
                    onChange={(e) => setAccountType(e.target.value)}
                />

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { accountType };
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