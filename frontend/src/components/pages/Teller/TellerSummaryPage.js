import React from "react";
import { tellerSearchLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';

function TellerSummaryPage() {
    const state = {
        'links': tellerSearchLinks,
        'items': []
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerSummaryPage;