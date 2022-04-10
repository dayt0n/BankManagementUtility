import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import decode from 'jwt-decode';
import "./EditUserAccount.css"

export const TellerEditUserAccount = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [password, setNewPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [passSuccess, setPasswordSuccess] = useState(Boolean);
    const [passError, setPasswordError] = useState(Boolean);
    const [infoSuccess, setInfoSuccess] = useState(Boolean);
    const [infoError, setInfoError] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    var errorMsg = 'Placeholder Error Message';

    function setVars(userInfo) {
        console.log(userInfo);
        var name = userInfo['name'].split(" ");
        setFirstName(name[0]);
        setLastName(name[1]);
        setAddress(userInfo['address']);
        setPhone(userInfo['phone']);
        setEmail(userInfo['email']);
    }

    var user = localStorage.getItem("User");

    useEffect(() => {
        fetch("/api/user/info/" + user)
            .then(res => res.json())
            .then(data => setVars(data["data"]))
    }, []);

    return (
        <div className="EditUserAccount">
            <h1>Edit Account</h1>
            <hr />
            <h3>Change Password</h3>
            <Form inverted className="ChangePasswordForm" success={passSuccess} error={passError} >
                <Form.Input
                    required
                    fluid
                    type='password'
                    label='Old Password'
                    placeholder="Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <Form.Input
                    required
                    fluid
                    type='password'
                    label='New Password'
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { oldPassword, password };
                        var quit = false;
                        for (var field in createRequest) {
                            if (createRequest[field] === "") {
                                errorMsg = document.getElementById('Error Message').getElementsByTagName('p')
                                errorMsg[0].textContent = "All fields must be filled."
                                setPasswordError(true);
                                setPasswordSuccess(false);
                                quit = true;
                            }
                        }

                        if (quit) { return; }


                        const response = await fetch("/api/user/edit/" + user, {
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
                            setPasswordError(true);
                            setPasswordSuccess(false);
                            return;
                        }
                        setRequestLoading(true);
                        let content = await response.json();
                        setRequestLoading(false);
                        
                        if (content.status === 'error') {
                            errorMsg = document.getElementById('Error Message').getElementsByTagName('p')
                            errorMsg[0].textContent = content.data
                            setPasswordError(true);
                            setPasswordSuccess(false);
                        }
                        else if (content.status === 'success') {
                            setPasswordError(false);
                            setPasswordSuccess(true);
                        }
                    }}
                >
                    Submit
                </Form.Button>
                <Message
                    success
                    header='Form Completed'
                    content='Password Updated!'
                />
                <Message id='Error Message'
                    error
                    header='Error!'
                    content='Placeholder Error Message.'
                />
            </Form>
            <hr />
            <h3>Change User Information</h3>
            <Form inverted className="ChangeAccountInfoForm" success={infoSuccess} error={infoError} >
                <Form.Group widths='equal'>
                    <Form.Input
                        required
                        fluid
                        label='First Name'
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Form.Input
                        required
                        fluid
                        label='Last Name'
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Form.Group>

                <Form.Input
                    required
                    fluid
                    type='email'
                    label='Email'
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                
                <Form.Input
                    required
                    fluid
                    label='Full Address'
                    placeholder="Full Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <Form.Input
                    required
                    fluid
                    label='Phone Number'
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { firstName, lastName, address, phone, email };
                        var quit = false;
                        for (var field in createRequest) {
                            if (createRequest[field] === "") {
                                errorMsg = document.getElementById('Error Message Info').getElementsByTagName('p')
                                errorMsg[0].textContent = "All fields must be filled."
                                setInfoError(true);
                                setInfoSuccess(false);
                                quit = true;
                            }
                        }

                        if (quit) { return; }


                        const response = await fetch("/api/user/edit/" + user, {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(createRequest),
                        });

                        if (!response.ok) {
                            console.log("response failed!");
                            errorMsg = document.getElementById('Error Message Info').getElementsByTagName('p')
                            errorMsg[0].textContent = "No response from server. Check your internet connection and try again."
                            setInfoError(true);
                            setInfoSuccess(false);
                            return;
                        }
                        setRequestLoading(true);
                        let content = await response.json();
                        console.log(content);
                        setRequestLoading(false);
                        
                        if (content.status === 'error') {
                            errorMsg = document.getElementById('Error Message Info').getElementsByTagName('p')
                            errorMsg[0].textContent = content.data
                            setInfoError(true);
                            setInfoSuccess(false);
                        }
                        else if (content.status === 'success') {
                            setInfoError(false);
                            setInfoSuccess(true);
                        }
                    }}
                >
                    Submit
                </Form.Button>
                <Message
                    success
                    header='Form Completed'
                    content='Account Information Successfully Updated!'
                />
                <Message id='Error Message Info'
                    error
                    header='Error!'
                    content='Placeholder Error Message.'
                />
            </Form>
        </div>
    );
};