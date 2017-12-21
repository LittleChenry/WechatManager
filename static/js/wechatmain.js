$(document).ready(function () {
	$(".content").height($(window).height() - 10);
	$(".content").width($(window).width() * 0.85);
	$(".menu").height($(window).height() - 9);
	$(".submenu").height($(window).height() - 9);
	$(".contact-list").height($(window).height() - 97);
	$(".thirdmenu").height($(window).height() - 9);
	$(".content-menu").height($(window).height() - 9);
	$(".extramenu").height($(window).height() - 9);
	$(".dialogue-send").height($(window).height() * 0.35 - 72);
	$(".send-area").height($(".dialogue-send").height() - 68);
	$(".keyword-send").height($(window).height() * 0.35 - 60);
	$(".thirdmenu").width($(".content").width() - $(".menu").width() - $(".submenu").width() - 254);
	$(".content-menu").width($(".content").width() - $(".menu").width() - $(".submenu").width() - 4);
	//$(".modal").show();
})

$(function(){
	getBasicInfo("/getQR");

	$(".menu-list").each(function(index,e){
		$(this).unbind("click").bind("click",{index:index},function(e){
			$(".menu-list").each(function(index,e){
				if ($(this).find("a").hasClass("menu-a-active")) {
					$(this).find("a").removeClass("menu-a-active").addClass("menu-a");
				}
			});
			$(this).find("a").removeClass("menu-a").addClass("menu-a-active");
			$(".groupsend").hide();
			$(".config").hide();
			$(".collection").hide();
			switch(e.data.index){
				case 0:
					$(".groupsend").show();
					break;
				case 1:
					$(".config").show();
					break;
				case 2:
					$(".collection").show();
					break;
			}
		});
	});
	
	$("#send").unbind("click").bind("click",function(){
		var message = $("#message-text").val();
		$("#message-text").val("");
		if (message != "") {
			var groups = new Array();
			var groupnames = new Array();
			var count = 0;
			$("#groups-ul").find("li").each(function(index, e){
				if ($(this).find("i").hasClass("fa-check-square")) {
					groups[count] = $(this).find("span:first").attr("id");
					groupnames[count++] = $(this).find("span:first").attr("title");
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
					var messagearea = $(".conversation-area");
					var g = "";
					for (var i = 0; i < groupnames.length; i++) {
						g += groupnames[i];
						if (groupnames.length - 1 != i) {
							g += "、";
						}
					}
					var li = '<li class="message"><img class="pic-right" src="static/img/pic.jpg">'
	                            + '<span class="message-box-right"><span class="message-content">'
	                            + '<i class="angle-right"></i><span class="text-right">'
	                            + '<p class="group-names-p" title="' + g + '">' + g + '</p>'
	                            + '<p class="group-text-p">' + message + '</p>'
	                            + '</span></span></span></li>';
	                messagearea.append(li);
				}
			});
		}else{
			alert("消息不能为空");
		}
		
	});

	$("#setdefaultgroups").unbind("click").bind("click",function(){
		var groups = new Array();
		var groupnames = new Array();
		var count = 0;
		$("#groups-ul").find("li").each(function(index, e){
			if ($(this).find("i").hasClass("fa-check-square")) {
				groups[count] = $(this).find("span:first").attr("id");
				groupnames[count++] = $(this).find("span:first").attr("title");
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
				getBasicInfo("/update");
			}
		});
	});

	$("#keyword-save").unbind("click").bind("click",function(){
		var keyword = $("#keyword").val();
		$("#keyword").val("");
		var reply = $("#reply").val();
		$("#reply").val("");
		if (keyword != "" && reply != "") {
			var groups = new Array();
			var groupnames = new Array();
			var count = 0;
			$("#groups-ul").find("li").each(function(index, e){
				if ($(this).find("i").hasClass("fa-check-square")) {
					groups[count] = $(this).find("span:first").attr("id");
					groupnames[count++] = $(this).find("span:first").attr("title");
				}
				return count;
			});
			$.ajax({
				type: "post",
				url: "/addKeyWord",
				data:{
					groups:groups,
					keyword:keyword,
					reply:reply
				},
				dataType: "json",
				success: function (data) {
					var keywordreplyul = $("#keyword-reply-ul");
					var g = "";
					for (var i = 0; i < groupnames.length; i++) {
						g += groupnames[i];
						if (groupnames.length - 1 != i) {
							g += "、";
						}
					}
					var li = '<li class="message"><span class="message-box-left">'
                                + '<span class="message-content"><i class="angle-left"></i>'
                                + '<span class="text-left"><p class="group-names-p" title="' + g + '">'+ g +'</p>'
                                + '<p class="group-text-p">关键词：' + keyword + '</p>'
                                + '<p class="group-text-p">回复：' + reply + '</p>'
                                + '</span></span></span></li>';
	                keywordreplyul.append(li);
				}
			});
		}else{
			if (keyword == "") {
				alert("请输入关键词");
				return false;
			}else{
				alert("请输入回复");
				return false;
			}
		}
	});
});

function findChoseGroup(){
	$("#ChoseGroup-area").html("");
	$(".single-group").each(function(){
		if ($(this).find("i").hasClass("fa-check-square")) {
			var name = $(this).find("span:first").attr("title");
			var p = '<p class="chosegroup-p">'+ name +'</p>';
			$("#ChoseGroup-area").append(p);
		}
	});
}

function getBasicInfo(url){
	$.ajax({
		type: "post",
		url: url,
		dataType: "json",
		success: function (data) {
			var ul = $("#groups-ul");
			ul.html("");
			for (var i = 0; i < data.length; i++) {
				var need = (data[i].need == true) ? 'fa fa-check-square' : 'fa fa-square-o';
				var manage = (data[i].need == true) ? '（已管理）' : '';
				var li = '<li class="single-group"><img class="message-pic" src="static/img/weixin.jpg">'
					+ '<span id="'+ data[i].id +'" class="group-name" title="'+ data[i].name + manage +'">'+ data[i].name
					+ '</span><span class="choose-box"><i class="' + need + '"></i></span></li>';
				ul.append(li);
			}
			findChoseGroup();
			$(".choose-box").unbind("click").bind("click",function(){
    			if ($(this).find("i").hasClass("fa-check-square")) {
    				$(this).find("i").removeClass("fa-check-square");
    				$(this).find("i").addClass("fa-square-o");
    			}else{
    				$(this).find("i").removeClass("fa-square-o");
    				$(this).find("i").addClass("fa-check-square");
    			}
    			findChoseGroup();
			});
        }
	});
}