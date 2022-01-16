# BankManagementUtility (BMU)

## Starting the PostgreSQL Server

On the command line, run:
```bash
$ docker-compose up --build -d
$ psql -U bmuuser -h localhost -p 5432 bmudb
```

When you want to shut down the server, run:
```bash
$ docker-compose down
```