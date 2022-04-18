import React, { useEffect, useState } from "react";
import { adminUserLinks } from '../../LinkLists';
import PermissionCheck from "../../PermissionCheck";
import TemplatePage from '../TemplatePage';
import { parseUserAccounts } from "../../parseUserAccounts";

function AdminUserSummary() {
    const [items, setItems] = useState();
    const links = adminUserLinks;

    var user = PermissionCheck("administrator");

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

export default AdminUserSummary;