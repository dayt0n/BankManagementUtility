import arrow
from bmuapi.database.database import SessionManager, get_money_account
from bmuapi.database.tables import UserAccount, Mortgage, MoneyMarket, TransactionHistory
from sqlalchemy import and_

from api.bmuapi.database.tables import CreditCard


def transfer_op(amount, fromAccount, toAccount=None, session=None,comment="withdraw"):
    frm: UserAccount = fromAccount
    if toAccount:
        to: UserAccount = toAccount
    if isinstance(fromAccount, int):
        with SessionManager(commit=False) as sess:
            if not session:
                session = sess
            frm = session.query(UserAccount).filter(
                UserAccount.accountNum == fromAccount).first()
        if not frm:
            return f"Account {fromAccount} not found."
    if toAccount:
        if isinstance(toAccount, int):
            with SessionManager(commit=False) as sess:
                if not session:
                    session = sess
                to = session.query(UserAccount).filter(
                    UserAccount.accountNum == toAccount).first()
                if not to:
                    return f"Account {toAccount} not found."
    fromMoney = get_money_account(frm, session=session)
    if toAccount:
        toMoney = get_money_account(to, session=session)
    if (toAccount and not toMoney) or not fromMoney:
        return "Could not locate money accounts to complete transfer."
    if isinstance(fromMoney, Mortgage):  # cannot transfer money FROM a mortgage account
        return "Cannot transfer money from a mortgage account."
    with SessionManager() as sess:
        if not session:
            session = sess
        oneMonthAgo = arrow.utcnow().shift(months=-1).datetime
        if isinstance(fromMoney, MoneyMarket):
            history = session.query(TransactionHistory).filter(and_(TransactionHistory.accountID == frm.id,
                                                                    TransactionHistory.transactionDate > oneMonthAgo)).count()
            if history >= 6:
                return f"Transfer limit reached on Money Market account {frm.accountNum}"
        if toAccount:
            if isinstance(toMoney, MoneyMarket):
                history = session.query(TransactionHistory).filter(and_(TransactionHistory.accountID == frm.id,
                                                                        TransactionHistory.transactionDate > oneMonthAgo)).count()
                if history >= 6:
                    return f"Transfer limit reached on Money Market account {to.accountNum}."
        if fromMoney.balance < amount:
            return f"Insufficient funds in {frm.accountNum}."
        fromMoney.balance -= amount
        fromRecipient = toMoney.accountName + f"({to.accountNum})" if toAccount else comment
        fromIsInternal = True if toAccount else False
        tdate = arrow.utcnow().datetime
        fromTH = TransactionHistory(accountID=frm.id, recipient=fromRecipient, transactionDate=tdate, amount=amount, internal=fromIsInternal)
        if toAccount:
            if isinstance(toMoney, Mortgage):
                toMoney.currentAmountOwed -= amount
            else:
                toMoney.balance += amount
            toTH = TransactionHistory(accountID=to.id, recipient=fromRecipient,transactionDate=tdate, amount=amount, internal=fromIsInternal)
            session.add(toTH)
        session.add(fromTH)
    return amount
