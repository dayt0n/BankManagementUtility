import React from "react";
import { tellerSearchLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import { CreateUserAccount } from '../../CreateUserAccount';

function TellerCreateNewAccountPage() {
    const state = {
        'links': tellerSearchLinks,
        'items': [<CreateUserAccount key="item1"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerCreateNewAccountPage;