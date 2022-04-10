import React, { useEffect, useState } from "react";
import { Form } from "semantic-ui-react";
import { fakenamelist } from "./fakenamelist";
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
        if ((users[user].toLowerCase()).includes(search.toLowerCase())) {
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

export const TellerUserSearch = () => {

    var fakeusers = ["a"];

    const [userList, setUserList] = useState([]);
    const [users, setUsers] = useState([]);
    const [limitReaced, setLimitReached] = useState(<></>);

    var limitReached = <></>;
    if (over50) {
        limitReached = <p>More than 50 results, limiting view to 50. Try a more in-depth search!</p>
    }


    // useEffect(() => {
    //     fetch("/api/user/list")
    //         .then(res => res.json())
    //         .then(data => { setUserList(data); console.log(data); })
    // }, []);

    return (
        <div className="TellerUserSearch">
            <h1>Search for User</h1>
            {limitReached}
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