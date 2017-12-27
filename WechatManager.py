from flask import Flask
from flask import send_file
from flask import request
import json
from threading import Lock
from flask import render_template
from MainChat import ChatRun
import threading
import base64
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
import time
from PIL import Image
from io import BytesIO
import os
from werkzeug.utils import secure_filename
from addmessage import *
from SelectForGroup import *
from messagelog import *
from recordGname import *
from datetime import datetime

app = Flask(__name__)

basepath = os.path.dirname(__file__)
async_mode = None
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()
chat = ChatRun(socketio)
def background_thread():
    global chat
    while True:
        if chat.hasNewMsg():
            m=chat.realSend()
            addmessage(m)
            buffer = BytesIO(chat.getheadpic(m['uid']))
            buffer2 = BytesIO()
            try:
                image = Image.open(buffer)
                image.save(buffer2, format="JPEG")
                img_str = base64.b64encode(buffer2.getvalue())
            except:
                img_str = ""
            listbase= chat.getgrouppic(m['gid'])
            dic = {}
            for k, v in m.items():
                dic[k] = v;
            dic['grouppic'] = listbase
            dic['pic'] = bytes.decode(img_str)
            socketio.emit('msg', dic, json=True,namespace='/test')


@socketio.on('connect', namespace='/test')
def sendNewMsg():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)
            #emit('msg', {'info': 'jy', 'name': '1', 'gname': '2'}, json=True)

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected', request.sid)

@app.route('/socket')
def tosocket():
    return render_template('sockettest.html',async_mode=socketio.async_mode)

@app.route('/ToIndex')
def toindex():
    return render_template('wechat.html',async_mode=socketio.async_mode)

@app.route('/')
def towechat():
    return send_file("templates/login.html")

@app.route('/logg/<gname>')
def tologg(gname):
    return render_template("messagelogging.html",gname=gname)
#
# @app.route('/shit')
# def hello_shit():
#     return 'hello shit'

@app.route('/postpara',methods=['POST'])
def post_para():
    name = request.form.get('name')
    print(name)
    print(request.form.get('age'))
    # return jsonify({'ok': True})
    return '123'


@app.route('/testpara/<name>')
def testpara(name):
    print(name)
    return ''

@app.route('/testtemplate')
def testtemplate():
    return render_template('user.html',name='shabi')


@app.route('/getQR', methods=["POST"])
def getQR():
    global chat
    t = threading.Thread(target=lambda: chat.run(), name="chat")
    t.start()
    while not chat.loginSuccess():
        pass
    return json.dumps({'success': True})

@app.route('/getGroupSelect', methods=["POST"])
def getGroupSelect():
    select=SelectForGroup()
    return select

@app.route('/login')
def toLogin():
    return send_file("templates/login.html")

@app.route('/update', methods=['POST'])
def updatepage():
    global chat
    buffer = BytesIO(chat.getMypic())
    buffer2 = BytesIO()
    try:
        image = Image.open(buffer)
        image.save(buffer2, format="JPEG")
        img_str = base64.b64encode(buffer2.getvalue())
    except:
        img_str = ""
    return json.dumps({'groups': chat.getAllGroup(), 'user': chat.getMyself(), 'userpic': bytes.decode(img_str), 'addKey': chat.getAddKey()})


@app.route('/test',methods=['POST'])
def test():
    global chat
    return chat.getmySelfID()

@app.route('/info', methods=['POST'])
def groupInfor():
    global chat
    str = request.form.get('message')
    group = request.form.getlist('groups[]')
    if len(group) == 0:
        group = None
    chat.group_information(str, group)
    return json.dumps({'success':True})

@app.route('/msglogging', methods=['POST'])
def msglogging1():
    begin = request.form.get('begin')
    end = request.form.get('end')
    groupid=request.form.get('group')
    msg=messagelog(begin,end,groupid)
    return msg

@app.route('/picture', methods=['POST'])
def groupPic():
    global chat
    group = request.form.getlist('groups')
    groups = group[0].split(',');
    file = request.files['image']
    if len(group) == 0:
        group = None
    if file:
        basepath = os.path.dirname(__file__)
        upload_path = os.path.join(basepath, 'static\\sendFile', secure_filename( time.strftime('%Y-%m-%d-%H-%M-%S', time.localtime(time.time()))+file.filename))
        file.save(upload_path)
        rpath = 'static\\sendFile' + secure_filename(time.strftime('%Y-%m-%d-%H-%M-%S', time.localtime(time.time())) + file.filename)
        chat.group_file(upload_path,rpath,group=groups)

        return json.dumps({'success': rpath})
    return json.dumps(({'success': False}))

@app.route('/p')
def stop():
    return send_file("templates/picture.html")

@app.route('/getGroupMember', methods=['POST'])
def getGroupMember():
    global chat
    group = request.form.get('groupID')
    return json.dumps(chat.getGroupMember(group))

@app.route('/getKeyWord', methods=['POST'])
def getKeyWord():
    global chat
    map = request.form.getlist('')
    return json.dumps({'success':True})

@app.route('/setDefault', methods=['POST'])
def setDefaultGroup():
    global chat
    namelist = request.form.getlist("groups[]")
    gname = []
    for item in namelist:
        name = chat.getGroupNameById(item)
        gname.append(name)
    manager=chat.getmySelfName()
    recordGname(gname,manager)
    chat.setNeedGroup(namelist)
    return json.dumps({'success':True})
@app.route('/addKeyWord', methods=['POST'])
def addKeyWord():
    global chat
    key = request.form.get('keyword')
    val = request.form.get('reply')
    chat.addKeyWordResponse({'key': key, 'val': val})
    return json.dumps({'success':True})

@app.route('/addAddkey', methods=['POST'])
def addAddkey():
    global char
    key = request.form.get('key')
    chat.addkeyadd(key)
    return json.dumps({"success": True})

@app.route('/deleteAddKey', methods=['POST'])
def deleteAddkey():
    global chat
    keys = request.form.getlist('keys[]')
    chat.deleteAddKey(*keys)
    return json.dumps({"success": True})

@app.route('/emoij', methods=["POST"])
def getemoij():
    list=[]
    for root, dirs, files in os.walk(basepath+"/static/img/emoij/guanfang"):
        for file in files:
            if os.path.splitext(file)[1] == '.jpeg' or '.gif' or '.png':
                list.append("/static/img/emoij/"+"guanfang"+"/"+file)
    return json.dumps({'list':list})

@app.route('/emoijtitle', methods=["POST"])
def getemoijtitle():
    list=[]
    jsonlist={}
    for root, dirs, files in os.walk(basepath+"/static/img/emoij"):
        for file in dirs:
            list.append(file)
    jsonlist["titlelist"]=list
    return json.dumps(jsonlist)

@app.route('/emoijone', methods=["POST"])
def getemoijone():
    list = []
    id=request.form.get("id")
    for root, dirs, files in os.walk(basepath+"/static/img/emoij/"+id):
        for file in files:
            if os.path.splitext(file)[1] == '.jpeg' or '.gif' or '.png':
                list.append("static/img/emoij/"+id+"/"+file)
    return json.dumps({'list': list})

@app.route('/impemoij', methods=["POST"])
def importemoij():
    list = []
    id="shoucang"
    lenth = int(request.form.get("length"))
    for i in range(0,lenth):
        file = request.files['importlist'+str(i)]
        # print(id);
        filename = file.filename.split('.')[0] + '_new.' + file.filename.split('.')[-1]
        if os.path.exists(basepath+"/static/img/emoij/"+id):
              file.save(basepath+"/static/img/emoij/"+id+"/"+datetime.now().date().strftime('%Y%m%d%H%M')+filename)
        else:
            os.makedirs(basepath+"/static/img/emoij/"+id)
            file.save(basepath+"/static/img/emoij/" + id + "/" + datetime.now().date().strftime('%Y%m%d%H%M') + filename)
    return "success"

@app.route('/sendemoij', methods=['POST'])
def groupemoij():
    global chat
    group = request.form.getlist("groups[]")
    filepath=request.form.get("message");
    filepath=basepath+ '/' + filepath;
    if len(group) == 0:
        group = None
    rpath = filepath
    chat.group_file(filepath,request.form.get("message"),group=group)
    return json.dumps({'success': request.form.get("message")})

@app.route('/sendguangfangemoij', methods=['POST'])
def groupguangfangemoij():
    global chat
    str = request.form.get('message')
    src= request.form.get('src')
    group = request.form.getlist('groups[]')
    if len(group) == 0:
        group = None
    chat.group_information(str, group)
    return json.dumps({'success': src})

@app.route('/addemoij', methods=['POST'])
def addemoij():
    global chat
    str = request.form.get('message')
    filename=str.split("/");
    with open(basepath+"/"+str,'rb') as f:
         s=f.read()
    with open(basepath+"/static/img/emoij/shoucang/"+datetime.now().date().strftime('%Y%m%d%H%M')+filename[len(filename)-1], 'wb') as f:
         f.write(s)
    return json.dumps({'success': "success"})


if __name__ == '__main__':
    #app.run(debug=True)
    socketio.run(app=app,debug=True)
