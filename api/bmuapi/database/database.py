from os import getenv
from sqlalchemy import create_engine


dbObj = None


def db():
    global dbObj
    return dbObj


def init_db():
    global dbObj
    url = f"postgresql+psycopg2://{getenv('DB_USER')}:{getenv('DB_PASS')}@{getenv('DB_HOST')}:{getenv('DB_PORT')}/{getenv('DB_NAME')}"
    print(url)
    engine = create_engine(url)
    dbObj = engine.connect()


def close_db():
    global dbObj
    dbObj.close()
