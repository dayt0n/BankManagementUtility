from sqlalchemy import Column, Integer, String
from . import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)
    rank = Column(Integer)
    address = Column(String)
    phone = Column(Integer)

    def __repr__(self):
        return f"<User(name='{self.name}', email='{self.email}', rank='{self.rank}', address='{self.address}', phone='{self.phone}'"
