import React from "react";
import adminUserLinks from '../../LinkLists'
import TemplatePage from '../TemplatePage';

function AdminUserSummary() {
    const state = {
        'links': adminUserLinks,
        'items': []
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default AdminUserSummary;