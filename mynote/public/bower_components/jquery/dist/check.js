/**
 * Created by 刘冶 on 2016/3/28.
 */



var usercheckd =false;
var pwdcheckd = false;
var repwdcheckd =false;

$(document).ready(function(){
    checkuser();
    checkpwd();
    checkrepwd();
    $("#remind").fadeOut(2000);
    $("#lgin").click(function(){
        var check =$("[name='chk']").prop("checked");
        if(check) {
            var data =$("[name='username']").val()+"_"+$("[name='passwd']").val();
            $.cookie('user_cookie',data, { expires: 7, path: '/' });
        }
        else{
            $.cookie('user_cookie',null);
        }
    })
    //$.backstretch([
    //    '../image/1.jpg',
    //    '../image/2.jpg',
    //    '../image/3.jpg',
    //], {
    //    fade : 1000, // 动画时长
    //    duration : 2000 // 切换延时
    //});

});



function ensure(){
    if(usercheckd&&pwdcheckd&&repwdcheckd)
        $("#btn").removeAttr("disabled");
    else{
        $("#btn").attr("disabled","true");
    }
}

function checkuser(){
    $("[name='user']").change(function() {
        var pattern = /[^\w|_]/i;
        var text=$(this).val();
        var test=pattern.exec(text);
        if(test != null)
        {
            $("#suggestion_user").show();
            $("#suggestion_user").fadeOut(2000);
            usercheckd =false;
        }
        else if(text.length<3||text.length>20){
            $("#suggestion_user2").show();
            $("#suggestion_user2").fadeOut(2000);
            usercheckd =false;
        }
        else{
            usercheckd =true;
        }
       ensure();
    });

}

function checkpwd(){
    $("[name='pwd']").change(function() {
        var text=$(this).val();
        var pattern1 = /\d/;
        var pattern2 = /[a-z]/;
        var pattern3 =/[A-Z]/;
        var pattern4 =/[^\w]/
        if(!(pattern1.test(text)&&pattern2.test(text)&&pattern3.test(text)&&!pattern4.test(text))){
            $("#suggestion_pwd").show();
            $("#suggestion_pwd").fadeOut(2000);
            pwdcheckd = false;
        }
        else if(text.length<6){
            $("#suggestion_pwd2").show();
            $("#suggestion_pwd2").fadeOut(2000);
            pwdcheckd = false;
        }
        else{
            pwdcheckd = true;
        }
       ensure();
    });
}

function checkrepwd(){
    $("[name='repwd']").change(function() {
        if($(this).val()!=$("[name='pwd']").val()){
            $("#suggestion_repwd").show();
            $("#suggestion_repwd").fadeOut(2000);
            repwdcheckd = false;
        }
        else{
            repwdcheckd = true;
        }
        ensure();
    });
}

