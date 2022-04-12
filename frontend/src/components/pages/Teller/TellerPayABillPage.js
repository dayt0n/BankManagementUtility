import React from "react";
import { tellerUserLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";
import { PayBillFromAccount } from "../../PayBillFromAccount";

function TellerPayABillPage() {
    const state = {
        'links': tellerUserLinks,
        'items': [<PayBillFromAccount key="item0"/>]
    };

    var user = PermissionCheck("teller");

    if (user === false) {
        return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
    }

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TellerPayABillPage;