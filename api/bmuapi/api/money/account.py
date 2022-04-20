import logging
from os import getenv
from random import randint
import arrow
from flask import Blueprint, abort, request
from bmuapi.database.database import SessionManager, get_money_account
from bmuapi.database.tables import User
from bmuapi.utils import admin_or_teller_only, get_account_owner, teller_only, teller_or_account_owner_only, teller_or_current_user_only, random_int_of_size
from bmuapi.api.api_utils import error, success
from bmuapi.database.tables import UserAccount
from bmuapi.database.tables import CheckingSavings, CreditCard, Mortgage, TransactionHistory, MoneyMarket
from bmuapi.database.ops import transfer_op
from dateutil.rrule import rrule, MONTHLY

account = Blueprint('account', __name__, url_prefix='/account')


# https://stackoverflow.com/a/28290050
def getPaymentDates(start: arrow.Arrow, due: arrow.Arrow):
    return [dt for dt in rrule(MONTHLY, dtstart=start.datetime, until=due.datetime)]


@account.route('/')
def api_home():
    abort(400)


@account.route('/create', methods=["POST"])
@admin_or_teller_only
def create(token):
    data = dict(request.get_json())
    reqKeys = ("username", "type", "name")
    if not all(k in data for k in reqKeys):
        abort(500)
    usr = None
    with SessionManager(commit=False) as sess:
        usr = sess.query(User).filter(
            User.username == data['username']).first()
    if not usr:
        return error(f"User {data['username']} not found")
    if usr.role != "customer":
        return error(f"Only customers can have money accounts.")
    now = arrow.utcnow().datetime
    acct = UserAccount(userID=usr.id, openDate=now)
    routingNumber = int(getenv("ROUTING_NUMBER"))
    moneyAcct = None
    accountNumBase = 123456789
    match data['type']:
        case "checking":
            acct.accountType = "checkingSaving"
            dividendRate = float(getenv("CHECKING_DIVIDEND_RATE"))
            moneyAcct = CheckingSavings(
                accountType="checking", balance=0, accountName=data['name'], routingNumber=routingNumber, dividendRate=dividendRate)
        case "savings":
            acct.accountType = "checkingSaving"
            # TODO: maybe allow custom rates
            dividendRate = float(getenv("SAVINGS_DIVIDEND_RATE"))
            moneyAcct = CheckingSavings(
                accountType="savings", balance=0, accountName=data['name'], routingNumber=routingNumber, dividendRate=dividendRate, lastInterestCheck=now)
        case "creditCard":
            acct.accountType = "creditCard"
            interestRate = float(getenv("CC_INTEREST_RATE"))
            cardNum = random_int_of_size(16)
            cvv = randint(0, 999)  # will have to zfill when extracting
            # credit card accounts don't actually have an expiration date
            # the expiration date is something that is for the plastic card only
            moneyAcct = CreditCard(
                accountName=data['name'], balance=0, routingNumber=routingNumber, interestRate=interestRate, cardNumber=cardNum, cvv=cvv, lastInterestCheck=now)
        case "moneyMarket":
            acct.accountType = "moneyMarket"
            interestRate = float(getenv("MM_INTEREST_RATE"))
            if not all(k in data for k in ("balanceFrom", "balance")):
                return error("Initial balance parameters not specified.")
            balanceFrom = int(data['balanceFrom'])
            balance = float(data['balance'])
            # do transfer from 'balanceFrom' accountID to this one after account creation to meet minimum deposit
            if balance < 500.0:
                return error(f"${balance} is not enough to meet the minumum of $500 initial deposit for money market account.")
            moneyAcct = MoneyMarket(
                accountName=data['name'], balance=balance, routingNumber=routingNumber, interestRate=interestRate, lastInterestCheck=now)
        case "mortgage":
            if not all(k in data for k in ("loanAmount", "term", "startDate")):
                return error("Not enough information for creating a mortgage account.")
            interestRate = float(getenv("MORTGAGE_INTEREST_RATE"))
            startDate = arrow.get(data['startDate'])
            dueDate = startDate.shift(years=int(data['term']))
            loanAmount = float(data['loanAmount'])
            acct.accountType = "mortgage"
            moneyAcct = Mortgage(accountName=data['name'], routingNumber=routingNumber, loanAmount=loanAmount, loanTerm=int(
                data['term']), interestRate=interestRate, paymentDueDate=dueDate.datetime, startDate=startDate.datetime)
            # calculate currentAmountOwed, monthlyPayment
            paymentDates = getPaymentDates(startDate, dueDate)
            monthlyPayment = loanAmount / len(paymentDates)
            moneyAcct.monthlyPayment = monthlyPayment
            if startDate <= arrow.utcnow():
                moneyAcct.currentAmountOwed = monthlyPayment
            else:
                moneyAcct.currentAmountOwed = 0
        case _:
            return error(f"No account type with name {data['type']}.")
    with SessionManager() as sess:
        sess.add(moneyAcct)
        sess.add(acct)
        sess.flush()
        acct.accountNum = accountNumBase + acct.id
        match data['type']:
            case "checking":
                acct.checkingSavingsAcctID = moneyAcct.id
            case "savings":
                acct.checkingSavingsAcctID = moneyAcct.id
            case "creditCard":
                acct.ccAcctID = moneyAcct.id
            case "moneyMarket":
                acct.mmAcctID = moneyAcct.id
                sess.flush()
                # complete a transaction on the balanceFrom, reducing the balance in balanceFrom
                res = transfer_op(balanceFrom, acct.accountNum,
                                  balance, session=sess)
                if res != balance:  # transfer failed, possibly insufficient funds
                    sess.delete(moneyAcct)
                    sess.delete(acct)
                    return error(res)
            case "mortgage":
                acct.mortgageID = moneyAcct.id
    return success(f"Created account of type {data['type']} for {data['username']}")


@account.route('/delete/<accountNum>', methods=["GET"])
@teller_only
def delete(accountNum, token):
    with SessionManager() as sess:
        owner = get_account_owner(accountNum, session=sess)
        if owner.role != 'customer':
            return error(f"Cannot delete account from non-customer.")
        acct = sess.query(UserAccount).filter(
            UserAccount.accountNum == accountNum).first()
        if not acct:
            return error(f"Could not find account with number {accountNum}")
        moneyAcct = get_money_account(acct)
        if isinstance(moneyAcct, Mortgage):
            if moneyAcct.status != "paid":
                return error(f"Mortgage account {accountNum} has not been paid off yet. Not going to delete.")
        else:
            if moneyAcct.balance != 0.0:
                return error(f"Account {accountNum} is not empty. Not going to delete.")
        sess.delete(acct)
    return success(f"Deleted account {accountNum}")


@account.route('/balance/<accountNum>', methods=["GET"])
@teller_or_account_owner_only
def balance(accountNum, token):
    with SessionManager(commit=False) as sess:
        acct = sess.query(UserAccount).filter(
            UserAccount.accountNum == accountNum).first()
        if not acct:
            return error(f"Could not find account with number {accountNum}")
        actualAccount = get_money_account(acct)
        if not actualAccount:
            return error("Error looking up account. Please contact an administrator.")
        if hasattr(actualAccount, 'balance'):
            if actualAccount.balance != '':
                return success({"balance": actualAccount.balance})
        return error("Account does not have a balance.")


@account.route('/history/<accountNum>', defaults={"count": 20}, methods=["GET"])
@account.route('/history/<accountNum>/<count>', methods=["GET"])
@teller_or_account_owner_only
def history(accountNum, count, token):
    with SessionManager(commit=False) as sess:
        acct = sess.query(UserAccount).filter(
            UserAccount.accountNum == accountNum).first()
        if not acct:
            return error(f"Could not find account with number {accountNum}")
        history = sess.query(TransactionHistory).filter(
            TransactionHistory.accountID == acct.id).order_by(TransactionHistory.transactionDate.desc()).limit(count).all()
        histories = []
        for h in history:
            hDict = h._asdict()
            del hDict['id']  # don't need id in result
            histories.append(hDict)
        if not histories:
            return success(f"No transaction history for account {accountNum}.")
        return success(histories)


@account.route('/summary/<accountNum>', methods=["GET"])
@teller_or_account_owner_only
def summary(accountNum, token):
    with SessionManager(commit=False) as sess:
        acct = sess.query(UserAccount).filter(
            UserAccount.accountNum == accountNum).first()
        if not acct:
            return error(f"Could not find account with number {accountNum}")
        actualAccount = get_money_account(acct)
        if not actualAccount:
            return error("Error looking up account. Please contact an administrator.")
        dictAccount = actualAccount._asdict()
        dictAccount['accountNum'] = acct.accountNum
        if 'accountType' not in dictAccount:
            dictAccount['accountType'] = acct.accountType
        # TODO: money market list transactions remaining for the month
        return success(dictAccount)
