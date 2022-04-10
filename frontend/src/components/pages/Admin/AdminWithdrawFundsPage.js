import React from "react";
import { adminUserLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";

function AdminWithdrawFundsPage() {
    const state = {
        'links': adminUserLinks,
        'items': [<TellerEditUserAccount key="item1"/>]
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