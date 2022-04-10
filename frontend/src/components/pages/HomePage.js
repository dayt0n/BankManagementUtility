import logo from '../logo.png';
import './HomePage.css';
import { Form, Message } from "semantic-ui-react";
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import decode from 'jwt-decode';

function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(Boolean);
  const [error, setError] = useState(Boolean);
  const [requestLoading, setRequestLoading] = useState(Boolean);
  var errorMsg = 'Placeholder Error Message';
  const navigate = useNavigate();

  if (document.cookie) {
    document.cookie = 'session=; Max-Age=0;';
  }


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
            <Form inverted className="CreateAccount">
              <Link to="/create-user-account">
                <Form.Button className="Button">Create Account</Form.Button>
              </Link>
            </Form>
            
          </div>
          <div className="ExistingUser">
            <li>
              Existing
            </li>
            <li>
              Customer
            </li>
            <br></br>
            <div className="LoginForm">
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
                    className="LoginButton"
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
                            //console.log(content.data);
                            //console.log(JSON.stringify(content.data).slice(10,-2));

                            if (document.cookie) {
                              document.cookie = 'session=; Max-Age=0;';
                            }

                            var decoded=decode(JSON.stringify(content.data).slice(10,-2));
                            //console.log(decoded);
                            //console.log(decoded["role"]);
                            
                            document.cookie="session=" + JSON.stringify(content.data).slice(10,-2);

                            if(decoded["role"]==="customer"){
                              navigate("/user/summary");
                            }
                            else if(decoded["role"]==="teller"){
                              navigate("/teller/overview");
                            }
                            else if(decoded["role"]==="administrator"){
                              navigate("/admin/overview");
                            }
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
                    content='Incorrect Username or Password.'
                />
            </Form>
            </div>
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
