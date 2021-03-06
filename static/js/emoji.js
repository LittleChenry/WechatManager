var groupfiles=[];
var base64group=[];
$(function(){
    $(document).unbind('click').bind('click',function() {
        $('.emoijbox').css('display','none');
        $('#emoijdivgroup').css('display','none');
    });
    $("#emoij").unbind("click").bind("click",function(e) {
        e.stopPropagation();
        $(".template-area").hide();
        $.ajax({
            type: "post",
            url: "/emoijtitle",
            dataType: "json",
            async:false,
            success: function (data) {
                $("#titleul").empty();
                var list=data.titlelist;
                var content='';
                for(var i=0;i<list.length;i++)
                {
                    if(list[i]=="guanfang")
                {
                    content=content+'<li id="'+list[i]+'" onclick="changetitle(this,event)"><span>官方表情</span></li>';
                    break;
                }
                }
                for(var i=0;i<list.length;i++)
                {
                    if(list[i]=="shoucang")
                    {
                        content=content+'<li id="'+list[i]+'" onclick="changetitle(this,event)"><span>收藏表情</span></li>';
                        break;
                    }
                }
                for(var i=0;i<list.length;i++)
                {
                    if(list[i]!="shoucang"&& list[i]!="guanfang")
                    {
                        content=content+'<li id="'+list[i]+'" onclick="changetitle(this,event)"><span>'+list[i]+'</span></li>';
                    }
                }
                $("#titleul").append(content);
            }
        });
        $(".emoijbox").show();
        var width=0;
        var ligroup=$("#titleul").find("li");
        for(var i=0;i<ligroup.length;i++)
        {
            width=width+$(ligroup[i]).width();
        }
        $("#emoijtitle2").width(width+100);
        $("#titleul li:eq(0)").addClass("liactive");
        $.ajax({
            type: "post",
            url: "/emoij",
            dataType: "json",
            success: function (data) {
                $("#emoijul").empty();
                $("#emoijpanel").removeClass("shoucang");
                $("#emoijpanel").addClass("guanfang");
                var list=data.list;
                var content="";
                for(var i=0;i<list.length;i++){
                    content=content+'<li><img onclick="sendguanfangemoij(this,event)" src="'+list[i]+'"/></li>';
                }
                $("#emoijul").append(content);
            }
        });
    });
    
    $("#emoijgroup").unbind("click").bind("click",function(e) {
        e.stopPropagation();
        $(".multitemplate-area").hide();
        $.ajax({
            type: "post",
            url: "/emoijtitle",
            dataType: "json",
            async:false,
            success: function (data) {
                $("#titleulgroup").empty();
                var list=data.titlelist;
                var content='';
                for(var i=0;i<list.length;i++)
                {
                    if(list[i]=="guanfang")
                {
                    content=content+'<li id="'+list[i]+'" onclick="changetitlegroup(this,event)"><span>官方表情</span></li>';
                    break;
                }
                }
                for(var i=0;i<list.length;i++)
                {
                    if(list[i]=="shoucang")
                {
                    content=content+'<li id="'+list[i]+'" onclick="changetitlegroup(this,event)"><span>收藏表情</span></li>';
                    break;
                }
                }
                for(var i=0;i<list.length;i++)
                {
                    if(list[i]!="shoucang"&& list[i]!="guanfang")
                    {
                        content=content+'<li id="'+list[i]+'" onclick="changetitlegroup(this,event)"><span>'+list[i]+'</span></li>';
                    }
                }
                $("#titleulgroup").append(content);
            }

        });
        $("#emoijdivgroup").show();
        var width=0;
        var ligroup=$("#titleulgroup").find("li");
        for(var i=0;i<ligroup.length;i++) {
            width=width+$(ligroup[i]).width();
        }
        $("#emoijtitle2group").width(width+100);
        $("#titleulgroup li:eq(0)").addClass("liactive");
        $.ajax({
            type: "post",
            url: "/emoij",
            dataType: "json",
            success: function (data) {
                $("#emoijulgroup").empty();
                var list=data.list;
                var content="";
                for(var i=0;i<list.length;i++)
                {
                    $("#emoijpanelgroup").removeClass("shoucang");
                    $("#emoijpanelgroup").addClass("guanfang");
                    content=content+'<li><img onclick="sendguanfangemoij(this,event)" src="'+list[i]+'"/></li>';
                }
                $("#emoijulgroup").append(content);
            }
        });

    })

    $("#close").unbind("click").bind("click",function(){
        $(".emoijbox").hide();
    })

    $("#closegroup").unbind("click").bind("click",function(){
        $("#emoijdivgroup").hide();
    })

    $("#importemoij").unbind("click").bind("click",function(e){
        $("#importemoijfile").click();
       // e.stopPropagation();
    })

    $("#emoijimportclose").unbind("click").bind("click",function(){
        $("#emoijimport").hide();
        $("#importemoijfile").attr("type","file");
    })

    $("#sendinport").unbind("click").bind("click",function(){
        if(groupfiles.length==0)
        {
            alert("没有表情需要导入");
            return;
        }
        var imgdata = new FormData();
        for(var i=0;i<groupfiles.length;i++)
        {
            imgdata.append("importlist"+i,groupfiles[i]);
        }
        imgdata.append("title",$("#title").val());
        imgdata.append("length",groupfiles.length);
        $.ajax({
            type: "post",
            url: "/impemoij",
            data: imgdata,
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {
                alert("导入成功");
                $("#importemoijfile").attr("type","file");
                $("#emoijimport").css("display",'none');
            }
        });
    })

})

function changetitle(evt,event){
    event.stopPropagation();
    var $title=$(evt);
    if(!$title.hasClass("liactive")){
        $("#titleul li.liactive").removeClass("liactive");
        var id=$title.attr("id");
        $title.addClass("liactive");
        $.ajax({
            type: "post",
            url: "/emoijone",
            data: {id:id},
            dataType: "json",
            success: function (data) {
                $("#emoijul").empty();
                var list=data.list;
                var content="";
                if(id=="guanfang"){
                    $("#emoijpanel").removeClass("shoucang");
                    $("#emoijpanel").addClass("guanfang");
                    for(var i=0;i<list.length;i++){
                        content=content+'<li><img onclick="sendguanfangemoij(this,event)" src="'+list[i]+'"/></li>';
                    }
                }else{
                    $("#emoijpanel").removeClass("guanfang");
                    $("#emoijpanel").addClass("shoucang");
                    for(var i=0;i<list.length;i++){
                        content=content+'<li><img onclick="sendemoij(this,event)" src="'+list[i]+'"/><i onclick="deleteemoij(this,event)" class="fa fa-window-close closeli"></i></li>';
                    }
                }
                    $("#emoijul").append(content)
                }
        });
    }
}


function changetitlegroup(evt,event){
    event.stopPropagation();
    var $title=$(evt);
    if(!$title.hasClass("liactive")){
        $("#titleulgroup li.liactive").removeClass("liactive");
        var id=$title.attr("id");
        $title.addClass("liactive");
        $.ajax({
            type: "post",
            url: "/emoijone",
            data: {id:id},
            dataType: "json",
            success: function (data) {
                $("#emoijulgroup").empty();
                var list=data.list;
                var content="";
                if(id=="guanfang"){
                $("#emoijpanelgroup").removeClass("shoucang");
                $("#emoijpanelgroup").addClass("guanfang");
                for(var i=0;i<list.length;i++){
                    content=content+'<li><img onclick="sendguanfangemoijgroup(this,event)" src="'+list[i]+'"/></li>';
                }
                }else{
                    $("#emoijpanelgroup").removeClass("guanfang");
                    $("#emoijpanelgroup").addClass("shoucang");
                    for(var i=0;i<list.length;i++){
                        content=content+'<li><img onclick="sendemoijgroup(this,event)" src="'+list[i]+'"/><i onclick="deleteemoij(this,event)" class="fa fa-window-close closeli"></i></li>';
                    }
                }
                $("#emoijulgroup").append(content);
            }
        });
    }
}

function handleFiles(e) {
    groupfiles=e.target.files;
    base64group=[];
    $("#emoijimportul").empty();
    for(var i=0;i<groupfiles.length;i++){
        var reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
            $("#emoijimportul").append('<li><img src="'+this.result+'"/><i onclick="deleteli(this)" class="fa fa-window-close closeli"></i></li>')
        };
        })(groupfiles[i]);
        reader.readAsDataURL(groupfiles[i]);
    }
    $("#importemoijfile").attr("type","txt");
    $("#emoijimport").css('display','block');
}


function deleteli(evt){
    var $ele=$(evt).parent();
    var index = $ele.index();
    groupfiles1=[];
    for(var i=0;i<index;i++){
        groupfiles1[i]=groupfiles[i];
    }
    for(var i=index;i<groupfiles.length-1;i++){
        groupfiles1[i]=groupfiles[i+1];
    }
    groupfiles=groupfiles1;
    $ele.remove();
}


function sendemoij(evt,event){
    event.stopPropagation();
    var $emoij=$(evt);
    var src=$emoij.attr("src");
    var groups = new Array();
    var groupnames = new Array();
    var count = 0;
    var sendid;
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
        url: "/sendemoij",
        data:{
            groups:groups,
            message:src
        },
        dataType: "json",
        success: function (data) {
            var today = new Date();
            var sendtime = today.toLocaleTimeString();
            var pic = $("#mypic").attr("src");
            var filepath = data.success.split("/");
            var length = filepath.length;
            var message ='<img src="'+ data.success +'" class="emoji-pic" onclick="ShowOptions(this)"><div class="picture-func"><i class="fa fa-search-plus" title="查看" onclick="ShowPic(this)"></i><i class="fa fa-plus" onclick="tianjia(this)" title="添加表情"></i></div>';
            var li = '<li class="message"><img class="pic-right" src="'+ pic +'"/>'
                    + '<span class="message-box-right"><span class="message-user">'
                    + '<p class="NickName-right"><span>'+ sendtime +'</span><span> 我</span></p>'
                    + '</span><span class="message-content"><i class="angle-right"></i>'
                    + '<span class="text-right">'+ message +'</span></span></span></li>';
            $("#" + sendid).append(li);
        }
    });
    $("#emoijdiv").hide();
    alert("发送成功!");
}


function sendguanfangemoij(evt,event){
    event.stopPropagation();
    var $emoij=$(evt);
    var src=$emoij.attr("src");
    var value=src.split("/");
    var value1=value[value.length-1];
    var message="";
    for(var key in face){
        if(face[key]==value1){
            message=key;
            break;
        }
    }
    $(evt).parents(".emoijbox").prev().find("textarea").val($(evt).parents(".emoijbox").prev().find("textarea").val() + message);
}


function sendemoijgroup(evt,event){
    event.stopPropagation();
    var $emoij=$(evt);
    var src=$emoij.attr("src");
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
    $.ajax({
        type: "post",
        url: "/sendemoij",
        data:{
            groups:groups,
            message:src
        },
        dataType: "json",
        success: function (data) {
            var today = new Date();
            var sendtime = today.toLocaleTimeString();
            var pic = $("#mypic").attr("src");
            var filepath = data.success.split("/");
            var length = filepath.length;
            var message ='<img src="'+ data.success +'" class="emoji-pic" onclick="ShowOptions(this)"><div class="picture-func"><i class="fa fa-search-plus" title="查看" onclick="ShowPic(this)"></i><i class="fa fa-plus" onclick="tianjia(this)" title="添加表情"></i></div>';
            var li = '<li class="message"><img class="pic-right" src="'+ pic +'"/>'
                    + '<span class="message-box-right"><span class="message-user">'
                    + '<p class="NickName-right"><span>'+ sendtime +'</span><span> 我</span></p>'
                    + '</span><span class="message-content"><i class="angle-right"></i>'
                    + '<span class="text-right">'+ message +'</span></span></span></li>';
            $("#" + sendid).append(li);

        }
    });
    $("#emoijdivgroup").hide();
    alert("发送成功!");
}


function sendguanfangemoijgroup(evt,event){
    event.stopPropagation();
    var $emoij=$(evt);
    var src=$emoij.attr("src");
    var value=src.split("/");
    var value1=value[value.length-1];
    var message="";
    for(var key in face){
        if(face[key]==value1){
            message=key;
            break;
        }
    }
    $("#multimessage-text").val( $("#multimessage-text").val()+message);

}

function tianjia(){
    alert("您已经收藏此表情!");
}
function deleteemoij(evt,event)
{
    event.stopPropagation();
    var $emoij=$(evt).prev();
    var src=$emoij.attr("src");
    $.ajax({
        type: "post",
        url: "/deleteemoij",
        data:{
            message:src
        },
        dataType: "json",
        success: function (data) {
          if(data.success)
          {
              $(evt).parent().remove();
          }

        }
    });

}