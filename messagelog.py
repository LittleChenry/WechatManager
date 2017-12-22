#-*- coding: utf-8 -*-
import MySQLdb
import database1
import json
import time
def messagelog(beg,end,group):
    conn = MySQLdb.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    cur2 = conn.cursor()
    print beg,end,group
    sel1 = "select message.content,message.Time,members.NickName,message.type from message,members where message.time>='%s' and message.time<='%s' and message.group_ID='%d' and message.member_ID=members.ID"%(beg,end,int(group))
    cur2.execute(sel1)
    results = cur2.fetchall()

    users = []
    for r in results:
        user = {}
        user['content'] = r[0]
        user['Time'] = r[1].strftime("%Y-%m-%d %H:%M:%S")
        user['NickName'] = r[2]
        user['type'] = r[3]
        users.append(user)
    jsonStr = json.dumps(users)
    cur2.close()
    conn.close()
    return jsonStr