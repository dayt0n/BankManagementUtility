import logo from '../logo.png';
import './HomePage.css';
import { Form, Message } from "semantic-ui-react";
import React, { useState } from "react";
import { Link } from 'react-router-dom';

function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(Boolean);
  const [error, setError] = useState(Boolean);
  const [requestLoading, setRequestLoading] = useState(Boolean);
  var errorMsg = 'Placeholder Error Message';

  return (
    <div className="HomePage">
      <header className="AppHeader">
        <img src={logo} className="BankLogo" />
        <p>
          Bank
        </p>
        <div className="LoginText">
          <div className="NewUser">
            <li>
              New
            </li>
            <li>
              Customer
            </li>
            <br></br>
            <Link to="/create-user-account">
              <button className="Button">Create Account</button>
            </Link>
            
          </div>
          <div className="ExistingUser">
            <li>
              Existing
            </li>
            <li>
              Customer
            </li>
            <br></br>
            <Form inverted className="UserLoginForm" success={success} error={error} >
                <Form.Group widths='equal'>
                    <Form.Input
                        required
                        fluid
                        label='Username'
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Input
                        required
                        fluid
                        type='password'
                        label='Password'
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Button
                    fluid
                    loading={requestLoading}
                    type='submit'
                    onClick={async () => {
                        const createRequest = { username, password };
                        var quit = false;
                        for (var field in createRequest) {
                            if (createRequest[field] === "") {
                                errorMsg = document.getElementById('Error Message').getElementsByTagName('p')
                                errorMsg[0].textContent = "All fields must be filled."
                                setError(true);
                                setSuccess(false);
                                quit = true;
                            }
                        }

                        if (quit) { return; }


                        const response = await fetch("/api/auth/login", {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(createRequest),
                        });

                        if (!response.ok) {
                            console.log("response failed!");
                            errorMsg = document.getElementById('Error Message').getElementsByTagName('p')
                            errorMsg[0].textContent = "No response from server. Check your internet connection and try again."
                            setError(true);
                            setSuccess(false);
                            return;
                        }
                        setRequestLoading(true);
                        let content = await response.json();
                        setRequestLoading(false);
                        
                        if (content.status === 'error') {
                            errorMsg = document.getElementById('Error Message').getElementsByTagName('p')
                            errorMsg[0].textContent = content.msg
                            setError(true);
                            setSuccess(false);
                        }
                        else if (content.status === 'success') {
                            setError(false);
                            setSuccess(true);
                        }
                    }}
                >
                    Log In
                </Form.Button>
                <Message
                    success
                    header='Form Completed'
                    content='Successfully logged in.'
                />
                <Message id='Error Message'
                    error
                    header='Error!'
                    content='Placeholder Error Message.'
                />
            </Form>
            <p>
              Forgot Password?
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default HomePage;
