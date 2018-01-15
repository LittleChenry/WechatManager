import mysql.connector
import database1

def readGname(name):
    conn = mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8",
        buffered = True
    )
    groupnames=[]
    try:
        cur1 = conn.cursor()
        sel1 = "select groups.name from groups,manager,group2manager where manager.Name='%s' and group2manager.manager_ID=manager.ID and groups.ID=group2manager.group_ID"% name
        cur1.execute(sel1)
        results = cur1.fetchall()
        groupnames=[]
        for r in results:
            gname=r[0]
            groupnames.append(gname)
        conn.commit()
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()
        return groupnames