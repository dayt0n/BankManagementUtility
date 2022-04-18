import React, { useState } from "react";
import { Form, Message } from "semantic-ui-react";
import { USStates } from "./arrays";
import PhoneInput from "react-phone-number-input/input";
import 'react-phone-number-input/style.css';
import "./CreateUserAccount.css";

function createAddress(street, city, state, zip) {
    var address = "";

    address = `${street}, ${city}, ${state}, ${zip}`;

    console.log(address)

    return address
}

export const CreateUserAccount = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ssn, setSSN] = useState("");

    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState(null);

    const [phone, setPhone] = useState("");
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    var errorMsg = 'Placeholder Error Message';

    return (
        <div className="CreateUserAccount">
            <h1>Create Account</h1>
            <hr />
            <Form inverted className="UserAccountForm" success={success} error={error} >
                <Form.Group widths='equal'>
                    <Form.Input
                        fluid
                        label='Username'
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Form.Input
                        fluid
                        type='password'
                        label='Password'
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

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
                        placeholder="ST"
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

                <Form.Input
                    fluid
                    label='Social Security Number'
                    placeholder="***-**-****"
                    value={ssn}
                    onChange={(e) => setSSN(e.target.value)}
                />

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { username, password, firstName, lastName, address: createAddress(street, city, state, zip), phone, email, ssn };
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


                        const response = await fetch("/api/auth/register", {
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
                    content='You have successfully created your account! Please log in from the home page.'
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