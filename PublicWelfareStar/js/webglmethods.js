var uid = localStorage.getItem("uid");
var sessionid = localStorage.getItem("sessionid");
var spuid=Request.QueryString("spuid");
var container = document.getElementById( 'webgl' );
var showing = new SHOWING(container);
var paramlist = new SHOWING.ParamList();
var olddata=decodeURI(Request.QueryString("olddata"));
var collectName,jewelID,series_id,price,linkstyle;
//按钮展示
var optionshowhide = {};
optionshowhide.show = function(index){
    $("header .right.gonext").css("display","none");
    $(".first_click").css("display","none");
    $(".tag_group").eq(index).addClass("active").siblings(".tag_group").removeClass("active");
};
optionshowhide.hide = function(){
    $("header .right.gonext").css("display","block");
    $(".tag_group").removeClass("active");
    $(".first_click").css("display","block");
};
optionshowhide.open = function(){
    $(".clickbtn").removeClass("go").addClass("active");
    if($(".first .block").length<=6){
        var deg = 180/($(".first .block").length-1);
    }else{
        var deg = 180/5;
    }
    for(var i = 0;i<$(".first .block").length;i++){
        var rotate1 = (deg*i)-180;
        var rotate2 = 180-(deg*i);
        $(".first .block").eq(i).css({'transform':'rotate('+rotate1+'deg) translate(2rem) rotate('+rotate2+'deg)','transition-delay':0.00*i+'s'})
    }
}
optionshowhide.close = function(){
    $(".clickbtn").addClass("go").removeClass("active");
    $(".first .block").css({'transform':'rotate(0deg) translate(0rem) rotate(0deg)','transition-delay':0.00*0+'s'})
}
//3D渲染
var webgl_key_change = function(webgl_key){
    if(webgl_key === "beiban"){
        return "compGroupOptions['beiban']"
    }else{
        return webgl_key
    }
}
var un_webgl_key_change = function(webgl_key){
    if(webgl_key === "compGroupOptions['beiban']"){
        return "beiban"
    }else{
        return webgl_key
    }
}
var clickthreeshow = function(webgl_key,webgl_num,img,webgl_text,obj){
    this.webgl_key = webgl_key;
    this.webgl_num = webgl_num;
    this.img = img;
    this.webgl_text = webgl_text;
    obj.attr("count",parseInt(obj.attr("count"))+1)
    eval('this.'+this.webgl_key+'()')
}
clickthreeshow.prototype={
    text : function(){
        webgloading();
        paramlist.text = this.webgl_text;//3D渲染
        showing.Reload(paramlist,Onload);

    },
    material : function(){
        var alias_name = $(".option.material").find("dl.active").attr("alias_name").split("/")[0];
        var stonedl = $(".option.stone .contenttwo dl");
        $(".option.stone .contenttwo dl").removeClass("active");
        var mainstonedl = $(".option.mainstone .contenttwo dl");
        $(".option.mainstone .contenttwo dl").removeClass("active");
        for(var z = 0; z<stonedl.length;z++){
            if(stonedl.eq(z).attr("alias_name").split("/")[0]==alias_name){
                stonedl.eq(z).removeClass("inl_none").addClass("inl_block");
            }else{
                stonedl.eq(z).removeClass("inl_block").addClass("inl_none");
            }
            if(stonedl.eq(z).attr("webgl_num")==$(".option.stone").attr("webgl_num")&&stonedl.eq(z).hasClass("inl_block")){
                stonedl.eq(z).addClass("active")
                $(".Step_2 .optionstwo .content .option.stone").attr("vid",stonedl.eq(z).attr("vid"));
            }
        }
        for(var z = 0; z< mainstonedl.length;z++){
            if( mainstonedl.eq(z).attr("alias_name").split("/")[0]==alias_name){
                mainstonedl.eq(z).removeClass("inl_none").addClass("inl_block");
            }else{
                mainstonedl.eq(z).removeClass("inl_block").addClass("inl_none");
            }
            if(mainstonedl.eq(z).attr("webgl_num")==$(".option.mainstone").attr("webgl_num")&&mainstonedl.eq(z).hasClass("inl_block")){
                mainstonedl.eq(z).addClass("active");
                $(".Step_2 .optionstwo .content .option.mainstone").attr("vid",mainstonedl.eq(z).attr("vid"));
            }
        }
        Onload();
    },
    font : function(){
        webgloading()
        paramlist.font= this.webgl_num;
        color_limit(this.webgl_num)
        showing.Reload(paramlist,Onload);
    },
    stone : function(){
        webgloading()
        showing.ChangeStone(this.webgl_num,Onload);
    },
    mainstone : function(){
        webgloading()
        showing.ChangeMainStone(this.webgl_num,Onload);
    },
    color : function(){
        webgloading()
        showing.ChangeColor(this.webgl_num,Onload);
    },
    size : function(){
        webgloading()
        paramlist.size = this.webgl_num;
        showing.Reload(paramlist,Onload);
    },
    ringstyle : function(){
        webgloading()
        paramlist.ringstyle = this.webgl_num;
        showing.Reload(paramlist,Onload);
    },
    sign : function(){
        showing.ChangeSign(webglimg(this.img),Onload);
    },
    picture : function(){
        showing.ChangePicture(webglimg(this.img),Onload);
    },
    linkstyle : function(){
        webgloading()
        paramlist.linkstyle =this.webgl_num;
        showing.Reload(paramlist,Onload);
    },
    chaincolor : function(){
        webgloading()
        showing.ChangeChainColor(this.webgl_num,Onload);
    },
    bodycolor : function(){
        webgloading()
        showing.ChangeBodyColor(this.webgl_num,Onload);
    },
    chainstyle : function(){
        webgloading()
        showing.ChangeChainStyle(this.webgl_num,Onload);
    },
    embedtype : function (){
        webgloading()
        paramlist.embedtype= this.webgl_num;
        showing.Reload(paramlist,Onload);
    },
    textinterval : function (){
        webgloading()
        paramlist.textinterval=this.webgl_num;
        showing.Reload(paramlist,Onload);
    },
    beiban : function (){
        webgloading()
        showing.ChangeGroupOption('beiban',this.webgl_num, Onload)
    }
}
//同款推荐
function same_paragraph(data,series_id){
    //同款
    var itemimg = data.data.img;
    var itemname = data.data.style.name
    $.ajax({
        type:"post",
        url:series,
        async:true,
        crossDomain: true,
        data:{series_id:series_id},
        beforeSend:function(){},
        success:function(data){
            var data =data.data;
            if(data.length>1){
                var str = '<h2><span></span>一键换款</h2><ul class="same_paragraph_list"><dl spuid="'+spuid+'"><dt><img src="'
                    +dataimgsrc(itemimg)+
                    '"></dt><dd>'+itemname+'</dd></dl>'
                var index = 0;
                $(data).each(function(n){
                    if(spuid!=this.id){
                        if(index<4){
                            str += '<dl spuid="'+this.id+'"><dt><img  src="'+dataimgsrc(this.img)+'"></dt><dd>'+this.style__name+'</dd></dl>'
                        }
                        index++
                    }
                })
                str += '</ul>'
            }
            $(".same_paragraph_box").html(str)
        },
        error:function(){
            new Toast({context:$('body'),message:"网络加载失败"}).show();
        }
    });
}
//字符限制
function text_length(){
    var nowlen = $(".text .diytext").text().length+$(".text .diytext").children("img").length;
    var maxlen=showing.getSymbolMax(jewelID,linkstyle);
    var minlen=showing.getSymbolMin(jewelID,linkstyle);
    $(".text .Character_length a.left").text(nowlen);
    $(".text .Character_length a.right").text(maxlen);
    if(minlen>nowlen){
        $(".text .Character_length a").css("color","#e61c64");
        $(".text .textNotice").text("* 此款式最少"+minlen+"字符").css("color","#c88d6d");
    }else if(maxlen<nowlen){
        $(".text .Character_length a").css("color","#e61c64");
        $(".text .textNotice").text("* 此款式最多"+maxlen+"字符").css("color","#c88d6d");
    }else{
        $(".text .Character_length a").css("color","#8D7064");
        $(".text .textNotice").text("").css("color","#fff");
    }
    $(".textdl").each(function(n){
        if($(this).text().length > maxlen)
            $(this).remove()
    })
}
//珐琅限制
function color_limit(font){
    font = font || 8
    var IfHavecolor = showing.IfHaveColor(font);
    if(IfHavecolor){
        $(".tag_group_nav").css("display","flex");
        $(".tag_group_nav .color").css("display","block");
    }else{
        $(".tag_group_nav .color").css("display","none").removeClass("active");
        if($(".tag_group_nav .color").siblings().length<=1){
            $(".tag_group_nav .color").parent(".tag_group_nav").css("display","none");
        }
        if($(".option.color").hasClass("active")){
            $(".tag_group_nav .color").siblings().eq(0).addClass("active");
            $(".option.color").removeClass("active").siblings().eq(1).addClass("active");
        }
    }
}
//加载中
function webgloading(){
    $("#loading").remove();
    $("body").append("<div id='loading'><div class='loadingcenter'><img src = '../img/topload.gif'></div></div>");
}
//3D加载完成
function Onloadfirst(){
    // var test = showing.GetFileData()
    // var blob = new Blob([test], {'type': 'text/plain'});
    // var url = URL.createObjectURL(blob);
    // var a = document.createElement("a");
    // document.body.appendChild(a);
    // a.style = "display: none";
    // a.href = url;
    // a.download = "杨晨";
    // document.body.removeChild(a);
    // a.click()
    material = $(".option.material").attr("webgl_num");
    font = $(".option.font").attr("webgl_num");
    showprice(jewelID,material,font,linkstyle);
    $("#loading").remove();
    //字符限制
    text_length()
    //珐琅限制
    color_limit(font)
    //材质隐藏
    //$(".first .选择材质").removeClass("block").addClass("none");
    optionshowhide.open()
}
function Onload(){
    material = $(".option.material").attr("webgl_num");
    font = $(".option.font").attr("webgl_num");
    showprice(jewelID,material,font,linkstyle);
    $("#loading").remove();
}
//生成图片
function webglimg(webglimgsrc){
    var image= new Image();
    image.crossOrigin='';
    image.src=webglimgsrc;
    return image
}
function showprice(jewelID,material,font,linkstyle){
    font = font || 8
    var Volume = showing.GetVolume();//体积
    var IfHavecolor = showing.IfHaveColor(font)?1:0;//珐琅
    var IfHaveChain = showing.IfHaveChain(jewelID,linkstyle)?1:0;//有没有链子
    var IfHaveStone = showing.IfHaveStone()?1:0;//皓石
    var Stonenum = showing.getMainStoneNum();
    $.ajax({
        type: "GET",
        url: '../js/custom.json',
        async: true,
        dataType: "json",
        success: function(data) {
            if(typeof (data) === 'string'){data = JSON.parse(data)}
            var weight = data[material].density*Volume/1000+data[material].chain[jewelID]*IfHaveChain;//重量
            var electroplate_price =  data[material].electroplate;
            var enamel_price = data[material].enamel*IfHavecolor;
            var fee_price = data[material].fee[jewelID];
            var lossratio = data[material].lossratio;
            var stone_price = data[material].stone*Stonenum;
            var unit_price;
            if(material == 1)
                unit_price = gold_price*0.75;
            else
                unit_price = data[material].unitprice;
            var lastprice=parseInt((weight*lossratio*unit_price+electroplate_price+enamel_price+fee_price+stone_price)*3.5);
            if(lastprice < price)
                $(".price").html("当前价格：￥"+ parseInt(price).toFixed(2));
            else
                $(".price").html("当前价格：￥"+ parseInt(lastprice).toFixed(2));
            // console.log("重量："+weight);
            // console.log("电镀："+electroplate_price);
            // console.log("珐琅："+enamel_price);
            // console.log("工费："+fee_price);
            // console.log("损耗比："+lossratio);
            // console.log("镶石价："+stone_price);
            // console.log("单价："+unit_price);
            // console.log("总价："+lastprice);
            // console.log("最低价"+price);
        },
        error:function(){
            $(".price").html("");
        }
    })
}
//锁定编辑器中鼠标光标位置。。
function insertHTML(html){
    var dthis=$(".diytext");
    var sel, range;
    if (window.getSelection){
        $(dthis).focus();
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            // var len = dthis.text().length+dthis.find("img").length;
            // range.setStart(range.startContainer,2);
            range.deleteContents();
            var el = document.createElement('p');
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) )
            {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }else if(document.selection && document.selection.type !='Control') {
        $(dthis).focus(); //在非标准浏览器中 要先让你需要插入html的p 获得焦点
        ierange= document.selection.createRange();//获取光标位置
        ierange.pasteHTML(html);    //在光标位置插入html 如果只是插入text 则就是fus.text="..."
        $(dthis).focus();
    }
}

//生成二维码图像
function f_onCreateQrcode(QRcode) {
    senddata={
        qrcode_text :line2br(QRcode)
    }
    $.ajax({
        type: "post",
        url: QRCodeUrlGenerate,
        async: true,
        crossDomain: true,
        data: sortByKeys(senddata),
        success: function(data) {
            $(".Step_2 .qrcodeimg").erweima({//生成二维吗
                //label: '随我',//二维码文字内容
                //mode: 4,
                //mSize:20,
                //image:webglimg(localStorage.getItem('head_image')),
                text:domainLm+data.data.qrcode_url//二维码内容
            });
            new Toast({context:$('body'),message:"二维码生成成功"}).show();
            setTimeout(function(){
                var imgsrc = $(".Step_2 .qrcodeimg img").attr("src");
                $.ajax({
                    type: "post",
                    url: uploadpictures,
                    async: true,
                    crossDomain: true,
                    data:{
                        pictures_content:imgsrc
                    },
                    success: function(data) {
                        imgsrc = data.data.pictures_urls[0];
                        var obj = $(".Step_2 .content .picture");
                        obj.attr("img",imgsrc).attr("webgl_num","").attr("value_name","").attr("is_custom",true);
                        new clickthreeshow("picture",null,dataimgsrc(imgsrc),null,obj)
                    },
                    error:function(){
                        new Toast({context:$('body'),message:"网络故障"}).show();
                    }
                })
            },100)
        },
        error:function(){
            new Toast({context:$('body'),message:"网络故障"}).show();
        }
    })
}
var params = {};
params.data_params = function(){
    var active = $(".Step_2 .option");
    var attributes_values = [];
    for(var i=0;i<active.length;i++){
        var obj={}
        var attribute_name = active.eq(i).attr("attribute_name") ?active.eq(i).attr("attribute_name"):"";
        var value_name = active.eq(i).attr("value_name") ?active.eq(i).attr("value_name"):"";
        var count = active.eq(i).attr("count") ?active.eq(i).attr("count"):"";
        var attribute = active.eq(i).attr("attribute") ?active.eq(i).attr("attribute"):"";
        var is_custom = active.eq(i).attr("is_custom")?active.eq(i).attr("is_custom"):"";
        var text = active.eq(i).attr("webgl_text")?active.eq(i).attr("webgl_text"):"";
        var img = active.eq(i).attr("img")?active.eq(i).attr("img"):"";
        var value = active.eq(i).attr("vid")?active.eq(i).attr("vid"):"";
        obj['attribute_name']=attribute_name;
        obj['value_name']=value_name;
        //obj['count']=count;
        obj['attribute']=attribute;
        obj['is_custom']=is_custom;
        obj['text']=text;
        obj['img']=img;
        obj['value']=value;
        obj = JSON.stringify(obj);
        attributes_values.push(obj);
    }
    console.log(attributes_values)
    attributes_values = "["+attributes_values.toString()+"]";
    return attributes_values
}
params.file_params = function(){
    var file_params = {//文件数据
        jewelID : jewelID,
        linkstyle:linkstyle
    }
    var active = $(".Step_2 .option");
    for(var i=0;i<active.length;i++) {
        if (active.eq(i).attr("webgl_key") === "text") {
            file_params[webgl_key_change(active.eq(i).attr("webgl_key"))] = active.eq(i).attr("webgl_text");
        } else if (active.eq(i).attr("webgl_key") === "picture") {
            if (active.eq(i).attr("webgl_num")) {
                file_params[webgl_key_change(active.eq(i).attr("webgl_key"))] = active.eq(i).attr("webgl_num");
            } else {
                file_params[webgl_key_change(active.eq(i).attr("webgl_key"))] = dataimgsrc(active.eq(i).attr("img"));
            }
        } else {
            //if (active.eq(i).attr("webgl_key") != "beiban")
                file_params[webgl_key_change(active.eq(i).attr("webgl_key"))] = active.eq(i).attr("webgl_num");
        }
    }
    console.log(file_params)
    file_params=JSON.stringify(file_params);
    console.log(file_params)
    return file_params
}
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
                new Toast({context:$('body'),message:'购买失败'}).show();
                Onload()
            }
        },
        error:function(){
            Onload()
            new Toast({context:$('body'),message:"网络故障"}).show();
        }
    });
}
//定制日志
function custom_items(){
    var active = $(".Step_2 .option");
    var items = [];
    for(var i=0;i<active.length;i++){
        var obj={}
        var attribute_name = active.eq(i).attr("attribute_name") ?active.eq(i).attr("attribute_name"):"";
        var count = active.eq(i).attr("count") ?active.eq(i).attr("count"):"";
        obj['attribute_name']=attribute_name;
        obj['count']=count;
        obj = JSON.stringify(obj);
        items.push(obj);
    }
    items = "["+items.toString()+"]";
    return items
}
//分享图像
function shareimg(index,share_pictures,collectName,uid,sessionid) {
    webgloading()
    var title = "我的饰品 请欣赏";
    var description = "随我个性珠宝";
    var icon = domainLm+"img/icon.png";
    var invertor =encodeURI(localStorage.getItem('nickname') || "梦工场");
    var arr = '';
    for(var i = 0;i<3;i++){//获取截图
        //截图
        convertToData($(".Step_3 .webglimg2 img").eq(i).attr("src"),function(basechar) {
            // 回调后的函数处理
            arr+=basechar+"@";
        });
    }
    setTimeout(function(){
        arr = arr.substr(0,arr.length-1)
        if(index === 2){//定制精选
            show_login(function (uid,sessionid){
                $.ajax({
                    type: "post",
                    url: uploadpictures,
                    async: true,
                    crossDomain: true,
                    data:{
                        pictures_content:arr
                    },
                    success: function(data) {
                        var pictures_urls = data.data.pictures_urls.join(",");
                        $(".sharemask").attr("pictures_urls",pictures_urls).css("display","block");
                        Onload()
                    },
                    error:function(){
                        new Toast({context:$('body'),message:"网络故障"}).show();
                        Onload()
                    }
                })
            },null,"../")
        }else{
            $.ajax({
                type: "post",
                url: SharePicturesGenerate,
                async: true,
                crossDomain: true,
                data:{
                    pictures_content:arr
                },
                success: function(data) {
                    Onload()
                    var pictures_urls = data.data.pictures_urls.join(",");
                    var webpageUrl = domainLm+"shareWebgl.html?imgsrc="+encodeURI(pictures_urls)+"&invertor="+invertor+"&collectName="+encodeURI(collectName);
                    if(index===0){
                        wechatsharelinkSESSION(title,description,icon,webpageUrl);
                    }else if(index===1){
                        wechatsharelinkTIMELINE(title,description,icon,webpageUrl);
                    }else if(index===3){
                        shareQQ(title,description,icon,webpageUrl);
                    }else if(index===4){
                        shareQQZone(title,description,icon,webpageUrl);
                    }
                },
                error:function(){
                    new Toast({context:$('body'),message:"网络故障"}).show();
                    Onload()
                }
            })
        }
        Onload()
    },1000)
}
//截图
function convertToData(url,callback) {
    var $image = $(".Step_3 .webglimg2 img");
    var cropw = $image.eq(0).width()*4; // 剪切的宽
    var croph = $image.eq(0).height()*4; // 剪切的宽
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    var poleft,potop;
    if(croph>=cropw){
        poleft =0 //canvasdata.left - cropdata.left; // canvas定位图片的左边位置
        potop =-(croph-cropw)/2 //canvasdata.top - cropdata.top; // canvas定位图片的上边位置
        canvas.width = cropw;
        canvas.height = cropw;
    }else{
        potop =0 //canvasdata.left - cropdata.left; // canvas定位图片的左边位置
        poleft =-(cropw-croph)/2 //canvasdata.top - cropdata.top; // canvas定位图片的上边位置
        canvas.width = croph;
        canvas.height = croph;
    }
    var img = new Image();
    img.src = url;
    img.onload = function() {
        // 这里主要是懂得canvas与图片的裁剪之间的关系位置
        ctx.drawImage(this,poleft,potop,cropw,croph);
        var base64 = canvas.toDataURL('image/png', 1);  // 这里的“1”是指的是处理图片的清晰度（0-1）之间，当然越小图片越模糊，处理后的图片大小也就越小
        callback && callback(base64)      // 回调base64字符串
    }
}
function unique5(array){
    var r = [];
    for(var i = 0, l = array.length; i < l; i++) {
        for(var j = i + 1; j < l; j++)
            if (array[i] === array[j]) j = ++i;
        r.push(array[i]);
    }
    return r;
}
