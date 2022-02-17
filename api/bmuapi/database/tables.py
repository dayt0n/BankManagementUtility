from sqlalchemy import Table
from . import Base


class Users(Base):
    __tablename__ = 'users'
