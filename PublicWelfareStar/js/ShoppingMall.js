 $(function(){
     FastClick.attach(document.body);
    var screendata;
    var newmall_parameter = {"list":0,"scrollTop":0,"salesvolumebtn":"salesvolumebtn","pricebtn":"0","screen_id":-1};
    var mall_parameter = JSON.parse(localStorage.getItem('mall_parameter'))?JSON.parse(localStorage.getItem('mall_parameter')):newmall_parameter;
    var list = mall_parameter.list;
    var scrollTop = mall_parameter.scrollTop;
    var salesvolumebtn = mall_parameter.salesvolumebtn;
    var pricebtn = mall_parameter.pricebtn;
    var screen_id = mall_parameter.screen_id;
    var pricebtnobj = $(".pricebtn");
    var mescroll = new MeScroll("mescroll", {
        down:{
            use: true,
            isLock:false
        },
        //上拉加载的配置项
        up: {
            callback: getListDataup, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            empty: {
                icon: "../img/common/kongitem.png", //图标,默认null
                tip: "暂无相关数据~" //提示
                // btntext: null, //按钮,默认""
                // btnClick: function(){}//点击按钮的回调,默认null
            },
            clearEmptyId: "dataList", //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
            toTop:{ //配置回到顶部按钮
                src : "../img/up.png" //默认滚动到1000px显示,可配置offset修改
                //offset : 1000
            }
        }
    });
    //筛选条件
    $.ajax({
        type:"get",
        url:shopping_categorys,
        async:true,
        crossDomain: true,
        data:{},
        beforeSend:function(){},
        success:function(data){
            screendata = data.data;
            console.log(screendata)
            var str1 ='';
            for(i =0;i<data.data.category.length;i++){
                str1 +='<span category_id="'+data.data.category[i].id+'">'+data.data.category[i].name+'</span>'
            }
            $(".itemnav").html(str1).append('<p class="navborder"></p>');
            $(".itemnav span").eq(list).addClass("active");
            var itemnav = $(".itemnav .active") ;
            $(".itemnav .navborder").css({"left":itemnav.offset().left,"width":itemnav.outerWidth(true)});
            $(".salesvolumebtn").removeClass("salesvolumebtn").addClass(salesvolumebtn);
            pricebtnobj.attr("sort",pricebtn);
            if(pricebtn === 1){
                pricebtnobj.find(".top").attr("src","../img/common/topred.png");
                pricebtnobj.find(".bottom").attr("src","../img/common/bottomhui.png");
            }else if(pricebtn === 2){
                pricebtnobj.find(".top").attr("src","../img/common/tophui.png");
                pricebtnobj.find(".bottom").attr("src","../img/common/bottomred.png");
            }else if(pricebtn === 0){
                pricebtnobj.find(".top").attr("src","../img/common/tophui.png");
                pricebtnobj.find(".bottom").attr("src","../img/common/bottomhui.png");
            }
            console.log(screen_id)
            screen(screen_id)
        },
        error:function(){
            new Toast({context:$('body'),message:"网络加载失败"}).show();
        }
    });
    //销量优先
    $(".salesvolumebtn").click(function(){
        $(this).toggleClass("active");
        pricebtnobj.attr("sort",0);
        pricebtnobj.find(".top").attr("src","../img/common/tophui.png");
        pricebtnobj.find(".bottom").attr("src","../img/common/bottomhui.png");
        //$(".screen li").removeClass("active");
        mescroll.resetUpScroll();
        scrollTop=0;
    })
    //价格排序
     pricebtnobj.click(function(){
        $(".salesvolumebtn").removeClass("active");
        var sort = $(this).attr("sort");
        sort++;
        if(sort>2){
            sort = 0
            $(this).find(".top").attr("src","../img/common/tophui.png");
            $(this).find(".bottom").attr("src","../img/common/bottomhui.png");
        }else{
            if(sort === 1){
                $(this).find(".top").attr("src","../img/common/topred.png");
                $(this).find(".bottom").attr("src","../img/common/bottomhui.png");
            }else if(sort === 2){
                $(this).find(".top").attr("src","../img/common/tophui.png");
                $(this).find(".bottom").attr("src","../img/common/bottomred.png");
            }
        }
        $(this).attr("sort",sort)
        $(this).toggleClass("active");
        mescroll.resetUpScroll();
        scrollTop=0;
    })
    //筛选
    $(".sortnav .screenbtn").click(function(){
        $(".screenmask").addClass("active").removeClass("displayNone");
        //$(".screenmask").stop().animate({"left":0},200);
    });
    $(".screenmask .screen").click(function(e){
        event.stopPropagation();
    })
    $(".screenmask").click(function(){
        $(".screenmask").removeClass("active").addClass("displayNone");
    })
    //选项
    $(".screenmask .screen").delegate("li","click",function(){
        $(".screenmask .screen li").removeClass("active");
        $(this).addClass("active");
    })
    //重置
    $(".screenmask .screen").delegate(".reset","click",function(){
        $(".screenmask .screen li").removeClass("active");
        $(".screenmask").removeClass("active");
        mescroll.resetUpScroll();
        scrollTop=0;
    })
    //确认
    $(".screenmask .screen").delegate(".complete","click",function(){
        $(".screenmask").removeClass("active");
        mescroll.resetUpScroll();
        scrollTop=0;
    })
    /*初始化菜单*/
    $(".itemnav").delegate("span","click",function(){
        var i=$(this).index();
        $(".itemnav span").removeClass("active");
        $(this).addClass("active");
        screen(-1)
        $(".itemnav .navborder").stop().animate({"left":$(this).offset().left,"width":$(this).outerWidth(true)},200)
        $(".salesvolumebtn").removeClass("active");
        pricebtnobj.attr("sort",0);
        pricebtnobj.find(".top").attr("src","../img/common/tophui.png");
        pricebtnobj.find(".bottom").attr("src","../img/common/bottomhui.png");
        //重置数据
        mescroll.resetUpScroll();
        scrollTop=0;
    })
    function screen(screen_id) {
        screen_id = screen_id||-1;
        var str = '';
        for(var i = 0;i< screendata.specification.length;i++){
            if(screendata.specification[i].category == $(".itemnav .active").attr("category_id") ){
                str+='<div class="option"><p class="title">'+screendata.specification[i].name+'</p><ul>'
                for(var j = 0;j< screendata.specification[i].specificationvalue.length;j++) {
                    str += '<li id="' + screendata.specification[i].specificationvalue[j].id + '">' + screendata.specification[i].specificationvalue[j].name + '</li>'
                }
                str+='</ul></div>';
            }
        }
        str += '<div class="option series"><p class="title">系列</p><ul>';
        for(var i = 0;i< screendata.series.length;i++){
            str+='<li id="'+screendata.series[i].id+'">'+screendata.series[i].name+'</li>'
        }
        str +='</ul></div>'
        $(".screen .top .content").html(str);
        console.log(screen_id)
        if(screen_id!=-1){
            $(".screen li[id="+screen_id+"]").addClass('active');
        }

    }
    /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    function getListDataup(page){
        //联网加载数据
        getListDataFromNet(page.num, page.size, function(data){
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endSuccess(data.length);//传参:数据的总数; mescroll会自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
            setListData(data)
            // /设置列表数据
        }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
        });
    }
    /*设置列表数据*/
    function setListData(data){
        var str = ''
        for (var i = 0; i < data.length; i++) {
            var is_custom= data[i].is_custom;
            if(is_custom == true){
                str +='<li is_custom="'+is_custom+'" class="item" spuid="'+data[i].id+'"><img class="Customlogo" src="../img/Customlogo.png"><dl><dt><img class="lazy"  data-original="'
                +dataimgsrc(data[i].img)+'"></dt><dd><p  class="name">'+data[i].name+'</p><p class="price">￥'+data[i].price+' 起</p></dd></dl></li>'
            }else{
                str +='<li is_custom="'+is_custom+'" class="item" spuid="'+data[i].id+'"><dl><dt><img class="lazy"  data-original="'
                + dataimgsrc(data[i].carouselpictures__medium_picture.split(",")[0])
                +'"></dt><dd><p  class="name">'+data[i].name+'</p><p class="price">￥'+data[i].price+' 起</p></dd></dl></li>'
            }

        }
        $("#dataList img").removeClass("lazy");
        $("#dataList").append(str);
        $("img.lazy").lazyload({
            effect: "fadeIn",
            container: $("#dataList"),
            threshold : 200
        });
        if(scrollTop>0){
            //$("#mescroll").scrollTop(parseInt(scrollTop));
        }
    }
    function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        setTimeout(function(){
            var senddata = {
                category_id:$(".itemnav span.active").attr("category_id"),
                page:pageNum,
                offid : $(".item").length
            }
            if($(".salesvolumebtn").hasClass("active")){
                senddata["sortord"] = "-sales_quantity";
            }else{
                if($(".pricebtn").attr("sort")==1){
                    senddata["sortord"] = "-price";

                }else if($(".pricebtn").attr("sort")==2){
                    senddata["sortord"] = "price";
                }
            }
            if($(".screen li.active").length>0){
                if($(".screen li.active").parents(".option").hasClass("series")){
                    senddata['series_id']= $(".screen li.active").attr("id");
                }else{
                    senddata['specification']= "["+$(".screen li.active").attr("id")+"]";
                }
            }
            $.ajax({
                type:"get",
                url:goods_list,
                async:true,
                crossDomain: true,
                data:senddata,
                beforeSend:function(){},
                success:function(data){
                    var data=data.data;
                    var listData = [];
                    for (var i = 0; i < data.length; i++) {//数据填充
                        //if (i == 5) break;   显示无更多数据
                        listData.push(data[i]);
                    }
                    //回调
                    successCallback(listData);
                },
                error:function(){
                    var listData = [];
                    successCallback(listData);
                    new Toast({context:$('body'),message:"网络加载失败"}).show();
                }
            });
        },200)

    }
    //禁止PC浏览器拖拽图片,避免与下拉刷新冲突;如果仅在移动端使用,可删除此代码
    document.ondragstart=function() {return false;}
    $("section").delegate(".item","click",function(){
        var is_custom = $(this).attr("is_custom");
        var spuid = $(this).attr("spuid");
        var screen_id = $(".screen").find(".active").attr("id");
        var mall_parameter ={
            list:$(".itemnav .active").index(),
            scrollTop:$(".mescroll").scrollTop(),
            salesvolumebtn:$(".salesvolumebtn").attr("class"),
            pricebtn:$(".pricebtn").attr("sort"),
            screen_id:screen_id
        }
        mall_parameter = JSON.stringify(mall_parameter);
        localStorage.setItem("mall_parameter", mall_parameter);
        if(is_custom === "true"){
            window.location.href="../webgl/customizations.html?spuid="+spuid;
        }else{
            window.location.href="itemdetails.html?spuid="+spuid;
        }
    })
 })