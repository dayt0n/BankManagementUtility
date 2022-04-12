import React, { useState } from "react";
import { Form } from "semantic-ui-react";
import { OpenAccountChecking } from "./OpenAccountChecking";
import { OpenAccountCreditCard } from "./OpenAccountCreditCard";
import { OpenAccountMoneyMarket } from "./OpenAccountMoneyMarket";
import { OpenAccountMortgage } from "./OpenAccountMortgage";
import { OpenAccountSaving } from "./OpenAccountSaving";
import "./OpenAccount.css"

export const OpenAccount = () => {
    const [accountForm, setAccountForm] = useState(<></>);

    var accountTypeOpt = [
        {key: "Checking", text: "Checking", value: "Checking"},
        {key: "Saving", text: "Saving", value: "Saving"}, 
        {key: "Credit Card", text: "Credit Card", value: "Credit Card"}, 
        {key: "Money Market", text: "Money Market", value: "Money Market"}, 
        {key: "Mortgage", text: "Mortgage", value: "Mortgage"}, 
    ]

    var accountKey = {
        "Checking": <OpenAccountChecking key="item1"/>,
        "Saving": <OpenAccountSaving key="item1"/>,
        "Credit Card": <OpenAccountCreditCard key="item1"/>,
        "Money Market": <OpenAccountMoneyMarket key="item1"/>,
        "Mortgage": <OpenAccountMortgage key="item1"/>
    }

    return (
        <div className="OpenAccount">
            <h1>Open New Account</h1>
            <hr />
            <Form inverted className="OpenAccountForm" >
                <Form.Select
                    required
                    fluid
                    label='Account Type'
                    options={accountTypeOpt}
                    placeholder='Type'
                    onChange={(e, {value}) => setAccountForm(accountKey[value])}
                />
            </Form>
            {accountForm}
        </div>
    );
};