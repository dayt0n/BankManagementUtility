import React from "react";
import tellerUserLinks from '../../LinkLists'
import TemplatePage from '../TemplatePage';
import { TransferAccountToAccount } from "../../TransferAccountToAccount";

function TellerTransferFundsPage() {
    const state = {
        'links': tellerUserLinks,
        'items': []
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerTransferFundsPage;