document.write('<script src="commonH5/different/'+source_id+'/different.js"></script>');
var uid = Request.QueryString('user_uid') || localStorage.getItem("uid"); //如果是小程序的话应从地址栏获取
var sessionid = Request.QueryString('user_sessionid') || localStorage.getItem("sessionid");
var spuid=Request.QueryString("spuid");
var container = document.getElementById( 'webgl' );
var showing = new SHOWING(container);
var paramlist = new SHOWING.ParamList();
showing.lastParamlist = paramlist
var olddata=decodeURI(Request.QueryString("olddata"));
var collectName,jewelID,series_id,price,linkstyle;
//按钮展示
var optionshowhide = {};
optionshowhide.show = function(index){
    $(".first_click").css("display","none");
    $(".tag_group").eq(index).addClass("active").siblings(".tag_group").removeClass("active");
};
optionshowhide.hide = function(){
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
var clickthreeshow = function(webgl_key,webgl_num,webgl_value,img,webgl_text,obj){
    this.webgl_key = webgl_key;
    this.webgl_num = webgl_num;
    this.img = img;
    this.webgl_text = webgl_text;
    this.webgl_value = webgl_value;
    obj.attr("count",parseInt(obj.attr("count"))+1)
    eval('this.'+this.webgl_key+'()')
}
clickthreeshow.prototype={
    text : function(){
        webgloading();
        paramlist.text = this.webgl_text;//3D渲染
        showing.Reload(paramlist,Onload);
    },
    lefttext : function(){
        webgloading();
        if(this.webgl_text === ''){
            $('.lefttext').attr("webgl_text",this.webgl_text);
            $('.lefttext .diytext').html('');
            text_length();
        }
        paramlist.text2 = this.webgl_text;//3D渲染
        showing.Reload(paramlist,Onload);
    },
    righttext : function(){
        webgloading();
        if(this.webgl_text === ''){
            $('.righttext').attr("webgl_text",this.webgl_text);
            $('.righttext .diytext').html('');
            text_length();
        }
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
    textfont : function(){
        webgloading()
        console.log(this.webgl_value)
        showing.ChangeTextFont(this.webgl_value,Onload);
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
    leftchain : function(){
        webgloading()
        if(this.webgl_num == 4){ //清除文字
            this.webgl_text = ''
            this.lefttext()
        }
        showing.ChangeGroupOption('chain', this.webgl_num, Onload, '2', true);
    },
    rightchain : function(){
        webgloading()
        if(this.webgl_num == 4){ //清除文字
            this.webgl_text = ''
            this.righttext()
            showing.Reload(paramlist,Onload);
        }
        showing.ChangeGroupOption('chain', this.webgl_num, Onload, '1', true);
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
    var itemname = data.data.name
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
    var obj =obj || $(".diytext");
    for (var i=0;i<obj.length;i++){
        var nowlen = $(obj[i]).text().length+$(obj[i]).children("img").length;
        var maxlen=showing.getSymbolMax(jewelID,linkstyle);
        var minlen=showing.getSymbolMin(jewelID,linkstyle);
        var minobj = $(obj[i]).siblings('.Character_length').find('a.left');
        var maxobj = $(obj[i]).siblings('.Character_length').find('a.right');
        var textNotice = $(obj[i]).parent('.textNotice')
        minobj.text(nowlen);
        maxobj.text(maxlen);
        if(minlen>nowlen){
            $(".text .Character_length a").css("color","#e61c64");
            textNotice.text("* 此款式最少"+minlen+"字符").css("color","#c88d6d");
        }else if(maxlen<nowlen){
            $(".text .Character_length a").css("color","#e61c64");
            textNotice.text("* 此款式最多"+maxlen+"字符").css("color","#c88d6d");
        }else{
            $(".text .Character_length a").css("color","#8D7064");
            textNotice.text("").css("color","#fff");
        }
        $(".textdl").each(function(n){
            if($(this).text().length > maxlen)
                $(this).remove()
        })
    }

}
//珐琅限制
function color_limit(font){
    font = font || 8
    var IfHavecolor = showing.IfHaveColor(font);
    if(IfHavecolor){
        $(".tag_group_nav").css("display","flex");
        $(".tag_group_nav .color").css("display","block");
    }else{
        if($(".tag_group_nav .color").siblings().length >0){
            $(".tag_group_nav .color").css("display","none").removeClass("active");
            if($(".tag_group_nav .color").siblings().length<=1){
                $(".tag_group_nav .color").parent(".tag_group_nav").css("display","none");
            }
            if($(".option.color").hasClass("active")){
                $(".tag_group_nav .color").siblings().eq(0).addClass("active");
                $(".option.color").removeClass("active").siblings().eq(1).addClass("active");
            }
        }else{
            $(".option.color").css("display","block");
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
    if(optionshowhide){
        optionshowhide.open()
    }
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
//texteara转换br
function line2br(text){
    return text.split("\n").join("<br/>");
}
function line2n(text){
    return text.split("<br/>").join("\n");
}
function showprice(jewelID,material,font,linkstyle){
    font = font || 8
    var Volume = showing.GetVolume();//体积
    var IfHavecolor = showing.IfHaveColor(font)?1:0;//珐琅
    var IfHaveChain = showing.IfHaveChain(jewelID,linkstyle)?1:0;//有没有链子
    var IfHaveStone = showing.IfHaveStone()?1:0;//皓石
    var Stonenum = showing.getMainStoneNum() || 0;
    $.ajax({
        type: "GET",
        url: 'commonH5/custom.json',
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
            var senddata = sharesortByKeys({
                title:"珠宝分享",
                nickname:decodeURI(invertor),
                jewelry:collectName,
                pics:arr
            })
            $.ajax({
                type: "post",
                url: "http://www.lovecantouch.com/threedshare/3d",
                async: true,
                crossDomain: true,
                data:senddata,
                success: function(data) {
                    Onload()
                    if(data.q){
                        var webpageUrl = "http://www.lovecantouch.com/threedshare/3d?q="+data.q;
                        differentshare(title,description,icon,webpageUrl,index)
                    }else{
                        new Toast({context:$('body'),message:"分享失败"}).show();
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
function sharesortByKeys(myObj) {//数据按照阿斯克码排序
    var str ="";
    var keys = Object.keys(myObj);//拿出key
    keys.sort()//key排序
    var sortedObject = Object()//创建一个新的对象
    for(i in keys) {//按照重新排序的key填入对象
        key = keys[i];
        sortedObject[key] = myObj[key];
        if(typeof(myObj[key]) == "object") {
            str += key + "=" + JSON.stringify(myObj[key]) + "&"
        } else {
            if(myObj[key]||myObj[key]==0){
                str += key + "=" + myObj[key] + "&"
            }
        }
    }
    // console.log(str)
    str = str.substring(0, str.lastIndexOf('&'));
    // var SWtoken = "3e03683b9cfe7d6c81200a29449779ac17cae35de1f8a30b2a630c73c6aae835";
    var SWtoken = "6AB45464E7FAD2EB3F30AC7B4C936627";
    var first_SWtoken = SWtoken.substr(0, 6);
    var last_SWtoken = SWtoken.substr(6, SWtoken.length - 1);
    // sortedObject['signature'] = md5(first_SWtoken + str + last_SWtoken).toUpperCase();//添加签名
    sortedObject['sign'] = md5(str + "&key=" + SWtoken).toUpperCase();//添加签名
    return sortedObject  //return一个新的对象
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
                        new clickthreeshow("picture",null,null,dataimgsrc(imgsrc),null,obj)
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
        if (active.eq(i).attr("webgl_key") === "text" || active.eq(i).attr("webgl_key") === "lefttext" || active.eq(i).attr("webgl_key") === "righttext") {
            file_params[webgl_key_change(active.eq(i).attr("webgl_key"))] = active.eq(i).attr("webgl_text");
        } else if (active.eq(i).attr("webgl_key") === "picture") {
            if (active.eq(i).attr("webgl_num")) {
                file_params[webgl_key_change(active.eq(i).attr("webgl_key"))] = active.eq(i).attr("webgl_num");
            } else {
                file_params[webgl_key_change(active.eq(i).attr("webgl_key"))] = dataimgsrc(active.eq(i).attr("img"));
            }
        } else {
            file_params[webgl_key_change(active.eq(i).attr("webgl_key"))] = active.eq(i).attr("webgl_num");
        }
    }
    file_params=JSON.stringify(file_params);
    return file_params
}
function addbuy(jsonsrc,uid,sessionid,successcall){
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
                    successcall(data.data[0].id);
                }else{
                    successcall();
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
function goback() {
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
            success: function(data) {
                history.go(-1)
            },
            error: function(e) {
                history.go(-1)
            }
        })
    }else{
        history.go(-1)
    }
}
function goods_data(spuid){
    $.ajax({
        type:"get",
        url:goods_details+spuid,
        async:true,
        crossDomain: true,
        data:{},
        beforeSend:function(){
            webgloading()
            $(".Step").removeClass("active");
            $(".Step_2").addClass("active");
        },
        success:function(data) {
            console.log(data)
            series_id = data.data.series;
            jewelID = data.data.jewelid;
            linkstyle = data.data.style.webgl_num;
            if(series_id==10000 || series_id==10034){
                if( jewelID==="neck")//随我猫牌项链隐藏试戴按钮
                    $(".visual_angle_btn").css("display","none")
            }else{
                if( jewelID==="ear"&&linkstyle ==7)//随我猫牌项链隐藏试戴按钮
                    $(".visual_angle_btn").css("display","none")
            }
            //同款
            same_paragraph(data,series_id)
            //数据
            var attributes_values = data.data.attributes_values;
            var default_text = data.data.style.default_text;//缺省文字
            collectName = data.data.name;
            price = data.data.price;
            gold_price = data.data.basic_price.gold_price;
            paramlist.jewelID = jewelID;
            paramlist.linkstyle = linkstyle;
            paramlist.starPlateText = webglimg("../img/customization/textstar.png");
            //数据重构
            var group_name = [];
            var group = [];
            for (var i = 0, l = attributes_values.length; i < l; i++) {
                for(var j = i + 1; j < l; j++)
                    if (attributes_values[i].tag_group === attributes_values[j].tag_group) j = ++i;
                group_name.push(attributes_values[i].tag_group);
            }
            for (var i = 0; i < group_name.length; i++) {
                group.push({'tag_group_name':group_name[i],'tag_group_arr':[]})
                for(var j = 0;j<attributes_values.length;j++){
                    if(group_name[i] === attributes_values[j].tag_group){
                        group[i].tag_group_arr.push(attributes_values[j])
                    }
                }
            }
            console.log(group)
            var str2 = '';
            var str3 = '';
            for (var z = 0; z < group.length; z++) {
                str2 += '<dl class="block '+group[z].tag_group_name+'"><dd>' +group[z].tag_group_name + '</dd></dl>';
                str3 += '<li class="tag_group_first '+group[z].tag_group_name+'">'+group[z].tag_group_name+'<span class="right"><img  src="../img/common/goto.png"></span></li><div class="tag_group '+group[z].tag_group_name+'"><span class="remove"><span>确认</span><img src="../img/customization/gofirst.png"></span>'
                str3 += '<div class="tag_group_title" >'+group[z].tag_group_name+'</div>'
                if(group[z].tag_group_arr.length>1){
                    str3 += '<div class="tag_group_nav">'
                    for(var i =0;i<group[z].tag_group_arr.length;i++){
                        str3 += '<span class="'+group[z].tag_group_arr[i].attributes.webgl_key+'">'+group[z].tag_group_arr[i].attributes.name+'</span>'
                    }
                    str3 += '</div>'
                }
                for(var i =0;i<group[z].tag_group_arr.length;i++){
                    //循环数据 传参 生成html标签
                    var optionhtml = new optionthreeshow(group[z].tag_group_arr[i],data.data.static,series_id,data.data);
                    str3+= eval('optionhtml.'+group[z].tag_group_arr[i].attributes.webgl_key+'()')
                }
                str3 += '</div>'
                // str3 += '<div class="bottom"><span class="left"><img src="../img/customization/xhao.png"></span><p>'+group[z].tag_group_name+'</p><span class="right"></span></div></div>';
            }
            $(".Step_2 .optionstwo .first").html(str2);
            $(".Step_2 .optionstwo .content").html(str3);
            //渲染文字   先渲染一遍的目的是防止继承时出现问题
            var webgl_text = default_text?default_text.split(',')[0]:"Star[39]";
            var webgl_text2 = default_text?default_text.split(',')[1]:"Star[39]";
            $(".text").find(".diytext").attr("webgl_text", webgl_text);
            $(".lefttext").find(".diytext").attr("webgl_text", webgl_text2);
            $(".righttext").find(".diytext").attr("webgl_text", webgl_text);
            for (var i = 0; i < $(".emojidl").length; i++) {
                var item = $(".emojidl").eq(i).find("img").prop("outerHTML");
                var num = $(".emojidl").eq(i).attr("webgl_num");
                allitem = new RegExp("\\[" + num + "\\]", "g");
                webgl_text = webgl_text.replace(allitem, item);
            }
            $(".text").find(".diytext").html(webgl_text);
            $(".lefttext").find(".diytext").html(webgl_text2);
            $(".righttext").find(".diytext").html(webgl_text);
            for (var i = 0; i < $(".tag_group").length; i++) {
                $(".tag_group").eq(i).find(".option").eq(0).addClass("active");
                $(".tag_group").eq(i).find(".tag_group_nav span").eq(0).addClass("active");
            }
            for (var i = 0; i < $(".options .option").length; i++) {
                if( $(".options .option").eq(i).hasClass("stone")||$(".options .option").eq(i).hasClass("mainstone")){
                    var alias_name = $(".option.material").find("dl.active").attr("alias_name").split("/")[0];
                    var stonedl = $(".option.stone .contenttwo dl");
                    var mainstonedl = $(".option.mainstone .contenttwo dl");
                    for(var z = 0; z<stonedl.length;z++){
                        if(stonedl.eq(z).attr("alias_name").split("/")[0]==alias_name){
                            stonedl.eq(z).removeClass("inl_none").addClass("inl_block");
                        }else{
                            stonedl.eq(z).removeClass("inl_block").addClass("inl_none");
                        }
                    }
                    for(var z = 0; z< mainstonedl.length;z++){
                        if( mainstonedl.eq(z).attr("alias_name").split("/")[0]==alias_name){
                            mainstonedl.eq(z).removeClass("inl_none").addClass("inl_block");
                        }else{
                            mainstonedl.eq(z).removeClass("inl_block").addClass("inl_none");
                        }
                    }
                }
                if($(".options .option").eq(i).hasClass("leftchain")){ // 修改左连子默认选项
                    $(".options .option").eq(i).find("dl.inl_block").eq(1).addClass("active");
                }else{
                    $(".options .option").eq(i).find("dl.inl_block").eq(0).addClass("active");
                }
                $(".options .option").eq(i).find(".contenttwonav").children("span").eq(0).addClass("active");
                $(".options .option").eq(i).find(".contenttwo").find(".contentthree").eq(0).addClass("active");
            }
            //继承
            if(olddata){//需要改
                olddata = JSON.parse(olddata);
                for(i in olddata){
                    var key = un_webgl_key_change(i)
                    eval('$(".option.'+key+' dl").removeClass("active")');
                    if(key ==='text' || key ==='righttext' || key ==='lefttext'){
                        var webgl_text = eval('olddata.'+key);
                        $(".option."+key+" .diytext").attr("webgl_text",webgl_text);
                        for (var i =0;i<$(".emojidl").length;i++) {
                            var item = $(".emojidl").eq(i).find("img").prop("outerHTML");
                            var num = $(".emojidl").eq(i).attr("webgl_num");
                            allitem = new RegExp("\\["+num+"\\]","g");
                            webgl_text= webgl_text.replace(allitem,item);
                        }
                        $("."+key).find(".diytext").html(webgl_text);
                    }else if(key ==='picture'){
                        if(eval('olddata.'+key).length<=10){
                            eval('$(".option.'+key+' dl[webgl_num='+eval('olddata.'+key)+']").addClass("active")');
                        }else{//如果是二维码
                            var img = eval('olddata.'+key);
                            $(".option."+key).attr("img",img).attr("is_custom",true).find("dl").removeClass("active");
                        }
                    }else{
                        if( key === 'stone'||key === 'mainstone'){
                            var alias_name = $(".option.material").find("dl.active").attr("alias_name").split("/")[0];
                            var stonedl = $(".option.stone .contenttwo dl");
                            var mainstonedl = $(".option.mainstone .contenttwo dl");
                            for(var z = 0; z<stonedl.length;z++){
                                if(stonedl.eq(z).attr("alias_name").split("/")[0]==alias_name){
                                    stonedl.eq(z).removeClass("inl_none").addClass("inl_block");
                                }else{
                                    stonedl.eq(z).removeClass("inl_block").addClass("inl_none");
                                }
                            }
                            for(var z = 0; z< mainstonedl.length;z++){
                                if( mainstonedl.eq(z).attr("alias_name").split("/")[0]==alias_name){
                                    mainstonedl.eq(z).removeClass("inl_none").addClass("inl_block");
                                }else{
                                    mainstonedl.eq(z).removeClass("inl_block").addClass("inl_none");
                                }
                            }
                        }
                        eval('$(".option.'+key+' dl.inl_block[webgl_num='+eval('olddata[i]')+']").addClass("active")');
                    }
                }
            }
            //属性 和 3D渲染
            for(var i=0;i<$(".option").length;i++){//需要改
                var vid = $(".option").eq(i).find("dl.active").attr("vid")?$(".option").eq(i).find("dl.active").attr("vid"):"";
                var webgl_key = $(".option").eq(i).attr("webgl_key");
                var value_name = $(".option").eq(i).find("dl.active").attr("value_name")?$(".option").eq(i).find("dl.active").attr("value_name"):"";
                $(".option").eq(i).attr("vid",vid).attr("value_name",value_name);
                if(webgl_key=='text'){//文字选项传参为字符串文字
                    var webgl_text = $(".option").eq(i).find(".diytext").attr("webgl_text")?$(".option").eq(i).find(".diytext").attr("webgl_text"):"";
                    $(".option").eq(i).attr("webgl_text",webgl_text);
                    eval('paramlist.'+webgl_key_change(webgl_key)+' = webgl_text'); //文字
                }else if(webgl_key=='lefttext'){//文字选项传参为字符串文字
                    var webgl_text = $(".option").eq(i).find(".diytext").attr("webgl_text")?$(".option").eq(i).find(".diytext").attr("webgl_text"):"";
                    $(".option").eq(i).attr("webgl_text",webgl_text);
                    eval('paramlist.'+webgl_key_change('text2')+' = webgl_text'); //文字
                }else if(webgl_key=='righttext'){//文字选项传参为字符串文字
                    var webgl_text = $(".option").eq(i).find(".diytext").attr("webgl_text")?$(".option").eq(i).find(".diytext").attr("webgl_text"):"";
                    $(".option").eq(i).attr("webgl_text",webgl_text);
                    eval('paramlist.'+webgl_key_change('text')+' = webgl_text'); //文字
                }else if(webgl_key=='picture'||webgl_key=='sign'){//图片选项传参为图片地址
                    var img = $(".option").eq(i).find("dl.active").attr("img")?$(".option").eq(i).find("dl.active").attr("img"):$(".option").eq(i).attr("img");
                    var webgl_num = $(".option").eq(i).find("dl.active").attr("webgl_num")?$(".option").eq(i).find("dl.active").attr("webgl_num"):"";
                    $(".option").eq(i).attr("webgl_num",webgl_num);
                    $(".option").eq(i).attr("img",img);
                    eval('paramlist.'+webgl_key_change(webgl_key)+' = webglimg(img)')//签名 图案
                }else if(webgl_key=='textfont'){
                    var webgl_num = $(".option").eq(i).find("dl.active").attr("webgl_num")?$(".option").eq(i).find("dl.active").attr("webgl_num"):"";
                    var webgl_value = $(".option").eq(i).find("dl.active").attr("webgl_value")?$(".option").eq(i).find("dl.active").attr("webgl_value"):$(".option").eq(i).attr("webgl_value");
                    $(".option").eq(i).attr("webgl_value",webgl_value).attr("webgl_num",webgl_num);
                    eval('paramlist.'+webgl_key_change(webgl_key)+' = webgl_value');
                }else if(webgl_key=='leftchain'){
                    var webgl_num = $(".option").eq(i).find("dl.active").attr("webgl_num")?$(".option").eq(i).find("dl.active").attr("webgl_num"):"";
                    var webgl_value = $(".option").eq(i).find("dl.active").attr("webgl_value")?$(".option").eq(i).find("dl.active").attr("webgl_value"):$(".option").eq(i).attr("webgl_value");
                    $(".option").eq(i).attr("webgl_value",webgl_value).attr("webgl_num",webgl_num);
                    showing.ChangeGroupOption('chain', webgl_num, null, '2', false);
                }else if(webgl_key=='rightchain'){
                    var webgl_num = $(".option").eq(i).find("dl.active").attr("webgl_num")?$(".option").eq(i).find("dl.active").attr("webgl_num"):"";
                    var webgl_value = $(".option").eq(i).find("dl.active").attr("webgl_value")?$(".option").eq(i).find("dl.active").attr("webgl_value"):$(".option").eq(i).attr("webgl_value");
                    $(".option").eq(i).attr("webgl_value",webgl_value).attr("webgl_num",webgl_num);
                    showing.ChangeGroupOption('chain', webgl_num, null, '1', false);
                }else{//其余为webglid
                    var webgl_num = $(".option").eq(i).find("dl.active").attr("webgl_num")?$(".option").eq(i).find("dl.active").attr("webgl_num"):"";
                    $(".option").eq(i).attr("webgl_num",webgl_num);
                    eval('paramlist.'+webgl_key_change(webgl_key)+' =webgl_num');
                }
            }
            showing.Reload(paramlist,Onloadfirst);
        },
        error:function(){
            new Toast({context:$('body'),message:"网络加载失败"}).show();
            Onload()
        }
    });
}
