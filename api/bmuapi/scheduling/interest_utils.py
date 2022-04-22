from operator import and_
from bmuapi.database.database import SessionManager
from bmuapi.database.tables import User, UserInterest


def get_interest_entry(userID, year, session=None):
    with SessionManager(session=session) as sess:
        interestEntry = sess.query(UserInterest).filter(and_(
            UserInterest.userID == userID, UserInterest.year == year)).first()
        if not interestEntry:  # need to create a new interest entry, then populate it
            interestEntry = UserInterest(
                userID=userID, year=year, interest=0)
            sess.add(interestEntry)
        return interestEntry
