import React from "react";
import { adminSearchLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';

function AdminSummaryPage() {
    const state = {
        'links': adminSearchLinks,
        'items': []
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default AdminSummaryPage;