import React from "react";
import TemplatePage from '../TemplatePage';

function AdminTellerSummary() {
    const state = {
        'links': ['Home', '/'],
        'items': []
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default AdminTellerSummary;