import logging
from operator import and_
from typing import Iterator
import arrow
from flask_apscheduler import APScheduler
from bmuapi.database.database import SessionManager
from bmuapi.database.tables import UserAccount, UserInterest, Mortgage, CreditCard, CheckingSavings, MoneyMarket, TransactionHistory
from bmuapi.api.money.account import getPaymentDates

from bmuapi.scheduling.interest_utils import get_interest_entry

scheduler = APScheduler()


# change to minute='*' for testing
@scheduler.task('cron', id='do_interest_check', day='*')
def interest_check():
    logging.debug("running interest check")
    realNow = arrow.utcnow()
    now = realNow.datetime
    thirtyDaysAgo = realNow.shift(months=-1).datetime
    thisYear = int(realNow.format("YYYY"))
    thirtyDaysFromNow = realNow.shift(months=1).datetime
    sixtyDaysFromNow = realNow.shift(months=2).datetime
    with SessionManager() as sess:
        # credit card interest
        ccs: Iterator[CreditCard] = sess.query(CreditCard).filter(
            CreditCard.nextPayment < now).all()
        for cc in ccs:
            if cc.balance < 0:
                # once every two months
                ccInterest = cc.balance * (cc.interestRate/6)
                cc.balance -= ccInterest
                if ccInterest != 0:
                    userAcct = sess.query(UserAccount).filter(
                        UserAccount.accountID == cc.id).first()
                    if not userAcct:
                        logging.debug(f"No account with ID {cc.id} found.")
                        continue
                    sess.add(TransactionHistory(
                        accountID=userAcct.id, recipient=f"interest for {realNow.format('MMMM, YYYY')}", transactionDate=now, amount=ccInterest, internal=True, positive=True if ccInterest > 0 else False))
            cc.nextPayment = sixtyDaysFromNow
        # checking/saving interest
        css: Iterator[CheckingSavings] = sess.query(CheckingSavings).filter(
            CheckingSavings.lastInterestCheck < thirtyDaysAgo).all()
        for cs in css:
            # once every month
            paid = cs.balance * (cs.dividendRate / 12)
            if paid != 0:
                cs.balance += paid
                userAcct = sess.query(UserAccount).filter(
                    UserAccount.accountID == cs.id).first()
                if not userAcct:
                    logging.debug(f"No account with ID {cs.id} found.")
                    continue
                interestEntry = get_interest_entry(
                    userAcct.userID, thisYear, session=sess)
                interestEntry.interest += paid
                sess.add(TransactionHistory(
                    accountID=userAcct.id, recipient=f"interest for {realNow.format('MMMM, YYYY')}", transactionDate=now, amount=paid, internal=True, positive=True if paid > 0 else False))
            cs.lastInterestCheck = now
        # money market interest
        mms: Iterator[MoneyMarket] = sess.query(MoneyMarket).filter(
            MoneyMarket.lastInterestCheck < thirtyDaysAgo).all()
        for mm in mms:
            # once every month
            paid = mm.balance * (mm.interestRate / 12)
            if paid != 0:
                mm.balance += paid
                userAcct = sess.query(UserAccount).filter(
                    UserAccount.accountID == mm.id).first()
                if not userAcct:
                    logging.debug(f"No account with ID {mm.id} found.")
                    continue
                interestEntry = get_interest_entry(
                    userAcct.userID, thisYear, session=sess)
                interestEntry.interest += paid
                sess.add(TransactionHistory(
                    accountID=userAcct.id, recipient=f"interest for {realNow.format('MMMM, YYYY')}", transactionDate=now, amount=paid, internal=True, positive=True if paid > 0 else False))
            mm.lastInterestCheck = now
        # mortgages
        morts: Iterator[Mortgage] = sess.query(Mortgage).filter(
            Mortgage.nextPayment < now).all()
        for acct in morts:
            paymentDates = getPaymentDates(
                acct.nextPayment, acct.paymentDueDate)
            # set new nextPayment
            acct.nextPayment = arrow.get(
                acct.nextPayment).shift(months=1).datetime
            payed = acct.monthlyPayment - acct.currentAmountOwed
            acct.totalOwed -= payed
            if acct.currentAmountOwed > 0:  # did not pay in complete this cycle
                # once every month
                mortInterest = acct.currentAmountOwed * \
                    (acct.interestRate / 12)
                if mortInterest != 0:
                    acct.totalOwed += mortInterest
                    userAcct = sess.query(UserAccount).filter(
                        UserAccount.accountID == acct.id).first()
                    if not userAcct:
                        logging.debug(f"No account with ID {acct.id} found.")
                        continue
                    sess.add(TransactionHistory(
                        accountID=userAcct.id, recipient=f"interest for {realNow.format('MMMM, YYYY')}", transactionDate=now, amount=mortInterest, internal=True, positive=True if mortInterest > 0 else False))
            if acct.paymentDueDate < now:
                acct.status = "PAST DUE"
                continue  # don't update values
            acct.monthlyPayment = acct.totalOwed / len(paymentDates)
            acct.currentAmountOwed = acct.monthlyPayment
