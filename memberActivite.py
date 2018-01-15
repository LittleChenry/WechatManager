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
        charset="utf8",
        buffered = True
    )
    activite3 = []
    try:
        cur1 = conn.cursor()
        list1 = []
        list2 = []
        list3 = []

        sel1="select distinct member_ID,content,time,group_ID from message,groups where group_ID=groups.ID and groups.name='%s'" % gname
        cur1.execute(sel1)
        results = cur1.fetchall()
        for r in results:
            list1.append(r[0])
        l1 = {}.fromkeys(list1).keys()


        DayAgo = (datetime.datetime.now() - datetime.timedelta(days=7))#minutes=10
        DayAgo = DayAgo.strftime("%Y-%m-%d %H:%M:%S")
        sel1 = "select distinct member_ID,content,time,group_ID from message,groups where group_ID=groups.ID and groups.name='%s' and message.Time >= '%s'" % (gname,DayAgo)
        cur1.execute(sel1)
        results = cur1.fetchall()
        for r in results:
            list2.append(r[0])
        l2 = {}.fromkeys(list2).keys()

        DayAgo = (datetime.datetime.now() - datetime.timedelta(days=30))#minutes=15
        DayAgo = DayAgo.strftime("%Y-%m-%d %H:%M:%S") 
        sel1 = "select distinct member_ID,content,time,group_ID from message,groups where group_ID=groups.ID and groups.name='%s' and message.Time >= '%s'" % (
        gname, DayAgo)
        cur1.execute(sel1)
        results = cur1.fetchall()
        for r in results:
            list3.append(r[0])
        l3 = {}.fromkeys(list3).keys()
        for l in l1:
            count1 = list1.count(l)
            count2 = list2.count(l)
            count3 = list3.count(l)
            sel11 = "select NickName from members where ID='%s'" % l
            cur1.execute(sel11)
            name = cur1.fetchone()
            item1 = {}
            item1['name'] = name[0]
            item1['allcount'] = count1
            item1['monthcount'] = count3
            item1['weekcount'] = count2
            activite3.append(item1)
        conn.commit()
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()
        return activite3