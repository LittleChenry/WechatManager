function getBasicInfo(url){
	var UserInfo;
	$.ajax({
		type: "post",
		url: url,
		async: true,
		dataType: "json",
		success: function (data) {
			UserInfo = data.user;
			userpho = data.userpic;
			$("#mypic").attr("src","data:image/jpg;base64," + userpho);
			MessageSync(UserInfo.NickName);
			
        }
	});
}