import arrow
import requests

url = 'http://bmu.local'

# i'm so sorry
with open('tests/creds.txt', 'r') as fp:
    for line in fp.readlines():
        data = line.strip().split(':')
        globals()[data[0]+"Username"] = data[1]
        globals()[data[0]+"Password"] = data[2]


def logout(sess: requests.Session):
    sess.cookies.clear()


# users = "normal", "teller", "admin"
def login(sess: requests.Session, user="normal"):
    logout(sess)
    username = globals()[user+"Username"]  # once again, so sorry
    password = globals()[user+"Password"]
    r = sess.post(url+"/api/auth/login",
                  json={"username": username, "password": password})
    resp = dict(r.json())
    sess.cookies.set("session", resp['data']
                     ['token'], domain=url.split('//', 1)[1])
    r = sess.get(url+"/api/auth/check")
    assert r.status_code == 200


def user_info(sess: requests.Session):
    login(sess, user="admin")
    r = sess.get(url+"/api/user/info/a")
    print(r.json())
    assert r.status_code == 200
    logout(sess)


def create_account(sess: requests.Session):
    login(sess, user="teller")
    # r = sess.post(url+"/api/money/account/create",
    #              json={"username": "a", "type": "savings", "name": "a's savings"})
    # print(r.text)
    # r = sess.post(url+"/api/money/account/create",
    #              json={"username": "a", "type": "checking", "name": "a's checking"})
    # loanTerm = 15  # 15 years
    # r = sess.post(url+"/api/money/account/create",
    #              json={"username": "a", "type": "mortgage", "name": "a's first house mortgage", "loanAmount": 200000.0, "startDate": arrow.utcnow().isoformat(), "term": loanTerm})
    # print(r.text)
    # r = sess.post(url+"/api/money/account/create",
    #              json={"username": "a", "type": "creditCard", "name": "a's first credit card"})
    # print(r.text)
    # r = sess.post(url+"/api/money/account/create",
    #              json={"username": "a", "type": "moneyMarket", "name": "a's first money market account", "balanceFrom": bleh, "balance": 500.0})
    frm = 123456791  # savings account for 'a'
    r = sess.post(url+"/api/money/account/create", json={"username": "a", "type": "moneyMarket",
                  "name": "a's first money market account", "balanceFrom": frm, "balance": 500.0})
    print(r.text)
    logout(sess)


def list_accounts(sess: requests.Session, user):
    login(sess, user="admin")
    r = sess.get(url+f"/api/user/accounts/{user}")
    print(r.text)
    logout(sess)


def deposit(sess: requests.Session):
    login(sess, user="admin")
    r = sess.post(url+"/api/money/move/deposit/123456801",
                  json={"amount": "554.60"})
    print(r.json())
    logout(sess)


def withdraw(sess: requests.Session):
    login(sess, user='admin')
    r = sess.post(url+'/api/money/move/withdraw/123456793',
                  json={"amount": "554.60"})
    print(r.json())
    logout(sess)


def transfer(sess: requests.Session):
    login(sess, user='admin')
    r = sess.post(url+'/api/money/move/transfer',
                  json={"amount": "554.60", 'to': 123456793, 'from': 123456801})
    print(r.json())
    logout(sess)


def changeRole(sess: requests.Session):
    login(sess, user='admin')
    r = sess.get(url+'/api/user/changeRole/a/customer')
    print(r.text)
    logout(sess)


def history(sess: requests.Session, num):
    login(sess, user='admin')
    r = sess.get(url+f'/api/money/account/history/{num}')
    print(r.text)
    logout(sess)


def list_users(sess: requests.Session):
    login(sess, user="normal")
    r = sess.get(url+"/api/user/list")
    assert r.status_code == 403
    login(sess, user="admin")
    r = sess.get(url+"/api/user/list")
    assert r.status_code == 200
    login(sess, user="teller")
    r = sess.get(url+"/api/user/list")
    assert r.status_code == 200
    logout(sess)


def delete_account(sess: requests.Session, accountNum):
    login(sess, user='admin')
    r = sess.get(url+f"/api/money/account/delete/{accountNum}")
    print(r.json())
    logout(sess)


s = requests.Session()

user_info(s)
# list_users(s)
# create_account(s)
list_accounts(s, "a")
"""
deposit(s)
list_accounts(s, "a")
transfer(s)
list_accounts(s, "a")
withdraw(s)
list_accounts(s, "a")
history(s, 123456793)
history(s, 123456801)
"""
#delete_account(s, 123456792)
# changeRole(s)
