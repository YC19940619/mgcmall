$(function(){
    FastClick.attach(document.body);
    var spuid = Request.QueryString("spuid");
    var made = Request.QueryString("made");
    $(".goback").click(function(){
        //parent.document.getElementById("iframe").style.display = "none";
        history.go(-1);
    })
    //顶部导航
    $("header p span").click(function(){
       $("header span").removeClass("active");
       $(this).addClass("active");
       if($(this).hasClass("detailsnav")){
           $("section").animate({scrollTop:$(".item").height()});
       }else{
           $("section").animate({scrollTop:0});
       }
    })
    //数据加载
    $.ajax({
        type:"get",
        url:goods_details+spuid,
        async:true,
        crossDomain: true,
        data:{},
        beforeSend:function(){},
        success:function(data) {
            console.log(data)
            var carousel_pictures = data.data.carousel_pictures[0].big_picture.split(",");
            var details_pictures= data.data.details_pictures[0].big_picture.split(",");
            console.log(data.data.details_pictures[0].big_picture)
            var name = data.data.name;
            var description = data.data.description;
            var specifications_values = data.data.specifications_values;
            var attributes_values = data.data.attributes_values;
            var sku = data.data.sku;
            $(".name_introduce .name").text(name);
            $(".name_introduce .introduce").text(description);
            for(var i=0; i<carousel_pictures.length;i++ ){
                var str ='<div class="swiper-slide"><img class="swiper-lazy" data-src="'
                    if(carousel_pictures[i]==""){
                        str +='../img/common/commonitem.png'
                    }else{
                        str += dataimgsrc(carousel_pictures[i])
                    }
                    str +='"/><div class="swiper-lazy-preloader"></div></div>';
                $(".swiper-wrapper").append(str);
            }
            for(var i=0; i<specifications_values.length;i++ ){
                if(specifications_values[i].specification_value.length>0){
                    var str ='<p><span class="key">'+specifications_values[i].specification.name+'：</span><span class="values">'+specifications_values[i].specification_value[0].name+'</span></p>'
                }else{
                    var str = "";
                }
                $(".Product_Parameters_box").append(str);
            }
            for(var i=0; i<details_pictures.length;i++ ){
                if(details_pictures[i] !== "")
                    $(".details").append('<img src="'+dataimgsrc(details_pictures[i])+'">');
            }
            // $("img.lazy").lazyload({
            //     effect: "fadeIn"
            // });
            for(var i=0; i<attributes_values.length;i++ ){
               var str = '<div class="parametr_change" skuid='+attributes_values[i].attribute.id+'><p class="title">'+attributes_values[i].attribute.name+'</p><p class="content">'
               $(attributes_values[i].attribute_value).each(function(n){
                   if(n==0){
                       str+='<span class="active" skuid="'+this.id+'">'+this.name+'</span>'
                   }else{
                       str+='<span skuid="'+this.id+'">'+this.name+'</span>'
                   }
               })
               str +='</p></div>'
               $(".parameter_C").append(str)
            }
            $(".parameter_T img").attr("src",dataimgsrc(carousel_pictures[0]));
            mgcsku ={};
            $(sku).each(function(i){
                var str ="";
                $(this.attributes_values).each(function(j){
                    str+=this.attribute__id+""+this.attribute_value__id;
                });
                mgcsku[str] = {
                    skuid:this.id,
                    price:this.price,
                    stocks:this.stocks
                };
            })
            console.log(mgcsku)
            var strmgc ="";
            $(".parametermask .parameter_C .parametr_change").each(function(n){
                var obj = $(".parametermask .parameter_C .parametr_change").eq(n);
                strmgc+=obj.attr("skuid")+""+obj.find(".active").attr("skuid");
            })
            $(".name_introduce .price").text("￥ "+mgcsku[strmgc].price);
            $(".parameter_T .price span").text("￥ "+mgcsku[strmgc].price).attr("skuid",mgcsku[strmgc].skuid);
            $(".parameter_T .stocks span").text("库存："+mgcsku[strmgc].stocks+"件").attr("stocks",mgcsku[strmgc].stocks);
            if(sku[0].stocks==0){
                $(".itemimg p").addClass("active");
                $(".parametermask .btn").removeClass("active");
            }
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplay: 2500,
                autoplayDisableOnInteraction: false,
                loop:true,
                lazyLoading : true
            });
        },
        error:function(){
            new Toast({context:$('body'),message:"网络加载失败"}).show();
        }
    });
    //参数
    $(".Product_Parameters").click(function(){
        $(".Product_Parameters .right").toggleClass("active");
        $(".Product_Parameters_box").stop().slideToggle();
    });
    //规格取消
    $(".parameter .remove").click(function(){
        $(".parametermask").css("display","none");
    })
    //选择规格
    $(".parametermask .parameter_C").delegate(".parametr_change span","click",function(){
        $(this).parent().find("span").removeClass("active");
        $(this).addClass("active");
        var str ="";
        $(".parametermask .parameter_C .parametr_change").each(function(n){
            var obj = $(".parametermask .parameter_C .parametr_change").eq(n);
           str+=obj.attr("skuid")+""+obj.find(".active").attr("skuid");
        })
        $(".name_introduce .price").text("￥ "+mgcsku[strmgc].price);
        $(".parameter_T .price span").text("￥ "+mgcsku[str].price).attr("skuid",mgcsku[str].skuid);
        $(".parameter_T .stocks span").text("库存："+mgcsku[str].stocks+"件").attr("stocks",mgcsku[str].stocks);
        if(mgcsku[str].stocks==0){
            $(".itemimg p").addClass("active");
            $(".parametermask .btn").removeClass("active");
        }else{
            $(".itemimg p").removeClass("active");
            $(".parametermask .btn").addClass("active");
        }
    })
    //数量加减
    $(".parametr_num_change").delegate(".jian","click",function (event) {
        var quantity = $(this).parent(".num").children("#changenum").val();
        var obj = $(this);
        if (quantity <= 1) {
            new Toast({context: $('body'), message: "亲！不能再少了"}).show();
        } else {
            quantity--;
            obj.parent(".num").children("#changenum").val(quantity);
            if (quantity <= 1) {
                $(this).addClass("highlight");
            }
        }
        event.stopPropagation();
    })
    $(".parametr_num_change").delegate(".jia","click",function (event) {
        var quantity = $(this).parent(".num").children("#changenum").val();
        var obj = $(this);
        if(quantity<parseInt($(".parameter_T .stocks span").attr("stocks"))){
            quantity++;
            obj.parent(".num").children("#changenum").val(quantity);
        }else{
            new Toast({context:$('body'),message:"库存不足"}).show();
        }
        if (quantity > 1) {
            $(this).parent(".num").children(".jian").removeClass("highlight");
        }
        event.stopPropagation();
    })
    //底部
    $(".footer .collect").click(function(){
        jsonurl = sjb_addition;
        Jumpurl = "../html/collect.html";
        $(".parametr_num_change").css("display","none");
        $(".parametermask").css("display","block");
    })
    $(".footer .shoppingcar").click(function(){
        jsonurl = cart_addition;
        Jumpurl = "../html/ShoppingCart.html";
        $(".parametr_num_change").css("display","block");
        $(".parametermask").css("display","block");
    })
    $(".footer .buynow").click(function(){
        jsonurl = buyNow;
        Jumpurl = "../html/firmOrder.html";
        $(".parametr_num_change").css("display","block");
        $(".parametermask").css("display","block");
    })
    //确认购买
    $(".parametermask .btn").click(function(){
        if($(this).hasClass("active")){
            show_login(function (uid,sessionid){
                addbuy(jsonurl,uid,sessionid,Jumpurl)
            },null,"../")
        }
    });
    function addbuy(jsonsrc,uid,sessionid,str){
        var ajaxdata ={
            uid:uid,
            sessionid:sessionid,
            spuid:spuid,
            quantity:$(".parametr_num_change #changenum").val(),
            skuid: $(".parameter_T .price span").attr("skuid")
        }
        var senddata = sortByKeys(ajaxdata);
        $.ajax({
            type:"post",
            url:jsonsrc,
            async:true,
            crossDomain: true,
            data:senddata,
            success:function(data){
                console.log(data)
                if(data.status == 0){

                    if(data.data){
                        var cartitem_idarr = "["+data.data[0].id+"]";
                        window.location.href=str+"?cartitem_idarr="+cartitem_idarr;
                    }else{
                        window.location.href=str;
                    }
                }else if(data.status==20207) {
                    new Toast({context: $('body'), message: '该商品已经存在我的收藏中'}).show();
                }else{
                    new Toast({context:$('body'),message:'购买失败'}).show();
                }
            },
            error:function(){
                new Toast({context:$('body'),message:"网络故障"}).show();
            }
        });
    }
})