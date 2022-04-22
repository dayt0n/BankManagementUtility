export function listUserAccounts(accounts, accountTypes) {

    if (accounts["status"] === 'error') {
        return [];
    }

    var options = [];

    console.log(accounts)

    for (var account in accounts) {
        var prefix1 = "$"
        var prefix2 = "$"
        account = accounts[account];
        var accountNum = account["accountNum"].toString();
        var accountType = account["accountType"]
        var len = accountNum.length;
        if (accountTypes.includes(accountType)) {
            if (accountType === "checking" || accountType === "savings" || accountType === "moneyMarket") {
                var balance = account["balance"]
                if (balance < 0) {
                    prefix1 = "-$";
                    balance *= -1;
                }
                balance = prefix1 + balance.toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
                options.push({key: account["accountName"], 
                        text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1) + " - Balance: " + balance, 
                        value: account["accountNum"]})
            }
            else if (accountType === "creditCard") {
                var balance = account["balance"]
                var owed = account["statementBalance"]
                if (balance < 0) {
                    prefix1 = "-$";
                    balance *= -1;
                }
                if (owed < 0) {
                    prefix2 = "-$";
                    owed *= -1;
                }
                balance = prefix1 + balance.toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
                owed = prefix2 + owed.toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
                options.push({key: account["accountName"], 
                        text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1) + " - Balance: " + balance + " - Next Bill: " + owed, 
                        value: account["accountNum"]})
            }
            else if (accountType === "mortgage") {
                var owed = account["currentAmountOwed"]
                var totalOwed = account["totalOwed"]
                if (owed < 0) {
                    prefix1 = "-$";
                    owed *= -1;
                }
                if (totalOwed < 0) {
                    prefix2 = "-$";
                    totalOwed *= -1;
                }
                owed = prefix1 + owed.toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
                totalOwed = prefix2 + totalOwed.toLocaleString("en", { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 });
                options.push({key: account["accountName"], 
                           text: account["accountName"] + " - *" + accountNum.substr(len-4, len-1) + " - Next Bill: " + owed + " - Total Owed: " + totalOwed, 
                           value: account["accountNum"]})
            }
        }
    }

    console.log(options)
    return options;
}