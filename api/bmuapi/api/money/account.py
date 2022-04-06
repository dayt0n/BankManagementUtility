from os import getenv
import arrow
from flask import Blueprint, abort, request
from bmuapi.database.database import SessionManager
from bmuapi.database.tables import User
from bmuapi.utils import admin_or_teller_only
from bmuapi.api.api_utils import error, success
from bmuapi.database.tables import UserAccount
from bmuapi.database.tables import CheckingSavings, CreditCard, Mortgage, TransactionHistory
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
    acct = UserAccount(userID=usr.id)
    routingNumber = int(getenv("ROUTING_NUMBER"))
    moneyAcct = None
    match data['type']:
        case "checking":
            acct.accountType = "checkingSaving"
            dividendRate = float(getenv("DIVIDEND_RATE"))
            moneyAcct = CheckingSavings(
                accountType="checking", balance=0, accountName=data['name'], routingNumber=routingNumber, dividendRate=dividendRate)
            acct.checkingSavingsAcctID = moneyAcct.id
        case "savings":
            acct.accountType = "checkingSaving"
            dividendRate = float(getenv("DIVIDEND_RATE"))
            moneyAcct = CheckingSavings(
                accountType="savings", balance=0, accountName=data['name'], routingNumber=routingNumber, dividendRate=dividendRate)
            acct.checkingSavingsAcctID = moneyAcct.id
        case "creditCard":
            acct.accountType = "creditCard"
            interestRate = float(getenv("CC_INTEREST_RATE"))
            moneyAcct = CreditCard(
                accountName=data['name'], balance=0, routingNumber=routingNumber, interestRate=interestRate)
            acct.ccAcctID = moneyAcct.id
        case "mortgage":
            if not all(k in data for k in ("loanAmount", "term", "dueDate", "startDate")):
                return error("Not enough information for creating a mortgage account.")
            interestRate = float(getenv("MORTGAGE_INTEREST_RATE"))
            startDate = arrow.get(data['startDate'])
            dueDate = arrow.get(data['dueDate'])
            loanAmount = float(data['loanAmount'])
            moneyAcct = Mortgage(
                accountType="fixed", accountName=data['name'], routingNumber=routingNumber, loanAmount=loanAmount, loanTerm=int(data['term']), interestRate=interestRate, paymentDueDate=dueDate, startDate=startDate)
            # calculate currentAmountOwed, monthlyPayment
            paymentDates = getPaymentDates(startDate, dueDate)
            monthlyPayment = loanAmount / len(paymentDates)
            moneyAcct.monthlyPayment = monthlyPayment
            if startDate <= arrow.utcnow():
                moneyAcct.currentAmountOwed = monthlyPayment
            else:
                moneyAcct.currentAmountOwed = 0
            acct.mortgageID = moneyAcct.id
        case _:
            return error(f"No account type with name {data['type']}.")
    with SessionManager() as sess:
        sess.add(moneyAcct)
        sess.add(acct)
    return success(f"Created account of type {data['type']} for {data['username']}")
