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
                var balance = "$" + account["balance"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
                options.push({key: account["accountName"], 
                        text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1) + " - Balance: " + balance, 
                        value: account["accountNum"]})
            }
            else if (accountType === "creditCard") {
                var balance = "$" + account["balance"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
                var owed = "$" + account["statementBalance"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
                options.push({key: account["accountName"], 
                        text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1) + " - Balance: " + balance + " - Next Bill: " + owed, 
                        value: account["accountNum"]})
            }
            else if (accountType === "mortgage") {
                var owed = "$" + account["currentAmountOwed"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
                var totalOwed = "$" + account["totalOwed"].toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
                options.push({key: account["accountName"], 
                           text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1) + " - Next Bill: " + owed + " - Total Owed: " + totalOwed, 
                           value: account["accountNum"]})
            }
        }
    }

    console.log(options)
    return options;
}