import psycopg2
#used to create database table

DB_NAME = "koozvdlv"	#database name column
DB_USER = "koozvdlv"	#database user column
DB_PASS = "u7eSvXoCfZR2O__ZbH_AUAlx5b3aWsY8"	#database password column
DB_HOST = "castor.db.elephantsql.com"	#database server host column
DB_PORT = "5432"	#database port column


conn = psycopg2.connect(database = DB_NAME, user = DB_USER, password = DB_PASS, host = DB_HOST, port = DB_PORT)

print("Database connected successfully.")

cur = conn.cursor()
cur.execute(""" 


CREATE TABLE Admin 		#create table
(
ID INT PRIMARY KEY NOT NULL,	#set fields to not null
NAME TEXT NOT NULL,
EMAIL TEXT NOT NULL,
IMAGE_FILE TEXT NOT NULL,
PASSWORD TEXT NOT NULL,
RANK TEXT NOT NULL


)

""")

conn.commit()
print("Table created successfully.")