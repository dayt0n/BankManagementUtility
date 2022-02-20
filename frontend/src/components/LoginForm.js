import React, { useState } from "react";
import { Form, Input, Button } from "semantic-ui-react";

export const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Form>
            <Form.Field>
                <Input
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Form.Field>
            <Form.Field>
                <Input
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Field>
            <Form.Field>
                <Button
                    onClick={async () => {
                        const loginRequest = { username, password };
                        console.log(
                            "Clicked button with username: " +
                                loginRequest.username +
                                " and password: " +
                                loginRequest.password
                        );
                        const response = await fetch("???", {
                            method: "POST",
                            header: {
                                "Content-type": "application/json",
                            },
                            body: JSON.stringify(loginRequest),
                        });

                        if (response.ok) {
                            console.log("response worked!");
                            console.log(response)
                        }
                    }}
                >
                    Submit
                </Button>
            </Form.Field>
        </Form>
    );
};

export default LoginForm;