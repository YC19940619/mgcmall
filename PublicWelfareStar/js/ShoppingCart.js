$(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton",function(){
            window.location.href = "personCenter.html"
        }, false);
    }
    $(".goback").click(function(){
        window.location.href = "personCenter.html"
    })
    var uid = localStorage.getItem("uid");
    var sessionid = localStorage.getItem("sessionid");
    var senddata = {
        uid: uid,
        sessionid: sessionid,
        flag: new Date().getTime()
    }
    var change;
    $.ajax({
        type: "post",
        url: cart_display,
        async: true,
        crossDomain: true,
        data: sortByKeys(senddata),
        beforeSend: function () {
            var str = "<p class='loading'>加载中...</p>"
            $("section ul").html(str)
        },
        success: function (data) {
            console.log(data)
            var str = '';
            if (data.status == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    var shopping_id = data.data[i].id;//确认订单的id
                    var quantity = data.data[i].quantity;//数量
                    if(data.data[i].sku){
                        var price = data.data[i].sku.price;//价格
                        var name = data.data[i].sku.spu.name;//名字
                        var imgicon =dataimgsrc(data.data[i].sku.threedfileparams[0].img);//图片icon
                        var content = data.data[i].sku.attributes_values;
                        var is_custom = data.data[i].sku.is_custom;
                        var spuid = data.data[i].sku.spu.id;
                        var olddata = data.data[i].sku.threedfileparams[0].params;
                        var stocks = 10000000000;
                    }else if(data.data[i].finishes_sku){
                        var price = data.data[i].finishes_sku.price;//价格
                        var name = data.data[i].finishes_sku.name;//名字
                        var imgicon =dataimgsrc(data.data[i].finishes_sku.carousel_pictures[0].big_picture.split(",")[0]);//图片icon
                        var content =data.data[i].finishes_sku.attributes_values;
                        var is_custom = data.data[i].finishes_sku.is_custom;
                        var spuid = data.data[i].finishes_sku.spu;
                        var olddata = "";
                        var stocks = data.data[i].finishes_sku.stocks;
                    }
                    str += '<li stocks = "'+stocks+'" olddata="'+encodeURI(olddata)+'" spuid="'+spuid+'" is_custom="'+is_custom+'" shopping_id ="' + shopping_id + '"><div class="top"><div class="T_L"><span class="iconfont"><img src="../img/common/nocheck.png"></span></div><div class="T_C"><img src="'
                        + imgicon +
                        '"/></div><div class="T_R"><p class="title">'
                        + name +
                        '<i>详情</i></p><div class="price" price="'
                        + price +
                        '">￥' + price +
                        '<p class="num"><span class="iconfont jian">&#xe64a;</span><input type="num" readonly="readonly" id="changenum" value="'
                        + quantity +
                        '"/><span class="iconfont jia">&#xe633;</span></p></div></div><div class="goremove">删除</div></div><div class="bottom">'
                    for (var j = 0; j < content.length; j++) {
                        str += '<p><span class="left">'
                            + content[j].attribute.name
                            +'：</span><span class="right">'
                        if(content[j].attribute_value){
                            var _value = content[j].attribute_value;
                        }else{
                            var _value = content[j].manually_attribute_value;
                        }
                        if(_value.img!=""){
                            str+='<img src="'+ dataimgsrc(_value.img)+'">'
                        }
                        str+= _value.name+ '</span></p>'
                    }
                }
                str += '</div></li>'
                $("section ul").html(str);
                var static = data.static.subattributes;//表情
                for(var i =0;i<$("section .right").length;i++){
                    var valuename = $("section .right").eq(i).html();
                    for (var n =0;n<static.length;n++) {//表情转换
                        for(var m=0;m<static[n].values.length;m++){
                            var item = '<img style="margin: 0;" src="'+dataimgsrc(static[n].values[m].img)+'">';
                            var num = static[n].values[m].webgl_num;
                            allitem = new RegExp("\\["+num+"\\]","g");
                            valuename= valuename.replace(allitem,item);
                        }
                    }
                    $("section .right").eq(i).html(valuename);
                }

                for (var i = 0; i < $("section ul li").length; i++) {
                    if ($("section ul li").eq(i).find("input").val() <= 1) {
                        $("section ul li").eq(i).find(".jian").addClass("highlight");
                    }
                }
            } else {
                $("section").css("background","#fff");
                str = '<p class="dingIcon"><img src="../img/common/kongshop.png"></p><p class="dingTit">购物车空空如也，不去选购些东西吗~</p><input type="button" class="gobuy" id="" value="去选购" />'
                $("section").html(str);
            }

        },
        error: function () {
            new Toast({context: $('body'), message: "网络加载失败"}).show();
        }
    });
    //购物车数量加减
    $("section").delegate(".jian", "click", function (event) {

        var quantity = $(this).parent(".num").children("#changenum").val();
        var cartitem_id = $(this).parents("li").attr("shopping_id");
        var obj = $(this);
        if (quantity <= 1) {
            new Toast({context: $('body'), message: "亲！不能再少了"}).show();
        } else {
            quantity--;
            obj.parent(".num").children("#changenum").val(quantity);
            numprice()
            changenum(cartitem_id, quantity, obj);
            if (quantity <= 1) {
                $(this).addClass("highlight");
            }
        }
        event.stopPropagation();
    })
    $("section").delegate(".jia", "click", function (event) {
        var stocks = Number($(this).parents("li").attr("stocks"));
        var quantity = Number($(this).parent(".num").children("#changenum").val());
        var cartitem_id = $(this).parents("li").attr("shopping_id");
        var obj = $(this);
        if(quantity<stocks){
            quantity++;
            obj.parent(".num").children("#changenum").val(quantity);
            numprice()
            changenum(cartitem_id, quantity, obj);
        }else{
            new Toast({context: $('body'), message: "库存不足"}).show();
        }
        if (quantity > 1) {
            $(this).parent(".num").children(".jian").removeClass("highlight");
        }
        event.stopPropagation();
    })
    //详情
    $("section").delegate(".T_R i", "click", function (e) {
        if ($(this).hasClass("checkimg")) {
            $(this).parents("li").children(".bottom").stop().slideUp(300);
            $(this).removeClass("checkimg");
        } else {
            $(this).parents("li").children(".bottom").stop().slideDown(300);
            $(this).addClass("checkimg");
        }
        e.stopPropagation();
    });
    $("section").delegate(".bottom", "click", function (event) {
        event.stopPropagation();
    });
    //去购买
    $("section").delegate(".gobuy", "click", function (event) {
        localStorage.removeItem('mall_parameter');
        localStorage.removeItem('made_parameter');
        window.location.href = "made.html";
    });
    //编辑
    $("header .right").click(function(){
       if($(this).text()=="编辑"){
           $(this).text("完成")
           $(".allright .right").text("删除所选")
       }else{
           $(this).text("编辑")
           $(".allright .right").text("去下单")
       }
    })
    //结算
    $(".allright .right").click(function () {
        if ($("section ul .check").length == 0) {
            new Toast({context: $('body'), message: "请选择商品"}).show();
        } else {
            var cartitem_idarr = [];
            for (var i = 0; i < $("section ul .check").length; i++) {
                cartitem_idarr.push($("section ul .check").eq(i).parents("li").attr("shopping_id"));
            }
            cartitem_idarr = "["+cartitem_idarr.toString()+"]";
            if( $("header .right").text()=="编辑"){
                var str = "firmOrder.html?&cartitem_idarr="+cartitem_idarr;
                window.location.href = str;
            }else{
                var obj = $("ul .check");
                show_confirm("删除选中商品？",function(result){
                    if(result==true){
                        dropnum(cartitem_idarr,obj);
                    }else{
                        new Toast({context:$('body'),message:"取消删除购物车"}).show();
                    }
                });
            }
        }
    })
    //quantity数量  cartitem_id购物车商品id
    function changenum(cartitem_id, quantity, obj) {
        var senddata = {
            uid: uid,
            sessionid: sessionid,
            cartitem_id: cartitem_id,
            quantity: quantity
        }
        $.ajax({
            type: "post",
            url: cart_change,
            async: true,
            crossDomain: true,
            data: sortByKeys(senddata),
            success: function (data) {
                if (data.status == 0) {
                    if (quantity == 0) {
                        obj.parents("li").addClass("remove");
                        setTimeout(function () {
                            obj.parents("li").remove();
                            if ($('section ul').html() == 0) {
                                str = '<p class="dingIcon"><img src="../img/common/kongshop.png"></p><p class="dingTit">购物车空空如也，不去选购些东西吗</p><input type="button" class="gobuy" id="" value="去选购" />'
                                $('section').html(str)
                            }
                        }, 500)

                        new Toast({context: $('body'), message: "商品删除成功"}).show();
                    }
                } else {
                    new Toast({context: $('body'), message: data.msg}).show();
                }
            },
            error: function () {
                new Toast({context: $('body'), message: "网络加载失败"}).show();
            }
        })
    }
    function dropnum(cartitem_id,obj) {
        var senddata = {
            uid: uid,
            sessionid: sessionid,
            cartitem_id: cartitem_id
        }
        $.ajax({
            type: "post",
            url: cart_drop,
            async: true,
            crossDomain: true,
            data: sortByKeys(senddata),
            success: function (data) {
                if (data.status == 0) {
                    obj.parents("li").addClass("remove");
                    setTimeout(function () {
                        obj.parents("li").remove();
                        numprice();
                        if ($('section ul').html() === "") {
                            str = '<p class="dingIcon"><img src="../img/common/kongshop.png"></p><p class="dingTit">购物车空空如也，不去选购些东西吗</p><input type="button" class="gobuy" id="" value="去选购" />'
                            $('section').html(str);
                        }
                    }, 500)
                    new Toast({context: $('body'), message: "商品删除成功"}).show();
                } else {
                    new Toast({context: $('body'), message: data.msg}).show();
                }
            },
            error: function () {
                new Toast({context: $('body'), message: "网络加载失败"}).show();
            }
        })
    }
    //全选
    $(".allright .left .iconfont").click(function () {
        if ($(this).hasClass("check")) {
            $(this).html('<img src="../img/common/nocheck.png">');
            $(this).removeClass("check");
            $("section .T_L .iconfont").html('<img src="../img/common/nocheck.png">').removeClass("check");
        } else {
            $(this).html('<img src="../img/common/check.png">');
            $(this).addClass("check");
            $("section .T_L .iconfont").html('<img src="../img/common/check.png">').addClass("check");
        }
        numprice()//计算价格
    });
    //单选
    $("section").delegate(".T_L .iconfont", "click", function (event) {
        if ($(this).hasClass("check")) {
            $(this).html('<img src="../img/common/nocheck.png">');
            $(this).removeClass("check");
        } else {
            $(this).html('<img src="../img/common/check.png">');
            $(this).addClass("check");
        }
        numprice()//计算价格
        event.stopPropagation();
    });
    function numprice() {
        //计算价格
        var check = $("section ul .check");
        if(check.length === 0){
            $(".allright .left .iconfont").html('<img src="../img/common/nocheck.png">').removeClass("check");
            $(".allright .left span").eq(1).text("全选");
        }else if(check.length === $("section ul li").length ){
            $(".allright .left span").eq(1).text("已选（" + check.length + "）");
            $(".allright .left .iconfont").html('<img src="../img/common/check.png">').addClass("check");
        }else{
            $(".allright .left span").eq(1).text("已选（" + check.length + "）");
            $(".allright .left .iconfont").html('<img src="../img/common/nocheck.png">').removeClass("check");
        }
        var price = 0;
        for (var i = 0; i < check.length; i++) {
            price += parseFloat(check.eq(i).parents("li").find(".price").attr("price")) * check.eq(i).parents("li").find("#changenum").val();
        }
        //下单状态
        if (price == 0) {
            $(".allright .right").css("background", "#DDDDDD");
        } else if (price > 0) {
            $(".allright .right").css("background", "#c88d6d");
        }
        $(".allright .center .price").text("￥" + (price).toFixed(2))
    }
    var starX = 0;
    $("section ul ").delegate("li .top", "touchstart", function (e) {

        starX = event.targetTouches[0].pageX;
        e.stopPropagation();
    })
    $("section ul ").delegate("li .top", "touchmove", function (e) {
        var X = event.targetTouches[0].pageX;//滑动的位置
        var changeX = starX - X;//位置差值
        var reX = $(this).find(".goremove").width();//最大滑动差值==删除按钮的width
        var marX = $(this).css("margin-left");//整体滑动位置
        if (changeX > 0 && changeX <= reX ) {//左滑
            $(this).css("margin-left", -changeX);
        } else if (changeX < 0 && parseInt(marX) < 0) {//右划
            $(this).css("margin-left", -reX - changeX);
        }
        e.stopPropagation();
    })
    $("section ul ").delegate("li .top", "touchend", function (e) {
        var endX = event.changedTouches[0].pageX;
        var changeX = starX - endX;//初始位置和结束位置的差值
        var reX = $(this).find(".goremove").width();
        if (changeX > 0) {
            if (changeX >= reX / 2) {//如果达到一半就全部显示
                $(this).css("margin-left", -reX);
                // $(".check").html('<img src="../img/common/nocheck.png">').removeClass("check");
                //numprice()
            } else {//如果没有达到一半就不显示
                $(this).css("margin-left", 0);
            }
        } else if (changeX < 0) {
            if (-changeX >= reX / 2) {//如果达到一半就全部显示
                $(this).css("margin-left", 0);

            } else {//如果没有达到一半就不显示
                $(this).css("margin-left",-reX);
            }
        }
        e.stopPropagation();
    })
    //删除
    $("section ul").delegate("li .goremove", "touchstart", function (e) {
        var cartitem_idarr =[];
        cartitem_idarr.push($(this).parents("li").attr("shopping_id"));
        cartitem_idarr = "["+cartitem_idarr.toString()+"]";
        var obj = $(this);
        show_confirm("删除选中商品？",function(result){
            if(result==true){
                dropnum(cartitem_idarr,obj);
            }else{
                new Toast({context:$('body'),message:"取消删除购物车"}).show();
            }
        });
        event.stopPropagation();
    })
    $("section ul").delegate("li .T_C", "click", function (e) {
        var is_custom = $(this).parents("li").attr("is_custom");
        var spuid =  $(this).parents("li").attr("spuid");
        var olddata =  $(this).parents("li").attr("olddata");
        if(is_custom == 'true'){//定制
            window.location.href = "../webgl/customizations.html?spuid="+spuid+"&olddata="+olddata;
        }else{
            window.location.href = "itemdetails.html?spuid="+spuid;
        }
    })
})
