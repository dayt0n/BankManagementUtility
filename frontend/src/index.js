// You can choose your kind of history here (e.g. browserHistory)
// import { Router, hashHistory as history } from 'react-router';
// Your routes.js file
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";

ReactDOM.render((
    <BrowserRouter>
      <App /> {/* The various pages will be displayed by the `Main` component. */}
    </BrowserRouter>
    ), document.getElementById('root')
  );
