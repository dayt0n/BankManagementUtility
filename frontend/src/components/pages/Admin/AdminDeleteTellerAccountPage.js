import React from "react";
import { adminTellerLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";
import { DeleteTellerAccount } from "../../DeleteTellerAccount";

function AdminDeleteTellerAccountPage() {
    const state = {
        'links': adminTellerLinks,
        'items': [<DeleteTellerAccount key="item0"/>]
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

export default AdminDeleteTellerAccountPage;