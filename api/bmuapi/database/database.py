from contextlib import contextmanager
from os import getenv
from typing import Iterator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import logging
from bmuapi.database import Base

from bmuapi.database.tables import User

from bmuapi.database.tables import UserAccount, CheckingSavings, CreditCard, Mortgage

MySession = sessionmaker()


# https://gist.github.com/naufalafif/bb2e238f9f80aa17a16ebd7023afb935
@contextmanager
def SessionManager(commit=True) -> Iterator[Session]:
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
    engine = create_engine(url, pool_pre_ping=True)
    MySession.configure(bind=engine)
    # don't do this until we have User finalized
    # just want to avoid migration at this point in the development process
    Base.metadata.create_all(engine)

    # use this to drop the User table
    # Base.metadata.drop_all(bind=engine, tables=[User.__table__])


def test_query():
    with SessionManager(commit=False) as session:
        for instance in session.query(User).order_by(User.id):
            logging.debug(instance.address)


def add_dummy_data():
    usr = User(name='test', email='test@test.com', password='yoo',
               rank=0, address='101 school road', phone=5555555)
    with SessionManager() as session:
        session.add(usr)


def get_money_account(acct: UserAccount):
    with SessionManager(commit=False) as sess:
        acctTable = None
        match acct.accountType:
            case 'checkingSaving':
                acctTable = CheckingSavings
            case 'creditCard':
                acctTable = CreditCard
            case 'mortgage':
                acctTable = Mortgage
        actualAccount = sess.query(acctTable).filter(
            acctTable.id == acct.accountID).first()
        if not actualAccount:
            return None
        return actualAccount
