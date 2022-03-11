import React from 'react';
import './InfoColumn.css';


function InfoColumn({dataParentToChild}) {
    return (
        <div className="InfoColumn">
            <div className="InfoItem">
                {dataParentToChild}
            </div>
        </div>
    );
}

export default InfoColumn;