import React, { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import decode from "jwt-decode";
import CurrencyInput from 'react-currency-input-field';
import DatePicker from 'react-datepicker';
import "./PayBillFromAccount.css"
import "react-datepicker/dist/react-datepicker.css";

function parseUserAccounts(accounts) {

    if (accounts["status"] === 'error') {
        return [];
    }

    var from = []

    for (var account in accounts) {
        account = accounts[account];
        if (account["accountType"] === "checking" || account["accountType"] === "savings") {
            var accountNum = account["accountNum"].toString();
            var len = accountNum.length;
            from.push({key: account["accountName"], 
                       text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1), 
                       value: account["accountNum"]})
        }
    }

    return from;
}

export const PayBillFromAccount = () => {
    const [payee, setPayee] = useState("");
    const [address, setAddress] = useState("");
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
            .then(data => setAccountOptions(parseUserAccounts(data["data"])))
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

                <Form.Input
                    fluid
                    label='Address'
                    placeholder='Address'
                    onChange={(e) => setAddress(e.target.value)}
                />

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
                        const createRequest = { payee, address, date: date.toISOString(), account, amount };
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