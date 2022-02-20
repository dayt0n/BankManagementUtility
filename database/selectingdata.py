#used to select new data/users into database table

import psycopg2


DB_NAME = "koozvdlv"	#database name column
DB_USER = "koozvdlv"	#database user column
DB_PASS = "ycsSyQ-AyqSrjgbWphklijpToSf3Om_r"	#database password column
DB_HOST = "castor.db.elephantsql.com"	#database server host column
DB_PORT = "5432"	#database port column


conn = psycopg2.connect(database = DB_NAME, user = DB_USER, password = DB_PASS, host = DB_HOST, port = DB_PORT)

print("Database connected successfully.")

cur = conn.cursor()

cur.execute("SELECT ID, NAME, EMAIL, IMAGE_FILE, PASSWORD, RANK, SOCIAL, ADDRESS, PHONE FROM Admin")

rows = cur.fetchall()

for data in rows: 
	print("ID: " + str(data[0]))
	print("Name: " + data[1])
	print("Email: " + data[2])
	print("Image_file: " + data[3])
	print("Password: " + data[4])
	print("Rank: " + data[5])
	print("Social: " + data[6])
	print("Address: " + data[7])
	print("Phone: " + data[8])

	print("Data selected successfully ")
	conn.close()
