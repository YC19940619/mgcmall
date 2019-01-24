$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton",function(){
            window.location.href="wallet.html";
        }, false);
    }
    $(".goback").click(function(){
        window.location.href="wallet.html";
    })
    var uid = localStorage.getItem("uid");
    var sessionid = localStorage.getItem("sessionid");
    var senddata = {
        uid: uid,
        sessionid: sessionid
    }
    if(localStorage.getItem("lobank_card_id")){
        var bank_name =localStorage.getItem("lobank_name");
        var bank_card_id = localStorage.getItem("lobank_card_id");
        var username = localStorage.getItem("lousername");
        str ='<div class="bank" bank_name="'+bank_name+'" bank_card_id="'
            +bank_card_id+'" username="'+username+'"><p>'
            +bank_name+'('+bank_card_id.substr(bank_card_id.length-4)+
            ')</p><span class="iconfont">&#xe62e;</span></div>'
        $(".bankbox").html(str)
    }else{
        //查询银行卡
        $.ajax({
            type: 'GET',
            url: bank_card,
            data:senddata,
            success: function(data){
                console.log(data)
                if(data.status == 20122){//未绑定
                    $(".bankbox").html("请选择到账账户")
                }else{
                    var bank_name = data.bankcard_info[0].bank_name;
                    var bank_card_id = data.bankcard_info[0].bank_card_id;
                    var username = data.bankcard_info[0].username;
                    str ='<div class="bank" bank_name="'+bank_name+'" bank_card_id="'
                        +bank_card_id+'" username="'+username+'"><p>'
                        +bank_name+'('+bank_card_id.substr(bank_card_id.length-4)+
                        ')</p><span class="iconfont">&#xe62e;</span></div>'
                    $(".bankbox").html(str)
                }
            },
            error:function(data){
                new Toast({context: $('body'), message: "网络加载失败"}).show();
            }
        });
    }
    $(".money input").bind('input propertychange',function(){//input的内容发生变化时
        var money = $(".money input").val();
        var testInp = /^[1-9]*[1-9][0-9]*$/;
        if(!testInp.test(money)){
            if(money==""){
                $(".redNotice").text("* 请输入提现金额")
            }else{
                $(".redNotice").text("* 请输入正整数")
            }
        }else if(money>=Number(localStorage.getItem("profit"))){
            $(".redNotice").text("* 您的余额不足")
        }else if(money<100){
            $(".redNotice").text("* 提现金额必须大于100元")
        }else{
            $(".redNotice").text("")
        }
    });
    $(".btn").click(function(){
       var money = $(".money input").val();
        var testInp = /^[1-9]*[1-9][0-9]*$/;
        if(!testInp.test(money)){
            if(money==""){
                new Toast({context:$('body'),message:"请输入提现金额"}).show();
                $(".redNotice").text("* 请输入提现金额")
            }else{
                new Toast({context:$('body'),message:"请输入正整数"}).show();
                $(".redNotice").text("* 请输入正整数")
            }
        }else if(money>=Number(localStorage.getItem("profit"))){
            new Toast({context:$('body'),message:"您的余额不足"}).show();
            $(".redNotice").text("* 您的余额不足")
        }else if(money<100){
            new Toast({context:$('body'),message:"提现金额必须大于100元"}).show();
            $(".redNotice").text("* 提现金额必须大于100元")
        }else{
            $(".redNotice").text("");
            if($(".bankbox").text()=="请选择到账账户"){//未选择银行卡
                new Toast({context:$('body'),message:"请选择到账账户"}).show();
            }else{//已选择银行卡
                //查询密码
                $.ajax({
                    type: 'GET',
                    url: bank_card_pw,
                    data:senddata,
                    success: function(data){
                        console.log(data);
                        if(data.status==0){
                            $(".maskentry").css("display","block");
                        }else{
                            $(".masksetup").css("display","block");
                        }
                    },
                    error:function(data){
                        new Toast({context: $('body'), message: "网络加载失败"}).show();
                    }
                });
            }
        }
    })
    $(".bankbox").click(function(){
        window.location.href="changebank.html";
    })
    $(".none").focus(function(){
        $(".fcous").css("display","block")
    });
    $(".none").on("input", function() {
        var $input = $(".input-box input");
        if(!$(this).val()) { //无值光标顶置
            $('.fcous').css('left',$input.eq(0).width()/2);
        }
        if(/^[0-9]*$/g.test($(this).val())) { //有值只能是数字
            var left=0;
            var pwd = $(this).val().trim();
            for(var i = 0, len = pwd.length; i < len; i++) {
                $input.eq(i).val(pwd[i]);
                if($input.eq(i).next().length) { //模拟光标，先将图片容器定位，控制left值而已
                    left+= $input.eq(i).width()+parseInt($input.eq(i).css("margin-right"));
                    $('.fcous').css('left', left+$input.eq(i).width()/2);
                }
            }
            $input.each(function() { //将有值的当前input后的所有input清空
                var index = $(this).index();
                if(index >= len) {
                    $(this).val("");
                }
            });
            if(len === 6) {
                //执行其他操作
                console.log('输入完整，执行操作');
                //提现
                var senddata = {
                    uid: uid,
                    sessionid: sessionid,
                    password:$(".none").val(),
                    submit_num:$(".money input").val(),
                    bank_card_id:$(".bank").attr("bank_card_id")
                }
                $.ajax({
                    type: 'post',
                    url: withdraw,
                    data:senddata,
                    success: function(data){
                        console.log(data)
                        if(data.status == 0){
                            window.location.href="presentrecord.html";
                        }else if(data.status==20133){
                            $(".entrypassword .red").text('提现密码错误，请重试');
                        }
                    },
                    error:function(data){
                        new Toast({context: $('body'), message: "网络加载失败"}).show();
                    }
                });
            }
        } else { //清除val中的非数字，返回纯number的value
            $(this).val($(this).val().replace(/\D/g,""));
            console.log($(this).val());
        }
    });
    $(".setuppassword .left").click(function(){//取消
        $(".masksetup").css("display","none");
    })
    $(".setuppassword .right").click(function(){//设置密码
        window.location.href="setuppassword.html";
    })
    $(".entrypassword .empty").click(function(){//X号
        $(".maskentry").css("display","none");
    })
    $(".entrypassword .forget span").click(function(){//重置密码
        window.location.href="modifypassword.html";
    })
})