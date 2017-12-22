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
from PIL import Image
import StringIO
import random
from addmessage import *
picDir = '/Users/apple/Documents/mavenProject/WechatManager/static/qr/QR.png'

class ChatRun(object):
    def __init__(self, *args, **kw):
        self.__friends = []

        # 获取自己
        self.__mySelf = {}

        # 获取所有群
        self.__groups = []

        # @回复内容
        self.__atContent = ''

        # 关键字回复字典
        self.__keyWordReponse = {u'一乙': 'auto', u'test': u'测试成功'}

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
        itchat.login()
        #itchat.auto_login(enableCmdQR=True)

        self.__friends = itchat.get_friends(update=True)[0:]
        for f in self.__friends:
            print f['UserName'],f['NickName'],'\n'

        # 获取自己
        self.__mySelf = self.__friends[0]

        # 获取所有群
        self.__groups = itchat.get_chatrooms()

        # @回复内容
        self.__atContent = ''

        # 关键字回复字典
        self.__keyWordReponse = {u'一乙': 'auto', u'test': u'测试成功'}

        # 待管理的群
        self.setNeedGroupByName([u'测试2群', u'微信群管理内部讨论群',u'测试1群'])

        #gid
        self.updateGid()
        # for gs in self.__groups:
        #    print gs['NickName']
        # print itchat.search_chatrooms(u'项目测试')

        # 群处理
        # 文本
        @itchat.msg_register([TEXT, MAP, CARD, NOTE, SHARING], isGroupChat=True)
        def reply_group(msg):
            if self.getmySelfID() == msg['ActualUserName']:
                if msg['Type'] == 'Sharing':
                    self.sendMsg(msg['Text'], self.getmySelfName(), self.getGroupNameById(msg['ToUserName']),
                                 time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())), msg['ActualUserName'],
                                 msg['ToUserName'], msg['Type'], url = msg['Url'])
                else:
                    self.sendMsg(msg['Text'], self.getmySelfName(), self.getGroupNameById(msg['ToUserName']),time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), msg['ActualUserName'],msg['ToUserName'],msg['Type'])
            self.updateGid()
            gid = self.__gid
            #print 'need:',self.__needGroups, 'gid:', len(gid)
            # print gid

            for gs in gid:
                if msg['FromUserName'] in gs:
                    text = msg['Text']
                    if msg['Type'] == 'Sharing':
                        self.sendMsg(msg['Text'], self.getmySelfName(), self.getGroupNameById(msg['ToUserName']),
                                     time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())),
                                     msg['ActualUserName'],
                                     msg['ToUserName'], msg['Type'], url=msg['Url'])
                    else:
                        self.sendMsg(text,msg['ActualNickName'],gs[msg['FromUserName']], time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), msg['ActualUserName'],msg['FromUserName'],msg['Type'])
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
                            else:
                                itchat.send(u'收到消息: %s @%s ' % (text, msg['ActualNickName']), msg['FromUserName'])
                            break
                        elif msg['isAt']:
                            time.sleep(3)
                            itchat.send(self.__atContent, msg['FromUserName'])
                            break
                    break

        @itchat.msg_register([PICTURE,RECORDING,ATTACHMENT,VIDEO], isGroupChat=True)
        def reply_files(msg):
            print msg['Text'], msg['FromUserName']
            basepath = os.path.dirname(__file__)
            upload_path = os.path.join(basepath, 'static/picture',msg['FileName'])
            print upload_path
            msg['Text'](upload_path)
            if self.getmySelfID() == msg['ActualUserName']:
                self.sendMsg('static/picture/'+msg['FileName'], self.getmySelfName(), self.getGroupNameById(msg['ToUserName']),time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), msg['ActualUserName'],msg['ToUserName'],msg['Type'])
            self.updateGid()
            gid = self.__gid

            for gs in gid:
                if msg['FromUserName'] in gs:
                    text = 'static\\picture\\'+msg['FileName']
                    self.sendMsg(text, msg['ActualNickName'], gs[msg['FromUserName']],
                                 time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())), msg['ActualUserName'],
                                 msg['FromUserName'],msg['Type'])
                    break

        #其他处理
        self.__successLogin = True

        itchat.run()
    # 保存群中@自己的文本
    # @param text 待保存的文本
    # @param group 来自的群的名字
    # @param user 发送者的NickName
    def saveText(self, text, group, user):
        now = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        str = u'%s 收到来自于群%s中用户%s的@消息: %s' % (now[5:], group, user, text)
        print str
    # 设置关键回复字字典
    def setKeyWordResponse(self, map):
        self.__keyWordReponse = map
    # 新增关键回复字及其内容
    def addKeyWordResponse(self, map):
        key = map['key']
        val = map['val']
        self.__keyWordReponse[key] = val
        print self.__keyWordReponse
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
    def getheadpic(self,ID):
        return itchat.get_head_img(userName=ID)

    #获取群头像
    def getgrouppic(self,gid):
        list2 = []
        # img = itchat.get_head_img(x['UserName'])
        memberlist = self.getGroupMember(gid)
        num = 0
        for i in memberlist:
            img = itchat.get_head_img(userName=i["id"])
            if type(img) == types.StringType:
                buffer = StringIO.StringIO(img)
                buffer2 = StringIO.StringIO()
                try:
                    image = Image.open(buffer)
                    image.save(buffer2, format="JPEG")
                    img_str = base64.b64encode(buffer2.getvalue())
                    list2.append(img_str)
                    num += 1
                except:
                    num = num
            else:
                num = num
            if num >= 8:
                return list2
        return list2


    # 跟新需要管理的群的GroupId
    def updateGid(self):
        self.__gid = []
        for group in self.__groups:
            if group['UserName'] in self.__needGroups:
                self.__gid.append({group['UserName']: group['NickName']})


    # 根据NickName获取群ID
    def getGroupIdByName(self,name):
        for group in self.__groups:
            if name == group['NickName']:
                return group['UserName']

    # 根据id获取群名
    def getGroupNameById(self,id):
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
            print group,' d:', group[0]
            print self.getGroupNameById(group[0])
            print self.__groups
            itchat.send(info, group[0])
        else:
            for g in group:
                time.sleep(3)
                itchat.send(info, g)
        for gi in group:
            gname=self.getGroupNameById(gi)
            if gname==None:
                continue
            else:
                msg={}
                msg['info']=info
                msg['name']=self.__mySelf['NickName']
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
        print 'need in getALLgroup:', self.__needGroups
        for x in self.__groups:
            # #img = itchat.get_head_img(x['UserName'])
            # list2 = []
            # # img = itchat.get_head_img(x['UserName'])
            # memberlist = self.getGroupMember(x['UserName'])
            # num = 0
            # for i in memberlist:
            #     img = itchat.get_head_img(userName=i["id"])
            #     if type(img) == types.StringType:
            #         buffer = StringIO.StringIO(img)
            #         buffer2 = StringIO.StringIO()
            #         try:
            #             image = Image.open(buffer)
            #             image.save(buffer2, format="JPEG")
            #             img_str = base64.b64encode(buffer2.getvalue())
            #             list2.append(img_str)
            #             num += 1
            #         except:
            #             num = num
            #     else:
            #         num = num
            #     if num >= 8:
            #         break
            list.append({'name': x['NickName'], 'id': x['UserName'], 'need': x['UserName'] in self.__needGroups,'grouppic':[]})
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
        print 'needgroup:', self.__needGroups
    def setNeedGroupByName(self,namelist):
        self.updateGroup()
        for group in self.__groups:
            if group['NickName'] in namelist:
                self.__needGroups.append(group['UserName'])
    def getNeedGroup(self):
        return self.__needGroups

    # 收到消息就发送到前台
    def sendMsg(self, info, name, gname,time, uid, gid, t, **kw):
        print 'info', info, 'name', name, 'gname', gname
        text = {}
        text['info'] = info
        text['name'] = name
        text['gname'] = gname
        text['time'] = time
        text['uid'] = uid
        text['gid'] = gid
        text['type'] = t
        for k, v in kw.iteritems():
            text[k] = v
        print text
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
                time.sleep(3)
                itchat.send('@%s@%s' % ({'Picture': 'img', 'Video': 'vid'}.get(ftype, 'fil'), info), g)
        for gi in group:
            gname = self.getGroupNameById(gi)
            if gname == None:
                continue
            else:
                msg = {}
                msg['info'] = mes
                msg['name'] = self.__mySelf['NickName']
                msg['gname'] = gname
                msg['time'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                msg['type'] = ftype
                addmessage(msg)