import React from "react";
import { adminUserLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";
import { DeleteAccount } from "../../DeleteAccount";
import { DeleteUserAccount } from "../../DeleteUserAccount";

function AdminDeleteUserAccountPage() {
    const state = {
        'links': adminUserLinks,
        'items': [<DeleteAccount key="item0"/>, <DeleteUserAccount key="item1"/>]
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

export default AdminDeleteUserAccountPage;