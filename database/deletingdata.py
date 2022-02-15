#used to delete data/users in database table

import psycopg2


DB_NAME = "koozvdlv"	#database name column
DB_USER = "koozvdlv"	#database user column
DB_PASS = "ycsSyQ-AyqSrjgbWphklijpToSf3Om_r"	#database password column
DB_HOST = "castor.db.elephantsql.com"	#database server host column
DB_PORT = "5432"	#database port column


conn = psycopg2.connect(database = DB_NAME, user = DB_USER, password = DB_PASS, host = DB_HOST, port = DB_PORT)

print("Database connected successfully.")

cur = conn.cursor()

cur.execute("DELETE FROM Admin WHERE ID = 2")
conn.commit()
print("Data deleted successfully ")
print("Total row affected: " + str(cur.rowcount))