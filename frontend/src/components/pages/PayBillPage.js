import React from "react";
import TemplatePage from './TemplatePage';
import { PayBillFromAccount } from "../PayBillFromAccount";

function PayBillPage() {
    const state = {
        'links': ['Summary', '/user/summary',
                  'Transfer Funds', '/user/transfer',
                  'Pay A Bill', '/user/pay-bill',
                  'Edit Account Information', '/user/edit-account',
                  'Open New Account', '/user/open-account',],
        'items': [<PayBillFromAccount />]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default PayBillPage;