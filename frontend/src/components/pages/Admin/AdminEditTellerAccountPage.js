import React from "react";
import { adminTellerLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";

function AdminEditTellerAccountPage() {
    const state = {
        'links': adminTellerLinks,
        'items': []
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

export default AdminEditTellerAccountPage;