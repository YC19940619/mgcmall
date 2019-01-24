$(function() {
    FastClick.attach(document.body);
    //返回按键
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton",function(){
            window.location.href="personCenter.html";
        }, false);
    }
    $(".goback").click(function () {
        window.location.href = "personCenter.html"
    })
    var uid = localStorage.getItem("uid");
    var sessionid = localStorage.getItem("sessionid");
    var order_num;
    var order_status;
    var curNavIndex = 0;;
    var mescrollArr = new Array(5);//5个菜单所对应的5个mescroll对象
    //初始化全部订单
    mescrollArr[0] = initMescroll("mescroll0", "dataList0");
    /*初始化菜单*/
    $('.tab .item').click(function () {
        var i = $(this).index();
        if (curNavIndex != i) {
            //更改列表条件
            $('.tab .item').removeClass("active");
            $(this).addClass("active");
            //隐藏当前列表
            $("#mescroll" + curNavIndex).hide();
            //显示对应的列表
            curNavIndex = i;
            order_status = $(this).attr("order_status");
            $("#mescroll" + curNavIndex).show();
            //取出菜单所对应的mescroll对象,如果未初始化则初始化
            if (mescrollArr[i] == null) mescrollArr[i] = initMescroll("mescroll" + i, "dataList" + i);
            //$("#mescroll"+i+" .mescroll-downwarp").remove();
            //$("#mescroll"+i+" .mescroll-upwarp").remove();
            //mescrollArr[i] = initMescroll("mescroll" + i, "dataList" + i);
        }
    })

    /*创建MeScroll对象*/
    function initMescroll(mescrollId, clearEmptyId) {
        //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
        var mescroll = new MeScroll(mescrollId, {
            //上拉加载的配置项
            up: {
                callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                empty: {
                    icon: "../img/common/kongorder.png", //图标,默认null
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
    function getListData(page) {
        //联网加载数据
        console.log("curNavIndex=" + curNavIndex + ", page.num=" + page.num + ",page.size=" + page.size);
        getListDataFromNet(curNavIndex, page.num, page.size, function (data) {
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            console.log(data);
            mescrollArr[curNavIndex].endSuccess(data.length);//传参:数据的总数; mescroll会自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
            setListData(data)
            // /设置列表数据
        }, function () {
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescrollArr[curNavIndex].endErr();
        });
    }

    /*设置列表数据*/
    function setListData(data) {
        var result ='';
        for(var i =0; i < data.length; i++){
            console.log(data);
            var create_date = data[i].create_date;
            var status = data[i].order_status;
            var total_price = data[i].total_money;
            var total_quantity = 0;
            var order_serial_number = data[i].order_serial_number
            result +='<div order_serial_number="'
                +order_serial_number+
                '" class="list"><p class="listTit"><span>'
                +create_date
                +'</span><span class="tit1">'
            if(status==0){
                result+='待付款'
            }else if(status==1){
                result+='待发货'
            }else if(status==2){
                result+='已发货'
            }else if(status==3){
                result+='已完成'
            }else if(status==4){
                result+='已取消'
            }
            result+='</span></p>';
            for(var j=0;j<data[i].cartitem.length;j++){
                var quantity = data[i].cartitem[j].quantity;
                if(data[i].cartitem[j].sku){
                    var price = parseFloat(data[i].cartitem[j].sku.price);//价格
                    var title = data[i].cartitem[j].sku.spu.name;
                    var imgicon =dataimgsrc(data[i].cartitem[j].sku.threedfileparams[0].img);//图片icon
                }else if(data[i].cartitem[j].finishes_sku){
                    var price = data[i].cartitem[j].finishes_sku.price;//价格
                    var title = data[i].cartitem[j].finishes_sku.name;//名字
                    var imgicon =dataimgsrc(data[i].cartitem[j].finishes_sku.carousel_pictures[0].big_picture.split(",")[0]);//图片icon
                }
                total_quantity+=quantity;
                result+='<div class="pro"><div class="left"><img src="'
                    +imgicon
                    +'"/></div><div class="center"><p class="proTit">'
                    +title
                    +'</p></div><div class="right"><p class="price">￥'
                    +price
                    +'</p><p class="num">x<span>'
                    +quantity
                    +'</span></p></div></div>'
            }
            result+='<div class="bottom"><p class="total">合计：<span>￥'
                +total_price
                +'</span></p>'
            if(status==0){//待付款
                result+='<p class="sureBtn sureBtn1" id = "paynow">立即付款</p><p class="sureBtn sureBtn2" id="cancel">取消订单</p>'
            }else if(status==1) {//待发货
                //result += '<p class="sureBtn sureBtn1" id = "confirm">确认收货</p>'
            }else if(status==2) {//已发货
                result += '<p class="sureBtn sureBtn1" id = "confirm">确认收货</p>'
            }else if(status==3) {//已完成
                result += '<p class="sureBtn sureBtn2" id="delete">删除订单</p>'
            }else if(status==4) {//已完成
                result += '<p class="sureBtn sureBtn2" id="delete">删除订单</p>'
            }
            result+='</div></div>'
        }
        $("#dataList"+curNavIndex).append(result)
    }

    function getListDataFromNet(curNavIndex, pageNum, pageSize, successCallback, errorCallback) {
        //延时一秒,模拟联网  上拉下拉都需要
        setTimeout(function () {
            var senddata = {
                uid: uid,
                sessionid: sessionid,
                content_type_id: 1,
                order_status: order_status
            }
            $.ajax({
                type: 'post',
                url: orderlist,
                data: sortByKeys(senddata),
                success: function (data) {
                    var listData = [];
                    if(data.status == 0){
                        for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {//数据填充
                            if (i == data.data.length) break;
                            listData.push(data.data[i]);
                        }
                    }
                    //回调
                    successCallback(listData);
                },
                error: errorCallback
            });
        }, 100)
    }
    //取消订单
    $("section").delegate("#cancel","click",function(event){
    	var obj = $(this);
    	var order_serial_number = $(this).parents(".list").attr("order_serial_number");
        var senddata = {
            uid:uid,
            sessionid:sessionid,
            content_type_id:0,
            order_serial_number:order_serial_number
        }
        show_confirm("是否取消订单？",function(result){
            if(result==true){
                $.ajax({
                    type: 'post',
                    url: orderlist,
                    data:sortByKeys(senddata),
                    success: function(data){
                        if(data.status ==0){
                            eval('$(".list[order_serial_number='+order_serial_number+'] #cancel").attr("id","delete").html("删除订单")');
                            eval('$(".list[order_serial_number='+order_serial_number+'] #paynow").remove()');
                            eval('$(".list[order_serial_number='+order_serial_number+'] .tit1").html("已取消")');
                        }
                        new Toast({context:$('body'),message:'确认取消订单'}).show();
                    },
                    error: function(xhr, type){
                        new Toast({context: $('body'), message: "网络加载失败"}).show();
                    }
                });
            }else{
                new Toast({context:$('body'),message:"撤回取消订单"}).show();
            }
        });

        event.stopPropagation();
    })
    //删除订单
    $("section").delegate("#delete","click",function(event){
    	var obj = $(this);
        var order_serial_number = $(this).parents(".list").attr("order_serial_number");
        var senddata = {
            uid:uid,
            sessionid:sessionid,
            content_type_id:3,
            order_serial_number:order_serial_number
        }
        show_confirm("是否删除订单？",function(result){
            if(result==true){
                $.ajax({
                    type: 'post',
                    url: orderlist,
                    data:sortByKeys(senddata),
                    success: function(data){
                        if(data.status ==0){
                            eval('$(".list[order_serial_number='+order_serial_number+']").addClass("remove")');
                            setTimeout(function(){
                                var data_list = obj.parents(".data-list");
                                eval('$(".list[order_serial_number='+order_serial_number+']").remove()');
                                if(data_list.find(".list").length<=0){
                                    var str = '<p class="dingIcon"><img src="../img/common/kongorder.png"></p><p class="dingTit">暂无相关数据~</p>'
                                    data_list.html(str)
                                }
                            },500)
                        }
                        new Toast({context:$('body'),message:'删除订单成功'}).show();
                    },
                    error: function(xhr, type){
                        new Toast({context: $('body'), message: "网络加载失败"}).show();
                    }
                });
            }else{
                new Toast({context:$('body'),message:"撤回删除订单"}).show();
            }
        });
        event.stopPropagation();
    })
    //确认收货
    $("section").delegate("#confirm","click",function(event){
        var order_serial_number = $(this).parents(".list").attr("order_serial_number");
        var senddata = {
            uid:uid,
            sessionid:sessionid,
            order_serial_number:order_serial_number
        }
        show_confirm("是否确认收货？",function(result){
            if(result==true){
                $.ajax({
                    type: 'post',
                    url: confirm_receipt,
                    data:sortByKeys(senddata),
                    success: function(data){
                        window.location.href = "orderDetail.html?order_serial_number="+order_serial_number;
                    },
                    error: function(xhr, type){
                        new Toast({context: $('body'), message: "网络加载失败"}).show();
                    }
                });
            }else{
                //new Toast({context:$('body'),message:"撤回确认收货"}).show();
            }
        });
        event.stopPropagation();
    })
    //选择支付方式
    $("section").delegate("#paynow","click",function(event){
    	order_num = $(this).parents(".list").attr("order_serial_number");
        gopay(order_num,"梦工场订单",uid,sessionid)
        event.stopPropagation();
    })
    $("section").delegate(".list","click",function(event){
    	var order_serial_number = $(this).attr("order_serial_number");
    	window.location.href = "orderDetail.html?order_serial_number="+order_serial_number;
    })
    //去购买
    $("section").delegate(".gobuy","click",function(event){
        window.location.href = "../index.html";
    });
})
