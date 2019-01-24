$(function(){
    FastClick.attach(document.body);
    var uid = localStorage.getItem("uid");
    var sessionid = localStorage.getItem("sessionid");
	var cartitem_idarr = Request.QueryString("cartitem_idarr");
    var shippingaddress_id = localStorage.getItem("shippingaddress_id");
	var allprice = 0;
	var allquantity =0;
	var order_num;//订单编号
	$(".goback").click(function(){
		history.go(-1)
	});
	//获取默认收货地址
	if(shippingaddress_id){
		$(".address").attr("shippingaddress_id",shippingaddress_id);
		var str = '<div class="left"><img src="../img/common/address.png"></div><div class="center"><p class="receiver">'
		+localStorage.getItem("order_receiver")+' '+localStorage.getItem("order_phone_num")+
		'</p><p class="detail_address">收货地址：'+
        localStorage.getItem("order_province")+' '+localStorage.getItem("order_detail_address")+
		'</p></div><div class="right"><img src="../img/common/goto.png"></div>'
		$(".address").html(str);
	}else{
        var senddata = {
            uid:uid,
            sessionid:sessionid
        }
		$.ajax({
			type:'post',
			url:sa_default_display,
			data:sortByKeys(senddata),
			success:function(data){
				if(data.status == 0){
                    $(".address").attr("shippingaddress_id",data.sa_list[0].id);
                    var str = '<div class="left"><img src="../img/common/address.png"></div><div class="center"><p class="receiver">'
                        +data.sa_list[0].receiver+' '+data.sa_list[0].phone_num+
                        '</p><p class="detail_address">收货地址：'
                        +data.sa_list[0].province+' '+data.sa_list[0].detail_address+
                        '</p></div><div class="right"><img src="../img/common/goto.png"></div>'
                    $(".address").html(str);
				}else{
                    $(".address").html("请选择收货地址");
				}
			},
			error:function(){
				new Toast({context:$('body'),message:'网络错误'}).show();
			}
		})
	}
    var senddata = {
        uid:uid,
        sessionid:sessionid,
        cartitem_id:cartitem_idarr
    }
    $.ajax({
        type: "post",
        url: confirm_order,
        async: true,
        crossDomain: true,
        data: sortByKeys(senddata),
        success: function (data) {
            console.log(data)
            if (data.status == 0) {
                var static = data.static.subattributes;//表情
            	var data = data.data;
				var str ="";
                for(var i =0;i<data.length;i++){
                    var quantity = parseInt(data[i].quantity);
                    if(data[i].sku){
                        var price = parseFloat(data[i].sku.price);//价格
                        var name = data[i].sku.spu.name;//名字
                        var imgicon =dataimgsrc(data[i].sku.threedfileparams[0].img);//图片icon
                        var content = data[i].sku.attributes_values;
                    }else if(data[i].finishes_sku){
                        var price = data[i].finishes_sku.price;//价格
                        var name = data[i].finishes_sku.name;//名字
                        var imgicon =dataimgsrc(data[i].finishes_sku.carousel_pictures[0].big_picture.split(",")[0]);//图片icon
                        var content =data[i].finishes_sku.attributes_values;
                    }
                    allquantity +=quantity;
                    allprice +=price*quantity;
                    str+='<li class="pro"><div class="top"><div class="left"><img src="'
                        +imgicon+
                        '"/></div><div class="center"><p class="proTit">'
                        +name+
                        '<span class="detail">参数</span></p><p class="price"><i>数量：'
                        +quantity+
                        '</i><span>价格：￥'
                        +price+
                        '</span></p></div></div><div class="bottom">'
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

                //总共价格和个数
                allprice = allprice.toFixed(2);
                $(".submitBtn .money").html("<i>应付：</i>￥"+allprice);
                $(".totalPrice i").html("￥"+allprice);
                $(".totalPrice span").html(allquantity);
            } else {
                new Toast({context: $('body'), message: data.msg}).show();
            }
        },
        error: function () {
            new Toast({context: $('body'), message: "网络加载失败"}).show();
        }
    })
    //详情
    $(".content").delegate(".proTit .detail","click",function(event){
        $(this).parents("li").children(".bottom").stop().slideToggle()
        event.stopPropagation();
    });
    $(".content").delegate(".bottom","click",function(event){
        event.stopPropagation();
    });
	//提交订单
	$(".submitBtn .btn").click(function(){
		if($(".address").html()=='请选择收货地址'){
			new Toast({context:$('body'),message:'请选择收货地址'}).show();
		}else{
            var senddata = {
                uid:uid,
                sessionid:sessionid,
                cartitem_id:cartitem_idarr,
                shippingaddress_id:$(".address").attr("shippingaddress_id")
            }
			$.ajax({
				type:"post",
				url:addorder,
				async:true,
				crossDomain: true,
				data:sortByKeys(senddata),
				success:function(data){

					if(data.status ==0){
						//$(".btn").unbind('click');
						order_num = data.data.order_serial_number;
                        gopay(order_num,"梦工场订单",uid,sessionid)//弹出支付方式
					}else{
						new Toast({context:$('body'),message:data.msg}).show();
					}
				},
				error:function(){
					new Toast({context:$('body'),message:"网络加载失败"}).show();
				}
			})
		}

	});
	//选择收货地址
	$(".address").click(function(){
        localStorage.setItem("backorder",1)
		window.location.href = "manageaddress.html?backorder=1";
	})
})
