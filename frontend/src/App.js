import React, { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import "./App.css";

function App() {
    // useEffect(() => {
    //   fetch('/movies').then(response =>
    //     response.json.then(data => {
    //       console.log(data);
    //     })
    //   );
    // }, [])

    return (
        <div className="App">
            <LoginForm />
            <div>
                test
            </div>
        </div>
    );
}

export default App;
