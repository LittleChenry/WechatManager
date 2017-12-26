import mysql.connector
import database1

def readGname(name):
    conn = mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    cur1 = conn.cursor()
    sel1 = "select name from groups,members where members.NickName='%s' and groups.manager_ID=members.ID"% name
    cur1.execute(sel1)
    results = cur1.fetchall()
    groupnames=[]
    for r in results:
        gname=r[0]
        groupnames.append(gname)
    return groupnames
    cur1.close()
    conn.commit()
    conn.close()
