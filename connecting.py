import psycopg2


DB_NAME = "koozvdlv"	#database name instance
DB_USER = "koozvdlv"	#database user instance
DB_PASS = "u7eSvXoCfZR2O__ZbH_AUAlx5b3aWsY8"	#database password instance
DB_HOST = "castor.db.elephantsql.com"	#database server host instance
DB_PORT = "5432"	#database port instance


try:
	conn = psycopg2.connect(database = DB_NAME, user = DB_USER, password = DB_PASS, host = DB_HOST, port = DB_PORT)
	print("Databse connected successfully.")


except:
	print("Database not connected.")