from contextvars import copy_context
from copy import copy
import logging
import arrow
from bmuapi.database.database import SessionManager, get_money_account
from bmuapi.database.tables import UserAccount, Mortgage, MoneyMarket, TransactionHistory
from sqlalchemy import and_


def transfer_op(amount, fromAccount=None, toAccount=None, session=None, comment="withdraw"):
    if not fromAccount and not toAccount:
        return "Must provide from and/or to account for transfer."
    if amount <= 0:  # hashtag security
        return f"Invalid transfer amount: {amount}"
    if fromAccount:
        frm: UserAccount = fromAccount
        if isinstance(fromAccount, int):
            with SessionManager(commit=False) as sess:
                if session:
                    sess = session
                frm = sess.query(UserAccount).filter(
                    UserAccount.accountNum == fromAccount).first()
            if not frm:
                return f"Account {fromAccount} not found."
    if toAccount:
        to: UserAccount = toAccount
        if isinstance(toAccount, int):
            with SessionManager(commit=False) as sess:
                if session:
                    sess = session
                to = sess.query(UserAccount).filter(
                    UserAccount.accountNum == toAccount).first()
                if not to:
                    return f"Account {toAccount} not found."
    if fromAccount:
        fromMoney = get_money_account(frm, session=session)
    if toAccount:
        toMoney = get_money_account(to, session=session)
    if (toAccount and not toMoney) or (fromAccount and not fromMoney):
        return "Could not locate money accounts to complete transfer."
    # cannot transfer money FROM a mortgage account
    if fromAccount and isinstance(fromMoney, Mortgage):
        return "Cannot transfer money from a mortgage account."
    with SessionManager() as sess:
        if session:
            sess = session
        oneMonthAgo = arrow.utcnow().shift(months=-1).datetime
        if fromAccount and isinstance(fromMoney, MoneyMarket):
            history = sess.query(TransactionHistory).filter(and_(TransactionHistory.accountID == frm.id,
                                                                 TransactionHistory.transactionDate > oneMonthAgo)).count()
            if history >= 6:
                return f"Transfer limit reached on Money Market account {frm.accountNum}"
        if toAccount and isinstance(toMoney, MoneyMarket):
            history = sess.query(TransactionHistory).filter(and_(TransactionHistory.accountID == to.id,
                                                                 TransactionHistory.transactionDate > oneMonthAgo)).count()
            if history >= 6:
                return f"Transfer limit reached on Money Market account {to.accountNum}."
        tdate = arrow.utcnow().datetime
        fromRecipient = toMoney.accountName + \
            f" ({to.accountNum})" if toAccount else comment
        if fromAccount:
            # TODO: add if credit card, because CreditCards can have negative balance, only if a limit is not yet reached
            if fromMoney.balance < amount:
                return f"Insufficient funds in {frm.accountNum}."
            realFromMoney = get_money_account(frm, session=sess)
            realFromMoney.balance -= amount
            fromIsInternal = True if toAccount else False
            fromTH = TransactionHistory(accountID=frm.id, recipient=fromRecipient,
                                        transactionDate=tdate, amount=amount, internal=fromIsInternal)
            sess.add(fromTH)
        if toAccount:
            realToMoney = get_money_account(to, session=sess)
            if isinstance(toMoney, Mortgage):
                realToMoney.currentAmountOwed -= amount
            else:
                realToMoney.balance += amount
            toIsInternal = True if fromAccount else False
            toTH = TransactionHistory(accountID=to.id, recipient=fromRecipient,
                                      transactionDate=tdate, amount=amount, internal=toIsInternal)
            sess.add(toTH)
    return amount
