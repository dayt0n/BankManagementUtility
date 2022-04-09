import React from "react";
import TemplatePage from '../TemplatePage';
import { OpenAccount } from '../../OpenAccount';

function OpenAccountPage() {
    const state = {
        'links': ['Summary', '/user/summary',
                  'Transfer Funds', '/user/transfer',
                  'Pay A Bill', '/user/pay-bill',
                  'Edit Account Information', '/user/edit-account',
                  'Open New Account', '/user/open-account',],
        'items': [<OpenAccount key="item1"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default OpenAccountPage;