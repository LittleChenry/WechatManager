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
        sel1 = "delete from groups where manager_ID='%d'"% int(managerID[0])
        cur1.execute(sel1)
        for name in gname:
            ins="insert into groups (name,manager_ID) values('%s','%d')" % (name,int(managerID[0]))
            cur1.execute(ins)
        conn.commit()
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()
