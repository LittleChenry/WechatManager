$(document).ready(function () {
	AdjustPage();
	var UserInfo = getBasicInfo();
	MessageSync(UserInfo.NickName);
	PageInit();
})

window.onresize = function() {
	AdjustPage();
}

function PageInit() {
	$("#contact").hide();
	$("#func").hide();
	$(".menulist").find("li").each(function(){
		$(this).unbind("click").bind("click",function(){
			if ($(this).find("a").hasClass("menu-a")) {
				$(".menulist").find("li").each(function(){
					if ($(this).find("a").hasClass("menu-a-active")) {
						$(this).find("a").removeClass("menu-a-active").addClass("menu-a");
						var contentclass = $(this).find("a").attr("data-content");
						$(".menu-content").find("." + contentclass).hide();
					}
				});
				$(this).find("a").removeClass("menu-a").addClass("menu-a-active");
				var contentclass = $(this).find("a").attr("data-content");
				$(".menu-content").find("." + contentclass).show();
			}
		});
	});

	$("#config-lists").find("li").each(function(){
		$(this).unbind("click").bind("click",function(){
			if (!($(this).hasClass("active"))) {
				$("#config-lists").find("li").each(function(){
					if ($(this).hasClass("active")) {
						$(this).removeClass("active");
						var contentid = $(this).find("span").attr("data-content");
						$("#" + contentid).hide();
					}
				});
				$(this).addClass("active");
				var contentid = $(this).find("span").attr("data-content");
				$("#" + contentid).show();
			}
		});
	});

	$(".dialog-func-tab").find("a").each(function(){
		$(this).unbind("click").bind("click",function(){
			if (!($(this).find("span").hasClass("tab-active"))) {
				$(".dialog-func-tab").find("a").each(function(){
					if ($(this).find("span").hasClass("tab-active")) {
						$(this).find("span").removeClass("tab-active");
						var contentclass = $(this).attr("data-content");
						$(this).parent().parent().find("." + contentclass).hide();
					}
				});
				$(this).find("span").addClass("tab-active");
				var contentclass = $(this).attr("data-content");
				$(this).parent().parent().find("." + contentclass).show();
			}
		});
	});

	$(".contact-tab").find("a").each(function(){
		$(this).unbind("click").bind("click",function(){
			if (!($(this).find("span").hasClass("tab-active"))) {
				$(".contact-tab").find("a").each(function(){
					if ($(this).find("span").hasClass("tab-active")) {
						$(this).find("span").removeClass("tab-active");
						var contentclass = $(this).attr("data-content");
						$(this).parent().parent().find("." + contentclass).hide();
					}
				});
				$(this).find("span").addClass("tab-active");
				var contentclass = $(this).attr("data-content");
				$(this).parent().parent().find("." + contentclass).show();
			}
		});
	});

	$("#send").unbind("click").bind("click",function(){
		var message = $("#message-text").val();
		var sendid;
		$("#message-text").val("");
		if (message != "") {
			var groups = new Array();
			var groupnames = new Array();
			var count = 0;
			$("#groups-ul").find("li").each(function(index, e){
				if ($(this).hasClass("active")) {
					var aitecount = parseInt($(this).attr("data-aite"));
					var aites = "";
					for (var i = 0; i < aitecount; i++) {
						aites += "@";
					}
					sendid = $(this).find(".group-name").attr("data-content");
					groups[count] = aites + $(this).find(".group-name").attr("data-content");
					groupnames[count++] = $(this).find(".group-name").attr("title");
				}
				return count;
			});
			$.ajax({
				type: "post",
				async: false,
				url: "/info",
				data:{
					groups:groups,
					message:message
				},
				dataType: "json",
				success: function (data) {
					var today = new Date();
					var sendtime = today.toLocaleTimeString();
					var pic = $("#mypic").attr("src");
					var li = '<li class="message"><img class="pic-right" src="'+ pic +'"/>'
	                     	+ '<span class="message-box-right"><span class="message-user">'
	                        + '<p class="NickName-right"><span>'+ sendtime +'</span><span> 我</span></p>'
	                        + '</span><span class="message-content"><i class="angle-right"></i>'
	                        + '<span class="text-right">'+ message +'</span></span></span></li>';
                    $("#" + sendid).append(li);
				}
			});
		}else{
			alert("消息不能为空");
		}
	});

	$("#multisend").unbind("click").bind("click",function(){
		var message = $("#multimessage-text").val();
		var sendid;
		$("#multimessage-text").val("");
		if (message != "") {
			var groups = new Array();
			var groupnames = new Array();
			var count = 0;
			$("#multigroups-ul").find("li").each(function(index, e){
				if ($(this).find("i").hasClass("fa-check-square")) {
					var aitecount = parseInt($(this).attr("data-aite"));
					var aites = "";
					for (var i = 0; i < aitecount; i++) {
						aites += "@";
					}
					sendid = $(this).find(".group-name").attr("data-content");
					groups[count] = aites + $(this).find(".group-name").attr("data-content");
					//alert(groups[count]);
					groupnames[count++] = $(this).find(".group-name").attr("title");
				}
				return count;
			});
			$.ajax({
				type: "post",
				url: "/info",
				data:{
					groups:groups,
					message:message
				},
				dataType: "json",
				success: function (data) {
					/*var today = new Date();
					var sendtime = today.toLocaleTimeString();
					var pic = $("#mypic").attr("src");
					var li = '<li class="message"><img class="pic-right" src="'+ pic +'"/>'
	                     	+ '<span class="message-box-right"><span class="message-user">'
	                        + '<p class="NickName-right"><span>'+ sendtime +'</span><span> 我</span></p>'
	                        + '</span><span class="message-content"><i class="angle-right"></i>'
	                        + '<span class="text-right">'+ message +'</span></span></span></li>';
                    $("#" + sendid).append(li);*/
                    //alert("success");
				}
			});
		}else{
			alert("消息不能为空");
		}
	});

	$("#choose-file").unbind("click").bind("click",function(){
		$("#send-file").click();
		$("#send-file").unbind("change").on("change",function(e){
			var data=new FormData()
			data.append('image',$("#send-file")[0].files[0]);
			var groups = new Array();
			var groupnames = new Array();
			var count = 0;
			$("#groups-ul").find("li").each(function(index, e){
				if ($(this).hasClass("active")) {
					var aitecount = parseInt($(this).attr("data-aite"));
					var aites = "";
					for (var i = 0; i < aitecount; i++) {
						aites += "@";
					}
					sendid = $(this).find(".group-name").attr("data-content");
					groups[count] = aites + $(this).find(".group-name").attr("data-content");
					groupnames[count++] = $(this).find(".group-name").attr("title");
				}
				return count;
			});
			data.append('groups',groups);
	        $.ajax({
	        	type: "post",
				url: "/picture",
				data:data,
				async: true,
				dataType: "json",
				contentType: false,
          		processData: false,
				success: function (data) {
					var today = new Date();
					var sendtime = today.toLocaleTimeString();
					var pic = $("#mypic").attr("src");
					var filepath = data.success.split("\\");
    				var length = filepath.length;
					var message = '<span>'+ filepath[length - 1] +'</span><a href="'+ data.success +'" download><i class="fa fa-download fa-fw"></i></a>';
					var li = '<li class="message"><img class="pic-right" src="'+ pic +'"/>'
	                     	+ '<span class="message-box-right"><span class="message-user">'
	                        + '<p class="NickName-right"><span>'+ sendtime +'</span><span> 我</span></p>'
	                        + '</span><span class="message-content"><i class="angle-right"></i>'
	                        + '<span class="text-right">'+ message +'</span></span></span></li>';
                    $("#" + sendid).append(li);
		        }
	        });
		});
	});

	$("#multichoose-file").unbind("click").bind("click",function(){
		$("#multisend-file").click();
		$("#multisend-file").unbind("change").on("change",function(e){
			var data=new FormData()
			data.append('image',$("#multisend-file")[0].files[0]);
			var groups = new Array();
			var groupnames = new Array();
			var count = 0;
			$("#multigroups-ul").find("li").each(function(index, e){
				if ($(this).find("i").hasClass("fa-check-square")) {
					var aitecount = parseInt($(this).attr("data-aite"));
					var aites = "";
					for (var i = 0; i < aitecount; i++) {
						aites += "@";
					}
					sendid = $(this).find(".group-name").attr("data-content");
					groups[count] = aites + $(this).find(".group-name").attr("data-content");
					groupnames[count++] = $(this).find(".group-name").attr("title");
				}
				return count;
			});
			data.append('groups',groups);
	        $.ajax({
	        	type: "post",
				url: "/picture",
				data:data,
				async: true,
				dataType: "json",
				contentType: false,
          		processData: false,
				success: function (data) {
					/*var today = new Date();
					var sendtime = today.toLocaleTimeString();
					var pic = $("#mypic").attr("src");
					var filepath = data.success.split("\\");
    				var length = filepath.length;
					var message = '<span>'+ filepath[length - 1] +'</span><a href="'+ data.success +'" download><i class="fa fa-download fa-fw"></i></a>';
					var li = '<li class="message"><img class="pic-right" src="'+ pic +'"/>'
	                     	+ '<span class="message-box-right"><span class="message-user">'
	                        + '<p class="NickName-right"><span>'+ sendtime +'</span><span> 我</span></p>'
	                        + '</span><span class="message-content"><i class="angle-right"></i>'
	                        + '<span class="text-right">'+ message +'</span></span></span></li>';
                    $("#" + sendid).append(li);*/
		        }
	        });
		});
	});

	$("#setdefaultgroups").unbind("click").bind("click",function(){
		var groups = new Array();
		var groupnames = new Array();
		var count = 0;
		$("#multigroups-ul").find("li").each(function(index, e){
			if ($(this).find("i").hasClass("fa-check-square")) {
				var aitecount = parseInt($(this).attr("data-aite"));
				var aites = "";
				for (var i = 0; i < aitecount; i++) {
					aites += "@";
				}
				sendid = $(this).find(".group-name").attr("data-content");
				groups[count] = aites + $(this).find(".group-name").attr("data-content");
				//alert(groups[count]);
				groupnames[count++] = $(this).find(".group-name").attr("title");
			}
			return count;
		});
		$.ajax({
			type: "post",
			url: "/setDefault",
			data:{
				groups:groups,
				groupnames:groupnames
			},
			dataType: "json",
			success: function (data) {
				alert("设置成功！");
				getBasicInfo("/update");
			}
		});
	});

	$("#deletekewords").unbind("click").bind("click",function(){
		if ($(this).html() == "删除") {
			$(this).next().find(".selected-group").each(function(){
				var del = '<i class="delete-selected-group fa fa-close" title="删除" onclick="deletekeyword(this)"></i>';
				$(this).append(del);
			});
			$(this).html("取消");
		}else{
			$(this).next().find(".selected-group").each(function(){
				$(this).find("i").remove();
			});
			$(this).html("删除");
		}
	});

	$("#savekeyword").unbind("click").bind("click",function(){
		var keyword = $("#newkeyword").val();
		$.ajax({
			type: "post",
			url: "/addAddkey",
			async: false,
			data:{
				key:keyword
			},
			dataType: "json",
			success: function (data) {
				alert("保存成功！");
				var keywordsarea = $(".keywords");
				var p = '<p class="selected-group"><span>'+ keyword +'</span></p>';
				keywordsarea.append(p);
				$("#newkeyword").val("");
			}
		});
	});

	$('#message-text').keydown(function(event){
		var keynum = (event.keyCode ? event.keyCode : event.which);
		if(keynum == '13'){
			$("#send").click();
			return false;
		}
	});

	$("body").bind("click").bind("click",function(){
		$(".template-area").hide();
		$(".multitemplate-area").hide();
	});

	$("#word-template").unbind("click").bind("click",function(e){
		e.stopPropagation();
		$("#emoijdiv").hide();
		$(".template-area").show();
	});

	$("#multiword-template").unbind("click").bind("click",function(e){
		e.stopPropagation();
		$("#emoijdivgroup").hide();
		$(".multitemplate-area").show();
	});

	$("#messages-history").unbind("click").bind("click",function(){
		var gname = $("#dialog-name").html();
		window.open("/logg/" + gname);
	});

	$(".modal").unbind("click").bind("click",function(){
		$(this).hide();
	});

	$("#larger").unbind("click").bind("click",function(e){
		e.stopPropagation();
		var picwidth = $(this).parents(".showfunc").next().find("img").width();
		$(this).parents(".showfunc").next().find("img").width(picwidth + 50);
	});

	$("#smaller").unbind("click").bind("click",function(e){
		e.stopPropagation();
		var picwidth = $(this).parents(".showfunc").next().find("img").width();
		$(this).parents(".showfunc").next().find("img").width(picwidth - 50);
	});
}

function AdjustPage(argument) {
	windowheight = $(window).height();
	windowwidth = $(window).width();
	actualheight = windowheight > 700 ? windowheight : 700;
	actualwidth = windowwidth > 1200 ? windowwidth : 1200;
	$(".content").height(actualheight);
	$(".menu").height(actualheight);
	$(".menu-content").height(actualheight);
	$(".menu-content").width(actualwidth - 60);
	$(".scroll-content").height(actualheight - 53);
}

function MessageSync(UserName) {
	namespace = '/test';
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
    socket.on('msg', function (msg) {
    	var dialogs = $("#dialogs");
    	var groupname = msg["gname"] == null ? "" : msg["gname"];
    	var picsrc = msg["pic"] == "" ? "static/img/nonepic.png" : ("data:image/jpg;base64," + msg["pic"]);
    	var uid = msg["uid"];
    	var gid = msg["gid"];
		if (groupname != "") {
			var c = "@";
			var regex = new RegExp(c, 'g');
			var result = msg["gid"].match(regex);
			var count = !result ? 0 : result.length;
	    	var groupid = msg["gid"].substring(count , msg["gid"].length);
	    	var GroupList = $("#groups-ul");
	    	var flag = 0;
			GroupList.find("li").each(function(index,e){
				contentID = $(this).find(".group-name").attr("data-content");
				if (groupid == contentID) {
					flag = 1;
					var name = msg["name"];
			    	var sendtime = " " + msg["time"].split(" ")[1] + " ";
			    	switch(msg["type"]){
			    		case "Text":
			    			var message = msg["info"].replace("\n", "<br>");
			    			break;
			    		case "Video":
			    			var message = '<video class="message-video" src="'+ msg["info"] +'" controls="controls">your browser does not support the video tag</video>';
			    			break;
			    		case "Picture":
			    			var message = '<img src="'+ msg["info"] +'" class="emoji-pic" onclick="ShowOptions(this)"><div class="picture-func"><i class="fa fa-search-plus" title="查看" onclick="ShowPic(this)"></i><i onclick="addemoij(this)" class="fa fa-plus" title="添加表情"></i></div>';
			    			break;
			    		case "Recording":
			    			var message = '<audio src="'+ msg["info"] +'" controls="controls">your browser does not support the audio tag</audio>';
			    			break;
			    		case "Sharing":
			    			var u = msg["url"] == "" ? "javascript:;" : msg["url"];
			    			var info = msg["info"] == "" ? "不支持预览，请在手机上查看。" : msg["info"];
			    			var message = '<a class="tab-a" href="'+ u +'" target="_blank">链接：'+ info +'</a>';
			    			break;
			    		case "Card":
			    			var message = '名片：' + msg["info"];
			    			break;
			    		case "Note":
			    			var message = msg["info"];
			    			break;
		    			case "Attachment":
		    				var filepath = msg["info"].split("\\");
		    				var length = filepath.length;
		    				var message = '<span>'+ filepath[length - 1] +'</span><a href="'+ msg["info"] +'" download><i class="fa fa-download fa-fw"></i></a>';
		    				break;
						default:
							var message = "不支持预览，请在手机上查看。";
			    	}
			    	
			    	if (msg.type == "Note") {
			    		var li = '<li class="system-message"><span class="system-info">'+ message +'</span></li>';
			    	}else{
			    		if (name == UserName) {
			    			var li = '<li class="message"><img class="pic-right" src="'+ picsrc +'"/>'
				                     	+ '<span class="message-box-right"><span class="message-user">'
				                        + '<p class="NickName-right"><span>'+ sendtime +'</span><span>我</span></p>'
				                        + '</span><span class="message-content"><i class="angle-right"></i>'
				                        + '<span class="text-right">'+ message +'</span></span></span></li>';
				    	}else{
				    		var li = '<li class="message unread"><img class="pic-left" src="'+ picsrc +'"/>'
				                     	+ '<span class="message-box-left"><span class="message-user">'
				                        + '<p class="NickName-left"><span>'+ name +'</span><span>'+ sendtime +'</span></p>'
				                        + '</span><span class="message-content"><i class="angle-left"></i>'
				                        + '<span class="text-left">'+ message +'</span></span></span></li>';
				            var addType = msg["addType"];
				            if (addType != undefined) {
				            	switch(addType){
				            		case "phone":
				            			var type = "电话消息";
				            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
				            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
				            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
				            				+ name
				            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + message + '</p>'
				            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
			            				break;
				            		case "link":
				            			var type = "链接消息";
				            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
				            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
				            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
				            				+ name
				            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + message + '</p>'
				            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
			            				break;
				            		case "sharing":
				            			var type = "分享消息";
				            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
				            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
				            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
				            				+ name
				            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + message + '</p>'
				            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
			            				break;
				            		case "keyword":
				            		var type = "关键词消息：" + msg["addkeyword"];
				            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
				            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
				            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
				            				+ name
				            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + message + '</p>'
				            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
			            				break;
				            		case "card":
				            			var type = "名片消息：";
				            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
				            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
				            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
				            				+ name
				            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + message + '</p>'
				            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
			            				break;
				            		case "Viedo":
				            			var type = "视频消息：";
				            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
				            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
				            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
				            				+ name
				            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + '视频' + '</p>'
				            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
			            				break;
		            				default:
		            					
				            	}
				            	$(".warningmessage-content").append(warningmessage);
				            }
				    	}
			    	}
			    	$("#" + contentID).append(li);
			    	RefreshDialogList();
				}
				return flag;
			});
			if (flag == 0) {
				var name = msg["name"];
		    	var sendtime = " " + msg.time.split(" ")[1];
		    	switch(msg.type){
		    		case "Text":
		    			var message = msg["info"].replace("\n", "<br>");
		    			break;
		    		case "Video":
		    			var message = '<video class="message-video" src="'+ msg["info"] +'" controls="controls">your browser does not support the video tag</video>';
		    			break;
		    		case "Picture":
		    			var message = '<img src="'+ msg["info"] +'" class="emoji-pic" onclick="ShowOptions(this)"><div class="picture-func"><i class="fa fa-search-plus" title="查看" onclick="ShowPic(this)"></i><i onclick="addemoij(this)" class="fa fa-plus" title="添加表情"></i></div>';
			    		break;
		    		case "Recording":
		    			var message = '<audio src="'+ msg["info"] +'" controls="controls">your browser does not support the audio tag</audio>';
		    			break;
		    		case "Sharing":
		    			var u = msg["url"] == "" ? "javascript:;" : msg["url"];
		    			var info = msg["info"] == "" ? "不支持预览，请在手机上查看。" : msg["info"];
		    			var message = '<a class="tab-a" href="'+ u +'" target="_blank">链接：'+ info +'</a>';
		    			break;
		    		case "Card":
		    			var message = '名片：' + msg["info"];
		    			break;
		    		case "Note":
		    			var message = msg["info"];
		    			break;
	    			case "Attachment":
	    				var filepath = msg["info"].split("\\");
	    				var length = filepath.length;
	    				var message = '<span>'+ filepath[length - 1] +'</span><a href="'+ msg["info"] +'" download><i class="fa fa-download fa-fw"></i></a>';
	    				break;
					default:
						var message = "不支持预览，请在手机上查看。";
		    	}
		    	if (msg.type == "Note") {
		    		var li = '<li class="system-message"><span class="system-info">'+ message +'</span></li>';
		    	}else{
		    		if (name == UserName) {
		    			var li = '<li class="message"><img class="pic-right" src="'+ picsrc +'"/>'
			                     	+ '<span class="message-box-right"><span class="message-user">'
			                        + '<p class="NickName-right"><span>'+ sendtime +'</span><span>我</span></p>'
			                        + '</span><span class="message-content"><i class="angle-right"></i>'
			                        + '<span class="text-right">'+ message +'</span></span></span></li>';
			    	}else{
			    		var li = '<li class="message unread"><img class="pic-left" src="'+ picsrc +'"/>'
			                     	+ '<span class="message-box-left"><span class="message-user">'
			                        + '<p class="NickName-left"><span>'+ name +'</span><span>'+ sendtime +'</span></p>'
			                        + '</span><span class="message-content"><i class="angle-left"></i>'
			                        + '<span class="text-left">'+ message +'</span></span></span></li>';
			            var addType = msg["addType"];
			            if (addType != undefined) {
			            	switch(addType){
			            		case "phone":
			            			var type = "电话消息";
			            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
			            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
			            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
			            				+ name
			            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + message + '</p>'
			            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
		            				break;
			            		case "link":
			            			var type = "链接消息";
			            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
			            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
			            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
			            				+ name
			            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + message + '</p>'
			            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
		            				break;
			            		case "sharing":
			            			var type = "分享消息";
			            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
			            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
			            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
			            				+ name
			            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + message + '</p>'
			            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
		            				break;
			            		case "keyword":
			            		var type = "关键词消息：" + msg["addkeyword"];
			            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
			            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
			            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
			            				+ name
			            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + message + '</p>'
			            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
		            				break;
			            		case "card":
			            			var type = "名片消息：";
			            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
			            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
			            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
			            				+ name
			            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + message + '</p>'
			            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
		            				break;
			            		case "Viedo":
			            			var type = "视频消息：";
			            			var warningmessage = '<li class="warning-message"><p class="warning-name">'+ type +'</p>'
			            				+ '<p class="warning-content">'+ '来自：' + '<span class="highlight">'+ groupname +'</span>' + ','
			            				//+ '<a class="kickmember" href="javascript:;" onclick="kick(this)">'+ name
			            				+ name
			            				+ '<input type="hidden" value="'+ uid +'"><input type="hidden" value="'+ gid +'"></a>' + ',' + sendtime + ',' + '视频' + '</p>'
			            				+ '<i class="fa fa-close close" onclick="deletewarning(this)"></i></li>';
		            				break;
	            				default:
	            					
			            	}
			            	$(".warningmessage-content").append(warningmessage);
			            }
			    	}
		    	}
		    	var grouppic = '<img class="message-pic" src="data:image/jpg;base64,'+ msg["grouppic"] +'"/>'
				var groupli = '<li class="single-message" data-aite="'+ count +'"><span class="group-pic">'+ grouppic +'</span>'
	                          + '<span class="group-name" title="'+ groupname +'" data-content="'+ groupid +'">'+ groupname +'</span></li>';
				var dialogul = '<ul id="'+ groupid +'" class="conversation-area">'+ li +'</ul>';
				GroupList.append(groupli);
				dialogs.append(dialogul);

				GroupList.find("li").each(function(index,e){
					$(this).unbind("click").bind("click",function(){
						$("#contact").show();
						$("#func").show();
						$("#dialog-name").html($(this).find(".group-name").attr("title"));
						GroupList.find("li").each(function(index,e){
							if ($(this).hasClass("active")) {
								$(this).removeClass("active");
								var ulid = $(this).find(".group-name").attr("data-content");
								dialogs.find("ul").each(function(index,e){
									if ($(this).hasClass("current-area")) {
										$(this).removeClass("current-area");
									}
								});
							}
						});
						var ulid = $(this).find(".group-name").attr("data-content");
						$("#" + ulid).addClass("current-area");
						$(this).addClass("active");
						$(this).find("li").each(function(index,e){
							if ($(this).hasClass("unread")) {
								$(this).removeClass("unread");
							}
						});
						RefreshDialogList();
					});
				});
				RefreshDialogList();
			}
		}
    	
        //$("#msgul").append("<li>" + msg.info + " " + msg.name + " " + msg.gname + "</li>");
    })//div.scrollTop = div.scrollHeight;
}

function RefreshDialogList() {//
	var GroupList = $("#groups-ul");
	var total = 0;
	GroupList.find("li").each(function(index,e){
		if ($(this).find(".unreadnum").length > 0) {
			$(this).find(".unreadnum").remove();
		}
		if ($(this).hasClass("active") && !($(".dialog-content").is(":hidden"))) {
			var ulid = $(this).find(".group-name").attr("data-content");
			$("#dialogs").scrollTop($("#dialogs")[0].scrollHeight);
			$("#" + ulid).find("li").each(function(index,e){
				if ($(this).hasClass("unread")) {
					$(this).removeClass("unread");
				}
			});
		}else{
			var ulid = $(this).find(".group-name").attr("data-content");
			$("#dialogs").scrollTop($("#dialogs")[0].scrollHeight);
			var count = 0;
			$("#" + ulid).find("li").each(function(index,e){
				if ($(this).hasClass("unread")) {
					count ++;
				}
				return count;
			});
			if (count > 0) {
				total += count;
				var showcount = count > 99 ? "…" : count;
				var span = '<span class="unreadnum">'+ showcount +'</span>';
				$(this).append(span);
			}
		}
		return total;
	});
	if ($("#at").find(".unreadtotal").length > 0) {
		$("#at").find(".unreadtotal").remove();
	}
	if (total > 0) {
		var showtotal = total > 99 ? "…" : total;
		var totalspan = '<span class="unreadtotal">'+ showtotal +'</span>';
		$("#at").append(totalspan);
	}

}

function getBasicInfo() {
	var UserInfo;
	$.ajax({
		type: "post",
		url: "/update",
		async: false,
		dataType: "json",
		success: function (data) {
			UserInfo = data.user;
			userpho = data.userpic;
			var addAddkey = data.addKey;
			$("#mypic").attr("src","data:image/jpg;base64," + userpho);
			//关键词
			var keywordsarea = $(".keywords");
			keywordsarea.html("");
			for (var i = 0; i < addAddkey.length; i++) {
				var p = '<p class="selected-group"><span>'+ addAddkey[i] +'</span></p>';
				keywordsarea.append(p);
			}
			//模板
			//var templates = data.template;
			//var templates = ["好友的搜索方法为search_friends，有四种搜索方式：","1. 仅获取自己的用户信息","2. 获取特定UserName的用户信息"];
			var templates = [];
			var templatearea = $(".template-lists");
			templatearea.each(function(){
				$(this).html("");
				for (var i = 0; i < templates.length; i++) {
					var li = '<li class="single-template" onclick="choosetemplate(this)">'+ templates[i] +'</li>';
					$(this).append(li);
				}
			});
			var templatemanagelist = $("#template-manage-list");
			templatemanagelist.html("");
			for (var i = 0; i < templates.length; i++) {
				var li = '<li class="single-allsee-list"><span class="templatemessage-content">'+ templates[i] +'</span></li>';
				templatemanagelist.append(li);
			}

			//群组
			var Allgroups = $(".allgroups-content");
			var Allcontact = $(".allcontact-content");
			var Manager = $(".manager-content");
			var StaticGroups = $("#static-groups");
			Allgroups.html("");
			Allcontact.html("");
			Manager.html("");
			StaticGroups.html("");
			$(".multisend-contacts").find(".selected-group").each(function(){
				$(this).remove();
			});
			var c = "@";
			var regex = new RegExp(c, 'g');
			for (var i = 0; i < data.groups.length; i++) {
				var result = data.groups[i].id.match(regex);
				var count = !result ? 0 : result.length;
		    	var groupid = data.groups[i].id.substring(count , data.groups[i].id.length);
		    	var need = (data.groups[i].need == true) ? 'fa fa-check-square' : 'fa fa-square-o';
		    	var grouppic = '<img class="message-pic" src="data:image/jpg;base64,'+ data.groups[i].grouppic +'"/>';
				var groupli = '<li class="single-message" data-aite="'+ count +'"><span class="group-pic">'+ grouppic +'</span>'
	                          + '<span class="group-name" title="'+ data.groups[i].name +'" data-content="'+ groupid +'">'+ data.groups[i].name +'</span>'
	                          + '<span class="choosebox pull-right"><i class="'+ need +'"></i></span></li>';
				Allgroups.append(groupli);
				if (need == 'fa fa-check-square') {
					var groupli = '<li class="single-message" data-aite="'+ count +'"><span class="group-pic">'+ grouppic +'</span>'
		                          + '<span class="group-name" title="'+ data.groups[i].name +'" data-content="'+ groupid +'">'+ data.groups[i].name +'</span></li>';
					Manager.append(groupli);
					StaticGroups.append(groupli);
					var groupp = '<p class="selected-group"><span title="'+ data.groups[i].name +'">'+ data.groups[i].name +' </span><i class="delete-selected-group fa fa-close" title="删除"></i></p>';
					$(".multisend-contacts").append(groupp);
				}
			}
			DeleteSelectedGroup();
			$(".choosebox").unbind("click").bind("click",function(){
				var name = $(this).prev().attr("title");
    			if ($(this).find("i").hasClass("fa-check-square")) {
    				$(this).find("i").removeClass("fa-check-square");
    				$(this).find("i").addClass("fa-square-o");
    				$(".multisend-contacts").find(".selected-group").each(function(){
    					if ($(this).find("span").attr("title") == name) {
    						$(this).remove();
    					}
    				});
    			}else{
    				$(this).find("i").removeClass("fa-square-o");
    				$(this).find("i").addClass("fa-check-square");
    				var groupp = '<p class="selected-group"><span title="'+ name +'">'+ name +' </span><i class="fa fa-close" title="删除"></i></p>';
					$(".multisend-contacts").append(groupp);
    			}
    			DeleteSelectedGroup();
			});
        }
	});
	return UserInfo;
}

function ShowOptions(e) {
	if ($(e).next().css("display") == "none") {
		$(e).next().show();
	}else{
		$(e).next().hide();
	}
}

function ShowPic(e) {
	var src = $(e).parent().prev().attr("src");
	$(".modal").find("img").attr("src",src);
	$(".modal").find("img").css("width","800px");
	$(".modal").show();
	
}

function findChoseGroup(){
	$("#ChoseGroup-area").html("");
	$(".allgroups-content").find("li").each(function(){
		if ($(this).find("i").hasClass("fa-check-square")) {
			var name = $(this).find(".group-name").attr("title");
			var p = '<p class="chosegroup-p">'+ name +'</p>';
			$("#ChoseGroup-area").append(p);
		}
	});
}

function DeleteSelectedGroup() {
	$(".selected-group").each(function(){
		$(this).find("i").unbind("click").bind("click",function(){
			var name = $(this).prev().attr("title");
			$(this).parent().remove();
			$(".allgroups-content").find(".group-name").each(function(){
				if ($(this).attr("title") == name) {
					$(this).next().find("i").removeClass("fa-check-square").addClass("fa-square-o");
				}
			});
		});
	});
}

function addemoij(e)
{
  var $e=$(e);
  var src=$e.parent().prev().attr("src");
  $.ajax({
        type: "post",
        url: "/addemoij",
        data:{
            message:src
        },
        dataType: "json",
        success: function (data) {
            alert("添加成功!");
        }
    });
}

function deletekeyword(e) {
	var keyword = new Array();
	keyword[0] = $(e).prev().html();
	$.ajax({
		type: "post",
		async: false,
		url: "/deleteAddKey",
		data:{
			keys:keyword
		},
		dataType: "json",
		success: function (data) {
			alert("删除成功！");
			$(e).parent().remove();
		}
	});
}

function deletewarning(e) {
	$(e).parent().remove();
}

function kick(e,uid,gid) {
	var kickspan = '<div class="kickdiv">踢除此人？<button class="btn" type="button" onclick="deletemember(this)">确定</button></div>';
	$(e).parent().append(kickspan);
	var top = $(e).offset().top + 15;
	var left = $(e).offset().left;
	$(e).parent().find(".kickdiv").offset({top : top, left: left});
}

function deletemember(e) {
	var uid,gid;
	$(e).parent().parent().find("input").each(function(index,e){
		if (index == 0) {
			uid = $(this).val();
		}
		if (index == 1) {
			gid = $(this).val();
		}
	});
	$.ajax({
		type: "post",
		async: true,
		url: "/removeUser",
		data:{
			uid : uid,
			gid : gid
		},
		dataType: "json",
		success: function (data) {
			alert("踢除成功！");
		}
	});
	$(e).parent().remove();
}

function closethis(e) {
	$(e).parents().find(".close-area").hide();
}

function choosetemplate(e){
	var content = $(e).html();
	$(e).parent().parent().parent().prev().prev().find("textarea").val(content);
}