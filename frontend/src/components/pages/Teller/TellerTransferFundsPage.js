import React from "react";
import TemplatePage from '../TemplatePage';
import { TransferAccountToAccount } from "../../TransferAccountToAccount";

function TellerTransferFundsPage() {
    const state = {
        'links': ['Back to Search', '/teller/overview',
                  'User Summary', '/teller/user/summary',
                  'Edit User Info', '/teller/user/view-account',
                  'Transfer Funds', '/teller/user/transfer',
                  'Delete Account', '/teller/user/delete-account'],
        'items': []
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerTransferFundsPage;