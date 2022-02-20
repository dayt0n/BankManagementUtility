from os import getenv
from sqlalchemy import create_engine
from sqlalchemy.engine.base import Connection
from sqlalchemy.orm import sessionmaker, Session

dbObj = None

MySession = sessionmaker()

sess: MySession


def db() -> Connection:
    global dbObj
    return dbObj


def init_db():
    global sess
    url = f"postgresql+psycopg2://{getenv('DB_USER')}:{getenv('DB_PASS')}@{getenv('DB_HOST')}:{getenv('DB_PORT')}/{getenv('DB_NAME')}"
    print(url)
    engine = create_engine(url)
    MySession.configure(bind=engine)
    #sess = MySession().configure()
    dbObj = engine.connect()


def close_db():
    global dbObj
    dbObj.close()
