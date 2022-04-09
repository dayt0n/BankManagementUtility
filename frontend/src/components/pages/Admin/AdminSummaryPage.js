import React from "react";
import TemplatePage from '../TemplatePage';

function AdminSummaryPage() {
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

export default AdminSummaryPage;