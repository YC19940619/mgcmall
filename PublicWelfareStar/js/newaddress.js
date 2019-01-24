$(function(){
    var uid = localStorage.getItem("uid");
    var sessionid = localStorage.getItem("sessionid");
	//返回按键
	$(".goback").click(function(){
        window.location.href = "manageaddress.html?backaddress=1&backorder="+Request.QueryString("backorder");
	})
	var arg = Request.QueryString("arg");
	if(arg==1){
		$('.receiver').val(localStorage.getItem('address_name'));
		$('.phone_num').val(localStorage.getItem('address_phone'));
		$('.address').val(localStorage.getItem('address_province'));
		$('.detail').val(localStorage.getItem('address_detail'));
		$('.save').click(function(){
            var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if(!$('.receiver').val() || !$('.phone_num').val() || !$('.address').val() || !$('.detail').val()){
                new Toast({context:$('body'),message:'输入框里内容不能为空'}).show();
            }else if(!myreg.test($('.phone_num').val())){
                new Toast({context: $('body'), message: '请输入合法的手机号!'}).show();
            }else {
                var senddata = {
                    uid: uid,
                    sessionid: sessionid,
                    receiver: $('.receiver').val(),
                    phone_num: $('.phone_num').val(),
                    province: $('.address').val(),
                    detail_address: $('.detail').val(),
                    shipping_address_id: localStorage.getItem('address_edit_id')
                }
                $.ajax({
                    type: 'post',
                    url: addressUpdate,
                    data: sortByKeys(senddata),
                    success: function (data) {
                        console.log(data);
                        if (data.status == 0) {
                            new Toast({context: $('body'), message: '地址修改成功'}).show();
                            window.location.href = "manageaddress.html?backaddress=1&backorder=" + Request.QueryString("backorder");
                        }else{
                            new Toast({context: $('body'), message: '地址修改失败'}).show();
						}
                    },
                    error: function () {
                        new Toast({context: $('body'), message: '网络加载失败'}).show();
                    }

                })
            }
		})
	}else if(arg==0){
        $(".delete").css("display","none")
		$('.save').click(function(){
            var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if(!$('.receiver').val() || !$('.phone_num').val() || !$('.address').val() || !$('.detail').val()){
                new Toast({context:$('body'),message:'输入框里内容不能为空'}).show();
			}else if(!myreg.test($('.phone_num').val())){
                new Toast({context: $('body'), message: '请输入合法的手机号!'}).show();
			}else{
                var senddata = {
                    uid:uid,
                    sessionid:sessionid,
                    receiver:$('.receiver').val(),
                    phone_num:$('.phone_num').val(),
                    province:$('.address').val(),
                    detail_address:$('.detail').val()
                }
                $.ajax({
                    type:'post',
                    url:addressAdd,
                    data:sortByKeys(senddata),
                    success:function(data){
                        console.log(data);
                        // if(data.status==1){
                        // 	new Toast({context:$('body'),message:data.error_msg}).show();
                        // }else{
                        // 	window.location.href = "manageaddress.html?backaddress=1&backorder="+Request.QueryString("backorder");
                        // }
                        if(data.status==0){
                            new Toast({context:$('body'),message:'地址添加成功'}).show();
                            window.location.href = "manageaddress.html?backaddress=1&backorder="+Request.QueryString("backorder");
                        }else{
                            new Toast({context:$('body'),message:'地址添加失败'}).show();
						}

                    },
                    error:function(){
                        new Toast({context:$('body'),message:'网络加载失败'}).show();
                    }

                })
			}

		})
	}
	//弹起地址选择框
	$("#address").click(function(){
		change($("#address"));
	})
    //删除收货地址
    $('section').delegate(".delete","click",function(event){
        console.log(localStorage.getItem('address_edit_id'));
        show_confirm("删除选中收货地址？",function(result){
            if(result==true){
                var senddata = {
                    uid:uid,
                    sessionid:sessionid,
                    shipping_address_id:localStorage.getItem('address_edit_id')
                }
                $.ajax({
                    type:'post',
                    url:addressDelete,
                    data:sortByKeys(senddata),
                    success:function(data){
                        console.log(data);
						//删除了订单收货地址
						if(localStorage.getItem("shippingaddress_id")==localStorage.getItem('address_edit_id')){
							localStorage.removeItem("shippingaddress_id");
							localStorage.removeItem("order_receiver");
							localStorage.removeItem("order_phone_num");
							localStorage.removeItem("order_province");
							localStorage.removeItem("order_detail_address");
						}
						if(data.status==0){
                            new Toast({context:$('body'),message:'删除地址成功'}).show();
                            window.location.href = "manageaddress.html?backaddress=1&backorder="+Request.QueryString("backorder");
                        }else{
                            new Toast({context:$('body'),message:'删除地址失败'}).show();
                        }

                    },
                    error:function(){
                        new Toast({context:$('body'),message:'网络加载失败'}).show();
                    }
                })
            }else{
                new Toast({context:$('body'),message:"取消删除收货地址"}).show();
            }
        });
        event.stopPropagation();
    })
})
