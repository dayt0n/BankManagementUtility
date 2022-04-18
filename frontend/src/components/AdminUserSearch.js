import React, { useEffect, useState } from "react";
import { Form } from "semantic-ui-react";
import SearchItem from "./SearchItem";
import "./TellerUserSearch.css"

var over50 = false;

function SearchUsers(users, search) {
    var key = 1;
    var i = 0;
    var limit = 50;
    over50 = false;
    var list = []
    var htmlList = []
    for (var user in users) {
        var userName = users[user]["name"];
        if ((userName.toLowerCase()).includes(search.toLowerCase())) {
            list.push(users[user]);
            i += 1;
            if (i >= limit) {
                over50 = true;
                break
            }
        }
    }

    for (var item in list) {
        htmlList.push(<SearchItem key={"item" + key} dataParentToChild={list[item]} />)
        key += 1;
    }
    
    return htmlList;
}

export const AdminUserSearch = () => {

    const [userList, setUserList] = useState([]);
    const [users, setUsers] = useState([]);

    var limitReached = <></>;
    if (over50) {
        limitReached = <p>More than 50 results, limiting view to 50. Try a more in-depth search!</p>
    }


    useEffect(() => {
        fetch("/api/user/list")
            .then(res => res.json())
            .then(data => { setUserList(data["data"]); setUsers(SearchUsers(data["data"], ""));})
    }, []);

    return (
        <div className="TellerUserSearch">
            <h1>Search for User</h1>
            {limitReached}
            <hr />
            <Form inverted >
                <Form.Input
                    inverted
                    fluid
                    label='Search for name'
                    placeholder="Name"
                    onChange={(e) => { 
                        setUsers(SearchUsers(userList, e.target.value));
                    }}
                />
            </Form>
            {users}
        </div>
    );
};