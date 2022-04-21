export function listUserAccounts(accounts, accountTypes) {

    if (accounts["status"] === 'error') {
        return [];
    }

    var options = [];

    console.log(accounts)

    for (var account in accounts) {
        account = accounts[account];
        var accountNum = account["accountNum"].toString();
        var accountType = account["accountType"]
        var len = accountNum.length;
        if (accountTypes.includes(accountType)) {
            if (accountType === "checking" || accountType === "savings" || accountType === "moneyMarket") {
                var balance = account["balance"].toString();
                options.push({key: account["accountName"], 
                        text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1) + " - Balance: " + balance, 
                        value: account["accountNum"]})
            }
            else if (accountType === "creditCard") {
                var balance = account["balance"].toString();
                var owed = account["statementBalance"].toString();
                options.push({key: account["accountName"], 
                        text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1) + " - Balance: " + balance + " - Next Bill: " + owed, 
                        value: account["accountNum"]})
            }
            else if (accountType === "mortgage") {
                var owed = account["currentAmountOwed"].toString();
                var totalOwed = account["totalOwed"].toString();
                options.push({key: account["accountName"], 
                           text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1) + " - Next Bill: " + owed + " - Total Owed: " + totalOwed, 
                           value: account["accountNum"]})
            }
        }
    }

    console.log(options)
    return options;
}