$(function(){
    var hasTouch = 'ontouchstart' in window;
    console.log(hasTouch)
    startEvent = hasTouch ? 'touchstart' : 'mousedown';
    moveEvent = hasTouch ? 'touchmove' : 'mousemove';
    endEvent = hasTouch ? 'touchend' : 'mouseup';
    var testStep=localStorage.getItem('testStep');
    if(!testStep){
        $('.testStep').addClass('active');
        localStorage.setItem('testStep',true);
    }
    $('.testStep .jump').click(function(){
        $('.testStep').removeClass('active');
    })
    $('.testStep img').click(function(){
        $(this).removeClass('active').next().addClass('active');
        if($(this).index() >3){
            $('.testStep').removeClass('active');
        }
    })
    //第二步上一步
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton",function(){
            show_confirm("定制内容将重置，是否返回？",function(result){if(result==true){
                goback()
            }});
        }, false);
    }
    $(".Step_2 .goback").click(function(){
        show_confirm("定制内容将重置，是否返回？",function(result){if(result==true){
            goback()
        }});
    })
    // 监听键盘出现
    var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //判断是iOS
    if(isIOS) {
        function keyboardShowHandler(e){
            //if(window.scrollY < 100) //键盘高度一般大于100，如果scrollY小于100，可以认为界面未上移，则需要手动上移
            window.scrollTo(0, e.keyboardHeight);
        }
        function keyboardHideHandler(e){
            if(window.scrollY != 0)
                window.scrollTo(0, 0);
        }
        window.addEventListener('native.keyboardshow', keyboardShowHandler);
        window.addEventListener('native.keyboardhide', keyboardHideHandler);
    }
    //文字编辑选项切换
    $(".content").delegate(".text .textnav span","click",function(event){})
    //输入文字
    $(".diytext").focus(function(){})
    $(".content").delegate(".text .diytext","input",function(){
        text_length()
    })
    //选择表情
    $(".content").delegate(".text .emojidl","click",function(event){
        if($(".diytext").html() =="<br>"){
            $(".diytext").html("");
        }
        $(".diytext").html(insertHTML($(this).find("img").prop("outerHTML")));
        text_length()
        event.stopPropagation();
    })
    //选择推荐文字
    $(".content").delegate(".text .textdl","click",function(event){
        var obj = $(this).parents('.contenttwo').siblings('.textbottom').find('.diytext')
        obj.html($(this).text());
        text_length()
        event.stopPropagation();
    })
    $(".Step_2").delegate(".text .remove","click",function(){
        optionshowhide.hide()
        event.stopPropagation();
    })
    //确认文字
    $(".content").delegate(".text .sure","click",function(){
        var diytext = $(this).siblings(".diytext")
        var webglval=diytext.html();
        var nowlen = diytext.text().length + diytext.children("img").length;
        var maxlen=showing.getSymbolMax(jewelID,linkstyle);
        var minlen=showing.getSymbolMin(jewelID,linkstyle);
        var testInp=/^[ A-Z|a-z|0-9|\[\]]+$/;
        var emojidl=$(".text .emojidl");
        if(nowlen<minlen||nowlen>maxlen){
            new Toast({context:$('body'),message:"您选择的这款首饰只能输入"+minlen+"到"+maxlen+"字符"}).show();
        }else {
            for (var i =0;i<emojidl.length;i++) {
                var item = emojidl.eq(i).find("img").prop("outerHTML");
                allitem = new RegExp(item,"g");
                var num = emojidl.eq(i).attr("webgl_num");
                webglval= webglval.replace(allitem,"["+num+"]");
            }
            var nbsp = new RegExp("&nbsp;","g");
            webglval= webglval.replace(nbsp," ");
            if(series_id==10002){webglval = webglval.toUpperCase()}
            if(!testInp.test(webglval) && series_id!=10034){
                new Toast({context:$('body'),message:"不能输入汉字和特殊字符"}).show();
            }else if(webglval.replace(/ /g,"").length<=0){
                new Toast({context:$('body'),message:"不能输入空字符"}).show();
            }else{
                var obj = $(this).parents(".option");
                obj.attr("webgl_text",webglval)
                if($(this).hasClass('lefttextbtn')){
                    new clickthreeshow('lefttext',null,null,null,webglval,obj)
                }else if($(this).hasClass('righttextbtn')){
                    new clickthreeshow('righttext',null,null,null,webglval,obj)
                }else{
                    new clickthreeshow('text',null,null,null,webglval,obj)
                }

            }
            optionshowhide.hide()
        }

        event.stopPropagation();
    })
    //第二步视角切换
    $(".Step_2 .visual_angle_btn").click(function(){
        if($(this).text() ==="试戴"){
            $(this).text("取消试戴")
            showing.ShowAll();//远景
        }else{
            $(this).text("试戴")
            showing.ShowPart();//近景
        }
    })
    //第二步同款推荐
    $(".same_paragraph_box").delegate("dl","click",function(){
        olddata=params.file_params();
        spuid = $(this).attr("spuid");
        goods_data(spuid);
    })
    //第二步下一步
    $(".Step_2 .gonext").click(function(){
        webgloading()
        if(localStorage.getItem("uid")){
            $.ajax({
                type: "post",
                url:custom_history,
                data:{
                    uid:localStorage.getItem("uid"),
                    sessionid:localStorage.getItem("sessionid"),
                    spuid:spuid,
                    items:custom_items()
                },
                dataType: "json",
                crossDomain: true,
                success: function(data) {},
                error: function(e) {}
            })
        }
        //近景截图
        optionshowhide.hide()
        showing.ShowPart();
        $(".Step_2 .visual_angle_btn i").text("试戴");
        $(".Step_2 .visual_angle_btn img").attr("src","../img/customization/shidai.png");
        var obj = showing.capturePictures();
        for(var i = 0;i<obj.length;i++){
            $(".Step_3 .webglimg2 img").eq(i).attr("src",obj[i].src);
        }
        $(".Step").removeClass("active");
        $(".Step_3").addClass("active");
        $(".Step_3 .sharecode").html('')
        $(".Step_3 .webglimg2 img").eq(0).one("load",function(){
            convertToData($(".Step_3 .webglimg2 img").eq(0).attr("src"),function(basechar) {
                // 回调后的函数处理
                $(".showimg .webglimg img").attr("src", basechar);
            });
        })
        Onload()
    })
    //合并导航点击
    $(".Step_2 .optionstwo ").delegate('.content .tag_group_nav span','click',function (event) {
        var index = $(this).index();
        $(this).parents(".tag_group_nav").find("span").removeClass("active");
        $(this).addClass("active");
        $(this).parents(".tag_group_nav").siblings(".option").removeClass("active");
        $(this).parents(".tag_group_nav").siblings(".option").eq(index).addClass("active");
        for(var i =0; i<$(".contentthree_ul").length;i++){
            var width = $(".contentthree_ul").eq(i).width();
            var dlwidth=0;
            for(var j=0;j<$(".contentthree_ul").eq(i).find("dl.inl_block").length;j++){
                dlwidth+=$(".contentthree_ul").eq(i).find("dl.inl_block").eq(j).outerWidth(true);
            }
            if(dlwidth<width){
                $(".contentthree").eq(i).addClass("flex");
            }else{
                $(".contentthree").eq(i).removeClass("flex");
            }
        }
        event.stopPropagation();
    })
    //选项
    $(".Step_2 .optionstwo").delegate('.content .option .contenttwo dl',endEvent,function (e) {
        $(this).siblings("dl").removeClass("active");
        $(this).addClass("active");
        var webgl_key = $(this).parents(".option").attr("webgl_key");
        var vid = $(this).attr("vid")?$(this).attr("vid"):"";
        var value_name = $(this).attr("value_name")?$(this).attr("value_name"):"";
        var webgl_value = $(this).attr("webgl_value")?$(this).attr("webgl_value"):"";
        var obj = $(this).parents(".option");
        var webgl_num
        $(this).parents(".option").attr("vid",vid).attr("value_name",value_name).attr('webgl_value',webgl_value);
        if(webgl_key === 'text'||webgl_key === 'lefttext'||webgl_key === 'righttext'){
        }else if(webgl_key === 'picture'||webgl_key === 'sign'){
            if(webgl_key === 'picture'){$(".option.picture").attr("is_custom",false)}
            var img = $(this).attr("img")?$(this).attr("img"):"";
            webgl_num = $(this).attr("webgl_num")?$(this).attr("webgl_num"):"";
            $(this).parents(".option").attr("img",img).attr("webgl_num",webgl_num);
            new clickthreeshow(webgl_key,webgl_num,webgl_value,img,null,obj);
        }else{
            webgl_num = $(this).attr("webgl_num")?$(this).attr("webgl_num"):"";
            $(this).parents(".option").attr("webgl_num",webgl_num);
            new clickthreeshow(webgl_key,webgl_num,webgl_value,null,null,obj);
        }
        event.stopPropagation();
    });
    //三级导航切换
    $(".Step_2 .optionstwo ").delegate('.content .option .contenttwonav span','click',function (e) {
        var index = $(this).index();
        $(this).parents(".contenttwonav").find("span").removeClass("active");
        $(this).addClass("active");
        $(this).parents(".contenttwonav").siblings(".contenttwo").find(".contentthree").removeClass("active");
        $(this).parents(".contenttwonav").siblings(".contenttwo").find(".contentthree").eq(index).addClass("active");
        for(var i =0; i<$(".contentthree_ul").length;i++){
            var width = $(".contentthree_ul").eq(i).width();
            var dlwidth=0;
            for(var j=0;j<$(".contentthree_ul").eq(i).find("dl.inl_block").length;j++){
                dlwidth+=$(".contentthree_ul").eq(i).find("dl.inl_block").eq(j).outerWidth(true);
            }
            if(dlwidth<width){
                $(".contentthree").eq(i).addClass("flex");
            }else{
                $(".contentthree").eq(i).removeClass("flex");
            }
        }
        event.stopPropagation()
    })
    //星牌二维码
    $(".options").delegate(".qrbtn","click",function(){
        var QRcode = $(this).siblings("textarea").val();
        console.log(QRcode);
        if(QRcode.length>0 ){
            if(QRcode.length<=100){
                f_onCreateQrcode(QRcode);
            }else{
                new Toast({context:$('body'),message:"二维码内容不能超过100个字符"}).show();
            }
        }else{
            new Toast({context:$('body'),message:"请输入二维码内容"}).show();
        }
    })
    //第二步x号
    $(".Step_2 .optionstwo").delegate(".remove","click",function(){
        optionshowhide.hide();
    })
    //第三步上一步
    $(".Step_3 .goback").click(function(){
        $(".Step").removeClass("active");
        $(".Step_2").addClass("active");
    })
    //第三部分享
    $(".sharelist dl").click(function(){
        var index = $(this).index();
        shareimg(index,showing.capturePictures(),collectName,uid,sessionid)
    })
    //取消分享
    $(".sharemask .remove").click(function(){
        $(".sharemask").css("display","none");
    })
    $(".sharemask .sure").click(function(){
        var description = $(".sharemask textarea").val();
        var pictures_urls = $(".sharemask").attr("pictures_urls");
        $.ajax({
            type: "post",
            url: choiceness_details,
            async: true,
            crossDomain: true,
            data:{
                uid:localStorage.getItem("uid"),
                sessionid:localStorage.getItem("sessionid"),
                spuid:spuid,
                file_params:params.file_params(),
                title:"梦工场",
                description:description,
                pictures:pictures_urls
            },
            success: function(data) {
                console.log(data)
                if(data.status == 0){
                    $(".sharemask textarea").val("");
                    show_confirm("分享成功，前往定制分享?",function(result){
                        if(result==true){
                            window.location.href="../html/activity.html";
                        }else{
                            new Toast({context:$('body'),message:"分享成功"}).show();
                        }
                    });
                }
                $(".sharemask").css("display","none");
            },
            error:function(){
                $(".sharemask").css("display","none");
                new Toast({context:$('body'),message:"分享失败"}).show();
            }
        })
    })
    //第三步回首页
    $(".Step_3 .right").click(function(){
        window.location.href="../../index.html";
    })
    //二维码清空函数
    $('.Step_2 ').delegate('.optionstwo .content .option .contentthree .qr .empty','click',function(){
        $('.Step_2 ').find('.optionstwo .content .option .contentthree .qr textarea').val("");
        $(".options").delegate(".qrbtn","click",function(){
            new Toast({context:$('body'),message:"请输入二维码内容"}).show();
        })
    })
    //二维码输入不能超过100个字符
    $('.Step_2 ').delegate('.optionstwo .content .option .contentthree .qr textarea','keyup',function(){
        if($(this).val().length>100){
            new Toast({context:$('body'),message:"二维码内容不能超过100个字符"}).show();
            $(this).val($(this).val().slice(0,100));
        }
    })
    //清除输入框里的内容
    $('.content').delegate('.text .textbottom .empty','click',function(){
        $(this).siblings('.diytext ').html('');
        $(this).siblings('.Character_length').children('.left').text(0);
    })
    goods_data(spuid)
    $(".content").delegate('.tag_group_first','click',function(){//平板一级选项点击展开选项
        $(this).css({
            // "background":"#f1f1f1",
            "color":"#c88d6d"
        })
        var name = $(this).attr('class').split(' ')[1];
        if($(this).children(".right").hasClass('active')){
            $(this).children(".right").removeClass('active');
            $('.tag_group.'+name).slideUp()
        }else{
            $(".tag_group_first").children(".right").removeClass('active');
            $(this).children(".right").addClass('active');
            $('.tag_group').stop().slideUp()
            $('.tag_group.'+name).stop().slideDown()
        }
        for(var i =0; i<$(".contentthree_ul").length;i++){
            var width = $(".contentthree_ul").eq(i).width();
            var dlwidth=0;
            for(var j=0;j<$(".contentthree_ul").eq(i).find("dl.inl_block").length;j++){
                dlwidth+=$(".contentthree_ul").eq(i).find("dl.inl_block").eq(j).outerWidth(true);
            }

            if(dlwidth<width){
                $(".contentthree").eq(i).addClass("flex");
            }else{
                $(".contentthree").eq(i).removeClass("flex");
            }
        }
    })
    //第二步按钮
    $(".first_click").delegate('.clickbtn',endEvent,function (e) {//手机端按钮旋转切换
        if($(".clickbtn").hasClass("go")){
            optionshowhide.open();
        }else{
            optionshowhide.close();
        }
    })
    var a = 0;
    var starx =0;
    //第二步一级选项转动
    $(".Step_2 .optionstwo").delegate('.first',startEvent,function (e) {//手机端一级选项旋转
        starx = event.targetTouches[0].pageX;
        preX = event.targetTouches[0].pageX;
        preY = event.targetTouches[0].pageY;
        //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
        preAngle = Math.atan2(preY, preX-100);
        //var a = 0;
        $(".Step_2 .optionstwo").delegate('.first', moveEvent, function (e) {
            var changedg = (180/5)*($('.Step_2 .optionstwo .first dl.block').length-6)
            if($('.Step_2 .optionstwo .first dl.block').length>6) {
                curX = event.targetTouches[0].pageX;
                curY = event.targetTouches[0].pageY;
                //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
                var curAngle = Math.atan2(curY, curX - 100);
                transferAngle = curAngle - preAngle;
                if(a*8>=0){
                    if(a*8<=changedg){
                        a += (transferAngle * 180 / Math.PI);
                        var movedg = a*8;
                        preX = curX;
                        preY = curY;
                        preAngle = curAngle;
                        $('.Step_2 .optionstwo .first').rotate(-movedg);
                        $('.Step_2 .optionstwo .first dl dd').css({'transform': 'rotate(' + movedg + 'deg)'});
                    }else{
                        a=changedg/8;
                    }
                }else{
                    a=0;
                }
            }
        })
    })
    $(".Step_2 .optionstwo .first").delegate("dl","click",function(e){//一级选项选择
        var index = $(this).index();
        optionshowhide.show(index);
        for(var i =0; i<$(".contentthree_ul").length;i++){
            var width = $(".contentthree_ul").eq(i).width();
            var dlwidth=0;
            for(var j=0;j<$(".contentthree_ul").eq(i).find("dl.inl_block").length;j++){
                dlwidth+=$(".contentthree_ul").eq(i).find("dl.inl_block").eq(j).outerWidth(true);
            }

            if(dlwidth<width){
                $(".contentthree").eq(i).addClass("flex");
            }else{
                $(".contentthree").eq(i).removeClass("flex");
            }
        }
    })
})
