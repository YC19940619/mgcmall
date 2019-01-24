$(".first").remove()
//第三部购买
$(".Step_3 .collect").click(function(){
    show_login(function (uid,sessionid){
        addbuy(sjb_addition,uid,sessionid,function(){
            show_confirm("加入成功，前往首饰盒?",function(result){
                if(result==true){
                    window.location.href="../html/collect.html"
                }
            });
        })
    },null)
});
$(".Step_3 .shopcar").click(function(){
    show_login(function (uid,sessionid){
        addbuy(cart_addition,uid,sessionid,function () {
            show_confirm("加入成功，前往购物车?",function(result){
                if(result==true){
                    window.location.href="../html/ShoppingCart.html";
                }
            });
        })
    },null)
});
$(".Step_3 .buynow").click(function(){
    show_login(function (uid,sessionid){
        addbuy(buyNow,uid,sessionid,function(id){
            var cartitem_idarr = "["+id+"]";
            window.location.href="../html/firmOrder.html?cartitem_idarr="+cartitem_idarr;
        })
    },null)
});
function differentshare(title,description,icon,webpageUrl,index) {
    $(".Step_3 .sharecode").erweima({//生成二维吗
        //label: '随我',//二维码文字内容
        //mode: 4,
        //mSize:20,
        //image:webglimg(localStorage.getItem('head_image')),
        text:webpageUrl//二维码内容
    });
}

