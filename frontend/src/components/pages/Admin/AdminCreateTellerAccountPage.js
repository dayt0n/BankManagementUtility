import React from "react";
import adminSearchLinks from '../../LinkLists'
import TemplatePage from '../TemplatePage';
import { CreateTellerAccount } from '../../CreateTellerAccount';

function AdminCreateTellerAccountPage() {
    const state = {
        'links': adminSearchLinks,
        'items': [<CreateTellerAccount key="item1"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default AdminCreateTellerAccountPage;