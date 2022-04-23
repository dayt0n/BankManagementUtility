# BankManagementUtility (BMU)

## Host setup

Add a file called `.env` to the `/api` folder. This file contains the database login information. It should look something like this:

```bash
DB_NAME=yourDBName
DB_USER=yourDBUsername
DB_PASS=y0urDBP455w0rD
DB_HOST=yourdb.com
DB_PORT=3306

```

Make sure there is a newline at the bottom of this file.

### Linux

Edit `/etc/hosts` to add the following line:

```
127.0.0.1 bmu.local
```

### Windows

Edit `C:\Windows\System32\drivers\etc\hosts` to add the following line:

```
127.0.0.1 bmu.local
```

## Starting the Server

### Development
On the command line, run:
```bash
$ docker-compose -f docker-compose-dev.yml up --build -d
```

When you want to shut down the server, run:
```bash
$ docker-compose -f docker-compose-dev.yml down
```

### Production

On the command line, run:
```bash
$ docker-compose up --build -d
```

When you want to shut down the server, run:
```bash
$ docker-compose down
```

## Using the server

Navigate to [http://bmu.local](http://bmu.local) and create and account or login to an existing customer, teller, or administrator account. 