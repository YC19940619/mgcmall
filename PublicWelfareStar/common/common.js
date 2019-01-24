//定义接口
//域名
var source_id = "SW_Phone"
// var domainL = "https://api.lovecantouch.com";
var domainLm = "http://www.lovecantouch.com/share/";
var domainL = "http://apidev.lovecantouch.com"
// var domainL = "http://192.168.1.131:8002"
var index_htnk = domainL + "/news/index/";
//热门推荐
var series = domainL + "/news/series";
//定制成品商品详情
var goods_details = domainL +"/shopping/product/";
//商城筛选
var shopping_categorys = domainL +"/shopping/categorys"
//商城列表
var goods_list = domainL +"/shopping/products";
//定制列表
var customgoods_list= domainL +"/shopping/customproducts";
//丛首饰盒加入到购物车
var addJewelryToCart = domainL + "/shopping/addJewelryToCart/"
//添加首饰盒
var sjb_addition = domainL + "/shopping/add/jewelrybox/";
//删除首饰盒
var sjb_drop = domainL + "/shopping/drop/jewelrybox/";
//查看首饰盒
var sjb_display = domainL + "/shopping/show/jewelrybox/";
//添加购物车
var cart_addition = domainL +"/shopping/add/cart/";
//立即购买
var buyNow = domainL + "/shopping/buyNow/";
//修改购物车数量
var cart_change = domainL +"/shopping/change/cart/";
//查看购物车
var cart_display = domainL + "/shopping/show/cart/";
//删除购物车
var cart_drop = domainL + "/shopping/drop/cart/";
//确认订单
var confirm_order=domainL + "/shopping/confirm/order/";
//生成订单
var addorder = domainL + "/shopping/add/order/";
//订单列表
var orderlist = domainL + "/order/";
//确认订单
var confirm_receipt=domainL + "/order/confirm/receipt/";
// 上传图片
var photoUpload = domainL + '/personal/head_image_change';
//保存用户个人信息
var savePersonMes = domainL + "/personal/nickname_sex_change";
//查询收获地址
var addressSearch = domainL + "/personal/sa_display";
//删除收获地址
var addressDelete = domainL + "/personal/sa_drop";
//编辑收获地址
var addressUpdate = domainL + "/personal/sa_change";
//添加新收获地址
var addressAdd = domainL+ "/personal/sa_addition";
//默认地址
var addressDefault = domainL + "/personal/sa_default_address";
//退出个人账号
var personSettinglogout = domainL + "/frontend/logout";
//发送手机号验证码
var phonevcode = domainL+ "/frontend/vcode";
//绑定手机验证码
var qqorwechatvcode= domainL+ "/frontend/qqorwechat/vcode";
//手机号登陆
var phone_num_login = domainL + "/frontend/logining";
//QQ登录
var qqlogin = domainL + "/frontend/qq/login/";
//微信登录
var wechat_authorization = domainL + "/frontend/wechat_authorization";
//支付宝支付信息
var alipayinfo = domainL + "/order/alipay/info/generate/";
//确定支付宝支付结果
var alipayquery = domainL + "/order/alipay/query/";
//绑定手机号发送验证码：
var phoneBindvcode = domainL + "/personal/phone_num_binding_vcode";
//手机号绑定
var phone_num_binding = domainL+ "/personal/phone_num_binding";
//查看默认收货地址
var sa_default_display = domainL + "/personal/sa_default_display";
//后台生成文件
var user_file_generation = domainL + "/personal/user_file_generation"
//确认订单文件
var order_user_file_generation = domainL + "/personal/order_user_file_generation"
//微信支付
var wechat_prepay_generation = domainL + "/frontend/wechat_prepay_generation"
//确定微信支付结果
var wechat_order_query = domainL+ "/frontend/wechat_order_query";
//线下支付
var offline_payment = domainL+ "/order/offline/payment/";
//查看用户签到接口
var judgeSign=domainL + "/personal/show/signin/";
//查询余额和邀请码
var  getdealersys =domainL+"/personal/dealersys";
//用户签到接口
var doSign=domainL + "/personal/doing/signin/";
//二维码
var QRCodeUrlGenerate= domainL +"/shopping/QRCodeUrlGenerate/";
//分享图片
var SharePicturesGenerate= domainL +"/shopping/SharePicturesGenerate/";
//上传多图
var uploadpictures=  domainL +"/news/choiceness/upload/pictures";
//分享到定制精选
var choiceness_details=  domainL +"/news/choiceness/details";
//发现1
var faxian1= domainL +"/news/faxian";
//发现2
var choiceness_list = domainL+"/news/choiceness/list";
//发现2点赞
var choiceness_thumbup= domainL+"/news/choiceness/thumbup";
//绑定银行卡
var bank_card =  domainL +"/personal/bank_card";
// get  uid sessionid
// post uid sessionid bank_name username bank_card_id
// delete (参数stringify) uid sessionid bank_card_id
// patch (参数stringify) uid sessionid bank_name username bank_card_id origin_bank_card_id
//提现
var withdraw =  domainL +"/personal/withdraw"
// get uid sessionid
// post uid sessionid submit_num bank_card_id
var withdraw_detail =  domainL +"/personal/withdraw_detail"
//设置密码
var bank_card_pw =  domainL +"/personal/bank_card_pw";
// get uid sessionid
// post uid sessionid password  设置
// patch (参数stringfy) uid sessionid phone_num submit_vcode password 重置
//验证码校验
var vcode =  domainL +"/personal/vcode";
//登录日志信息
var record_login = domainL+"/personal/record/login";
//定制日志信息
var custom_history = domainL+"/personal/record/custom_history";

function sortByKeys(myObj) {//数据按照阿斯克码排序
    var str ="";
    var keys = Object.keys(myObj);//拿出key
    keys.sort()//key排序
    var sortedObject = Object()//创建一个新的对象
    for(i in keys) {//按照重新排序的key填入对象
        key = keys[i];
        sortedObject[key] = myObj[key];
        if(typeof(myObj[key]) == "object") {
            str += key + "=" + JSON.stringify(myObj[key]) + "&"
        } else {
            if(myObj[key]||myObj[key]==0){
                str += key + "=" + myObj[key] + "&"
            }
        }
    }
    // console.log(str)
    str = str.substring(0, str.lastIndexOf('&'));
    // var SWtoken = "3e03683b9cfe7d6c81200a29449779ac17cae35de1f8a30b2a630c73c6aae835";
    var SWtoken = "6AB45464E7FAD2EB3F30AC7B4C936627";
    var first_SWtoken = SWtoken.substr(0, 6);
    var last_SWtoken = SWtoken.substr(6, SWtoken.length - 1);
    // sortedObject['signature'] = md5(first_SWtoken + str + last_SWtoken).toUpperCase();//添加签名
    sortedObject['sign'] = md5(str + "&key=" + SWtoken).toUpperCase();//添加签名
    return sortedObject  //return一个新的对象
}
var Request = { //获取url地址参数
    QueryString: function(val) {
        var uri = window.location.search;
        var re = new RegExp("" + val + "=([^&?]*)", "ig");
        return((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : "");
    }
}
// function getQueryString(name, str) { //获取url地址参数
// 	str = str || decodeURIComponent(window.location.search);
// 	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
// 	var r = str.substr(1).match(reg);
// 	if(r != null) {
// 		return unescape(r[2]);
// 	}
// 	return null;
// }
//图片地址
function dataimgsrc(src){
    if(src.indexOf("http") === -1 && src.indexOf("https") === -1 ){
        if(src.indexOf("media") > -1){
            src =domainL+src;
        }else{
            src =domainL+"/media/"+src;
        }
    }
    return src
}
//图片大小显示
function showimg(obj) { //obj最终必须是img元素
    obj.one('load', function() {
        var imgwidth = $(this).width();
        var imgheight = $(this).height();
        $(this).css("width", "");
        $(this).css("height", "");
        if(imgheight < imgwidth) {
            $(this).css("width", "100%");
            var heightdt = $(this).parent().height();
            var margint = (heightdt - $(this).height()) / 2;
            $(this).css("margin-top", margint);
        } else {
            $(this).css({ "height": "100%", "margin": "0 auto" });
        }
    }).each(function() {
        if(this.complete) $(this).load();
    });
}
//查看大图
function bigimg(src){
    $(".maskbigimg").remove();
    var str ='<div class="maskbigimg"><div style="width:100%;height:100%;" class="imgbj"></div></div>';
    $("body").append(str)
    $(".maskbigimg .imgbj").css({"background":"url('"+src+"') no-repeat center center","background-size":"60%"})
    $(".maskbigimg").click(function(){
        $(".maskbigimg").remove();
    })
}
//模拟安卓弹窗
var Toast = function(config) {
    this.context = config.context == null ? $('body') : config.context; //������
    this.message = config.message; //��ʾ����
    this.time = config.time == null ? 3000 : config.time; //����ʱ��
    this.left = config.left; //��������ߵľ���
    this.top = config.top; //�������Ϸ��ľ���
    this.init();
}
var msgEntity;
Toast.prototype = {
    init: function() {
        $("#toastMessage").remove();
        var msgDIV = new Array();
        msgDIV.push('<div id="toastMessage">');
        msgDIV.push('<span style="font-size:0.28rem;">' + this.message + '</span>');
        msgDIV.push('</div>');
        msgEntity = $(msgDIV.join('')).appendTo(this.context);
        //������Ϣ��ʽ
        var left = this.left == null ? this.context.width()/2 - msgEntity.find('span').width() /2-10 : this.left;
        var top = this.top == null ? this.context.height() / 2 - msgEntity.find('span').height() / 2 : this.top;
        msgEntity.css({
            'position': 'absolute',
            'top': top,
            'z-index': '999999',
            'left': left,
            'background-color': 'black',
            'color': 'white',
            'font-size': '0.28rem',
            'padding': '10px 10px',
            'border-radius':'3px'

        });
        msgEntity.hide();
    },
    show: function() {
        msgEntity.fadeIn(this.time / 2);
        msgEntity.fadeOut(this.time / 2);
    }
}
//随机数
function RndNum(n) {
    var rnd = "";
    for(var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;
}
function show_confirm(info, callback) { //两个参数：info为需要显示的内容,callback为回调函数
    var content = '<div class="show_info_contain" id="contain-info-show"><div class="show_info_content">'+info
        +'</div><div class="show_info_confirm_cancel tr" id="show_info_confirm_cancel"><a href="javascript:void(0);" id="confirm-info-show" class="btn btn1">取消</a><a href="javascript:void(0);" id="cancel-info-show" class="btn btn2">确认</a></div></div>'
    $('body .show_info_contain').remove()
    $('body').append(content);
    $('#show_info_confirm_cancel').click(function(e) {
        if(e.target == $("#cancel-info-show")[0]) {
            $('#contain-info-show').remove();
            callback.call(this, true);
        } else if(e.target == $("#confirm-info-show")[0]) {
            $('#contain-info-show').remove();
            callback.call(this, false);
        }
    });
}
function qqorwechatgetyzm(obj,vcodedata) {//QQWX验证码
    $.ajax({
        type: "post",
        url:qqorwechatvcode,
        data:vcodedata,
        dataType: "json",
        crossDomain: true,
        success: function(data) {
            console.log(data);
            if(data.status == 0) {
                //60s倒计时
                var countdown = 60;
                obj.value = "重新发送(" + countdown + ")";
                var time = setInterval(function() {
                    if(countdown == 0) {
                        obj.removeAttribute("disabled");
                        obj.value = "发验证码";
                        countdown = 60;
                        clearInterval(time)
                        return;
                    } else {
                        obj.setAttribute("disabled", true);
                        countdown--;
                        obj.value = "重新发送(" + countdown + ")";
                    }
                }, 1000)
                new Toast({ context: $('body'), message: "验证码已发送，请注意查收" }).show();
            } else{
                new Toast({ context: $('body'), message: data.error_msg }).show();
            }
        },
        error: function(e) {
            console.log(e)
        }
    })
}
var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
function getyzm(obj,phone_num) {//验证码

    if($('.phonenum').val().length<=0){
        new Toast({ context: $('body'), message: '请输入您的手机号!' }).show();
    }else if(!myreg.test($('.phonenum').val())) {
        new Toast({context: $('body'), message: '请输入合法的手机号!'}).show();
    }else {
        $.ajax({
            type: "post",
            url: phonevcode,
            data: {
                phone_num: $('.phonenum').val(),
            },
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                console.log(data);
                if (data.status == 0) {
                    //60s倒计时
                    var countdown = 60;
                    obj.value = "重新发送(" + countdown + ")";
                    obj.style.backgroundColor ="#ccc";
                    var time = setInterval(function () {
                        if (countdown == 0) {
                            obj.removeAttribute("disabled");
                            obj.value = "发验证码";
                            countdown = 60;
                            obj.style.backgroundColor ="#c88d6d";
                            clearInterval(time)
                        } else {
                            obj.setAttribute("disabled", true);
                            countdown--;
                            obj.value = "重新发送(" + countdown + ")";
                        }
                    }, 1000)
                    new Toast({context: $('body'), message: "验证码已发送，请注意查收!"}).show();
                } else if (data.status == 20008) {
                    new Toast({context: $('body'), message: "您的操作已达上线，请勿重复提交!"}).show();
                } else if (data.status == 20007) {
                    new Toast({context: $('body'), message: "操作过于频繁，请在60s之后重新获取验证码!"}).show();
                }
            },
            error: function (e) {
                new Toast({context: $('body'), message: "网络加载失败"}).show();
            }
        })
    }
}
//cordova
document.addEventListener("deviceready", function() {
    appintance = new app();
}, true);
var app = function() {
    this.wechatInstall = function(callbacksuccess,callbackerror){
        Wechat.isInstalled(function (installed) {
            if(installed){callbacksuccess()}else{callbackerror()}
        }, function (reason) {
            callbackerror()
        });
    };
    this.qqInstall = function(callbacksuccess,callbackerror){
        var args = {};
        args.client = QQSDK.ClientType.QQ;//QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
        QQSDK.checkClientInstalled(function () {
            callbacksuccess()
        }, function () {
            // if installed QQ Client version is not supported sso,also will get this error
            callbackerror()
        }, args);
    };
    this.ssoLogin = function(callbacklogin) {
        var args = {};
        args.client = QQSDK.ClientType.QQ; //QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
        QQSDK.ssoLogin(function(result) {
            $.ajax({
                type: "GET",
                url: qqlogin,
                crossDomain: true,
                data: {
                    access_token: result.access_token,
                    userid:result.userid,
                    event:1,
                    model:localStorage.getItem("model") || "",
                    os_version:localStorage.getItem("os_version") || "",
                    channel:localStorage.getItem("channel") || "",
                    uuid:localStorage.getItem("uuid") || "",
                    imei:localStorage.getItem("imei") || "",
                    serialnum:localStorage.getItem("serialnum") || "",
                    mac:localStorage.getItem("mac") || "",
                    version:localStorage.getItem("version") || ""
                },
                success: function(data) {
                    console.log(data)
                    function removelogin(data){
                        var uid =data.uid;
                        var sessionid = data.sessionid;
                        localStorage.setItem('sessionid', data.data.sessionid);
                        localStorage.setItem('uid', data.data.uid);
                        localStorage.setItem('nickname', data.data.nickname);
                        localStorage.setItem('sex', data.data.sex);
                        localStorage.setItem('phone_num', data.data.phone_num);
                        localStorage.setItem('head_image', domainL + data.data.head_image);
                        $('body .loginbox').removeClass("loginbox0");
                        setTimeout(function(){
                            $('body .loginbox').remove() //删除弹框
                        },800)
                        if(callbacklogin){
                            callbacklogin(uid,sessionid)
                        }
                    }
                    if(data.status == 0) {//直接登录
                        new Toast({ context: $('body'), message:"登录成功"}).show();
                        removelogin(data)
                    } else if(data.status == 1){
                        new Toast({ context: $('body'), message:"登录失败"}).show();
                    }else{
                        new Toast({ context: $('body'), message:"登录失败"}).show();
                    }
                },
                error: function() {
                    new Toast({ context: $('body'), message: "网络加载失败" }).show();
                }
            });
        }, function(failReason) {
            //alert(failReason);
        }, args);
    };
    this.wechatauth = function(callbacklogin) {
        var scope = "snsapi_userinfo",
            state = "_" + (+new Date());
        Wechat.auth(scope, state, function(response) {
            $.ajax({
                type: "GET",
                url: wechat_authorization,
                crossDomain: true,
                data: {
                    submit_code: response.code,
                    event:1,
                    model:localStorage.getItem("model") || "",
                    os_version:localStorage.getItem("os_version") || "",
                    channel:localStorage.getItem("channel") || "",
                    uuid:localStorage.getItem("uuid") || "",
                    imei:localStorage.getItem("imei") || "",
                    serialnum:localStorage.getItem("serialnum") || "",
                    mac:localStorage.getItem("mac") || "",
                    version:localStorage.getItem("version") || ""
                },
                success: function(data) {
                    function removelogin(data){
                        var uid =data.uid;
                        var sessionid = data.sessionid;
                        localStorage.setItem('sessionid', data.data.sessionid);
                        localStorage.setItem('uid', data.data.uid);
                        localStorage.setItem('nickname', data.data.nickname);
                        localStorage.setItem('sex', data.data.sex);
                        localStorage.setItem('phonenum', data.data.phone_num);
                        localStorage.setItem('head_image', domainL + data.data.head_image);
                        $('body .loginbox').removeClass("loginbox0");
                        setTimeout(function(){
                            $('body .loginbox').remove() //删除弹框
                        },800)
                        if(callbacklogin){
                            callbacklogin(uid,sessionid)
                        }
                    }
                    if(data.status == 0) {//直接登录
                        new Toast({ context: $('body'), message:"登录成功"}).show();
                        removelogin(data)
                    } else if(data.status == 1){
                        new Toast({ context: $('body'), message:"登录失败"}).show();
                    }else{
                        new Toast({ context: $('body'), message:"登录失败"}).show();
                    }
                },
                error: function() {
                    new Toast({ context: $('body'), message: "网络错误" }).show();
                }
            });
        }, function(reason) {
            new Toast({ context: $('body'), message: "登陆失败" }).show();
        });
    }
    this.device = function(){
        var model = device.model || "";
        var uuid = device.uuid || "";
        var channel = device.platform || "";
        var os_version = device.version || "";
        var deviceImei = device.imei || "";
        localStorage.setItem("model",model)
        localStorage.setItem("uuid",uuid)
        localStorage.setItem("channel",channel)
        localStorage.setItem("os_version",channel+" "+os_version)
        localStorage.setItem("imei","")
        localStorage.setItem("serialnum","")
        cordova.getAppVersion.getVersionNumber().then(function (version) {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if(bIsIpad || bIsMidp){
                localStorage.setItem("version","ipad "+version)
            }else if(bIsIphoneOs){
                localStorage.setItem("version","iphone "+version)
            }else{
                localStorage.setItem("version","android "+version)
            }

        });
        window.MacAddress.getMacAddress(
            function(macAddress) {
                localStorage.setItem("mac",macAddress)
            },function(fail) {
                localStorage.setItem("mac","")
            }
        )
    }
}

//登录弹窗
function show_login(callback,callbacklogin,url) { //callback为回调函数
    if($(document).attr("title") === "首页")
        url = "";
    else
        url = "../"
    var uid = localStorage.getItem("uid");
    var sessionid = localStorage.getItem("sessionid");
    if(uid === '' || uid == null || uid === undefined || sessionid === '' || sessionid === null || sessionid === undefined) { //如果没有登录
        var content = '<div class="loginbox">'+
            '<div class="logintop"><header><span class="left goback"><img src="'+url+'img/common/goback.png"></span><p>登录</p></header><img class="logo" src="'+url+'img/logo.png"><img class="word" src="'+url+'img/word.png"></div><div class="phonelogomask"><div class="phonelogo">'+
            '<div class="phonelogotop"><img class="removeTan" src="'+url+'img/common/empty.png"><p class="phone1"><span><img src="'+url+'img/common/phonenum.png"></span><input type="number" class="phonenum" placeholder="请输入您的手机号" value="">'+
            '<span class="empty"><img src="'+url+'img/common/empty.png"></span></p><p> <span><img src="'+url+'img/common/verification.png"></span>'+
            '<input type="number" class="verificanum" placeholder="请输入您的验证码" value=""> <input type="button" id="verifica" value="发送验证码" /></p></div><p class="phonebtn">登录</p></div></div>'+
            '<div class="loginbottom"><p class="othertitle">选择登录方式</p><ul class="otherlogin">'
        content +='<dl class="phone"><dt><img src="'+url+'img/common/phone.png"></dt><dd>手机号登陆</dd></dl>'
        content +='<dl class="WX"><dt><img src="'+url+'img/common/wx.png"></dt><dd>微信登陆</dd></dl>'
        content +='<dl class="QQ"><dt><img src="'+url+'img/common/QQ.png"></dt><dd>QQ登陆</dd></dl>'
        content +='</ul></div></div>'
        $('body .loginbox').remove() //删除弹框
        $('body').append(content); //生成弹框
        document.addEventListener("deviceready", function() {
            appintance = new app();
            appintance.wechatInstall(function(){},function(){
                $(".WX").css("display","none")
            });
            appintance.qqInstall(function(){},function(){
                $(".QQ").css("display","none")
            });
        }, true);
        setTimeout(function(){
            $('body .loginbox').addClass("loginbox0");
        },100)
        $('.loginbox .goback').click(function() {
            $('body .loginbox').removeClass("loginbox0");
            setTimeout(function(){
                $('body .loginbox').remove() //删除弹框
            },800)
        })
        $('.loginbox .removeTan').click(function(){//隐藏手机号登录
            $('.phonelogomask').hide();
        })
        $('.phonelogomask').click(function(){//隐藏手机号登录
           $(this).hide();
        })
        $('.phonelogo').click(function(event){//隐藏手机号登录
           event.stopPropagation()
        })
        $('.loginbox .empty').click(function() {//清空手机号
            $(".phonenum").val("");
        })
        $('#verifica').click(function(){//发送验证码
            getyzm(this,$(".phonenum").val())
        })
        $('.phonebtn').click(function() {
            checkUser(callbacklogin);//手机号登陆
        })

        $('.phone').click(function() {//弹出手机号
            $(".phonelogomask").css("display","block");
        })
        $('.WX').click(function() {//WX登录
            appintance.wechatauth(callbacklogin)
        })
        $('.QQ').click(function() {//QQ登录
            appintance.ssoLogin(callbacklogin)
        })
        //登录验证
        function checkUser(callbacklogin) {
            var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if($('.phonenum').val().length<=0){
                new Toast({ context: $('body'), message: '请输入您的手机号!' }).show();
            }else if(!myreg.test($('.phonenum').val())) {
                new Toast({context: $('body'), message: '请输入合法的手机号!'}).show();
            }else if($('.verificanum').val().length<=0){
                new Toast({context: $('body'), message: '请输入验证码!'}).show();
            }else{
                console.log($('.phonenum').val()+" ,"+$('.verificanum').val());
                $.ajax({
                    type: "post",
                    url: phone_num_login,
                    data: {
                        phone_num: $('.phonenum').val(),
                        submit_vcode: $('.verificanum').val(),
                        event:1,
                        model:localStorage.getItem("model") || "",
                        os_version:localStorage.getItem("os_version") || "",
                        channel:localStorage.getItem("channel") || "",
                        uuid:localStorage.getItem("uuid") || "",
                        imei:localStorage.getItem("imei") || "",
                        serialnum:localStorage.getItem("serialnum") || "",
                        mac:localStorage.getItem("mac") || "",
                        version:localStorage.getItem("version") || ""
                    },
                    dataType: "json",
                    crossDomain: true,
                    success: function(data) {
                        console.log(data);
                        if(data.status == 0) {
                            console.log(data)
                            new Toast({ context: $('body'), message: "登录成功，您可到个人中心修改信息哦" }).show();
                            var uid =data.uid;
                            var sessionid = data.sessionid;
                            localStorage.setItem('sessionid', data.sessionid);
                            localStorage.setItem('uid', data.uid);
                            localStorage.setItem('nickname', data.nickname);
                            localStorage.setItem('sex', data.sex);
                            localStorage.setItem('phone_num', data.phone_num);
                            localStorage.setItem('head_image', domainL + data.head_image);
                            $('body .loginbox').removeClass("loginbox0");
                            setTimeout(function(){
                                $('body .loginbox').remove() //删除弹框
                            },800)
                            if(callbacklogin){
                                callbacklogin(uid,sessionid)
                            }
                        } else if(data.status == 20011) {
                            new Toast({ context: $('body'), message: '短信验证码错误！' }).show();
                        }else if(data.status==20010){
                            new Toast({ context: $('body'), message: '短信验证码过期！' }).show();
                        }else{
                            new Toast({ context: $('body'), message: '登录失败！' }).show();
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        new Toast({ context: $('body'), message: "网络错误" }).show();
                    }
                })
            }

        }
    } else {
        callback(uid,sessionid)
    }
}
//支付选项
function gopay(order_num,title,uid,sessionid) {
    var content = '<p>请确认您购买的商品参数信息后，再进行付款。确认付款后，由于定制参数及内容造成的问题，随我个性定制APP将不承担任何责任。</p>' +
        '<p>温馨提示：</p>' +
        '<p>1、定制产品为手机3D模拟显示，因手机型号、显卡、分辨率不同，会有颜色差异等可能，产品请以最终实物为准；</p>' +
        '<p>2、您在随我个性定制APP上，定购产品并经梦工场珠宝企业管理有限公司确认收到您的定金之前，您和随我个性定制之间不存在任何契约关系。随我个性定制APP有权在发现APP上显示的产品及订单的明显错误或缺货的情况下，单方面撤回该订单。</p>' +
        '<p>以上购物协议内容构成本定制合同条款，在先行法律允许情况下，解释权归梦工场珠宝企业管理有限公司所有。</p>'
    var str = '<div class="paybj"><div class="agreement"><span class="am_remove"></span><div class="am_title">购买须知</div><h2>尊敬的用户您好：</h2><div class="am_content">'
            +content+'</div><div class="am_agree"><span class="false"></span><i>确认并同意上述内容</i></div><div class="am_agree_btn false">确认并付款</div></div>'
        str +='<ul class="payWin"><li class="winTit">选择付款方式<i class="iconfont">&#xe61a;</i></li>'
        str +='<li class="alipay a"><b class="iconfont"></b>支付宝支付<span></span></li>'
        str +='<li class="wechatpay a"><b class="iconfont"></b>微信支付<span style="display: none"></span></li>'
        str +='<li class="downpay a" style="display:none;"><b class="iconfont"></b>线下支付<span style="display: none"></span></li>'
        str +='<li class="gopaynow goalipay">确认支付</li></ul></div>'
    $("body").append(str);
    document.addEventListener("deviceready", function() {
        appintance = new app();
        appintance.wechatInstall(function(){
            $(".wechatpay").css("display","block");
        },function(){
            $(".wechatpay").css("display","none");
        });
    }, true);
    $(".paybj .alipay").click(function(){
        $(".paybj .a").css("background","#fff");
        $(".paybj .a span").css("display","none");
        $(".paybj .alipay").css("background","#F1F1F1");
        $(".paybj .alipay span").css("display","block");
        $(".gopaynow").removeClass("gowechatpay godownpay").addClass("goalipay");
    })
    $(".paybj .wechatpay").click(function(){
        $(".paybj .a").css("background","#fff");
        $(".paybj .a span").css("display","none");
        $(".paybj .wechatpay").css("background","#F1F1F1");
        $(".paybj .wechatpay span").css("display","block");
        $(".gopaynow").removeClass("goalipay godownpay").addClass("gowechatpay");
    })
    $(".paybj .downpay").click(function(){
        $(".paybj .a").css("background","#fff");
        $(".paybj .a span").css("display","none");
        $(".paybj .downpay").css("background","#F1F1F1");
        $(".paybj .downpay span").css("display","block");
        $(".gopaynow").removeClass("goalipay gowechatpay").addClass("godownpay");
    })
    $(".paybj .gopaynow").click(function(){
        if($(this).hasClass("goalipay")){
            alipay(order_num,uid,sessionid);//支付宝支付
        }else if($(this).hasClass("gowechatpay")){
            Wechatpay(order_num,title,uid,sessionid);
        }else if($(this).hasClass("godownpay")){
            godownpay(order_num,uid,sessionid)
        }
    });
    //删除支付选项
    $(".paybj .winTit i").click(function(){
        window.location.href = "orderDetail.html?order_serial_number="+order_num;
    });
    $(".agreement .am_remove").click(function(){
       $(".paybj").remove();
    });
    var am_agree_btn = $(".am_agree_btn");
    $(".agreement .am_agree").click(function(){
        if($(this).children("span").hasClass("false")){
            $(this).children("span").removeClass("false").addClass("true");
            am_agree_btn.removeClass("false").addClass("true");
        }else{
            $(this).children("span").removeClass("true").addClass("false");
            am_agree_btn.removeClass("true").addClass("false");
        }
    });
    am_agree_btn.click(function(){
        if($(this).hasClass("false")){
            new Toast({ context: $('body'), message: "您需同意此协议才可付款" }).show();
        }else{
            $(".agreement").remove();
            $(".payWin").css("display","block");
        }
    })
}
//线下支付
function godownpay(order_num,uid,sessionid){
    show_confirm("<input class='InviteCode' value='' placeholder='绑定门店邀请码'>",function(result){
        var obj = $(this).parent().find(".InviteCode");
        if(result==true){
            var senddata = {
                uid:uid,
                sessionid:sessionid,
                order_serial_number: order_num,
                belong_to_guider:obj.val()
            }

            $.ajax({
                type: "post",
                url: offline_payment,
                async: true,
                crossDomain: true,
                data: sortByKeys(senddata),
                success: function(data) {
                    console.log(data)
                    if(data.status == 0){
                        window.location.href = "orderDetail.html?order_serial_number="+order_num;
                    }else if(data.status==20309){
                        new Toast({ context: $('body'), message: "门店邀请码有误" }).show();
                    }
                },
                error: function() {
                    window.location.href = "orderDetail.html?order_serial_number="+order_num;
                }
            })
        }else{
            new Toast({ context: $('body'), message: "线下支付必须绑定门店邀请码" }).show();
        }
    });
}
//支付宝支付
function alipay(order_num,uid,sessionid) {
    var senddata = {
        uid:uid,
        sessionid:sessionid,
        order_serial_number: order_num
    }
    $.ajax({
        type: "post",
        url: alipayinfo,
        async: true,
        crossDomain: true,
        data: sortByKeys(senddata),
        success: function(data) {
            // 第一步：订单在服务端签名生成订单信息，具体请参考官网进行签名处理
            console.log(data)
            console.log(data.data.payinfo);
            var payInfo = data.data.payinfo;
            //var payInfo  = "app_id=2017081408195592&biz_content=%7B%22out_trade_no%22%3A%22201708151516%22%2C%22product_code%22%3A%22QUICK_MSECURITY_PAY%22%2C%22total_amount%22%3A%220.01%22%2C%22subject%22%3A%22%5Cu68a6%5Cu5de5%5Cu573a%5Cu8ba2%5Cu5355%22%7D&charset=utf-8&method=alipay.trade.app.pay&notify_url=http%3A%2F%2F123.57.57.117%3A8888%2Forder%2Falipay_notify&sign_type=RSA2&timestamp=2017-08-15+17%3A25%3A52&version=1.0&sign=pUKGbPh7GQaFXWpvvtZXwsRG7lnvC7KuEsidwwqqwySzoKpqZraQtm%2BrzlTtuKFUOQFVfADBO29QT%2B37ihi6GFbbpCPkoPn1PW8FzE5k%2B9hB%2FfZQvdA%2B%2BQUCwFYlaGgDHsiTA72u8rnjAogkiHlObcCi56GsV8dx0P%2FCXqW19xnznbfyoqHpQHA3KMKfPRDz85tWPzw64MFnL%2FcLEQUlUXwyciOP5irfVMw%2Ff0pSyRLJZ7S2pMf1uWXg3utjdqWMB%2FyBN6foa6pBAm7nbTVousAbFZgIhu7P4VgqOsH0TMxz4AsYxZQIUCQdqRpZITAxo%2FlUOlm8M6xMwb%2Bh4LBlIg%3D%3D";
            //alert(payInfo)
            // 第二步：调用支付插件
            cordova.plugins.alipay.payment(payInfo, function success(e) {
                var senddata = {
                    uid:uid,
                    sessionid:sessionid,
                    order_serial_number: order_num
                }
                $.ajax({
                    type: "post",
                    url:alipayquery ,
                    crossDomain: true,
                    data:sortByKeys(senddata),
                    success: function(data) {
                        window.location.href = "orderDetail.html?order_serial_number="+order_num;
                    },
                    error: function() {
                        window.location.href = "orderDetail.html?order_serial_number="+order_num;
                    }
                });
            }, function error(e) {
                window.location.href = "orderDetail.html?order_serial_number="+order_num;
            });
        },
        error: function() {
            window.location.href = "orderDetail.html?order_serial_number="+order_num;
        }
    })
    //e.resultStatus  状态代码  e.result  本次操作返回的结果数据 e.memo 提示信息
    //e.resultStatus  9000  订单支付成功 ;8000 正在处理中  调用function success
    //e.resultStatus  4000  订单支付失败 ;6001  用户中途取消 ;6002 网络连接出错  调用function error
    //当e.resultStatus为9000时，请去服务端验证支付结果
    /**
     * 同步返回的结果必须放置到服务端进行验证（验证的规则请看https://doc.open.alipay.com/doc2/
     * detail.htm?spm=0.0.0.0.xdvAU6&treeId=59&articleId=103665&
     * docType=1) 建议商户依赖异步通知
     */
}
//微信支付
function Wechatpay(order_num, title,uid,sessionid) {
    //alert("已经开始微信支付")
    var senddata = {
        uid:uid,
        sessionid:sessionid,
        body: title,
        order_serial_num: order_num
    }
    $.ajax({
        type: "post",
        url: wechat_prepay_generation,
        crossDomain: true,
        data: sortByKeys(senddata),
        success: function(data) {
            //alert(JSON.stringify(data))
            console.log(JSON.stringify(data))
            var param = data.pay_dict;
            var params = {
                noncestr: param.noncestr,
                partnerid: param.partnerid,
                prepayid: param.prepayid,
                sign: param.sign,
                timestamp: param.timestamp
            };
            Wechat.sendPaymentRequest(params, function(e) {
                $.ajax({
                    type: "post",
                    url: wechat_order_query,
                    crossDomain: true,
                    data: {
                        uid:uid,
                        sessionid:sessionid,
                        order_serial_num: order_num,
                    },
                    success: function(data) {
                        window.location.href = "orderDetail.html?order_serial_number="+order_num;
                    },
                    error: function() {
                        window.location.href = "orderDetail.html?order_serial_number="+order_num;
                    }
                });
            }, function(e, reason) {
                //alert(reason+"/"+e);
                window.location.href = "orderDetail.html?order_serial_number="+order_num;
            });
        },
        error: function() {
            window.location.href = "orderDetail.html?order_serial_number="+order_num;
        }
    });
}
//Wechat.Scene.TIMELINE 表示分享到朋友圈
function wechatsharelinkTIMELINE(title, description, imgsrc, webpageUrl) {
    Wechat.share({
        message: {
            title: title,
            description: description,
            thumb: imgsrc,
            media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: webpageUrl
            }
        },
        scene: Wechat.Scene.TIMELINE // share to Timeline
    }, function() {
        $(".sharediv").css("display", "none");
        new Toast({ context: $('body'), message: "分享成功" }).show();
    }, function(reason) {
        $(".sharediv").css("display", "none");
        new Toast({ context: $('body'), message: "分享失败" }).show();
    });
}
//Wechat.Scene.SESSION 表示分享给好友
function wechatsharelinkSESSION(title, description, imgsrc, webpageUrl) {
    Wechat.share({
        message: {
            title: title,
            description: description,
            thumb: imgsrc,
            media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: webpageUrl
            }
        },
        scene: Wechat.Scene.SESSION // share to Timeline
    }, function() {
        $(".sharediv").css("display", "none");
        new Toast({ context: $('body'), message: "分享成功" }).show();
    }, function(reason) {
        $(".sharediv").css("display", "none");
        new Toast({ context: $('body'), message: "分享失败" }).show();
    });
}
//QQSDK.Scene.QQ  分享到QQ
function shareQQ(title, description, imgsrc, webpageUrl) {
    var args = {};
    args.client = QQSDK.ClientType.QQ; //QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
    args.scene = QQSDK.Scene.QQ; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
    args.url = webpageUrl;
    args.title = title;
    args.description = description;
    args.image = imgsrc;
    QQSDK.shareNews(function() {
        $(".sharediv").css("display", "none");
        new Toast({ context: $('body'), message: "分享成功" }).show();
    }, function(failReason) {
        $(".sharediv").css("display", "none");
        new Toast({ context: $('body'), message: "分享失败" }).show();
    }, args);
};
//QQSDK.Scene.QQZone 分享到QQ空间
function shareQQZone(title, description, imgsrc, webpageUrl) {
    var args = {};
    args.client = QQSDK.ClientType.QQ; //QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
    args.scene = QQSDK.Scene.QQZone; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
    args.url = webpageUrl;
    args.title = title;
    args.description = description;
    args.image = imgsrc;
    QQSDK.shareNews(function() {
        $(".sharediv").css("display", "none");
        new Toast({ context: $('body'), message: "分享成功" }).show();
    }, function(failReason) {
        $(".sharediv").css("display", "none");
        new Toast({ context: $('body'), message: "分享失败" }).show();
    }, args);
};
function sidebar(){
    var nickname = localStorage.getItem("nickname") || "";
    var defualt_img = $(document).attr("title") === "首页" ? 'onerror=javascript:this.src="img/common/headlogo.png"' : 'onerror=javascript:this.src="../img/common/headlogo.png"';
    var head_img = localStorage.getItem('head_image')
    var str = '<div class="sidebarmask"><div class="sidebar"><span class="remove iconfont">&#xe65a;</span>'
    str += '<div class="top"><img class="head_img" src="'+head_img+'"'+defualt_img+'><p class="nickname">'+nickname+'</p><p class="integral">0积分</p><p class="signbtn effective">签到</p></div>'
    str += '<div class="center"><ul>'+
        '<li class="index"><span></span>首页</li>'+
        '<li class="made"><span></span>自由定制</li>'+
        '<li class="activity"><span></span>发现</li>'+
        '<li class="personCenter"><span></span>个人中心</li></div>'
    if(localStorage.getItem('uid'))
        str += '<div class="bottom"><p class="exit">退出登录</p></div>'
    else
        str += '<div class="bottom"><p class="login">登录</p></div>'
    str += '</div></div>';
    $(".sidebarmask").remove();
    $("body").append(str);
    var sidebarmask = $(".sidebarmask");
    var senddata = {
        uid:localStorage.getItem('uid'),
        sessionid:localStorage.getItem('sessionid')
    };
    queryIntegral(senddata);
    setTimeout(function () {
        sidebarmask.addClass('active');
    },50)
    sidebarmask.click(function(){
        $(this).removeClass('active');
    })
    $(".sidebarmask .sidebar .remove").click(function(event){
        sidebarmask.removeClass('active');
    })
    $(".sidebarmask .sidebar").click(function(event){
        event.stopPropagation();
    })
    $(".sidebarmask .sidebar .signbtn").click(function(event){
        signing(senddata)
    })
    $(".sidebarmask .sidebar .center li").click(function(event){
        localStorage.removeItem('mall_parameter');
        localStorage.removeItem('made_parameter');
        var classname = $(this).attr("class");
        if($(this).index() == 3)
            show_login(function (){
                if($(document).attr("title") === "首页")
                    if($(this).attr("class") === "index")
                        window.location.href= classname+".html"
                    else
                        window.location.href= "html/"+classname+".html"
                else
                if($(this).attr("class") === "index")
                    window.location.href= "../"+classname+".html"
                else
                    window.location.href= classname+".html"
            },function(){sidebarmask.remove();})
        else
        if($(document).attr("title") === "首页")
            if($(this).attr("class") === "index")
                window.location.href= classname+".html"
            else
                window.location.href= "html/"+classname+".html"
        else
        if($(this).attr("class") === "index")
            window.location.href= "../"+classname+".html"
        else
            window.location.href= classname+".html"
    })
    //登录
    $('.sidebarmask .sidebar .login').click(function(){
        show_login(function (){},function(){
            sidebarmask.remove();
        })
    })
    $('.sidebarmask .sidebar .head_img').click(function(){
        show_login(function (){},function(){
            sidebarmask.remove();
        })
    })
    //退出登录
    $('.sidebarmask .sidebar .exit').click(function(){
        exitLogin()
    })
}
function queryIntegral(senddata){
    $.ajax({
        type: "post",
        url: judgeSign,
        async: true,
        crossDomain: true,
        data: sortByKeys(senddata),
        success: function(data) {
            if(data.status === 0){//没有签到记录
                var total_integral = data.data.total_integral;//总积分
                var last_time = data.data.last_time;
                if(last_time.split(" ")[0] === new_time(new Date()).split(" ")[0])
                    $(".sign").addClass('off').text('已签到');
                $(".integral").text(total_integral+"积分");
                function new_time(date) {
                    var datetime = date.getFullYear()
                        + "-"// "年"
                        + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
                            + (date.getMonth() + 1))
                        + "-"// "月"
                        + (date.getDate() < 10 ? "0" + date.getDate() : date
                            .getDate())
                        + " "
                        + (date.getHours() < 10 ? "0" + date.getHours() : date
                            .getHours())
                        + ":"
                        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                            .getMinutes())
                        + ":"
                        + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                            .getSeconds());
                    return datetime;
                }
            }else{
                $(".integral").text("0积分")
            }
        },
        error:function(){
        }
    })
}
function signing(senddata){
    $.ajax({
        type: "post",
        url: doSign,
        async: true,
        crossDomain: true,
        data: sortByKeys(senddata),
        success: function(data) {
            console.log(data);
            if(data.status === 20121){
                new Toast({context:$('body'),message:'今日已签到！'}).show();
            }else if(data.status==0){
                var str = '<div class="signmask"><div class="signbj"><div class="signcontent">'+
                    '<div class="signcontent1"><p class="p1">恭喜你，获得积分'
                    +data.data.integral_addition+
                    '分</p><p class="p2"><i class="line"></i>'
                for(var i=0;i<7;i++){
                    var day = i+1;
                    if(day <= data.data.continue_signin_times){
                        str +='<span class="signspan">'+day+'</span>'
                    }else{
                        str +='<span >'+day+'</span>'
                    }
                }
                str += '</p><p class="p3"></p><p class="p4">已成功连续签到'
                    +data.data.continue_signin_times+
                    '天</p></div><div class="signcontent2">'+
                    '<p>连续签到7天可额外获得100积分</br>中断签到重新从第一天算起</br>用户每日只可签到一次</p><input type="button" class="btn" id="signback" value="返回" /></div>'+
                    '</div></div><p class="rule">查看签到规则</p><span class="removesign"></span></div>'
                $("body").append(str);
                queryIntegral(senddata)
                $(".signmask .removesign").click(function(){//x号
                    $(".signmask").remove();
                })
                $(".signmask .rule").click(function(){//签到规则
                    $(".signmask .signcontent1").slideUp();
                })
                $(".signmask #signback").click(function(){//返回
                    $(".signmask .signcontent1").slideDown();
                })
            }
        },
        error:function(){
            new Toast({context:$('body'),message:"网络故障,签到失败"}).show();
        }
    })
}

function exitLogin(){
    $.ajax({
        type:'post',
        url:personSettinglogout,
        data:{
            uid:localStorage.getItem('uid'),
            sessionid:localStorage.getItem('sessionid'),
            event:0,
            model:localStorage.getItem("model") || "",
            os_version:localStorage.getItem("os_version") || "",
            channel:localStorage.getItem("channel") || "",
            uuid:localStorage.getItem("uuid") || "",
            imei:localStorage.getItem("imei") || "",
            serialnum:localStorage.getItem("serialnum") || "",
            mac:localStorage.getItem("mac") || "",
            version:localStorage.getItem("version") || ""
        },
        dataType: "json",
        crossDomain: true,
        success:function(data){
            console.log(data);
            localStorage.clear();
            new Toast({context:$('body'),message:'您已成功退出'}).show();
            document.addEventListener("deviceready", function() {
                appintance = new app();
                appintance.device()
            }, true);
            if($(document).attr("title") === "首页")
                window.location.href = 'index.html';
            else
                window.location.href = '../index.html';
        },
        error:function(){
            new Toast({context:$('body'),message:'网络异常,退出登录失败'}).show();
        }
    })
}
//document.write("<script src='../common/fastclick.js'></script>");
$(function(){
    //侧边栏划出事件
    $(".sidebarbtn").click(function(){
         sidebar()
    })
    //FastClick.attach(document.body);
})
