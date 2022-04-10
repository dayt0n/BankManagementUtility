import React from "react";
import { Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import "./SearchItem.css"

function SearchItem(dataParentToChild) {

    const navigate = useNavigate();

    var user = decode(document.cookie);

    return (
        <div className="SearchItem">
            <h3>{dataParentToChild.dataParentToChild}</h3>

            <Button className="ChooseButton"
                onClick= {() => {
                    localStorage.setItem('User', dataParentToChild.dataParentToChild);
                    
                    if (user["role"] === "teller") {
                        navigate("/teller/user/summary");
                    }
                    else {
                        navigate("/admin/user/summary");
                    }
                
                }}>
                Choose User
            </Button>

            
        </div>
    );
};

export default SearchItem;