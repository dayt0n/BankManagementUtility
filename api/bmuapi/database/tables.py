from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.dialects.postgresql import MONEY, ENUM
from . import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    username = Column(String)
    password = Column(String)
    rank = Column(ENUM('customer', 'teller', 'administrator', name='rankEnum'))
    address = Column(String)
    phone = Column(Integer)

    def __repr__(self):
        return f"<User(name='{self.name}', email='{self.email}', rank='{self.rank}', address='{self.address}', phone='{self.phone}'"


class UserAccount(Base):
    __tablename__ = 'user-account'
    id = Column(Integer, primary_key=True)
    userID = Column(Integer)
    accountType = Column(String)
    accountID = Column(Integer)

    def __repr__(self):
        return f"<UserAccount(UserID='{self.userID}', accountType='{self.accountType}', accountID='{self.accountID}'"


class CheckingSavings(Base):
    __tablename__ = 'checking-savings'
    id = Column(Integer, primary_key=True)
    accountType = Column(String)
    accountName = Column(Integer)
    accountID = Column(Integer)
    balance = Column(MONEY)
    routingNumber = Column(Integer)
    dividendRate = Column(Float)

    def __repr__(self):
        return f"<CheckingSavings(accountType='{self.accountType}', accountName='{self.accountName}', accountID='{self.accountID}', balance='{self.balance}', routingNumber='{self.routingNumber}', dividendRate='{self.dividendRate}'"


class CreditCard(Base):
    __tablename__ = 'credit-card'
    id = Column(Integer, primary_key=True)
    accountName = Column(String)
    accountID = Column(Integer)
    balance = Column(MONEY)
    routingNumber = Column(Integer)
    interestRate = Column(Float)

    def __repr__(self):
        return f"<CreditCard(accountName='{self.accountName}', accountID='{self.accountID}', balance='{self.balance}', routingNumber='{self.routingNumber}', interestRate='{self.interestRate}'"


class Mortgage(Base):
    __tablename__ = 'mortgage'
    id = Column(Integer, primary_key=True)
    accountType = Column(String)
    accountName = Column(Integer)
    accountID = Column(Integer)
    routingNumber = Column(Integer)
    loanAmount = Column(MONEY)
    currentAmountOwed = Column(MONEY)
    loanTerm = Column(Integer)
    interestRate = Column(Float)
    monthlyPayment = Column(MONEY)
    paymentDueDate = Column(Integer)
    startDate = Column(Integer)
    status = Column(String)

    def __repr__(self):
        return f"<Mortgage(accountType='{self.accountType}', accountName='{self.accountName}', accountID='{self.accountID}', balance='{self.balance}', routingNumber='{self.routingNumber}', loanAmount='{self.loanAmount}', currentAmountOwed='{self.currentAmountOwed}', loanTerm='{self.loanTerm}', interestRate='{self.interestRate}', monthlyPayment='{self.monthlyPayment}', paymentDueDate='{self.paymentDueDate}', startDate='{self.startDate}', status ='{self.status}'"


class TransactionHistory(Base):
    __tablename__ = 'transaction-history'
    id = Column(Integer, primary_key=True)
    accountID = Column(Integer)
    recipient = Column(String)
    transactionDate = Column(Integer)
    amount = Column(MONEY)
    internal = Column(Boolean)

    def __repr__(self):
        return f"<TransactionHistory(accountID='{self.accountID}', recipient='{self.recipient}', transactionDate='{self.transactionDate}', amount='{self.amount}', internal='{self.internal}'"
