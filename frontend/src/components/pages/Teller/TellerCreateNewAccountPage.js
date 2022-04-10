import React from "react";
import { tellerSearchLinks } from '../../LinkLists';
import PermissionCheck from "../../PermissionCheck";
import TemplatePage from '../TemplatePage';
import { CreateUserAccount } from '../../CreateUserAccount';

function TellerCreateNewAccountPage() {
    const state = {
        'links': tellerSearchLinks,
        'items': [<CreateUserAccount key="item1"/>]
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

export default TellerCreateNewAccountPage;