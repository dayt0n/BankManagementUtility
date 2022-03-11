import React, { useState } from "react";
import TemplateHeader from "../TemplateHeader"
import InfoColumn from "../InfoColumn"
import LinkColumn from "../LinkColumn"
import './TemplatePage.css';

function TemplatePage(dataParentToChild) {
    return (
        <div className="Template">
            <TemplateHeader />
            <body>
                <div className="Columns">
                    <InfoColumn dataParentToChild = {dataParentToChild.dataParentToChild.items}/>
                    <LinkColumn dataParentToChild = {dataParentToChild.dataParentToChild.links}/>
                </div>
            </body>
        </div>
    );
}

export default TemplatePage;