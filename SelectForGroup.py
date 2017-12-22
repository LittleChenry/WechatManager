#-*- coding: utf-8 -*-
import MySQLdb
import database1
import json
def SelectForGroup():
    conn = MySQLdb.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    cur2 = conn.cursor()
    sel1 = "select id,Name from groups"
    cur2.execute(sel1)
    results = cur2.fetchall()
    users = []
    for r in results:
        user = {}
        user['id'] = r[0]
        user['name'] = r[1]
        users.append(user)
    jsonStr = json.dumps(users)

    cur2.close()
    conn.close()
    return jsonStr