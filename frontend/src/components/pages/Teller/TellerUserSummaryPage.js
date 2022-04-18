import React, { useEffect, useState } from "react";
import { tellerUserLinks } from '../../LinkLists';
import PermissionCheck from "../../PermissionCheck";
import TemplatePage from '../TemplatePage';
import { parseUserAccounts } from "../../parseUserAccounts";

function TellerUserSummaryPage() {
    const [items, setItems] = useState();
    const links = tellerUserLinks;

    var user = PermissionCheck("teller");

    if (user === false) {
        return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
    }

    useEffect(() => {
        fetch("/api/user/accounts/" + localStorage.getItem("User"))
            .then(res => res.json())
            .then(data => setItems(parseUserAccounts(data)))
    }, []);

    return (
        <div>
            {items && links && <TemplatePage dataParentToChild={{items, links}} />}
        </div>
    );
}

export default TellerUserSummaryPage;