import React from "react";
import { tellerSearchLinks } from '../../LinkLists';
import { TellerUserSearch } from "../../TellerUserSearch";
import PermissionCheck from "../../PermissionCheck";
import TemplatePage from '../TemplatePage';

function TellerSummaryPage() {
    const state = {
        'links': tellerSearchLinks,
        'items': [<TellerUserSearch key="item0"/>]
    };

    localStorage.removeItem('User');

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

export default TellerSummaryPage;