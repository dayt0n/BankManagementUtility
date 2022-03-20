import React from "react";
import TemplatePage from './TemplatePage';
import { CreateUserAccount } from '../CreateUserAccount';

function CreateUserAccountPage() {
    const state = {
        'links': ['Home', '/'],
        'items': [<CreateUserAccount />]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default CreateUserAccountPage;