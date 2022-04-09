import React from "react";
import { userLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import decode from 'jwt-decode';
import { TransferAccountToAccount } from "../../TransferAccountToAccount";

function TransferFundsPage() {
    const state = {
        'links': userLinks,
        'items': [<TransferAccountToAccount key="item1"/>]
    };

    if (document.cookie) {
        user = decode(document.cookie);
        console.log(user);
        console.log(document.cookie);

        if (user["role"] !== "customer") {
            return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
        }
    }
    else {
        return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
    }

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TransferFundsPage;