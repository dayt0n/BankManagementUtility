import React from "react";
import TemplatePage from './TemplatePage';
import { TransferAccountToAccount } from "../TransferAccountToAccount";

function TransferFundsPage() {
    const state = {
        'links': ['Home', '/'],
        'items': [<TransferAccountToAccount />]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TransferFundsPage;