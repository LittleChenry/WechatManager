import mysql.connector
import database1

def recordGname(gname,manager):
    conn = mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    try:
        cur2 = conn.cursor()
        cur1 = conn.cursor()

        sel = "select ID from members where NickName='%s'"% manager
        cur1.execute(sel)
        managerID=cur1.fetchone()
        if managerID==None:
            inse="insert into members (nickname) values('%s')"% manager
            cur2.execute(inse)
            cur1.execute(sel)
            managerID = cur1.fetchone()
        sel = "select ID from manager where Name='%s'" % manager
        cur1.execute(sel)
        manID = cur1.fetchone()
        if manID == None:
            inse = "insert into manager (name,member_ID) values('%s','%s')" % (manager,int(managerID[0]))
            cur2.execute(inse)
            cur1.execute(sel)
            manID = cur1.fetchone()
        sel1 = "delete from group2manager where manager_ID='%s'"% int(manID[0])
        cur1.execute(sel1)
        for name in gname:
            sel = "select ID from groups where Name='%s'" % name
            cur1.execute(sel)
            ID = cur1.fetchone()
            if ID == None:
                inse = "insert into groups (name) values('%s')" % name
                cur2.execute(inse)
                cur1.execute(sel)
                ID = cur1.fetchone()
            ins="insert into group2manager (group_ID,manager_ID) values('%s','%s')" % (int(ID[0]),int(manID[0]))
            cur1.execute(ins)
        conn.commit()
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()
