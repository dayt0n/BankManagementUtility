import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="Home">
            <div>
                <p>Home Page</p>
                <Link to="/test">Click me!</Link>
            </div>
        </div>
    );
}

export default HomePage;