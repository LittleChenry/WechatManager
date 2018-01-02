import mysql.connector
import database1

def recordtemplate(word,name):
    conn = mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    try:
        cur1 = conn.cursor()
        sel="select ID from members where NickName='%s'" % name
        cur1.execute(sel)
        memberid = cur1.fetchone()
        ins="insert into template (message,manager_ID) values('%s','%s')" % (word,int(memberid[0]))
        cur1.execute(ins)
        conn.commit()
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()

def readtemplate(name):
    conn = mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    template=[]
    try:
        cur1 = conn.cursor()
        sel = "select ID from members where NickName='%s'" % name
        cur1.execute(sel)
        memberid = cur1.fetchone()
        ins="select message from template where manager_ID='%s' "% int(memberid[0])
        cur1.execute(ins)
        results = cur1.fetchall()
        template = []
        for r in results:
            badin = r[0]
            template.append(badin)
        conn.commit()
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()
        return template

def deletetemplate(words,name):
    conn = mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    try:
        cur1 = conn.cursor()
        sel = "select ID from members where NickName='%s'" % name
        cur1.execute(sel)
        memberid = cur1.fetchone()
        ins="delete from template where message='%s' and manager_ID ='%s'"% (words,int(memberid[0]))
        cur1.execute(ins)
        conn.commit()
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()