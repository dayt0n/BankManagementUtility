from contextlib import contextmanager
from os import getenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import logging
from bmuapi.database import Base

from bmuapi.database.tables import User

MySession = sessionmaker()


@contextmanager
def SessionManager(commit=True):
    sess: Session = MySession()
    try:
        yield sess
        if commit:
            sess.commit()
    except Exception:
        sess.rollback()
        raise
    finally:
        sess.close()


def init_db():
    global MySession
    url = f"postgresql+psycopg2://{getenv('DB_USER')}:{getenv('DB_PASS')}@{getenv('DB_HOST')}:{getenv('DB_PORT')}/{getenv('DB_NAME')}"
    engine = create_engine(url)
    MySession.configure(bind=engine)
    Base.metadata.create_all(engine)

def test_query():
    with SessionManager(commit=False) as session:
        for instance in session.query(User).order_by(User.id):
            logging.debug(instance.address)

def addUserData():
    usr = User(name='test', email='test@test.com', password='yoo',
               rank=0, address='101 school road', phone=5555555)
    with SessionManager() as session:
        session.add(usr)

def addUserAccountData():
    usr = UserAccount(userID=8984, accountType='type', accountID=5555555)
    with SessionManager() as session:
        session.add(usr)

def addCheckSavingsData():
    usr = CheckingSavings(accountType='type', accountName='name', accountID=5555555, balance=30.20, routingNumber=1238911, dividendRate=0.01)
    with SessionManager() as session:
        session.add(usr)

def addCreditCardData():
    usr = CreditCard(accountName='name', accountID=5555555, balance=30.20, routingNumber=1238911, interestRate=0.01)
    with SessionManager() as session:
        session.add(usr)

def addMortgage():
    usr = Mortgage(accountType='type', accountName='name', accountID=5555555, routingNumber=12312320, loanAmount=127389.30, currentAmountOwed=0.01, loanTerm=4, interestRate=0.04, monthlyPayment=3024.40, paymentDueDate=06172021, startDate=06122021, status = 'active')
    with SessionManager() as session:
        session.add(usr)

def addTransactionHistory():
    usr = TransactionHistory(accountID=5555555, recipient='dad',transactionDate=05252020,amount=30.30,internal='true')
    with SessionManager() as session:
        session.add(usr)