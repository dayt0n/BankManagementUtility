import React from "react";
import { adminTellerLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';

function AdminTellerSummary() {
    const state = {
        'links': adminTellerLinks,
        'items': []
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default AdminTellerSummary;