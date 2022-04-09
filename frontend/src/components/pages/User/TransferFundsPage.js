import React from "react";
import { userLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";
import { TransferAccountToAccount } from "../../TransferAccountToAccount";

function TransferFundsPage() {
    const state = {
        'links': userLinks,
        'items': [<TransferAccountToAccount key="item1"/>]
    };

    var user = PermissionCheck("customer");

    if (user === false) {
        return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
    }

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TransferFundsPage;