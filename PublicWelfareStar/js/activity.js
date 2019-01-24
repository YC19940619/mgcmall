$(function(){
    // FastClick.attach(document.body);
    $("body").delegate(".box","click",function(){
        var aid = $(this).attr("aid");
        show_login(function (){
            articl(aid)
            //$(".articledetail").attr("src","html/articledetail.html?aid="+aid);
            //$(".articledetail").addClass("active");
        },null)
    })
    function articl(aid){
        var str = '<iframe class="articledetail" id="articledetail" src="../html/articledetail.html?aid='+aid+'"></iframe>'
        $(".articledetail").remove();
        $("body").append(str);
        setTimeout(function(){
            $(".articledetail").addClass("active");
        },100)
    }
    var curNavIndex=0;//今天戴什么0; 定制精品1;
    var mescrollArr=new Array(4);//4个菜单所对应的4个mescroll对象
    //初始化首页
    mescrollArr[0]=initMescroll("mescroll0", "dataList0");
    /*初始化菜单*/
    $(".nav li").click(function(){
        var i=$(this).index();
        if(curNavIndex!=i) {
            //更改列表条件
            $(".nav .active").removeClass("active");
            $(this).addClass("active");
            //隐藏当前列表
            $("#mescroll"+curNavIndex).hide();
            //显示对应的列表
            curNavIndex=i;
            $("#mescroll"+curNavIndex).show();
            //取出菜单所对应的mescroll对象,如果未初始化则初始化
            if(mescrollArr[i]==null) mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
        }
    })

    /*创建MeScroll对象*/
    function initMescroll(mescrollId,clearEmptyId){
        //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
        var mescroll = new MeScroll(mescrollId, {
            //上拉加载的配置项
            up: {
                callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                empty: {
                    icon: "img/common/kongactive.png", //图标,默认null
                    tip: "暂无相关数据~", //提示
                   // btntext: null, //按钮,默认""
                   // btnClick: function(){}//点击按钮的回调,默认null
                },
                clearEmptyId: clearEmptyId //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
            }
        });
        return mescroll;
    }
    /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    function getListData(page){
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
        if(curNavIndex == 0){
            for (var i = 0; i < data.length; i++) {
                var str='';
                str+='<div class="dynamic" file_params="'+encodeURI(data[i].file_params)+'" spuid="'+data[i].spuid+'" choiceness_id="'+data[i].id+'"><div class="headimg"><div class="left"><img src="'
                    +dataimgsrc(data[i].user__headimage__head_image)+
                    '"></div><div class="center"><p class="nickname">'
                    +data[i].user__nickname+
                    '</p><p class="time">'
                    +getDateDiff(data[i].publish_time)+
                    '</p></div></div><div class="imgbox">'
                var pictures = data[i].pictures.split(",");
                for(var j = 0;j<pictures.length;j++){
                    str+='<img class="lazy"  data-original="'+dataimgsrc(pictures[j])+'">'
                }
                str+='</div><div class="describe"><p>'
                    +data[i].description+
                    '</p></div><div class="bottom"><span class="thumbs-up"><i>点赞</i><i class="heart heartgray"><img src="../img/common/heartgray.png"></i><i class="num">'
                    +data[i].thumbup+
                    '</i></span><b></b><span class="Customizing">定制同款</span></div></div>'
                //$("#dataList0 img").removeClass("lazy");
                $("#dataList0").append(str)
            }
            $("img.lazy").lazyload({
                effect: "fadeIn",
                container: $("#dataList0"),
                threshold : 200
            });
        }
        else if(curNavIndex == 1){
            //今日戴什么
            // for (var i = 0; i < data.length; i++) {
            //     var mytime= data[i].publish_time;
            //     var publish_time = mytime.replace(/-/g,'/').split(" ")[0];
            //     var str='<div class="box" aid="'+data[i].id+'"><div class="detail"><img class="lazy"  data-original="'
            //         +dataimgsrc(data[i].title_img)+
            //         '"><h2>'+data[i].title+'</h2><div class="bottom"><p class="time">'+publish_time+'</p><p class="read">阅读 '+data[i].clicking+'</p></div></div></div>';
            //     //$("#dataList1 img").removeClass("lazy");
            //     $("#dataList1").append(str)
            // }
            // $("img.lazy").lazyload({
            //     effect: "fadeIn",
            //     container: $("#dataList1"),
            //     threshold : 200
            // });
        //    品牌资讯
            for (var i = 0; i < data.length; i++) {
                var mytime= data[i].publish_time;
                var publish_time = mytime.replace(/-/g,'/').split(" ")[0];
                var str='<div class="box" aid="'+data[i].id+'"><div class="detail"><img class="lazy"  data-original="'
                    +dataimgsrc(data[i].title_img)+
                    '"><h2>'+data[i].title+'</h2><div class="bottom"><p class="time">'+publish_time+'</p><p class="read">阅读 '+data[i].clicking+'</p></div></div></div>';
                //$("#dataList1 img").removeClass("lazy");
                $("#dataList1").append(str)

            }
            $("img.lazy").lazyload({
                effect: "fadeIn",
                container: $("#dataList1"),
                threshold : 200
            });
        }
        //    品牌资讯
        // else{
        //     for (var i = 0; i < data.length; i++) {
        //         var mytime= data[i].publish_time;
        //         var publish_time = mytime.replace(/-/g,'/').split(" ")[0];
        //         var str='<div class="box" aid="'+data[i].id+'"><div class="detail"><img class="lazy"  data-original="'
        //             +dataimgsrc(data[i].title_img)+
        //             '"><h2>'+data[i].title+'</h2><div class="bottom"><p class="time">'+publish_time+'</p><p class="read">阅读 '+data[i].clicking+'</p></div></div></div>';
        //         //$("#dataList1 img").removeClass("lazy");
        //         $("#dataList2").append(str)
        //
        //     }
        //     $("img.lazy").lazyload({
        //         effect: "fadeIn",
        //         container: $("#dataList2"),
        //         threshold : 200
        //     });
        // }
    }
    function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
        //延时一秒,模拟联网  上拉下拉都需要
        if(curNavIndex==0){
            var url = choiceness_list ;
            var data = {
                page:pageNum,
                offid : $("#dataList0 .box").length
            }

        }else if(curNavIndex==1){

            var url = faxian1 ;
            var data = {
                page:pageNum,
                category:"品牌资讯",
                offid : $("#dataList1 .box").length
            }
        }else{
            var url = faxian1;
            var data = {
                page:pageNum,
                category:"今日推荐",
                offid : $("#dataList2 .box").length
            }
        }
        setTimeout(function () {
            $.ajax({
                type: 'GET',
                url: url,
                data:data,
                success: function(data){
                    if(typeof(data) == "string"){
                        data = JSON.parse(data);
                    }
                    var data=data.data;
                    var listData = [];
                    for (var i = 0; i < data.length; i++) {//数据填充
                        //if (i == 5) break;   显示无更多数据
                        listData.push(data[i]);
                    }
                    //回调
                    successCallback(listData);
		        },
                error: errorCallback
		   });
        },500)
    }
    //禁止PC浏览器拖拽图片,避免与下拉刷新冲突;如果仅在移动端使用,可删除此代码
    document.ondragstart=function() {return false;}
    //点赞
    $("#dataList0").delegate(".dynamic .bottom .heartgray","click",function(){
        var obj = $(this);
        var choiceness_id =$(this).parents(".dynamic").attr('choiceness_id');
        var uid = localStorage.getItem('uid');
        var sessionid = localStorage.getItem('sessionid');
        show_login(function (){
            $.ajax({
                type: 'post',
                url:choiceness_thumbup,
                data:{
                    uid:uid,
                    sessionid:sessionid,
                    choiceness_id:choiceness_id
                },
                success: function(data){
                    console.log(data);
                    if(data.status == 0){
                        new Toast({context:$('body'),message:'点赞成功'}).show();
                        obj.removeClass("heartgray").addClass("heartred");
                        obj.children("img").attr("src","../img/common/heartred.png");
                        obj.parents(".bottom").find(".num").text(parseInt(obj.parents(".bottom").find(".num").text())+1);
                    }else if(data.status== 20405){
                        new Toast({context:$('body'),message:'您已经点过赞了'}).show();
                    }
                },
                error:function(){
                    new Toast({context:$('body'),message:"网络加载失败"}).show();
                }
            });

        },function (){

        })
    })
    //定制同款
    $(".content").delegate(".Customizing","click",function(){
        var spuid = $(this).parents(".dynamic").attr("spuid");
        var olddata = $(this).parents(".dynamic").attr("file_params");
        window.location.href = "../webgl/customizations.html?spuid="+spuid+"&olddata="+olddata;
    })
    // $("#dataList1").delegate(".dynamic .bottom .heartred","click",function(){
    //     $(this).removeClass("heartred").addClass("heartgray");
    //     $(this).children("img").attr("src","img/common/heartgray.png");
    //     $(this).parents(".bottom").find(".num").text(parseInt($(this).parents(".bottom").find(".num").text())-1);
    // })
    //大图
    $("#dataList0").delegate(".dynamic .imgbox img","click",function(){
        var index = $(this).parents(".dynamic").index();
        ycbigimg(this,'.dynamic .imgbox',index)
    })

    function getDateDiff(dateStr) {
        var publishTime =  Date.parse(dateStr.replace(/-/gi,"/"))/1000;
        var d_seconds;
        var d_minutes;
        var d_hours;
        var d_days;
        var timeNow = parseInt(new Date().getTime()/1000);
        var d;
        var date = new Date(publishTime*1000);
        var Y = date.getFullYear();
        var M = date.getMonth()+1;
        var D = date.getDate();
        var H = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        //小于10的在前面补0
        if (M < 10) {
            M = '0' + M;
        }
        if (D < 10) {
            D = '0' + D;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        d = timeNow - publishTime;
        d_days = parseInt(d/86400);
        d_hours = parseInt(d/3600);
        d_minutes = parseInt(d/60);
        d_seconds = parseInt(d);
        if(d_days > 0 && d_days < 3){
            return d_days + '天前';
        }else if(d_days <= 0 && d_hours > 0){
            return d_hours + '小时前';
        }else if(d_hours <= 0 && d_minutes > 0){
            return d_minutes + '分钟前';
        }else if (d_seconds < 60) {
            if (d_seconds <= 0) {
                return '刚刚发表';
            }else {
                return d_seconds + '秒前';
            }
        }else if (d_days >= 3 && d_days < 30){
            return M + '-' + D + '&nbsp;' + H + ':' + m;
        }else if (d_days >= 30) {
            return Y + '-' + M + '-' + D + '&nbsp;' + H + ':' + m;
        }
    }
})


