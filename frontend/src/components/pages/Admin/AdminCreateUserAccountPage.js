import React from "react";
import { adminSearchLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";
import { CreateUserAccount } from "../../CreateUserAccount";

function AdminCreateUserAccountPage() {
    const state = {
        'links': adminSearchLinks,
        'items': [<CreateUserAccount key="item1"/>]
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

export default AdminCreateUserAccountPage;