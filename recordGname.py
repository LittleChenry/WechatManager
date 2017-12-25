import mysql.connector
import database1

def recordGname(gname):
    conn = mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    cur1 = conn.cursor()
    sel1 = "delete from groups "
    cur1.execute(sel1)
    for name in gname:
        ins="insert into groups (name) values('%s')" % (name)
        cur1.execute(ins)
    cur1.close()
    conn.commit()
    conn.close()
