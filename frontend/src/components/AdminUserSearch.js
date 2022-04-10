import React, { useEffect, useState } from "react";
import { Form } from "semantic-ui-react";
import SearchItem from "./SearchItem";
import "./AdminUserSearch.css"

function SearchUsers(users, search) {
    var key = 1;

    var list = []
    var htmlList = []
    for (var user in users) {
        if (users[user].includes(search)) {
            list.push(users[user]);
        }
    }

    for (var item in list) {
        htmlList.push(<SearchItem key={"item" + key} dataParentToChild={list[item]} />)
        key += 1;
    }

    return htmlList;
}

export const AdminUserSearch = () => {

    var fakeusers = ["a", "bob", "joe", "timmy", "tim", "alex"];

    const [userList, setUserList] = useState([]);
    const [users, setUsers] = useState(SearchUsers(fakeusers, ""));


    // useEffect(() => {
    //     fetch("/api/user/list")
    //         .then(res => res.json())
    //         .then(data => { setUserList(data); console.log(data); })
    // }, []);

    return (
        <div className="AdminUserSearch">
            <h1>Search for User</h1>
            <hr />
            <Form.Input
                required
                fluid
                label='Search for name'
                placeholder="Name"
                onChange={(e) => { 
                    setUsers(SearchUsers(fakeusers, e.target.value));
                }}
            />
            {users}
        </div>
    );
};