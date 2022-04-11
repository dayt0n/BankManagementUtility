from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import MONEY, ENUM, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from . import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    username = Column(String)
    password = Column(String)
    role = Column(ENUM('customer', 'teller', 'administrator', name='roleEnum'))
    address = Column(String)
    phone = Column(String)
    accounts = relationship("UserAccount", back_populates="user")

    def __repr__(self):
        return f"<User(name='{self.name}', email='{self.email}', rank='{self.rank}', address='{self.address}', phone='{self.phone}'"


class UserAccount(Base):
    __tablename__ = 'user_accounts'
    id = Column(Integer, primary_key=True)
    user = relationship("User", back_populates="accounts")
    userID = Column(Integer, ForeignKey("users.id"))
    accountType = Column(ENUM('checkingSaving', 'creditCard',
                         'mortage', name='accountTypeEnum'))
    accountNum = Column(Integer)
    openDate = Column(TIMESTAMP(timezone=True))
    # transaction history table relationship
    history = relationship("TransactionHistory", back_populates="account")
    # checking/savings table relationship
    checkingSavingAcct = relationship(
        "CheckingSavings", back_populates="userAcct")
    checkingSavingsAcctID = Column(Integer, ForeignKey("checking_savings.id"))
    # credit card table relationship
    ccAcct = relationship("CreditCard", back_populates="userAcct")
    ccAcctID = Column(Integer, ForeignKey("credit_cards.id"))
    # mortgage table relationship
    mortgageAcct = relationship("Mortgage", back_populates="userAcct")
    mortgageID = Column(Integer, ForeignKey("mortgages.id"))
    # money market table relationship
    mmAcct = relationship("MoneyMarket", back_populates="userAcct")
    mmAcctID = Column(Integer, ForeignKey("money_market.id"))

    # accountID returns the ID of whatever ID is populated for this account type
    @hybrid_property  # https://ourpython.com/python/sqlalchemy-foreign-key-to-multiple-tables
    def accountID(self):
        return self.checkingSavingsAcctID or self.ccAcctID or self.mortgageID

    def __repr__(self):
        return f"<UserAccount(UserID='{self.userID}', accountType='{self.accountType}', accountID='{self.accountID}'"


class CheckingSavings(Base):
    __tablename__ = 'checking_savings'
    id = Column(Integer, primary_key=True)
    userAcct = relationship("UserAccount", back_populates="checkingSavingAcct")
    accountType = Column(
        ENUM('checking', 'savings', name='checking_savings_type_enum'))
    accountName = Column(String)
    balance = Column(MONEY)
    routingNumber = Column(Integer)
    dividendRate = Column(Float)

    def __repr__(self):
        return f"<CheckingSavings(accountType='{self.accountType}', accountName='{self.accountName}', balance='{self.balance}', routingNumber='{self.routingNumber}', dividendRate='{self.dividendRate}'"


class MoneyMarket(Base):
    __tablename__ = "money_market"
    id = Column(Integer, primary_key=True)
    userAcct = relationship("UserAccount", back_populates="checkingSavingAcct")
    accountName = Column(String)
    balance = Column(MONEY)
    routingNumber = Column(Integer)
    interestRate = Column(Float)
    # get transfer count from TransactionHistory. limit to 6 every calendar month

    def __repr__(self):
        return f"<MoneyMarket(accountName='{self.accountName}', balance='{self.balance}', routingNumber='{self.routingNumber}', interestRate='{self.interestRate}'"


class CreditCard(Base):
    __tablename__ = 'credit_cards'
    id = Column(Integer, primary_key=True)
    userAcct = relationship("UserAccount", back_populates="ccAcct")
    accountName = Column(String)
    balance = Column(MONEY)
    routingNumber = Column(Integer)
    interestRate = Column(Float)

    def __repr__(self):
        return f"<CreditCard(accountName='{self.accountName}', accountID='{self.accountID}', balance='{self.balance}', routingNumber='{self.routingNumber}', interestRate='{self.interestRate}'"


class Mortgage(Base):
    __tablename__ = 'mortgages'
    id = Column(Integer, primary_key=True)
    userAcct = relationship("UserAccount", back_populates="mortgageAcct")
    accountType = Column(String)
    accountName = Column(String)
    routingNumber = Column(Integer)
    loanAmount = Column(MONEY)
    currentAmountOwed = Column(MONEY)
    loanTerm = Column(Integer)
    interestRate = Column(Float)
    monthlyPayment = Column(MONEY)
    paymentDueDate = Column(TIMESTAMP(timezone=True))
    startDate = Column(TIMESTAMP(timezone=True))
    status = Column(String)

    def __repr__(self):
        return f"<Mortgage(accountType='{self.accountType}', accountName='{self.accountName}', accountID='{self.accountID}', balance='{self.balance}', routingNumber='{self.routingNumber}', loanAmount='{self.loanAmount}', currentAmountOwed='{self.currentAmountOwed}', loanTerm='{self.loanTerm}', interestRate='{self.interestRate}', monthlyPayment='{self.monthlyPayment}', paymentDueDate='{self.paymentDueDate}', startDate='{self.startDate}', status ='{self.status}'"


class TransactionHistory(Base):
    __tablename__ = 'transaction_history'
    id = Column(Integer, primary_key=True)
    account = relationship("UserAccount", back_populates="history")
    accountID = Column(Integer, ForeignKey("user_accounts.id"))
    recipient = Column(String)
    transactionDate = Column(TIMESTAMP(timezone=True))
    amount = Column(MONEY)
    internal = Column(Boolean)

    def __repr__(self):
        return f"<TransactionHistory(accountID='{self.accountID}', recipient='{self.recipient}', transactionDate='{self.transactionDate}', amount='{self.amount}', internal='{self.internal}'"
