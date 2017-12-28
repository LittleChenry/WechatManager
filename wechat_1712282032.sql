/*
Navicat MySQL Data Transfer

Source Server         : yiyi
Source Server Version : 50638
Source Host           : 139.224.94.195:3300
Source Database       : wechat

Target Server Type    : MYSQL
Target Server Version : 50638
File Encoding         : 65001

Date: 2017-12-28 20:31:49
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for badinfo
-- ----------------------------
DROP TABLE IF EXISTS `badinfo`;
CREATE TABLE `badinfo` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Content` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for expression
-- ----------------------------
DROP TABLE IF EXISTS `expression`;
CREATE TABLE `expression` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Expression` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Remark` varchar(255) DEFAULT NULL,
  `Manager_ID` int(10) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for keywords
-- ----------------------------
DROP TABLE IF EXISTS `keywords`;
CREATE TABLE `keywords` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Words` varchar(255) DEFAULT NULL,
  `Reply_ID` int(10) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for manager
-- ----------------------------
DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Member_ID` int(10) DEFAULT NULL,
  `Permissions` int(2) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for members
-- ----------------------------
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Gender` bit(1) DEFAULT NULL,
  `NickName` varchar(255) DEFAULT NULL,
  `Group_ID` int(10) DEFAULT NULL,
  `SpeakTimes` int(10) DEFAULT NULL,
  `JionTime` datetime DEFAULT NULL,
  `City` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `url` text,
  `Time` datetime DEFAULT NULL,
  `Group_ID` int(10) DEFAULT NULL,
  `Member_ID` int(10) DEFAULT NULL,
  `Type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for reply
-- ----------------------------
DROP TABLE IF EXISTS `reply`;
CREATE TABLE `reply` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Message` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
