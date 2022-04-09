import React from "react";
import tellerUserLinks from '../../LinkLists'
import TemplatePage from '../TemplatePage';
import { OpenAccount } from '../../OpenAccount';

function TellerOpenAccountPage() {
    const state = {
        'links': tellerUserLinks,
        'items': [<OpenAccount key="item1"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerOpenAccountPage;