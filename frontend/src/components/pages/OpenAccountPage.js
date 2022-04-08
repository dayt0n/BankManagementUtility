import React from "react";
import TemplatePage from './TemplatePage';
import { OpenAccount } from '../OpenAccount';

function OpenAccountPage() {
    const state = {
        'links': ['Overview', '/user/overview'],
        'items': [<OpenAccount />]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default OpenAccountPage;