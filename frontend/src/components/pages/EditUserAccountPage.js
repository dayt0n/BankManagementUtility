import React from "react";
import TemplatePage from './TemplatePage';
import { EditUserAccount } from '../EditUserAccount';

function EditUserAccountPage() {
    const state = {
        'links': ['Overview', '/user/overview'],
        'items': [<EditUserAccount key="item1"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default EditUserAccountPage;