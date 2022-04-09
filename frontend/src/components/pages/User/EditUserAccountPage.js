import React from "react";
import TemplatePage from '../TemplatePage';
import { EditUserAccount } from '../../EditUserAccount';

function EditUserAccountPage() {
    const state = {
        'links': ['Summary', '/user/summary',
                  'Transfer Funds', '/user/transfer',
                  'Pay A Bill', '/user/pay-bill',
                  'Edit Account Information', '/user/edit-account',],
        'items': [<EditUserAccount key="item1"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default EditUserAccountPage;