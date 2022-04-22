import logging
import arrow
from bmuapi.database.database import SessionManager, get_money_account
from bmuapi.utils import get_account_owner
from bmuapi.database.tables import UserAccount, Mortgage, MoneyMarket, TransactionHistory, CreditCard
from sqlalchemy import and_


def delete_op(accountNum, session=None):
    with SessionManager(session=session) as sess:
        owner = get_account_owner(accountNum, session=sess)
        if owner.role != 'customer':
            return f"Cannot delete account from non-customer."
        acct = sess.query(UserAccount).filter(
            UserAccount.accountNum == accountNum).first()
        if not acct:
            return f"Could not find account with number {accountNum}"
        moneyAcct = get_money_account(acct, session=sess)
        if isinstance(moneyAcct, Mortgage):
            if moneyAcct.status != "paid":
                return f"Mortgage account {accountNum} has not been paid off yet. Not going to delete."
        else:
            if moneyAcct.balance != 0.0:
                return f"Account {accountNum} is not empty. Not going to delete."
        sess.delete(moneyAcct)
        sess.delete(acct)
        sess.query(TransactionHistory).filter(
            TransactionHistory.accountID == acct.id).delete(synchronize_session=False)
        return "success"


def transfer_op(amount, fromAccount=None, toAccount=None, session=None, comment="withdraw"):
    if not fromAccount and not toAccount:
        return "Must provide from and/or to account for transfer."
    if amount <= 0:  # hashtag security
        return f"Invalid transfer amount: {amount}"
    if fromAccount:
        frm: UserAccount = fromAccount
        if isinstance(fromAccount, int):
            with SessionManager(commit=False, session=session) as sess:
                frm = sess.query(UserAccount).filter(
                    UserAccount.accountNum == fromAccount).first()
            if not frm:
                return f"Account {fromAccount} not found."
    if toAccount:
        to: UserAccount = toAccount
        if isinstance(toAccount, int):
            with SessionManager(commit=False, session=session) as sess:
                to = sess.query(UserAccount).filter(
                    UserAccount.accountNum == toAccount).first()
                if not to:
                    return f"Account {toAccount} not found."
    if fromAccount:
        fromMoney = get_money_account(frm, session=session)
    if toAccount:
        toMoney = get_money_account(to, session=session)
    if toAccount and fromAccount:
        if toAccount.accountNum == fromAccount.accountNum:
            return "Transfer to same account not allowed."
    if (toAccount and not toMoney) or (fromAccount and not fromMoney):
        return "Could not locate money accounts to complete transfer."
    # cannot transfer money FROM a mortgage account
    if fromAccount and isinstance(fromMoney, Mortgage):
        return "Cannot transfer money from a mortgage account."
    with SessionManager(session=session) as sess:
        oneMonthAgo = arrow.utcnow().shift(months=-1).datetime
        if fromAccount and isinstance(fromMoney, MoneyMarket):
            history = sess.query(TransactionHistory).filter(and_(TransactionHistory.accountID == frm.id,  # withdraws
                                                                 TransactionHistory.transactionDate > oneMonthAgo, not TransactionHistory.positive)).count()
            if history >= 6:
                return f"Transfer limit reached on Money Market account {frm.accountNum}"
        tdate = arrow.utcnow().datetime
        fromRecipient = toMoney.accountName + \
            f" ({to.accountNum})" if toAccount else comment
        if fromAccount:
            if isinstance(fromMoney, CreditCard):
                if (fromMoney.balance - amount) < (-1 * fromMoney.creditLimit):
                    return f"Stopping transfer that goes over the credit limit of {fromMoney.creditLimit}."
                    # ignore mortgages from money limit
                if (amount > fromMoney.moneyLimit) and toAccount and not isinstance(toMoney, Mortgage):
                    return f"Stopping transfer that goes over the money limit of {fromMoney.moneyLimit}."
            elif fromMoney.balance < amount:
                return f"Insufficient funds in {frm.accountNum}."
            realFromMoney = get_money_account(frm, session=sess)
            realFromMoney.balance -= amount
            fromIsInternal = True if toAccount else False
            fromTH = TransactionHistory(accountID=frm.id, recipient=fromRecipient,
                                        transactionDate=tdate, amount=amount, internal=fromIsInternal, positive=False)
            sess.add(fromTH)
        if toAccount:
            realToMoney = get_money_account(to, session=sess)
            if isinstance(toMoney, Mortgage):
                realToMoney.currentAmountOwed -= amount
            else:
                realToMoney.balance += amount
            toIsInternal = True if fromAccount else False
            toTH = TransactionHistory(accountID=to.id, recipient=fromRecipient,
                                      transactionDate=tdate, amount=amount, internal=toIsInternal, positive=True)
            sess.add(toTH)
    return amount
