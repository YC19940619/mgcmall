$(function(){
    FastClick.attach(document.body);
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
		uid:uid,
		sessionid:sessionid
	}
    $.ajax({
        type:"post",
        url:sjb_display,
        async:true,
        crossDomain: true,
        data:sortByKeys(senddata),
        beforeSend: function () {
            var str = "<p class='loading'>加载中...</p>"
            $("section .wrap").html(str)
        },
        success:function(data){
            console.log(data)
            if(data.status == 0) {
                var str = '<ul>'//多张展示
                for (var i = 0; i < data.data.length; i++) {
                    var cartitem_id = data.data[i].id;//cartitem_id
                    var quantity = data.data[i].quantity;//数量
                    if(data.data[i].sku){
                        var price = data.data[i].sku.price;//价格
                        var name = data.data[i].sku.spu.name;//名字
                        var imgicon =dataimgsrc(data.data[i].sku.threedfileparams[0].img);//图片icon
                        var content = data.data[i].sku.attributes_values;
                        var is_custom = data.data[i].sku.is_custom;
                        var spuid = data.data[i].sku.spu.id;
                        var olddata = data.data[i].sku.threedfileparams[0].params;
                    }else if(data.data[i].finishes_sku){
                        var price = data.data[i].finishes_sku.price;//价格
                        var name = data.data[i].finishes_sku.name;//名字
                        var imgicon =dataimgsrc(data.data[i].finishes_sku.carousel_pictures[0].big_picture.split(",")[0]);//图片icon
                        var content =data.data[i].finishes_sku.attributes_values;
                        var is_custom = data.data[i].finishes_sku.is_custom;
                        var spuid = data.data[i].finishes_sku.spu;
                        var olddata = "";
                    }
                    str+='<li olddata="'+encodeURI(olddata)+'" spuid="'+spuid+'" is_custom="'+is_custom+'" cartitem_id="'+cartitem_id+'"><div class="detail">'
                    	for (var j = 0; j <content.length; j++) {
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
                    str+='</div><p class="proImg"><img src="'
                       +imgicon+
                       '" alt="" /></p><div class="rightPro"><p class="nowPrice"><span class="name">'
                       +name+'</span></p><p class="priGoto"><i>￥'
                       +price
                       +'</i><span class="mgobuy">加入购物车</span><span class="delete">删除</span></p></div></li>'
                }
                str+='</ul>'
                $("section .wrap").html(str);
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
                var swiper2 = new Swiper('.swiper-container2', {
                    pagination: '.swiper-pagination',
                    paginationType: 'fraction',
                    spaceBetween: 33,
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents:true//修改swiper的父元素时，自动初始化swiper
                });
            }else{
                $("section").css("background","#fff")
                str = '<p class="dingIcon"><img src="../img/common/kongcollect.png"></p><p class="dingTit">收藏夹空空如也，不去选购些东西吗~</p><input type="button" class="gobuy" id="" value="去选购" />'
                $("section .wrap").html(str)
            }
        },
        error:function(){
            new Toast({context:$('body'),message:"网络加载失败"}).show();
        }
    });
    //去购买
    $("section").delegate(".gobuy", "click", function (event) {
        localStorage.removeItem('mall_parameter');
        localStorage.removeItem('made_parameter');
        window.location.href = "made.html";
    });
	//加入购物车
	$("section").delegate(".mgobuy","click",function(event){
        var cartitem_id=$(this).parents("li").attr("cartitem_id");
        var senddata = {
            uid:uid,
            sessionid:sessionid,
            cartitem_id:cartitem_id
        }
		$.ajax({
			type:"post",
			url:addJewelryToCart,
			async:true,
			crossDomain: true,
			data:sortByKeys(senddata),
			success:function(data){

				if(data.status ==0){
					new Toast({context:$('body'),message:"加入购物车成功"}).show();
					window.location.href="ShoppingCart.html"
				}else{
					new Toast({context:$('body'),message:data.msg}).show();
				}

			},
			error:function(){
				new Toast({context:$('body'),message:"网络加载失败"}).show();
			}
		});
	});
    $("section .wrap").delegate("li .proImg", "click", function (e) {
        var is_custom = $(this).parents("li").attr("is_custom");
        var spuid =  $(this).parents("li").attr("spuid");
        var olddata =  $(this).parents("li").attr("olddata");
        if(is_custom == 'true'){//定制
            window.location.href = "../webgl/customizations.html?spuid="+spuid+"&olddata="+olddata;
        }else{
            window.location.href = "itemdetails.html?spuid="+spuid;
        }
    })
	//移出首饰盒
    $("section").delegate(".delete","click",function(){
        var obj =$(this);
        var cartitem_idarr = [];
        cartitem_idarr.push($(this).parents("li").attr("cartitem_id"));
        cartitem_idarr = "["+cartitem_idarr.toString()+"]";
        show_confirm("删除选中商品？",function(result){
            if(result==true){
                var senddata = {
                    uid:uid,
                    sessionid:sessionid,
                    cartitem_id:cartitem_idarr
                }
                $.ajax({
                    type:"post",
                    url:sjb_drop,
                    async:true,
                    crossDomain: true,
                    data:sortByKeys(senddata),
                    success:function(data){
                        if(data.status ==0){
                            console.log(data);
                            obj.parents("li").addClass("remove");
                            setTimeout(function(){
                                obj.parents("li").remove();
                                if($('section ul').html()==0){
                                    str = '<p class="dingIcon"><img src="../img/common/kongcollect.png"></p><p class="dingTit">收藏夹空空如也，不去选购些东西吗~</p><input type="button" class="gobuy" id="" value="去选购" />'
                                    $("section .wrap").html(str)
                                }
                            },500);
                            new Toast({context:$('body'),message:'从收藏夹移出商品成功!'}).show();
                        }else{
                            new Toast({context:$('body'),message:data.msg}).show();
                        }
                    },
                    error:function(){
                        new Toast({context:$('body'),message:"网络加载失败"}).show();
                    }
                });
            }else{

            }
        });
	})

})
