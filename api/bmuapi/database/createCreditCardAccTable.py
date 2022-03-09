from sqlalchemy import Column, Integer, String
from . import Base


class CreditCard(Base):
    __tablename__ = 'credit-card'
    id = Column(Integer, primary_key=True)
    accountName = Column(String)
    accountID = Column(Integer)
    balance = Column(Float)
    routingNumber = Column(Integer)
    interestRate = Column(Float)

    def __repr__(self):
        return f"<CreditCard(accountName='{self.accountName}', accountID='{self.accountID}', balance='{self.balance}', routingNumber='{self.routingNumber}', interestRate='{self.interestRate}'"