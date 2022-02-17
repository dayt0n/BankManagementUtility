# bmuapi

This is the API portion of the Bank Management Utility.

# Running

To run, just use the `docker-compose up` command from the README in the root directory of this repo.

# Testing

Testing can be completed using the `curl` command. 

On Linux, testing the login portion of the API can be done with:

```bash
$ curl -X POST -d "username=test&password=none" http://127.0.0.1:5000/api/auth/login
```