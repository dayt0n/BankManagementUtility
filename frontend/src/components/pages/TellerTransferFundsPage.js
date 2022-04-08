import React from "react";
import TemplatePage from './TemplatePage';
import { TransferAccountToAccount } from "../TransferAccountToAccount";

function TellerTransferFundsPage() {
    const state = {
        'links': ['Home', '/'],
        'items': [<TransferAccountToAccount key="item1"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerTransferFundsPage;