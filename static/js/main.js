$(document).ready(function () {
	AdjustPage();
	getBasicInfo();
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
					var count = parseInt($(this).attr("data-aite"));
					var aites = "";
					for (var i = 0; i < count; i++) {
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
					var count = parseInt($(this).attr("data-aite"));
					var aites = "";
					for (var i = 0; i < count; i++) {
						aites += "@";
					}
					sendid = $(this).find(".group-name").attr("data-content");
					groups[count] = aites + $(this).find(".group-name").attr("data-content");
					alert(groups[count]);
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
                    alert("success");
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
	actualheight = windowheight > 800 ? windowheight : 800;
	actualwidth = windowwidth > 1300 ? windowwidth : 1300;
	$(".content").height(actualheight);
	$(".menu").height(actualheight);
	$(".menu-content").height(actualheight);
	$(".menu-content").width(actualwidth - 60);
}

function MessageSync(UserName) {
	namespace = '/test';
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
    socket.on('msg', function (msg) {
    	var dialogs = $("#dialogs");
    	var groupname = msg.gname == null ? "" : msg.gname;
		if (groupname != "") {
			var c = "@";
			var regex = new RegExp(c, 'g');
			var result = msg.gid.match(regex);
			var count = !result ? 0 : result.length;
	    	var groupid = msg.gid.substring(count , msg.gid.length);
	    	var GroupList = $("#groups-ul");
	    	var flag = 0;
			GroupList.find("li").each(function(index,e){
				contentID = $(this).find(".group-name").attr("data-content");
				if (groupid == contentID) {
					flag = 1;
					var name = msg.name;
			    	var sendtime = " " + msg.time.split(" ")[1] + " ";
			    	switch(msg.type){
			    		case "Text":
			    			var message = msg.info;
			    			break;
			    		case "Video":
			    			var message = '<video class="message-video" src="'+ msg.info +'" controls="controls">your browser does not support the video tag</video>';
			    			break;
			    		case "Picture":
			    			var message = '<img src="'+ msg.info +'" class="emoji-pic" onclick="ShowOptions(this)"><div class="picture-func"><i class="fa fa-search-plus" title="查看" onclick="ShowPic(this)"></i><i class="fa fa-plus" title="添加表情"></i></div>';
			    			break;
			    		case "Recording":
			    			var message = '<audio src="'+ msg.info +'" controls="controls">your browser does not support the audio tag</audio>';
			    			break;
		    			case "Attachment":
		    				var filepath = msg.info.split("\\");
		    				var length = filepath.length;
		    				var message = '<span>'+ filepath[length - 1] +'</span><a href="'+ msg.info +'" download><i class="fa fa-download fa-fw"></i></a>';
		    				break;
						default:
							var message = "不支持预览，请在手机上查看。";
			    	}
			    	
			    	if (name == UserName) {
			    		var li = '<li class="message"><img class="pic-right" src="data:image/jpg;base64,'+ msg.pic +'"/>'
			                     	+ '<span class="message-box-right"><span class="message-user">'
			                        + '<p class="NickName-right"><span>'+ sendtime +'</span><span>我</span></p>'
			                        + '</span><span class="message-content"><i class="angle-right"></i>'
			                        + '<span class="text-right">'+ message +'</span></span></span></li>';
			    	}else{
			    		var li = '<li class="message unread"><img class="pic-left" src="data:image/jpg;base64,'+ msg.pic +'"/>'
			                     	+ '<span class="message-box-left"><span class="message-user">'
			                        + '<p class="NickName-left"><span>'+ name +'</span><span>'+ sendtime +'</span></p>'
			                        + '</span><span class="message-content"><i class="angle-left"></i>'
			                        + '<span class="text-left">'+ message +'</span></span></span></li>';
			    	}
			    	$("#" + contentID).append(li);
			    	RefreshDialogList();
				}
				return flag;
			});
			if (flag == 0) {
				var name = msg.name;
		    	var sendtime = " " + msg.time.split(" ")[1];
		    	switch(msg.type){
		    		case "Text":
		    			var message = msg.info;
		    			break;
		    		case "Video":
		    			var message = '<video class="message-video" src="'+ msg.info +'" controls="controls">your browser does not support the video tag</video>';
		    			break;
		    		case "Picture":
		    			var message = '<img src="'+ msg.info +'" class="emoji-pic" onclick="ShowOptions(this)"><div class="picture-func"><i class="fa fa-search-plus" title="查看" onclick="ShowPic(this)"></i><i class="fa fa-plus" title="添加表情"></i></div>';
			    		break;
		    		case "Recording":
		    			var message = '<audio src="'+ msg.info +'" controls="controls">your browser does not support the audio tag</audio>';
		    			break;
	    			case "Attachment":
	    				var filepath = msg.info.split("\\");
	    				var length = filepath.length;
	    				var message = '<span>'+ filepath[length - 1] +'</span><a href="'+ msg.info +'" download><i class="fa fa-download fa-fw"></i></a>';
	    				break;
					default:
						var message = "不支持预览，请在手机上查看。";
		    	}
		    	if (name == UserName) {
		    		var li = '<li class="message"><img class="pic-right" src="data:image/jpg;base64,'+ msg.pic +'"/>'
		                     	+ '<span class="message-box-right"><span class="message-user">'
		                        + '<p class="NickName-right"><span>'+ sendtime +'</span><span>我</span></p>'
		                        + '</span><span class="message-content"><i class="angle-right"></i>'
		                        + '<span class="text-right">'+ message +'</span></span></span></li>';
		    	}else{
		    		var li = '<li class="message unread"><img class="pic-left" src="data:image/jpg;base64,'+ msg.pic +'"/>'
		                     	+ '<span class="message-box-left"><span class="message-user">'
		                        + '<p class="NickName-left"><span>'+ name +'</span><span>'+ sendtime +'</span></p>'
		                        + '</span><span class="message-content"><i class="angle-left"></i>'
		                        + '<span class="text-left">'+ message +'</span></span></span></li>';
		    	}
		    	var pic = msg.grouppic;
		    	var content = "";
		    	for(var i = 0; i < pic.length; i++) {
	                 content = content + '<img class="message-pic" src="data:image/jpg;base64,'+ pic[i] +'"/>';
				}
				var groupli = '<li class="single-message" data-aite="'+ count +'"><span class="group-pic">'+ content +'</span>'
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

function RefreshDialogList() {
	var GroupList = $("#groups-ul");
	GroupList.find("li").each(function(index,e){
		if ($(this).find(".unreadnum").length > 0) {
			$(this).find(".unreadnum").remove();
		}
		if ($(this).hasClass("active")) {
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
				var span = '<span class="unreadnum">'+ count +'</span>';
				$(this).append(span);
			}
		}
	});
}

function getBasicInfo() {
	var UserInfo;
	$.ajax({
		type: "post",
		url: "/update",
		async: true,
		dataType: "json",
		success: function (data) {
			UserInfo = data.user;
			userpho = data.userpic;
			$("#mypic").attr("src","data:image/jpg;base64," + userpho);
			MessageSync(UserInfo.NickName);

			var Allgroups = $(".allgroups-content");
			var Allcontact = $(".allcontact-content");
			var Manager = $(".manager-content");
			Allgroups.html("");
			Allcontact.html("");
			Manager.html("");
			
			var c = "@";
			var regex = new RegExp(c, 'g');

			for (var i = 0; i < data.groups.length; i++) {
				var result = data.groups[i].id.match(regex);
				var count = !result ? 0 : result.length;
		    	var groupid = data.groups[i].id.substring(count , data.groups[i].id.length);
		    	var need = (data.groups[i].need == true) ? 'fa fa-check-square' : 'fa fa-square-o';
				var pic = data.groups[i].grouppic;
		    	var content = "";
		    	for(var j = 0; j < pic.length; j++) {
	                 content = content + '<img class="message-pic" src="data:image/jpg;base64,'+ pic[j] +'"/>';
				}
				content = content == "" ? '<img class="single-pic" src="static/img/weixin.jpg"/>' : content;
				var groupli = '<li class="single-message" data-aite="'+ count +'"><span class="group-pic">'+ content +'</span>'
	                          + '<span class="group-name" title="'+ data.groups[i].name +'" data-content="'+ groupid +'">'+ data.groups[i].name +'</span>'
	                          + '<span class="choosebox pull-right"><i class="'+ need +'"></i></span></li>';
				Allgroups.append(groupli);
				if (need == 'fa fa-check-square') {
					var groupli = '<li class="single-message" data-aite="'+ count +'"><span class="group-pic">'+ content +'</span>'
		                          + '<span class="group-name" title="'+ data.groups[i].name +'" data-content="'+ groupid +'">'+ data.groups[i].name +'</span></li>';
					Manager.append(groupli);
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