import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import { USStates } from "./arrays";
import PhoneInput from "react-phone-number-input/input";
import 'react-phone-number-input/style.css';
import "./EditUserAccount.css"

export const TellerEditUserAccount = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [password, setNewPassword] = useState("");

    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

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
        var arr = userInfo['address'].split(", ")
        setStreet(arr[0]);
        setCity(arr[1]);
        setState(arr[2]);
        setZip(arr[3]);
        setPhone(userInfo['phone']);
        setEmail(userInfo['email']);
    }

    function createAddress(street, city, state, zip) {
        var address = "";

        address = `${street}, ${city}, ${state}, ${zip}`;

        return address
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

                <Form.Group widths='equal'>
                    <Form.Input
                        fluid
                        type='password'
                        label='New Password'
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { password };
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
                        fluid
                        label='First Name'
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Form.Input
                        fluid
                        label='Last Name'
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Form.Group>

                <Form.Input
                    fluid
                    type='email'
                    label='Email'
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Form.Group>
                    <Form.Input
                        fluid
                        width={10}
                        label='Street'
                        placeholder="Street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                    />

                    <Form.Input
                        fluid
                        width={4}
                        label='City'
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />

                    <Form.Dropdown
                        fluid
                        width={2}
                        label='State'
                        placeholder="??"
                        search
                        selection
                        options={USStates}
                        value={state}
                        onChange={(e, {value}) => setState(value)}
                    />

                    <Form.Input
                        fluid
                        width={4}
                        label='Zip Code'
                        placeholder="Zip Code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                    />
                </Form.Group>

                <label>Phone Number</label>

                <PhoneInput
                    id="PhoneInput"
                    country="US"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={setPhone}
                />

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { address: createAddress(street, city, state, zip), phone, email };
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