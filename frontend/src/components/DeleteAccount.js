import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import "./DeleteAccount.css"

function parseUserAccounts(accounts) {

    if (accounts["status"] === 'error') {
        return [];
    }
    return accounts;
}

export const DeleteAccount = () => {
    const [account, setAccount] = useState("");
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    const [accountOpt, setAccountOptions] = useState([]);
    var errorMsg = 'Placeholder Error Message';

    var name = localStorage.getItem("User");

    useEffect(() => {
        fetch("/api/user/accounts/" + name)
            .then(res => res.json())
            .then(data => setAccountOptions(parseUserAccounts(data)))
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
                    options={accountOpt}
                    placeholder='Account'
                    onChange={(e, {value}) => setAccount(value)}
                />

                <Form.Button
                    fluid
                    negative
                    loading={requestLoading}
                    type='Delete Account'
                    onClick={async () => {
                        const createRequest = { account };
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