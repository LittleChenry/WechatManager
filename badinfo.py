import mysql.connector
import database1

def recordbadinfo(word):
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
        ins="insert into badinfo (Content) values('%s')" % (word)
        cur1.execute(ins)
        conn.commit()
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()

def readbadinfo():
    conn = mysql.connector.connect(
        host=database1.host,
        port=database1.port,
        user=database1.user,
        passwd=database1.passwd,
        db=database1.db,
        charset="utf8"
    )
    badinfo=[]
    try:
        cur1 = conn.cursor()
        ins="select Content from badinfo "
        cur1.execute(ins)
        results = cur1.fetchall()
        badinfo = []
        for r in results:
            badin = r[0]
            badinfo.append(badin)
        conn.commit()
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()
        return badinfo

def deletebadinfo(words):
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
        ins="delete from badinfo where content='%s'"%words
        cur1.execute(ins)
        conn.commit()
    except Exception as e:
        pass
    finally:
        cur1.close()
        conn.close()