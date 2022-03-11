import React, { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar"
import "./App.css";
import { Link } from 'react-router';
import Main from "./components/Main";

function App() {
    return (
      <div className="App">
        <Navbar />
        <Main />
      </div>
    );
}

export default App;
