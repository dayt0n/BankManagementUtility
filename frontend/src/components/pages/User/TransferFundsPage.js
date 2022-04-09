import React from "react";
import TemplatePage from '../TemplatePage';
import { TransferAccountToAccount } from "../../TransferAccountToAccount";

function TransferFundsPage() {
    const state = {
        'links': ['Summary', '/user/summary',
                  'Transfer Funds', '/user/transfer',
                  'Pay A Bill', '/user/pay-bill',
                  'Edit Account Information', '/user/edit-account',],
        'items': [<TransferAccountToAccount key="item1"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TransferFundsPage;