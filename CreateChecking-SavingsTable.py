from sqlalchemy import Column, Integer, String
from . import Base


class CheckingSavings(Base):
    __tablename__ = 'checking-savings'
    id = Column(Integer, primary_key=True)
    accountType = Column(String)
    accountName = Column(Integer)
    accountID = Column(Integer)
    balance = Column(Float)
    routingNumber = Column(Integer)
    dividendRate = Column(Float)


    def __repr__(self):
        return f"<CheckingSavings(accountType='{self.accountType}', accountName='{self.accountName}', accountID='{self.accountID}', balance='{self.balance}', routingNumber='{self.routingNumber}', dividendRate='{self.dividendRate}'"