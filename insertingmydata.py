#used to insert new data/users into database table

import psycopg2


DB_NAME = "koozvdlv"	#database name column
DB_USER = "koozvdlv"	#database user column
DB_PASS = "u7eSvXoCfZR2O__ZbH_AUAlx5b3aWsY8"	#database password column
DB_HOST = "castor.db.elephantsql.com"	#database server host column
DB_PORT = "5432"	#database port column


conn = psycopg2.connect(database = DB_NAME, user = DB_USER, password = DB_PASS, host = DB_HOST, port = DB_PORT)

print("Database connected successfully.")

cur = conn.cursor()
#must insert correct IMAGE_FILE as well vvvvvvvvvvvvvvvvv
cur.execute("INSERT INTO Admin (ID, NAME, EMAIL, IMAGE_FILE, PASSWORD, RANK) VALUES(4, 'Customer', 'Melvin@uah.edu', 'default', 'Olnbr567', 2)")
conn.commit()
print("Data inserted successfully.")
conn.close() 