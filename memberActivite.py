import mysql.connector
import database1
import datetime
import json
import time
def getactivite(gname):
    conn = mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    activite = {}
    try:
        cur1 = conn.cursor()
        list1 = []
        list2 = []
        list3 = []
        activite3 = []
        activite1 = []
        activite2 = []
        sel1="select member_ID from message,groups where group_ID=groups.ID and groups.name='%s'" % gname
        cur1.execute(sel1)
        results = cur1.fetchall()
        for r in results:
            list1.append(r[0])
        l1 = {}.fromkeys(list1).keys()
        for l in l1:
            count=list1.count(l)
            sel11="select NickName from members where ID='%s'"% l
            cur1.execute(sel11)
            name = cur1.fetchone()
            item={}
            item['name']=name[0]
            item['count']=count
            activite1.append(item)

        DayAgo = (datetime.datetime.now() - datetime.timedelta(minutes=10))#days=7
        DayAgo = DayAgo.strftime("%Y-%m-%d %H:%M:%S")
        sel1 = "select member_ID from message,groups where group_ID=groups.ID and groups.name='%s' and message.Time >= '%s'" % (gname,DayAgo)
        cur1.execute(sel1)
        results = cur1.fetchall()
        for r in results:
            list2.append(r[0])
        l1 = {}.fromkeys(list2).keys()
        for l in l1:
            count = list2.count(l)
            sel11 = "select NickName from members where ID='%s'" % l
            cur1.execute(sel11)
            name = cur1.fetchone()
            item1 = {}
            item1['name'] = name[0]
            item1['count'] = count
            activite2.append(item1)
        DayAgo = (datetime.datetime.now() - datetime.timedelta(minutes=15))#days=30
        DayAgo = DayAgo.strftime("%Y-%m-%d %H:%M:%S")
        sel1 = "select member_ID from message,groups where group_ID=groups.ID and groups.name='%s' and message.Time >= '%s'" % (
        gname, DayAgo)
        cur1.execute(sel1)
        results = cur1.fetchall()
        for r in results:
            list3.append(r[0])
        l1 = {}.fromkeys(list3).keys()
        for l in l1:
            count = list3.count(l)
            sel11 = "select NickName from members where ID='%s'" % l
            cur1.execute(sel11)
            name = cur1.fetchone()
            item1 = {}
            item1['name'] = name[0]
            item1['count'] = count
            activite3.append(item1)
        conn.commit()
        activite['all']=activite1
        activite['week'] = activite2
        activite['month'] = activite3
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()
        return json.dumps(activite)