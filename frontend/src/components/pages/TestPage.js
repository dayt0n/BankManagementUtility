import React from "react";
import TemplatePage from './TemplatePage';
import TemplateInfoComponent from '../TemplateInfoComponent';

function TestPage() {
    const state = {
        'links': ['Home', '/', 
                  'Test', '/test'],
        'items': [<TemplateInfoComponent />]
    };

    console.log(state)
    return (
        <div>
            <TemplatePage dataParentToChild={state} />
        </div>
    );
}

export default TestPage;