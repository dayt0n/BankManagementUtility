import React from 'react';
import './LinkColumn.css';
import { NavLink } from "react-router-dom";


function LinkColumn({dataParentToChild}) {
    const links = [];

    for (let i = 0; i < dataParentToChild.length; i += 2) {
        links.push(<NavLink key={dataParentToChild[i]} to={dataParentToChild[i+1]}>{dataParentToChild[i]}</NavLink>)
    }

    return (
        <div className="LinkColumn">
            <div className="Links">
                {links}
            </div>
        </div>
    );
}

export default LinkColumn;