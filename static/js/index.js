$(function(){
    var data = {
    "name": "test",
    "age": 1
    };
    
    
    $.ajax({
        url:"/postpara",
        data:data,
        type:"post",
        //dataType: 'json',

        success:function (data) {
           alert(data);
        },
        error:function () {
            alert("asd")
        }
    });

    $("#test").bind("click", function () {
         $.ajax({
        url:"/test",
        type:"post",
        //dataType: 'json',

        success:function (data) {
           alert(data);
        },
        error:function () {
            alert("error")
        }
    });
    });

    $("#info").bind("click",function () {
        var str = $("#text").val();
        $.ajax({
            type: "POST",
            url: "/info",
            data:{"information": str},
            success: function (data) {

            }
        });
    });
});
