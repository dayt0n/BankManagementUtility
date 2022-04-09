import React from "react";
import TemplatePage from '../TemplatePage';
import { CreateUserAccount } from '../../CreateUserAccount';

function TellerCreateNewAccountPage() {
    const state = {
        'links': ['Back to Search', '/teller/overview',
                  'Create User Account', '/teller/user/create-account'],
        'items': [<CreateUserAccount key="item1"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerCreateNewAccountPage;