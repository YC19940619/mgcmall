$(function(){
    FastClick.attach(document.body);
    $("header p ").text(decodeURI(Request.QueryString("data-name")))
    $(".goback").click(function(){
        history.go(-1)
    })
    var newmade_parameter = {list:0,scrollTop:0};
    var made_parameter = JSON.parse(localStorage.getItem('made_parameter'))?JSON.parse(localStorage.getItem('made_parameter')):newmade_parameter;
    var list = 0;
    var scrollTop = made_parameter.scrollTop;
    var curNavIndex=0;
    var mescrollArr=new Array(1);
    $(".itemnav span").eq(curNavIndex).addClass("active");
    $(".contentitem .mescroll").eq(curNavIndex).addClass("active");
    //初始化首页
    mescrollArr[curNavIndex]=initMescroll("mescroll"+curNavIndex, "dataList"+curNavIndex);
    /*初始化菜单*/
    $(".itemnav").delegate("span","click",function(){
        var i=$(this).index();
        if(curNavIndex!=i) {
            //更改列表条件
            $(".itemnav span").removeClass("active");
            $(this).addClass("active");
            $(".mescroll").removeClass("active");

            //隐藏当前列表
            $("#mescroll"+curNavIndex).hide();
            //显示对应的列表
            curNavIndex=i;
            $("#mescroll"+curNavIndex).show().addClass("active");
            //取出菜单所对应的mescroll对象,如果未初始化则初始化
            if(mescrollArr[i]==null) mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
            scrollTop = 0;
        }

    })
    /*创建MeScroll对象*/
    function initMescroll(mescrollId,clearEmptyId){
        //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
        var mescroll = new MeScroll(mescrollId, {
            down:{
                use: true,
                isLock:false
            },
            //上拉加载的配置项
            up: {
                callback: getListDataUp, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                empty: {
                    icon: "../img/common/kongitem.png", //图标,默认null
                    tip: "暂无相关数据~", //提示
                    // btntext: null, //按钮,默认""
                    // btnClick: function(){}//点击按钮的回调,默认null
                },
                clearEmptyId: clearEmptyId //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
            }
        });
        return mescroll;
    }
    function getListDataUp(page){
        //联网加载数据
        getListDataFromNet(curNavIndex, page.num, page.size, function(data){
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            mescrollArr[curNavIndex].endSuccess(data.length);//传参:数据的总数; mescroll会自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
            setListData(data)
            // /设置列表数据
        }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescrollArr[curNavIndex].endErr();
        });
    }
    /*设置列表数据*/
    function setListData(data){
        console.log(data)
        var str = "";
        for (var i = 0; i < data.length; i++) {
            str +='<div class="item '+$("header .right").attr("item_data")+'" spuid="'+data[i].id+'"><div class="left"><img  class="lazy"  data-original="'+dataimgsrc(data[i].img) +'"></div><div class="right">'
                +'<p class="name">'+data[i].name+'</p><p class="description">'+data[i].description+'</p><p class="goprice">'
                +'<span class="price">￥ '+data[i].price+'起</span><span class="go">开始定制</span>'
                +'</p></div></div></div>'
        }
        $("#dataList"+curNavIndex).append(str)
        $("img.lazy").lazyload({
            effect: "fadeIn",
            container: $("#dataList"+curNavIndex),
            threshold : 200
        });
        if(scrollTop>0){
            $(".contentitem #mescroll"+curNavIndex).scrollTop(parseInt(scrollTop));
        }
    }
    function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
        //setTimeout(function() {
        var url,type;
        var senddata = {
            page:pageNum,
            offid:$(".item").length
        };
        if(Request.QueryString("category_id")){
            url = customgoods_list;
            type = "GET";
            senddata["category_id"] = Request.QueryString("category_id");
        }else{
            url = series;
            type = "post";
            senddata["series_id"] = Request.QueryString("series_id");
        }
        $.ajax({
            type: type,
            url: url,
            async: true,
            crossDomain: true,
            data: senddata,
            beforeSend: function () {
            },
            success: function (data) {
                var data = data.data;
                var listData = [];
                for (var i = 0; i < data.length; i++) {//数据填充
                    //if (pageNum > 1 && Request.QueryString("series_id")) break;   //显示无更多数据
                    listData.push(data[i]);
                }
                //回调
                successCallback(listData);
            },
            error: function () {
                var listData = [];
                successCallback(listData);
                new Toast({context: $('body'), message: "网络加载失败"}).show();
            }
        });
       //},500)
    }
    //禁止PC浏览器拖拽图片,避免与下拉刷新冲突;如果仅在移动端使用,可删除此代码
    document.ondragstart=function() {return false;}
    $("section").delegate(".item","click",function(){
        var made_parameter ={
            list:$(".itemnav .active").index(),
            scrollTop:$(".mescroll.active").scrollTop()
        }
        made_parameter = JSON.stringify(made_parameter);
        localStorage.setItem("made_parameter",made_parameter);
        var spuid = $(this).attr("spuid");
        window.location.href="../webgl/customizations.html?spuid="+spuid;
    })
    $("header .right").click(function(){
        if($(this).hasClass("row")){
//      	console.log($('.data-list div:odd'))
        	$('.data-list div').removeClass('listWrap');
            $(this).removeClass("row").addClass("column").attr("item_data","item_column").find("img").attr("src","../img/common/column.png");
            $(".item").removeClass("item_row").addClass("item_column");
        }else{
        	$('.data-list div:first-child').addClass('listWrap');
            $(this).removeClass("column").addClass("row").attr("item_data","item_row").find("img").attr("src","../img/common/row.png");
            $(".item").removeClass("item_column").addClass("item_row");
        }
    })
})
