import React from "react";
import { adminTellerLinks } from '../../LinkLists';
import PermissionCheck from "../../PermissionCheck";
import TemplatePage from '../TemplatePage';

function AdminTellerSummary() {
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

export default AdminTellerSummary;