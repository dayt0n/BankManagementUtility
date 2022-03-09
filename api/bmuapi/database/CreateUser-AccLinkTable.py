from sqlalchemy import Column, Integer, String
from . import Base


class UserAccount(Base):
    __tablename__ = 'user-account'
    id = Column(Integer, primary_key=True)
    userID = Column(Integer)
    accountType = Column(String)
    accountID = Column(Integer)

    def __repr__(self):
        return f"<UserAccount(UserID='{self.userID}', accountType='{self.accountType}', accountID='{self.accountID}'"