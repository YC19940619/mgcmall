//第三部购买
$(".Step_3 .collect").click(function(){
    addbuy(sjb_addition,uid,sessionid,function(){
        show_confirm("加入成功，前往首饰盒?",function(result){
            if(result==true){
                wx.miniProgram.navigateTo({url: '../../pages/collect/collect'})
            }
        });
    })
});
$(".Step_3 .shopcar").click(function(){
    addbuy(cart_addition,uid,sessionid,function () {
        show_confirm("加入成功，前往购物车?",function(result){
            if(result==true){
                wx.miniProgram.navigateTo({url: '../../pages/shoppingcar/shoppingcar'})
            }
        });
    })
});
$(".Step_3 .buynow").click(function(){
    addbuy(buyNow,uid,sessionid,function(id){
        var cartitem_idarr = "["+id+"]";
        wx.miniProgram.navigateTo({url: '../../pages/firmorder/firmorder?cartitem_idarr='+cartitem_idarr})
    })
});
