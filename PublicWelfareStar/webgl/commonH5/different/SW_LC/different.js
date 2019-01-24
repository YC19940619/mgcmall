$(".first").remove()
$('.first_click').remove();
//第三部购买
//$(".Step_3 .collect").click(function(){
//  show_login('../',function () {
//      addbuy(sjb_addition,uid,sessionid,"../html/collect.html","收藏夹")
//  });
//})
//$(".Step_3 .shopcar").click(function(){
//  show_login('../',function(){
//      addbuy(cart_addition,uid,sessionid,"../html/ShoppingCart.html","购物车")
//  });
//})
//$(".Step_3 .buynow").click(function(){
//  show_login('../',function () {
//      addbuy(buyNow,uid,sessionid,"../html/firmOrder.html")
//  });
//})
// 隐藏pc定制官网操作步奏
$('.testStep').remove();
//第三部购买
    $(".Step_3 .collect").click(function(){
		show_login('../',function(uid,sessionid){
			addbuy(sjb_addition,uid,sessionid,"../html/collect.html","收藏夹")
		});
    })
    $(".Step_3 .shopcar").click(function(){
		show_login('../',function(uid,sessionid){
			addbuy(cart_addition,uid,sessionid,"../html/ShoppingCart.html","购物车")
		});
    })
    $(".Step_3 .buynow").click(function(){
		show_login('../',function(uid,sessionid){
			addbuy(buyNow,uid,sessionid,"../html/firmOrder.html","立即购买")
		});	
    })
function addbuy(jsonsrc,uid,sessionid,str,name){
    webgloading()
    var ajaxdata ={
        uid:uid,
        sessionid:sessionid,
        spuid:spuid,
        quantity:1,
        cc:$(".price").eq(0).text().split("￥")[1],
        screenshot:$(".Step_3 .webglimg img").attr("src"),
        attributes_values:params.data_params(),
        file_params:params.file_params()
    }
    var senddata = sortByKeys(ajaxdata);
    $.ajax({
        type:"post",
        url:jsonsrc,
        async:true,
        crossDomain: true,
        data:senddata,
        success:function(data){
            if(data.status == 0){
                Onload()
                if(data.data){
                    var cartitem_idarr = "["+data.data[0].id+"]";
                    window.location.href=str+"?cartitem_idarr="+cartitem_idarr;
                }else{
                    show_confirm("加入成功，前往"+name+"?",function(result){
                        if(result==true){
                            window.location.href=str;
                        }
                    });
                }
            }else{
//              new Toast({context:$('body'),message:'购买失败'}).show();
                Onload()
            }
        },
        error:function(){
            Onload()
            new Toast({context:$('body'),message:"网络故障"}).show();
        }
    });
}
function differentshare(title,description,icon,webpageUrl,index) {
    $(".Step_3 .sharecode").erweima({//生成二维吗
        //label: '随我',//二维码文字内容
        //mode: 4,
        //mSize:20,
        //image:webglimg(localStorage.getItem('head_image')),
        text:webpageUrl//二维码内容
    });
}
$('.Step header').hide();
$('<div class="headerWrap"><header class="minWid"><span class="left">首页</span><p>定制</p><span class="right gonext" style="color:#fff;font-size:24px;">完成定制</span></header></div>').insertBefore($('.Step_2 section'))
$('<div class="headerWrap"><header class="minWid"><span class="left">首页</span><p>定制</p></header></div>').insertBefore($('.Step_3 section'))
$('body').delegate('.headerWrap .left','click',function(){
	window.location.href="../index.html";
})
