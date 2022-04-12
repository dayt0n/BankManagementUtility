import React from "react";
import { adminUserLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";
import { WithdrawDepositFunds } from "../../WithdrawDepositFunds";

function AdminWithdrawFundsPage() {
    const state = {
        'links': adminUserLinks,
        'items': [<WithdrawDepositFunds key="item0"/>]
    };

    var user = PermissionCheck("administrator");

    if (user === false) {
        return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
    }

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default AdminWithdrawFundsPage;