from os import getenv
from typing import Iterator
import arrow
from flask_apscheduler import APScheduler
from bmuapi.database.database import SessionManager
from bmuapi.database.tables import Mortgage
from bmuapi.api.money.account import getPaymentDates

scheduler = APScheduler()


@scheduler.task('cron', id='do_mortgage_check', day='*')
def mortgage_check():
    now = arrow.utcnow().datetime
    with SessionManager() as sess:
        toSwitch: Iterator[Mortgage] = sess.query(Mortgage).filter(
            Mortgage.nextPayment < now).all()
        for acct in toSwitch:
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
