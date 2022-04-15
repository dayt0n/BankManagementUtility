import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import "./DeleteTellerAccount.css"


export const DeleteTellerAccount = () => {
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);

    const navigate = useNavigate();
    var errorMsg = 'Placeholder Error Message';

    var name = localStorage.getItem("User");

    return (
        <div className="DeleteTellerAccount">
            <h1>Delete Entire Account</h1>
            <hr />
            <Form inverted className="DeleteTellerAccountForm" success={success} error={error} >

                <h3>This is not reversible! Make sure this is what you want to do before clicking the button below.</h3>

                <Form.Button
                    fluid
                    negative
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {

                        const response = await fetch("/api/user/delete/" + name, {
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

                            await new Promise(r => setTimeout(r, 2000));
                            navigate("/admin/overview");
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