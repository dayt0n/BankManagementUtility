import React, { useState } from "react";
import { Form, Message } from "semantic-ui-react";

export const OpenAccountMortgage = () => {
    const [name, setName] = useState("");
    const [loanAmount, setLoanAmount] = useState(0);
    const [term, setTerm] = useState(0);
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    var errorMsg = 'Placeholder Error Message';

    var user = localStorage.getItem("User");

    var username = user;
    var type = "mortgage";

    return (
        <div className="OpenAccount">
            <h2>Mortgage</h2>
            <hr />
            <Form inverted className="OpenAccountMortgageForm" success={success} error={error} >

                <Form.Input
                    required
                    fluid
                    label='Account Name'
                    placeholder='Name'
                    onChange={(e) => setName(e.target.value)}
                />

                <Form.Input
                    required
                    fluid
                    label='Loan Amount'
                    placeholder='Amount'
                    onChange={(e) => setLoanAmount(e.target.value)}
                />

                <Form.Input
                    required
                    fluid
                    label='Term in Years'
                    placeholder='Years'
                    onChange={(e) => setTerm(e.target.value)}
                />

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        var currentTime = new Date();
                        var startDate = currentTime.toISOString();
                        const createRequest = {username, type, name, loanAmount, startDate, term};
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