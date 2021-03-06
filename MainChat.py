#! /usr/bin/python
#-*- coding: utf-8 -*-
#coding=utf8

import itchat
import time
from itchat.content import *
import base64
import os
import itchat.config
import types
import random
import re
from addmessage import *
from readGname import *
from badinfo import *
picDir = '/Users/apple/Documents/mavenProject/WechatManager/static/qr/QR.png'

class ChatRun(object):
    def __init__(self,socketio, *args, **kw):
        self.__friends = []
        self.socketio=socketio
        # 获取自己
        self.__mySelf = {}

        # 获取所有群
        self.__groups = []

        # @回复内容
        self.__atContent = ''

        # 关键字回复字典
        self.__keyWordReponse = {}

        # 关键字广告检测
        self.__keywordAdd=[]

        # 待管理的群
        self.__needGroups = []
        self.__gid = []

        # 二维码
        self.__fileQr = None
        self.__QR = ''
        self.__QrTrue = False

        # 登录成功
        self.__successLogin = False

        # 收到消息数量
        self.__newMsgCount = 0
        # 新消息缓存
        self.__newMsgList = []

    def run(self):
        itchat.login(self.socketio)
        #itchat.auto_login(enableCmdQR=True)

        self.__friends = itchat.get_friends(update=True)[0:]

        #获取自己
        self.__mySelf = self.__friends[0]

        # 获取所有群
        self.__groups = itchat.get_chatrooms()

        # @回复内容
        self.__atContent = ''

        # 关键字回复字典
        self.__keyWordReponse = {}

        # 待管理的群
        self.setNeedGroupByName(readGname(self.__mySelf['NickName']))

        # 广告关键字
        self.setAddKey()

        #gid
        self.updateGid()
        # for gs in self.__groups:
        #    print gs['NickName']
        # print itchat.search_chatrooms(u'项目测试')

        # 群处理
        # 文本
        @itchat.msg_register([TEXT, MAP, CARD, NOTE, SHARING], isGroupChat=True)
        def reply_group(msg):
            memberList = itchat.update_chatroom(msg['FromUserName'], detailedMember=True)
            realNickName=""
            #print("memberList: ", memberList.get('MemberList',[]))
            for member in memberList.get('MemberList',[]):
                if msg['ActualUserName'] == member.get('UserName'):
                    realNickName = member.get('NickName')
                    break
            #print("realName:", realNickName)
            if self.getmySelfID() == msg['FromUserName']:
                if msg['Type'] == 'Sharing':
                    self.sendMsg(msg['Text'], self.getmySelfName(), self.getGroupNameById(msg['ToUserName']),
                                 time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])), self.getmySelfID(),
                                 msg['ToUserName'], msg['Type'], url = msg['Url'],rename=self.getmySelfName())
                else:
                    self.sendMsg(msg['Text'], self.getmySelfName(), self.getGroupNameById(msg['ToUserName']),time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(msg['CreateTime'])), msg['FromUserName'],msg['ToUserName'],msg['Type'],rename=self.getmySelfName())


            self.updateGid()
            gid = self.__gid
            #print 'need:',self.__needGroups, 'gid:', len(gid)
            # print gid

            for gs in gid:
                if msg['FromUserName'] in gs:
                    text = msg['Text']
                    if msg['Type'] is "Note":
                        who = ''
                        invite1 = re.compile(r'^\w+ invited (\S*) to the group chat$')
                        m = invite1.match(text)
                        invite2 = re.compile(r'^"?([^"]*)"? joined the group chat via the QR Code shared by "?\S*"?.$')
                        m2 = invite2.match(text)
                        invite3 = re.compile(u'^"?\S*"?邀请"?([^"]*)"?加入了群聊 *$')
                        m3 = invite3.match(text)
                        invite4 = re.compile(u'^"?([^"]*)"?通过扫描"?\S*"?分享的二维码加入群聊( )*( 撤销)?$')
                        m4 = invite4.match(text)
                        if m:
                            itchat.send(u"欢迎" + m.group(1) + u"加入本群 @" + m.group(1), msg['FromUserName'])
                        elif m2:
                            itchat.send(u"欢迎" + m2.group(1) + u"加入本群 @" + m2.group(1), msg['FromUserName'])
                        elif m3:
                            itchat.send(u"欢迎" + m3.group(1) + u"加入本群 @" + m3.group(1), msg['FromUserName'])
                        elif m4:
                            itchat.send(u"欢迎" + m4.group(1) + u"加入本群 @" + m4.group(1), msg['FromUserName'])

                    flag = False
                    if not self.getmySelfID() == msg['FromUserName']:
                        infomation = msg['Text']
                        phone1 = re.compile(
                            r'([\S\s])*((\+86)|(86))?([^\d]{0,5})?(\d[^\d]{0,5}){11}([^\d]|\b)([\S\s])*')
                        phone2 = re.compile(r'([\S\s])*(\d[^\d]{0,5}){8,10}([^\d]|\b)([\S\s])*')
                        link = re.compile(
                            r'([\S\s])*((http|ftp|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?')

                        if msg['Type'] == 'Card':
                            flag = True
                            self.sendMsg(infomation.get('NickName'), msg['ActualNickName'], gs[msg['FromUserName']],
                                         time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])),
                                         msg['ActualUserName'],
                                         msg['FromUserName'], msg['Type'], rename=realNickName, addType='card')
                        elif link.match(infomation):
                            flag=True
                            self.sendMsg(infomation, msg['ActualNickName'], gs[msg['FromUserName']],
                                         time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])),
                                         msg['ActualUserName'],
                                         msg['FromUserName'], msg['Type'], rename=realNickName,addType='link')
                        elif phone1.match(infomation) or phone2.match(infomation):
                            flag = True
                            self.sendMsg(infomation, msg['ActualNickName'], gs[msg['FromUserName']],
                                         time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])),
                                         msg['ActualUserName'],
                                         msg['FromUserName'], msg['Type'], rename=realNickName, addType='phone')
                        elif msg['Type'] == 'Sharing':
                            flag = True
                            if infomation == '':
                                infomation = u'不支持预览，请在手机上查看。'
                            self.sendMsg(infomation, msg['ActualNickName'], self.getGroupNameById(msg['FromUserName']),
                                         time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])),
                                         msg['ActualUserName'],
                                         msg['FromUserName'], msg['Type'], url=msg['Url'], rename=realNickName, addType='sharing')
                        else:
                            for key in self.__keywordAdd:
                                if infomation.find(key) > -1:
                                    flag=True
                                    self.sendMsg(infomation, msg['ActualNickName'], gs[msg['FromUserName']],
                                                 time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])),
                                                 msg['ActualUserName'],
                                                 msg['FromUserName'], msg['Type'], rename=realNickName, addType='keyword', addkeyword=key)
                                    break;

                    if not flag:
                        text = msg['Text']
                        self.sendMsg(text,msg['ActualNickName'],gs[msg['FromUserName']], time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(msg['CreateTime'])), msg['ActualUserName'],msg['FromUserName'],msg['Type'],rename=realNickName)
                        # print msg, 'type:', type(msg),'\n'
                        if msg['isAt']:
                            gName = gs[msg['FromUserName']]
                            self.saveText(text, gName, msg['ActualNickName'])
                        for key in self.__keyWordReponse:
                            if text.find(key) > -1:
                                time.sleep(3)
                                value = self.__keyWordReponse[key]
                                if not value == 'auto':
                                    itchat.send('%s @%s ' % (self.__keyWordReponse[key], msg['ActualNickName']),
                                                msg['FromUserName'])
                                    self.sendMsg(self.__keyWordReponse[key], self.__mySelf['NickName'],
                                                 gs[msg['FromUserName']],
                                                 time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])),
                                                 self.__mySelf['UserName'], msg['FromUserName'], msg['Type'],
                                                 rename=self.__mySelf['NickName'])

                                else:
                                    itchat.send(u'收到消息: %s @%s ' % (text, msg['ActualNickName']), msg['FromUserName'])
                                    self.sendMsg(text, self.__mySelf['NickName'],
                                                 gs[msg['FromUserName']],
                                                 time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])),
                                                 self.__mySelf['UserName'], msg['FromUserName'], msg['Type'],
                                                 rename=self.__mySelf['NickName'])
                                break
                            elif msg['isAt']:
                                time.sleep(3)
                                itchat.send(self.__atContent, msg['FromUserName'])
                                break
                        break

        @itchat.msg_register([PICTURE,RECORDING,ATTACHMENT,VIDEO], isGroupChat=True)
        def reply_files(msg):
            memberList = itchat.update_chatroom(msg['FromUserName'], detailedMember=True)
            realNickName = ""
            for member in memberList.get('MemberList', []):
                if msg['ActualUserName'] == member.get('UserName'):
                    realNickName = member.get('NickName')
                    break
            basepath = os.path.dirname(__file__)
            ran = (int)(time.time()) + random.randint(0,(int)(time.time() / 10000))
            upload_path = os.path.join(basepath, 'static/picture',(str)(ran)+"-"+msg['FileName'])
            print(upload_path)
            msg['Text'](upload_path)
            fsize = os.path.getsize(upload_path)
            if self.getmySelfID() == msg['FromUserName']:
                if not fsize==0:
                    self.sendMsg('static/picture/'+(str)(ran) + "-" + msg['FileName'], self.getmySelfName(), self.getGroupNameById(msg['ToUserName']),time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(msg['CreateTime'])), msg['FromUserName'],msg['ToUserName'],msg['Type'],rename=self.getmySelfName())
                else:
                    self.sendMsg('static/img/nonepic.jpg', self.getmySelfName(),
                                 self.getGroupNameById(msg['ToUserName']),
                                 time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])), msg['FromUserName'],
                                 msg['ToUserName'], msg['Type'], rename=self.getmySelfName())
            self.updateGid()
            gid = self.__gid

            for gs in gid:
                if msg['FromUserName'] in gs:
                    text = 'static/picture/'+(str)(ran) + "-" + msg['FileName']
                    if msg['Type'] == 'Video':
                        self.sendMsg(text, msg['ActualNickName'], gs[msg['FromUserName']],
                                     time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])),
                                     msg['ActualUserName'],
                                     msg['FromUserName'], msg['Type'], rename=realNickName, addType='Viedo')
                    else:
                        if not fsize == 0:
                            self.sendMsg(text, msg['ActualNickName'], gs[msg['FromUserName']],
                                         time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])), msg['ActualUserName'],
                                     msg['FromUserName'],msg['Type'],rename=realNickName)
                        else:
                            self.sendMsg('static/img/nonepic.jpg', msg['ActualNickName'], gs[msg['FromUserName']],
                                         time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(msg['CreateTime'])), msg['ActualUserName'],
                                     msg['FromUserName'],msg['Type'],rename=realNickName)
                    break

        #其他处理
        self.__successLogin = True
        self.socketio.emit('loginsuccess', {'nickname': self.__mySelf['NickName'], 'pic': bytes.decode(base64.b64encode(self.getMypic()))},json=True, namespace='/login')
        itchat.run()
    # 保存群中@自己的文本
    # @param text 待保存的文本
    # @param group 来自的群的名字
    # @param user 发送者的NickName
    def saveText(self, text, group, user):
        now = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        str = u'%s 收到来自于群%s中用户%s的@消息: %s' % (now[5:], group, user, text)
    # 设置关键回复字字典
    def setKeyWordResponse(self, map):
        self.__keyWordReponse = map
    # 新增关键回复字及其内容
    def addKeyWordResponse(self, map):
        key = map['key']
        val = map['val']
        self.__keyWordReponse[key] = val
    # 删除指定关键回复字
    def deleteKeyWordResponse(self, *args):
        for k in args:
            if k in self.__keyWordReponse:
                self.__keyWordReponse.pop(k)
    # 获取关键字字典
    def getKeyWorkMap(self):
        return self.__keyWordReponse
    # 获取自身全部信息
    def getMyself(self):
        return self.__mySelf

    # 获取自身ID
    def getmySelfID(self):
        return self.__mySelf['UserName']

    # 获取自身NickName
    def getmySelfName(self):
        return self.__mySelf['NickName']

    # 获取自身头像
    def getMypic(self):
        return itchat.get_head_img(userName=self.__mySelf['UserName'])
    #获取对话头像
    def getheadpic(self,ID,GID):
        return itchat.get_head_img(userName=ID,chatroomUserName=GID)

    #获取群头像
    def getgrouppic(self,gid):
        list2 = []
        # img = itchat.get_head_img(x['UserName'])
        img = itchat.get_head_img(chatroomUserName=gid)
        try:
            # buffer = BytesIO(img)
            # buffer2 = BytesIO()
            # image = Image.open(buffer)
            # image.save(buffer2, format="JPEG")
            img_str = base64.b64encode(img)
            img_str=bytes.decode(img_str)
        except:
            img_str=""
        return img_str


    # 跟新需要管理的群的GroupId
    def updateGid(self):
        self.__gid = []
        self.updateGroup()
        for group in self.__groups:
            if group['UserName'] in self.__needGroups:
                self.__gid.append({group['UserName']: group['NickName']})

    def updateGroup(self):
        self.__groups = []
        self.__groups = itchat.get_chatrooms(update=True)

    # 根据NickName获取群ID
    def getGroupIdByName(self,name):
        for group in self.__groups:
            if name == group['NickName']:
                return group['UserName']

    # 根据id获取群名
    def getGroupNameById(self,id):
        self.updateGroup()
        for group in self.__groups:
            if id == group['UserName']:
                return group['NickName']

    # 群发消息
    # @param info 消息
    # @param group 需要发送的群，默认为None，如果为None则向所有管理的群发送
    def group_information(self, info, group = None):
        if group == None:
            list = self.__gid
            group = []
            for l in list:
                for x in l:
                    group.append(x)
        if len(group) == 1:
            itchat.send(info, group[0])
        else:
            for g in group:
                ran = random.randint(2,7)
                time.sleep(3 + ran)
                itchat.send(info, g)
        for gi in group:
            gname=self.getGroupNameById(gi)
            if gname==None:
                continue
            else:
                msg={}
                msg['info']=info
                msg['rename']=self.__mySelf['NickName']
                msg['gname']=gname
                msg['time']=time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
                msg['type']='Text'
                addmessage(msg)
    # 更新群
    def updateGroup(self):
        self.__groups = itchat.get_chatrooms()

    # 获取所有群的成员列表
    def getAllGroupMember(self):
        list = []
        for x in self.__groups:
            memberList = itchat.update_chatroom(x['UserName'], detailedMember=True)
            list.append({'name': x['NickName'], 'id': x['UserName'], 'memberList': memberList})
        return list

    # 获取所有群名称
    def getAllGroup(self):
        self.updateGroup()
        list = []
        for x in self.__groups:
            img = itchat.get_head_img(chatroomUserName=x['UserName'])
            try:
                # buffer = BytesIO(img)
                # buffer2 = BytesIO()
                # image = Image.open(buffer)
                # image.save(buffer2, format="JPEG")
                img_str = base64.b64encode(img)
                img_str=bytes.decode(img_str)
            except:
                img_str=""
            list.append({'name': x['NickName'], 'id': x['UserName'], 'need': x['UserName'] in self.__needGroups,'grouppic':img_str})
        return list

    # 获取指定群所有成员
    def getGroupMemberInner(self, group):
        memberList = itchat.update_chatroom(group, detailedMember=True)
        return memberList

    # 将群成员封装成所需对象
    def getGroupMember(self, group):
        memberlist = self.getGroupMemberInner(group)
        list = []
        for member in memberlist['MemberList']:
            list.append({'id': member['UserName'], 'name': member['NickName']})
        return list

    # 获取QR
    def getQR(self):
        while(not self.__QrTrue):
            pass
            with open(self.__fileQr, 'wb') as f:
                self.__QR = base64.urlsafe_b64encode(f.read())
        return self.__QR

    def setfileQr(self, f):
        self.__fileQr = f

    def setQrTrue(self, b):
        self.__QrTrue = b

    def loginSuccess(self):
        return self.__successLogin

    def setNeedGroup(self,idlist):
        self.__needGroups = idlist
    def setNeedGroupByName(self,namelist):
        self.updateGroup()
        for group in self.__groups:
            if group['NickName'] in namelist:
                self.__needGroups.append(group['UserName'])
    def getNeedGroup(self):
        return self.__needGroups

    # 收到消息就发送到前台
    def sendMsg(self, info, name, gname,time, uid, gid, t, **kw):
        text = {}
        text['info'] = info
        text['name'] = name
        text['gname'] = gname
        text['time'] = time
        text['uid'] = uid
        text['gid'] = gid
        text['type'] = t
        for k, v in kw.items():
            text[k] = v
        self.__newMsgList.append(text)
        self.__newMsgCount += 1

    # 判断后台是否有新消息
    def hasNewMsg(self):
        return len(self.__newMsgList) > 0

    def realSend(self):
        first = self.__newMsgList[0]
        self.__newMsgList.pop(0)
        return first

 # 群发文件
    # @param info 图片
    # @param group 需要发送的群，默认为None，如果为None则向所有管理的群发送
    def group_file(self, info,mes, ftype='Picture', group=None):
        if group == None:
            list = self.__gid
            group = []
            for l in list:
                for x in l:
                    group.append(x)
        if len(group) == 1:
            itchat.send('@%s@%s' % ({'Picture': 'img', 'Video': 'vid'}.get(ftype, 'fil'), info), group[0])
        else:
            for g in group:
                ran = random.randint(2, 7)
                time.sleep(3+ran)
                itchat.send('@%s@%s' % ({'Picture': 'img', 'Video': 'vid'}.get(ftype, 'fil'), info), g)
        for gi in group:
            gname = self.getGroupNameById(gi)
            if gname == None:
                continue
            else:
                msg = {}
                msg['info'] = mes
                msg['rename'] = self.__mySelf['NickName']
                msg['gname'] = gname
                msg['time'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                msg['type'] = ftype
                addmessage(msg)

    # 增加add关键字
    def addkeyadd(self, *args):
        for key in args:
            self.__keywordAdd.append(key)
            recordbadinfo(key)
            #加入数据库

    # 获取广告关键字
    def getAddKey(self):
        return self.__keywordAdd

    # 读取数据库广告关键字
    def setAddKey(self):
        user = self.getmySelfName()
        keys=readbadinfo()
        for key in keys:
            self.__keywordAdd.append(key)
    # 删除关键字getMypic
    def deleteAddKey(self,*args):
        for key in args:
            if key in self.__keywordAdd:
                self.__keywordAdd.remove(key)
                deletebadinfo(key)
                # 数据库删除

    def deleteMember(self, groupid, memberid):

        g = itchat.search_chatrooms(userName=groupid)
        memberlist = [{'UserName': memberid}]
        itchat.delete_member_from_chatroom(g, memberlist)
        # memberlist = itchat.update_chatroom(groupid, detailedMember=True)['MemberList']
        # itchat.delete_member_from_chatroom(g, memberlist)
        # for member in memberlist:
        #     if member.get('UserName') == memberid:
        #         itchat.delete_member_from_chatroom(g, member)
        #         break;

    #注销登录
    def logout(self):
         itchat.logout(self.socketio)
         self.__friends = []
         self.__mySelf = {}
         self.__groups = []
         self.__atContent = ''
         self.__keyWordReponse = {}
         self.__keywordAdd = []
         self.__needGroups = []
         self.__gid = []
         self.__fileQr = None
         self.__QR = ''
         self.__QrTrue = False
         self.__successLogin = False
         self.__newMsgCount = 0
         self.__newMsgList = []

    #注销chat
    def logout2(self):
        self.__friends = []
        self.__mySelf = {}
        self.__groups = []
        self.__atContent = ''
        self.__keyWordReponse = {}
        self.__keywordAdd = []
        self.__needGroups = []
        self.__gid = []
        self.__fileQr = None
        self.__QR = ''
        self.__QrTrue = False
        self.__successLogin = False
        self.__newMsgCount = 0
        self.__newMsgList = []