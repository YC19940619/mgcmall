$(function(){
    FastClick.attach(document.body);
    var uid=localStorage.getItem('uid');
    var sessionid=localStorage.getItem('sessionid');
    //获取头像和登录状态和邀请码
    loginstate(uid,sessionid)
    function loginstate(uid,sessionid){
        var senddata = {
            uid:uid,
            sessionid:sessionid
        }
        if(uid == '' || uid == null || uid == undefined || sessionid == '' || sessionid == null || sessionid == undefined){
            $('.user .loginstate').text("未登录");
        }else{
            $('.user .loginstate').text(localStorage.getItem("nickname"));
            $('.user .headimg').attr('src',localStorage.getItem('head_image'));
        }
        queryIntegral(senddata)
        $.ajax({//查询邀请码
            type: "get",
            url: getdealersys ,
            async: true,
            crossDomain: true,
            data: {
                uid:uid,
                sessionid:sessionid
            },
            success: function(data) {
                if(data.status==0){
                    $(".myCode .center").text(data.sharing_code);
                }
            },
            error:function(){
                new Toast({context:$('body'),message:"网络故障"}).show();
            }
        })
    }
    $('.sign').click(function() {
        var senddata = {
            uid: uid,
            sessionid: sessionid
        }
        signing(senddata)
    })
    $(".user .headimg").click(function(){
        show_login(function (){
            window.location.href="personMes.html"
        },function (){
            window.location.reload()
        })
    })
    $(".list li").click(function(){
        window.location.href = $(this).attr("class")+".html"
    })

})
