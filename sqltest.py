import mysql.connector

conn = mysql.connector.connect(user='root', password='123456', database='wechat', use_unicode=True)
cursor = conn.cursor()
cursor.execute('SELECT * FROM user')
values = cursor.fetchall()
print values
cursor.close()
conn.close()