import { NoAccounts } from "./NoAccounts";
import AccountChecking from "./AccountChecking";
import AccountSaving from "./AccountSaving";
import AccountCreditCard from "./AccountCreditCard";
import AccountMortgage from "./AccountMortgage";
import AccountMoneyMarket from "./AccountMoneyMarket";

export function parseUserAccounts(accounts) {
    var items = []
    var key = 0
    console.log(accounts)

    if (accounts["status"] === 'error') {
        items.push(<NoAccounts key={"item" + key}/>);
    }
    else {
        for (var account in accounts["data"]) {

            account = accounts["data"][account];

            if (account["accountType"] === "checking") {
                items.push(<AccountChecking key={"item" + key } dataParentToChild={account}/>)
            }
            else if (account["accountType"] === "savings") {
                items.push(<AccountSaving key={"item" + key } dataParentToChild={account}/>)
            }
            else if (account["accountType"] === "creditCard") {
                items.push(<AccountCreditCard key={"item" + key } dataParentToChild={account}/>)
            }
            else if (account["accountType"] === "mortgage") {
                items.push(<AccountMortgage key={"item" + key } dataParentToChild={account}/>)
            }
            else if (account["accountType"] === "moneyMarket") {
                items.push(<AccountMoneyMarket key={"item" + key } dataParentToChild={account}/>)
            }
            
            key += 1;
        }
    }

    console.log(items);
    return items;
}