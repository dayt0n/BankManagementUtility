import React from "react";
import TemplatePage from '../TemplatePage';
import { CreateTellerAccount } from '../../CreateTellerAccount';

function CreateTellerAccountPage() {
    const state = {
        'links': ['Overview', '/admin/overview'],
        'items': [<CreateTellerAccount key="item1"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default CreateTellerAccountPage;