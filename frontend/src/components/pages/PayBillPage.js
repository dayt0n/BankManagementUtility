import React from "react";
import TemplatePage from './TemplatePage';
import { PayBillFromAccount } from "../PayBillFromAccount";

function PayBillPage() {
    const state = {
        'links': ['Home', '/'],
        'items': [<PayBillFromAccount />]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default PayBillPage;