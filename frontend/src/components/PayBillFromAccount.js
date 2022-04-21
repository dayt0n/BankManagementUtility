import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import { USStates } from "./arrays";
import decode from "jwt-decode";
import CurrencyInput from 'react-currency-input-field';
import DatePicker from 'react-datepicker';
import { listUserAccounts } from './listUserAccounts';
import "./PayBillFromAccount.css"
import "react-datepicker/dist/react-datepicker.css";

function createAddress(street, city, state, zip) {
    var address = "";

    address = `${street}, ${city}, ${state}, ${zip}`;

    console.log(address)

    return address
}

export const PayBillFromAccount = () => {
    const [payee, setPayee] = useState("");

    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

    const [date, setDate] = useState(new Date());
    const [account, setAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [success, setSuccess] = useState(Boolean);
    const [error, setError] = useState(Boolean);
    const [accountsLoading, setAccountsLoading] = useState(Boolean);
    const [requestLoading, setRequestLoading] = useState(Boolean);
    const [accountOpt, setAccountOptions] = useState([]);
    var errorMsg = 'Placeholder Error Message';

    var name = localStorage.getItem("User");

    if (name === null)
    {
        var user = decode(document.cookie)
        name = user["user"];
    }

    var today = new Date();

    useEffect(() => {
        setAccountsLoading(true);
        fetch("/api/user/accounts/" + name)
            .then(res => res.json())
            .then(data => {
                if (data["status"] === "success") {
                    setAccountOptions(listUserAccounts(data["data"], ["checking", "savings", "moneyMarket", "creditCard"]))
                }
            })
            .then(() => setAccountsLoading(false))
    }, []);


    return (
        <div className="PayBillFromAccount">
            <h1>Pay Bill</h1>
            <hr />
            <Form inverted className="PayBillForm" success={success} error={error} >
                <Form.Input
                    fluid
                    label='Payee'
                    placeholder='Name'
                    onChange={(e) => setPayee(e.target.value)}
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

                <label>Due Date</label>

                <DatePicker
                    id="DatePicker"
                    minDate={today}
                    selected={date} 
                    onChange={(date) => setDate(date)} 
                />

                <Form.Select
                    fluid
                    label='Account To Pay From'
                    disabled={accountsLoading}
                    loading={accountsLoading}
                    options={accountOpt}
                    placeholder='Account'
                    onChange={(e, {value}) => setAccount(value)}
                />

                <label><b>Amount</b></label>

                <CurrencyInput
                    id="amount-input"
                    name="Amount"
                    placeholder="Amount"
                    decimalsLimit={2}
                    allowNegativeValue={false}
                    defaultValue={0}
                    prefix="$"
                    onValueChange={(value, name) => setAmount(value)}
                />

                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { payee, address: createAddress(street, city, state, zip), date: date.toISOString(), amount };
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


                        const response = await fetch("/api/money/bills/pay/" + account, {
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