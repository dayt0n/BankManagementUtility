import React from "react";
import TemplatePage from './TemplatePage';
import TemplateInfoComponent from '../TemplateInfoComponent';

function TestPage() {
    const state = {
        'links': ['Home', '/', 
                  'Test', '/test'],
        'items': [<TemplateInfoComponent key="item1"/>, <TemplateInfoComponent key="item2"/>, <TemplateInfoComponent key="item3"/>, <TemplateInfoComponent key="item4"/>]
    };

    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TestPage;