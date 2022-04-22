import React, { useState, useEffect } from "react";
import { Form } from "semantic-ui-react";
import { saveAs } from 'file-saver';
import "./UserInterest.css";

function createTable(history, name) {
    var list = [];
    var key = 0;
    for (let item in history) {
        item = history[item];
        let year = item["year"]
        list.push(<tr key={"row" + key}>
                        <td>{item["year"]}</td>
                        <td>{"$" + item["interest"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })}</td>
                        <td>
                        <Form.Button
                            className="LoginButton"
                            fluid
                            type='submit'
                            onClick={async () => {
                                await fetch("/api/user/", {
                                    method: "GET",
                                    headers: {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json",
                                    },
                                })
                                .then(res => res.blob())
                                .then((blob) => saveAs(blob, `${name} - 1099-INT Form for ${year}.pdf`));
                            }}
                            >
                                Download 1099-INT Form
                            </Form.Button>
                        </td>
                    </tr>
        )
        key += 1;
    }

    if (list === []) {
        list.push(<p>No current interest for this customer.</p>)
    }

    return list;
}

export const UserInterest = () => {
    const [interestHistory, setInterestHistory] = useState(<></>);

    var name = localStorage.getItem("User");

    useEffect(() => {
        fetch("/api/user/interest/" + name)
            .then(res => res.json())
            .then(data => setInterestHistory(createTable(data["data"], name)))
    }, []);


    return (
        <div className="UserInterest">
            <h3>Interest by Year</h3>
            <hr />
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Interest</th>
                        <th>Form Download</th>
                    </tr>
                </thead>
                <tbody>
                    {interestHistory}
                </tbody>
            </table>
        </div>
    );
};