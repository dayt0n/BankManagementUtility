import React, { useEffect, useState } from "react";
import { userLinks } from '../../LinkLists';
import TemplatePage from '../TemplatePage';
import PermissionCheck from "../../PermissionCheck";
import { parseUserAccounts } from "../../parseUserAccounts";

function UserSummaryPage() {
    const [items, setItems] = useState();
    const links = userLinks;

    var user = PermissionCheck("customer");

    if (user === false) {
        return <meta http-equiv="refresh" content="0; URL=http://bmu.local/" />;
    }

    useEffect(() => {
        fetch("/api/user/accounts/" + user["user"])
            .then(res => res.json())
            .then(data => setItems(parseUserAccounts(data)))
    }, []);

    return (
        <div>
            {items && links && <TemplatePage dataParentToChild={{items, links}} />}
        </div>
    );
}

export default UserSummaryPage;