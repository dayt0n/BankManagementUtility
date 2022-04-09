import React from "react";
import { tellerUserLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';

function TellerUserSummaryPage() {
    const state = {
        'links': tellerUserLinks,
        'items': []
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerUserSummaryPage;