$(function(){
    FastClick.attach(document.body);
	var uid = localStorage.getItem("uid");
    var sessionid = localStorage.getItem("sessionid");
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton",function(){
            if(Request.QueryString("backaddress")==1){
                history.go(-3)
            }else{
                history.go(-1)
            }
        }, false);
    }
	//返回按键
	$(".goback").click(function(){
		if(Request.QueryString("backaddress")==1){
			history.go(-3)
		}else{
			history.go(-1)
		}

	})
    var senddata = {
        uid:uid,
        sessionid:sessionid
    }
	$.ajax({
		type:'post',
		url:addressSearch,
		data:sortByKeys(senddata),
		success:function(data){
			var result="";
			if(data.status==0){
                //收获表中有列表
                for(var i=0;i<data.sa_list.length;i++){
                    var receiver = data.sa_list[i].receiver;//收货人
                    var phone_num = data.sa_list[i].phone_num;//收货手机号
                    var province = data.sa_list[i].province;//收货地址省市
                    var detail_address = data.sa_list[i].detail_address;//收货地址街道
                    var is_default = data.sa_list[i].is_default;//默认收货地址
                    if(is_default){
                        var str ='<li class="default" id="'+data.sa_list[i].id+'"><div class="left"><span class="iconfont">默认</span></div><div class="center"><p class="receiver">'
                            +receiver+' '+phone_num+'</p><p class="detail_address">收货地址：'+province+' '+detail_address+'</p></div><div class="right"><img src="../img/common/edit.png"></div>'
                        $('section .list').prepend(str)
                    }else{
                        result +='<li id="'+data.sa_list[i].id+'"><div class="left"><span class="iconfont">默认</span></div><div class="center"><p class="receiver">'
                            +receiver+' '+phone_num+'</p><p class="detail_address">收货地址：'+province+' '+detail_address+'</p></div><div class="right"><img src="../img/common/edit.png"></div>'
                    }

                }
			}else{
                // 收获地址中没有列表
                result+='<p class="dingIcon"><img src="../img/common/kongaddress.png"></p><p class="dingTit">您还没有收货地址呢~去添加一个吧~</p>'
			}
			$('section .list').append(result);
		},
		error:function(){
			new Toast({context:$('body'),message:'ajax调取失败'}).show();
		}
	})
	//新增收货地址
	$('section').delegate(".add","click",function(){
		isPageHide = true;
		window.location.href ="newAddress.html?arg=0&backorder="+Request.QueryString("backorder");
	})

	//默认收货地址
	$('section').delegate("li .left span","click",function(event){
		var obj=$(this);
		var senddata = {
			uid:uid,
			sessionid:sessionid,
			shipping_address_id:obj.parents('li').attr('id')
		}
		$.ajax({
			type:'post',
			url:addressDefault,
			data:sortByKeys(senddata),
			success:function(data){
				window.location.reload()
				//obj.parents('li').addClass("default").siblings('li').removeClass('default');
			},
			error:function(){
				new Toast({context:$('body'),message:'ajax调取失败'}).show();
			}
		})
		event.stopPropagation();
	})
	//编辑收货地址
	$('section').delegate(".right","click",function(event){
		obj=$(this);
		localStorage.setItem('address_edit_id',$(this).parents('li').attr('id')); // 编辑的收获地址id
		localStorage.setItem('address_name',obj.parent("li").find('.receiver').text().split(" ")[0]);
		localStorage.setItem('address_phone',obj.parent("li").find('.receiver').text().split(" ")[1]);
		localStorage.setItem('address_province',obj.parent("li").find('.detail_address').text().split("：")[1].split(" ")[0]);
		localStorage.setItem('address_detail',obj.parent("li").find('.detail_address').text().split(" ")[1])
        window.location.href ="newAddress.html?arg=1&backorder="+Request.QueryString("backorder");
		event.stopPropagation();
	})
	//选择收货地址
	$("section").delegate("li","click",function(event){
		localStorage.setItem("shippingaddress_id",$(this).attr("id"));
		localStorage.setItem("order_receiver",$(this).find('.receiver').text().split(" ")[0]);
		localStorage.setItem("order_phone_num",$(this).find('.receiver').text().split(" ")[1]);
		localStorage.setItem("order_province",$(this).find('.detail_address').text().split("：")[1].split(" ")[0]);
		localStorage.setItem("order_detail_address",$(this).find('.detail_address').text().split(" ")[1]);
		if(Request.QueryString("backorder")==1){//如果是编辑地址进入的并且是确认订单来的
			if(Request.QueryString("backaddress")==1){
                history.go(-3)
			}else{
                history.go(-1)
			}
		}
		event.stopPropagation();
	})
})
