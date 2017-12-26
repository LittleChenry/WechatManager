#-*- coding: utf-8 -*-
import mysql.connector
import database1

def addmessage(dic):
    conn = mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8mb4"
    )
    cur1 = conn.cursor()
    cur2 = conn.cursor()
    cur3 = conn.cursor()
    sel="select id from members where nickname='%s'" % dic['rename']
    cur1.execute(sel)
    memberid =cur1.fetchone()
    sel1 = "select min(id) from groups where name='%s'" % dic['gname']
    cur2.execute(sel1)
    groupid = cur2.fetchone()
    if dic['type']=='Sharing':
        url=dic['url']
    else:
        url=''
    if groupid==None:
        pass
    else:
        if memberid == None:
            inse = "insert into members (nickname,group_id)values('%s','%d')" % (dic['rename'], int(groupid[0]))
            cur1.execute(inse)
            sel = "select id from members where nickname='%s'" % dic['rename']
            cur1.execute(sel)
            memberid = cur1.fetchone()
        str="insert into message (Content,group_id,member_id,time,Type,url) values('%s','%d','%d','%s','%s','%s')"%(dic['info'], int(groupid[0]) ,int(memberid[0]), dic['time'],dic['type'],url)
        cur3.execute(str)
    cur1.close()
    cur2.close()
    cur3.close()
    conn.commit()
    conn.close()