import logging
import math
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, TypeDecorator
from sqlalchemy.dialects.postgresql import MONEY, ENUM, TIMESTAMP, BIGINT
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from . import Base, noCommaRegex, moneyRegex, incomingMoneyRegex
import re
from typing import Any


class NumericMoney(TypeDecorator):
    impl = MONEY

    def process_bind_param(self, value: Any, dialect: Any):
        logging.debug(value)
        if not isinstance(value, str):
            value = str(float(value))
        # rounds down to nearest cent
        m = re.match(incomingMoneyRegex, value)
        if m:
            value = float(m.group(1))
            logging.debug(value)
        return value

    def process_result_value(self, value: Any, dialect: Any) -> None:
        if value is not None:
            value = re.sub(noCommaRegex, '', value)
            m = re.match(moneyRegex, value)
            if m:
                value = float(m.group(1))
        return value


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    email = Column(String)
    username = Column(String)
    password = Column(String)
    role = Column(ENUM('customer', 'teller', 'administrator', name='roleEnum'))
    address = Column(String)
    phone = Column(String)
    accounts = relationship("UserAccount", back_populates="user")
    ssn = Column(BIGINT)

    def __repr__(self):
        return f"<User(name='{self.name}', email='{self.email}', rank='{self.rank}', address='{self.address}', phone='{self.phone}'"


class UserAccount(Base):
    __tablename__ = 'user_accounts'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user = relationship("User", back_populates="accounts")
    userID = Column(Integer, ForeignKey("users.id"))
    accountType = Column(ENUM('checkingSaving', 'creditCard',
                         'mortgage', 'moneyMarket', name='accountTypeEnum'))
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
        return self.checkingSavingsAcctID or self.ccAcctID or self.mortgageID or self.mmAcctID

    def __repr__(self):
        return f"<UserAccount(UserID='{self.userID}', accountType='{self.accountType}', accountID='{self.accountID}'"


class CheckingSavings(Base):
    __tablename__ = 'checking_savings'
    id = Column(Integer, primary_key=True, autoincrement=True)
    userAcct = relationship("UserAccount", back_populates="checkingSavingAcct")
    accountType = Column(
        ENUM('checking', 'savings', name='checking_savings_type_enum'))
    accountName = Column(String)
    balance = Column(NumericMoney)
    routingNumber = Column(Integer)
    dividendRate = Column(Float)
    lastInterestCheck = Column(TIMESTAMP(timezone=True))

    def __repr__(self):
        return f"<CheckingSavings(accountType='{self.accountType}', accountName='{self.accountName}', balance='{self.balance}', routingNumber='{self.routingNumber}', dividendRate='{self.dividendRate}'"


class MoneyMarket(Base):
    __tablename__ = "money_market"
    id = Column(Integer, primary_key=True, autoincrement=True)
    userAcct = relationship("UserAccount", back_populates="mmAcct")
    accountName = Column(String)
    balance = Column(NumericMoney)
    routingNumber = Column(Integer)
    interestRate = Column(Float)
    lastInterestCheck = Column(TIMESTAMP(timezone=True))
    # get transfer count from TransactionHistory. limit to 6 every calendar month

    def __repr__(self):
        return f"<MoneyMarket(accountName='{self.accountName}', balance='{self.balance}', routingNumber='{self.routingNumber}', interestRate='{self.interestRate}'"


class CreditCard(Base):
    __tablename__ = 'credit_cards'
    id = Column(Integer, primary_key=True, autoincrement=True)
    userAcct = relationship("UserAccount", back_populates="ccAcct")
    accountName = Column(String)
    balance = Column(NumericMoney)
    cardNumber = Column(BIGINT)
    cvv = Column(Integer)
    routingNumber = Column(Integer)
    interestRate = Column(Float)
    creditLimit = Column(NumericMoney)
    moneyLimit = Column(NumericMoney)
    nextPayment = Column(TIMESTAMP(timezone=True))
    statementBalance = Column(NumericMoney)
    lastInterestCheck = Column(TIMESTAMP(timezone=True))

    def __repr__(self):
        return f"<CreditCard(accountName='{self.accountName}', accountID='{self.accountID}', balance='{self.balance}', routingNumber='{self.routingNumber}', interestRate='{self.interestRate}'"


class Mortgage(Base):
    __tablename__ = 'mortgages'
    id = Column(Integer, primary_key=True, autoincrement=True)
    userAcct = relationship("UserAccount", back_populates="mortgageAcct")
    accountName = Column(String)
    routingNumber = Column(Integer)
    loanAmount = Column(NumericMoney)
    currentAmountOwed = Column(NumericMoney)
    loanTerm = Column(Integer)
    interestRate = Column(Float)
    monthlyPayment = Column(NumericMoney)
    paymentDueDate = Column(TIMESTAMP(timezone=True))
    startDate = Column(TIMESTAMP(timezone=True))
    nextPayment = Column(TIMESTAMP(timezone=True))
    totalOwed = Column(NumericMoney)
    status = Column(String)

    def __repr__(self):
        return f"<Mortgage(accountType='{self.accountType}', accountName='{self.accountName}', accountID='{self.accountID}', balance='{self.balance}', routingNumber='{self.routingNumber}', loanAmount='{self.loanAmount}', currentAmountOwed='{self.currentAmountOwed}', loanTerm='{self.loanTerm}', interestRate='{self.interestRate}', monthlyPayment='{self.monthlyPayment}', paymentDueDate='{self.paymentDueDate}', startDate='{self.startDate}', status ='{self.status}'"


class TransactionHistory(Base):
    __tablename__ = 'transaction_history'
    id = Column(Integer, primary_key=True, autoincrement=True)
    account = relationship("UserAccount", back_populates="history")
    accountID = Column(Integer, ForeignKey("user_accounts.id"))
    recipient = Column(String)
    transactionDate = Column(TIMESTAMP(timezone=True))
    amount = Column(NumericMoney)
    internal = Column(Boolean)

    def __repr__(self):
        return f"<TransactionHistory(accountID='{self.accountID}', recipient='{self.recipient}', transactionDate='{self.transactionDate}', amount='{self.amount}', internal='{self.internal}'"

# TODO: employee info table
