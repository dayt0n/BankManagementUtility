import React from "react";
import { Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import "./SearchItem.css"

function SearchItem(dataParentToChild) {

    const navigate = useNavigate();

    var user = decode(document.cookie);
    var userName = dataParentToChild.dataParentToChild["username"];
    var name = dataParentToChild.dataParentToChild["name"];
    var role = dataParentToChild.dataParentToChild["role"];

    return (
        <div className="SearchItem">
            <h3 className="Name">{`${role[0].toUpperCase() + role.slice(1)}: ${name} (${userName})`}</h3>

            <Button className="ChooseButton"
                onClick= {() => {
                    localStorage.setItem('User', userName);
                    
                    if (user["role"] === "teller") {
                        navigate("/teller/user/summary");
                    }
                    else if (user["role"] === "administrator") {
                        if (role === "customer") {
                            navigate("/admin/user/summary");
                        }
                        else {
                            navigate("/admin/teller/edit-account");
                        }
                    }
                }}>
                Choose User
            </Button>

            
        </div>
    );
};

export default SearchItem;