import React from "react";
import { AdminUserSearch } from "../../AdminUserSearch";
import { adminSearchLinks } from '../../LinkLists';
import PermissionCheck from "../../PermissionCheck";
import TemplatePage from '../TemplatePage';

function AdminSummaryPage() {
    const state = {
        'links': adminSearchLinks,
        'items': [<AdminUserSearch key="item0"/>]
    };

    localStorage.removeItem('User');

    var user = PermissionCheck("administrator");

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default AdminSummaryPage;