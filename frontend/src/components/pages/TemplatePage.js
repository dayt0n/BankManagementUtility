import React from "react";
import TemplateHeader from "../TemplateHeader"
import InfoColumn from "../InfoColumn"
import LinkColumn from "../LinkColumn"
import './TemplatePage.css';

function TemplatePage(dataParentToChild) {
    return (
        <div>
            <TemplateHeader />
            <div className="Columns">
                <InfoColumn dataParentToChild = {dataParentToChild.dataParentToChild.items}/>
                <LinkColumn dataParentToChild = {dataParentToChild.dataParentToChild.links}/>
            </div>
        </div>
    );
}

export default TemplatePage;