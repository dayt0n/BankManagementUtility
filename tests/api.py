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
    print(r.json())
    logout(sess)


s = requests.Session()

list_users(s)
