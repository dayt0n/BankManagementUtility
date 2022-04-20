from typing import Iterator
import arrow
from flask_apscheduler import APScheduler
from bmuapi.database.database import SessionManager
from bmuapi.database.tables import Mortgage, CreditCard, CheckingSavings, MoneyMarket
from bmuapi.api.money.account import getPaymentDates

scheduler = APScheduler()


@scheduler.task('cron', id='do_interest_check', day='*')
def interest_check():
    now = arrow.utcnow().datetime
    thirtyDaysAgo = arrow.utcnow().shift(months=-1).datetime
    thirtyDaysFromNow = arrow.utcnow().shift(months=1).datetime
    with SessionManager() as sess:
        # credit card interest
        ccs: Iterator[CreditCard] = sess.query(CreditCard).filter(
            CreditCard.nextPayment < now).all()
        for cc in ccs:
            if cc.balance < 0:
                cc.balance *= (1 + cc.interestRate)
            cc.nextPayment = thirtyDaysFromNow
        # checking/saving interest
        css: Iterator[CheckingSavings] = sess.query(CheckingSavings).filter(
            CheckingSavings.lastInterestCheck < thirtyDaysAgo).all()
        for cs in css:
            cs.balance *= (1 + cs.dividendRate)
            cs.lastInterestCheck = now
        # money market interest
        mms: Iterator[MoneyMarket] = sess.query(MoneyMarket).filter(
            MoneyMarket.lastInterestCheck < thirtyDaysAgo).all()
        for mm in mms:
            mm.balance *= (1 + mm.interestRate)
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
                acct.totalOwed += (acct.currentAmountOwed *
                                   (1 + acct.interestRate))
            if acct.paymentDueDate < now:
                acct.status = "PAST DUE"
                continue  # don't update values
            acct.monthlyPayment = acct.totalOwed / len(paymentDates)
            acct.currentAmountOwed = acct.monthlyPayment
