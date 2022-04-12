import React from "react";
import { tellerUserLinks } from '../../LinkLists';
import PermissionCheck from "../../PermissionCheck";
import TemplatePage from '../TemplatePage';
import { TransferAccountToAccount } from "../../TransferAccountToAccount";

function TellerTransferFundsPage() {
    const state = {
        'links': tellerUserLinks,
        'items': [<TransferAccountToAccount key="item0"/>]
    };

    var user = PermissionCheck("teller");

    if (user === false) {
        return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
    }

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerTransferFundsPage;