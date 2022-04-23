# BankManagementUtility (BMU)

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

## Host setup

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

## Using the server

Navigate to [http://bmu.local](http://bmu.local) and create and account or login to an existing customer, teller, or administrator account. 