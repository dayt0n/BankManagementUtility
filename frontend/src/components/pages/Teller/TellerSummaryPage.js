import React from "react";
import TemplatePage from '../TemplatePage';

function TellerSummaryPage() {
    const state = {
        'links': ['Back to Search', '/teller/overview',
                  'Create User Account', '/teller/user/create-account'],
        'items': []
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerSummaryPage;