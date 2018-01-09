#-*- coding: utf-8 -*-
import mysql.connector
import database1
import json
import time
import datetime
def messagelog(beg,end,group):
    conn =  mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    jsonStr =''
    try:
        cur2 = conn.cursor()
        sel="select min(ID) from groups where name='%s'"% group
        cur2.execute(sel)
        groupid=cur2.fetchone()
        if len(end)<13:
            end=end+' 23:59:59'
        sel1 = "select distinct message.content,message.Time,members.NickName,message.type,message.url from message,members where message.time>='%s' and message.time<='%s' and message.group_ID='%d' and message.member_ID=members.ID order by message.time desc"%(beg,end,int(groupid[0]))
        cur2.execute(sel1)
        results = cur2.fetchall()

        users = []
        for r in results:
            user = {}
            user['content'] = r[0]
            user['Time'] = r[1].strftime("%Y-%m-%d %H:%M:%S")
            user['NickName'] = r[2]
            user['type'] = r[3]
            user['url'] = r[4]
            users.append(user)
        jsonStr = json.dumps(users)

    except Exception as e:
        pass
    finally:
        cur2.close()
        conn.close()
        return jsonStr