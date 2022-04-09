import React from "react";
import { userLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";
import { EditUserAccount } from '../../EditUserAccount';

function EditUserAccountPage() {
    const state = {
        'links': userLinks,
        'items': [<EditUserAccount key="item1"/>]
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

export default EditUserAccountPage;