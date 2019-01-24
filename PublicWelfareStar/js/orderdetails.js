$(function(){
    FastClick.attach(document.body);
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton",function(){
            window.location.href = "myOrder.html"
        }, false);
    }
    $(".goback").click(function(){
        window.location.href = "myOrder.html"
    })
    var uid = localStorage.getItem("uid");
    var sessionid = localStorage.getItem("sessionid");
	var order_serial_number = Request.QueryString("order_serial_number");
    var senddata = {
        uid:uid,
        sessionid:sessionid,
        content_type_id:1,
        order_serial_number:order_serial_number
    }
	//订单详情
	$.ajax({
        type: 'post',
        url: orderlist,
        data:sortByKeys(senddata),
        success: function(data){

        	$(".address .receiver").text(data.data[0].receiver+' '+data.data[0].phone_number);
        	$(".address .detail_address").text("收货地址："+data.data[0].shippingaddress);
    		var total_money = data.data[0].total_money;
    		var order_serial_number = data.data[0].order_serial_number;
    		var create_date = data.data[0].create_date;
    		var state = data.data[0].order_status;
    		var payment_method = data.data[0].payment_method;
    		if(state == 0){
                $(".order_state").text("等待买家付款")
				str='<p class="sureBtn sureBtn1" id = "paynow">立即付款</p><p class="sureBtn sureBtn2" id="cancel">取消订单</p>'
			}else if(state == 1){
                $(".order_state").text("买家已付款")
			}else if(state == 2){
                $(".order_state").text("商品已发货")
                str= '<p class="sureBtn sureBtn1" id = "confirm">确认收货</p>'
            }else if(state == 3){
                $(".order_state").text("交易已完成")
                str= '<p class="sureBtn sureBtn2" id="delete">删除订单</p>'
            }else if(state == 4){
                $(".order_state").text("交易已取消")
                str= '<p class="sureBtn sureBtn2" id="delete">删除订单</p>'
            }
            $(".btnlist").html(str);
            var datas = data.data[0].cartitem;
            var str = ''
            for(var i =0;i<datas.length;i++){
                var quantity = parseInt(datas[i].quantity);
                if(datas[i].sku){
                    var price = parseFloat(datas[i].sku.price);
                    var name = datas[i].sku.spu.name;
                    var imgicon =dataimgsrc(datas[i].sku.threedfileparams[0].img);//图片icon
                    var content = datas[i].sku.attributes_values;
                    var is_custom = datas[i].sku.is_custom;
                    var spuid = datas[i].sku.spu.id;
                    var olddata = datas[i].sku.threedfileparams[0].params;
                }else if(datas[i].finishes_sku){
                    var price = parseFloat(datas[i].finishes_sku.price);;//价格
                    var name = datas[i].finishes_sku.name;
                    var imgicon =dataimgsrc(datas[i].finishes_sku.carousel_pictures[0].big_picture.split(",")[0]);//图片icon
                    var content =datas[i].finishes_sku.attributes_values;
                    var is_custom = datas[i].finishes_sku.is_custom;
                    var spuid = datas[i].finishes_sku.spu;
                    var olddata = "";
                }
                str+='<li olddata="'+encodeURI(olddata)+'" spuid="'+spuid+'" is_custom="'+is_custom+'" class="pro"><div class="top"><div class="left"><img src="'
                    +imgicon+
                    '"/></div><div class="center"><p class="proTit">'
                    +name+
                    '<span class="detail">参数</span></p><p class="price"><span>￥'
                    +price+
                    '</span><i>x '
                    +quantity+
                    '</i></p></div></div><div class="bottom">'
                for (var j = 0; j < content.length; j++) {
                    str += '<p><span class="left">'
                        + content[j].attribute.name
                        + '：</span><span class="right">'
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
                str +='</div></li>'
            }
  			$(".content").html(str);
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
  			$(".totalPrice i").html("￥"+total_money);
  			$(".orderNum i").html(order_serial_number);
  			$(".orderCreate i").html(create_date);
  			if(payment_method==0){
                $(".orderPay i").text("未支付")
            }else if(payment_method==1){
                $(".orderPay i").text("支付宝支付")
            }else if(payment_method==2){
                $(".orderPay i").text("微信支付")
            }else if(payment_method==3){
                $(".orderPay i").text("线下支付")
            }

        },
        error: function(xhr, type){
          	new Toast({context:$('body'),message:"网络加载失败"}).show();
        }
    });
    //详情
	$(".content").delegate(".proTit .detail","click",function(event){
		if($(this).hasClass("check")){
			$(this).parents("li").children(".bottom").stop().slideUp();
			$(this).removeClass("check");
		}else{
			$(this).parents("li").children(".bottom").stop().slideDown();
			$(this).addClass("check");
		}
		event.stopPropagation();
	});
	$(".content").delegate(".bottom","click",function(event){
		event.stopPropagation();
	});
    //取消订单
    $("section").delegate("#cancel","click",function(event){
        var senddata = {
            uid:uid,
            sessionid:sessionid,
            content_type_id:0,
            order_serial_number:order_serial_number
        }
        show_confirm("是否取消订单？",function(result){
            if(result==true){
                $.ajax({
                    type: 'post',
                    url: orderlist,
                    data:sortByKeys(senddata),
                    success: function(data){
                        if(data.status ==0){
                            window.location.href = "myOrder.html";
                        }
                        new Toast({context:$('body'),message:'确认取消订单'}).show();
                    },
                    error: function(xhr, type){
                        new Toast({context: $('body'), message: "网络加载失败"}).show();
                    }
                });
            }else{
                new Toast({context:$('body'),message:"撤回取消订单"}).show();
            }
        });
        event.stopPropagation();
    })
    //删除订单
    $("section").delegate("#delete","click",function(event){
        var senddata = {
            uid:uid,
            sessionid:sessionid,
            content_type_id:3,
            order_serial_number:order_serial_number
        }
        show_confirm("是否删除订单？",function(result){
            if(result==true){
                $.ajax({
                    type: 'post',
                    url: orderlist,
                    data:sortByKeys(senddata),
                    success: function(data){
                        if(data.status ==0){
                            window.location.href = "myOrder.html"
                        }
                        new Toast({context:$('body'),message:'成功删除订单'}).show();
                    },
                    error: function(xhr, type){
                        new Toast({context: $('body'), message: "网络加载失败"}).show();
                    }
                });
            }else{
               new Toast({context:$('body'),message:"撤回删除订单"}).show();
            }
        });
        event.stopPropagation();
    })
    //确认收货
    $("section").delegate("#confirm","click",function(event){
        var senddata = {
            uid:uid,
            sessionid:sessionid,
            order_serial_number:order_serial_number
        }
        show_confirm("是否确认收货？",function(result){
            if(result==true){
                $.ajax({
                    type: 'post',
                    url: confirm_receipt,
                    data:sortByKeys(senddata),
                    success: function(data){
                        if(data.status == 0){
                            window.location.href = "myOrder.html";
                            new Toast({context:$('body'),message:"确认收货"}).show();
                        }
                    },
                    error: function(xhr, type){
                        new Toast({context: $('body'), message: "网络加载失败"}).show();
                    }
                });
            }else{
               new Toast({context:$('body'),message:"取消确认收货"}).show();
            }
        });
        event.stopPropagation();
    })
    //选择支付方式
    $("section").delegate("#paynow","click",function(event){
        gopay(order_serial_number,"梦工场订单",uid,sessionid)
        event.stopPropagation();
    })
	//跳转详情
	$(".content").delegate("li .left","click",function(event){
        var is_custom = $(this).parents("li").attr("is_custom");
        var spuid =  $(this).parents("li").attr("spuid");
        var olddata =  $(this).parents("li").attr("olddata");
        if(is_custom == 'true'){//定制
            window.location.href = "../webgl/customizations.html?spuid="+spuid+"&olddata="+olddata;
        }else{
            window.location.href = "itemdetails.html?spuid="+spuid;
        }
		event.stopPropagation();
	})
})
