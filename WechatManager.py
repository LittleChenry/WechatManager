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
import StringIO
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
chat = ChatRun()

async_mode = None
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()

def background_thread():
    global chat
    while True:
        if chat.hasNewMsg():
            print 'send'
            m=chat.realSend()
            buffer = StringIO.StringIO(chat.getheadpic(m['uid']))
            buffer2 = StringIO.StringIO()
            try:
                image = Image.open(buffer)
                image.save(buffer2, format="JPEG")
                img_str = base64.b64encode(buffer2.getvalue())
            except:
                 img_str="";
            listbase= chat.getgrouppic(m['gid'])
            dic = {}
            for k, v in m.iteritems():
                dic[k] = v;
            dic['grouppic'] = listbase
            dic['pic'] = img_str
            socketio.emit('msg', dic, json=True,namespace='/test')


@socketio.on('myconnect',namespace='/test')
def conncet(msg):
    print msg
'''
@socketio.on('send',namespace='/test')
def send(msg):
    print msg
    emit('response',{'data': msg['data']})
'''
@socketio.on('send', namespace='/test')
def connect():
    print 'success'

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

@app.route('/login')
def toLogin():
    return send_file("templates/login.html")

@app.route('/update', methods=['POST'])
def updatepage():
    global chat
    buffer = StringIO.StringIO(chat.getMypic())
    buffer2 = StringIO.StringIO()
    try:
        image = Image.open(buffer)
        image.save(buffer2, format="JPEG")
        img_str = base64.b64encode(buffer2.getvalue())
    except:
        img_str=""
    return json.dumps({'groups': chat.getAllGroup(), 'user': chat.getMyself(), 'userpic': img_str})

@app.route('/test',methods=['POST'])
def test():
    global chat
    return chat.getmySelfID()

@app.route('/info', methods=['POST'])
def groupInfor():
    global chat
    str = request.form.get('message')
    group = request.form.getlist('groups[]')
    print group, type(group)
    if len(group) == 0:
        group = None
    chat.group_information(str, group)
    return json.dumps({'success':True})

@app.route('/picture', methods=['POST'])
def groupPic():
    global chat
    print 'picture success'
    group = request.form.getlist('groups')
    file = request.files['image']
    if len(group) == 0:
        group = None
    if file:
        basepath = os.path.dirname(__file__)
        upload_path = os.path.join(basepath, 'static\\sendFile', secure_filename( time.strftime('%Y-%m-%d-%H-%M-%S', time.localtime(time.time()))+file.filename))
        file.save(upload_path)
        print upload_path
        chat.group_file(upload_path, group=group)
        rpath = 'static\\sendFile' + secure_filename( time.strftime('%Y-%m-%d-%H-%M-%S', time.localtime(time.time()))+file.filename)
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
    print 'default'
    namelist = request.form.getlist("groups[]")
    chat.setNeedGroup(namelist)
    return json.dumps({'success':True})
@app.route('/addKeyWord', methods=['POST'])
def addKeyWord():
    global chat
    key = request.form.get('keyword')
    val = request.form.get('reply')
    chat.addKeyWordResponse({'key': key, 'val': val})
    return json.dumps({'success':True})

if __name__ == '__main__':
    #app.run(debug=True)
    socketio.run(app=app,debug=True)
