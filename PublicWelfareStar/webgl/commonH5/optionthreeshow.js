var optionthreeshow = function(attributes_values,statics,series_id,data){
    this.data = data;
    this.series_id = series_id;
    this.statics = statics;
    this.attributes_values = attributes_values;
    this.webgl_key = attributes_values.attributes.webgl_key;
    this.attribute = attributes_values.attributes.id;
    this.is_custom = attributes_values.attributes.is_custom;
    this.name = attributes_values.attributes.name;
    this.str = '<div count="0" attribute_name="'+this.name+'" attribute="' + this.attribute + '" is_custom="' + this.is_custom + '" class="option ' + this.webgl_key + '" webgl_key="' + this.webgl_key + '"><div class="contenttwo"><div class="contentthree"><span class="three_btn active three_btn_left"></span><ul class="contentthree_ul">'
    for (var j = 0; j < this.attributes_values.values.length; j++) {
        this.str += '<dl value_name="'+this.attributes_values.values[j].name+'" class="inl_block" alias_name="' + this.attributes_values.values[j].alias_name + '" vid="' + this.attributes_values.values[j].id + '" webgl_num="' + this.attributes_values.values[j].webgl_num + '">'
        if (attributes_values.values[j].img === '') {
            this.str += '<dd>'+this.attributes_values.values[j].name+'</dd>'
        } else {
            this.str += '<dt><img src="' + dataimgsrc(this.attributes_values.values[j].img) + '"></dt><dd>' + this.attributes_values.values[j].name + '</dd>'
        }
        this.str +='<span class="sign"></span></dl>'
    }
    this.str += '</ul><span class="three_btn three_btn_right"></span></div></div></div>';
};
optionthreeshow.prototype = {
    text:function(textStr){
        textStr = textStr || 'text';
        var Recommended_text_arr = this.data.style.recommend_text.split(",");//推荐文字
        var Emoji = [[], []];//表情
        if(this.data.name.indexOf('满集') < 0){//满级系列不支持表情符号
            for (var k = 0; k < this.statics.subattributes.length; k++) {
                for (var j = 0; j < this.statics.subattributes[k].values.length; j++) {
                    Emoji[k].push(this.statics.subattributes[k].values[j])
                }
            }
        }
        var textstr1 = "";
        var textstr2 = "";
        var textstr3 = "";
        $(Recommended_text_arr).each(function () {
            that = this.replace(" ","")//去掉推荐文字空格
            textstr1 += '<dl class="textdl inl_block"><dd>' + that + '</dd></dl>';
        })
        for (var j = 0; j < Emoji[1].length; j++) {
            textstr2 += '<dl class="emojidl inl_block" webgl_num="' + Emoji[1][j].webgl_num + '"><dt><img src="'
                + dataimgsrc(Emoji[1][j].img) +
                '"></dt></dl>'
        }
        for (var j = 0; j < Emoji[0].length; j++) {
            textstr3 += '<dl class="emojidl inl_block" webgl_num="' + Emoji[0][j].webgl_num + '"><dt><img src="'
                + dataimgsrc(Emoji[0][j].img) +
                '"></dt><dd>'+Emoji[0][j].name+'</dd></dl>'
        }
        var str ='<div count="0" class="'+textStr+' text option" attribute_name="'
            +this.name+'"  attribute="' + this.attribute
            + '"is_custom=true webgl_key="'+textStr+'"><div class="contenttwonav"><span class="active">推荐文字</span>'
            if(Emoji[0].length>0)
                str +='<span>符号</span>'
            if(Emoji[1].length>0)
            str +='<span>星座</span>'
            str +='</div><div class="contenttwo">'
            +'<div class="contentthree active"><span class="three_btn active three_btn_left"></span><ul class="contentthree_ul">'
            +textstr1
            +'</ul><span class="three_btn three_btn_right"></span></div><div class="contentthree"><span class="three_btn active three_btn_left"></span><ul class="contentthree_ul">'
            +textstr2
            +'</ul><span class="three_btn three_btn_right"></span></div><div class="contentthree "><span class="three_btn active three_btn_left"></span><ul class="contentthree_ul">'
            +textstr3
            +'</ul><span class="three_btn three_btn_right"></span></div></div><div class="textbottom"><div contenteditable="true" '
        if(this.series_id === 10002){str +='style="text-transform:uppercase;" '}
        str+='class="diytext"></div><span class="Character_length"><a class="left">0</a>/<a class="right">30</a></span><span class="empty"><img src="../img/common/empty.png"></span><span class="sure '+textStr+'btn">确认</span></div> <p class="textNotice">*</p></div>'
        return str
    },
    lefttext: function(){
        return this.text('lefttext')
    },
    righttext: function(){
        return this.text('righttext')
    },
    font:function(){
        var str= '<div count="0" attribute_name="'+this.name+'"   attribute="' + this.attribute + '" is_custom="' + this.is_custom + '" class="option ' + this.webgl_key + '" webgl_key="' + this.webgl_key + '"><div class="contenttwo"><div class="contentthree"><span class="three_btn active three_btn_left"></span><ul class="contentthree_ul">'
        for (var j = 0; j < this.attributes_values.values.length; j++) {
            str += '<dl value_name="'+this.attributes_values.values[j].name+'" class="inl_block" vid="' + this.attributes_values.values[j].id + '" webgl_num="' + this.attributes_values.values[j].webgl_num + '">'
                +'<dt><img src="' + dataimgsrc(this.attributes_values.values[j].img) + '"></dt><span class="sign"></span></dl>'
        }
        str += '</ul><span class="three_btn three_btn_right"></span></div></div></div>';
        return str
    },
    textfont:function(){
        var newStyle = document.createElement('style');
        var str= '<div count="0" attribute_name="'+this.name+'"   attribute="' + this.attribute + '" is_custom="' + this.is_custom + '" class="option ' + this.webgl_key + '" webgl_key="' + this.webgl_key + '"><div class="contenttwo"><div class="contentthree"><span class="three_btn active three_btn_left"></span><ul class="contentthree_ul">'
        for (var j = 0; j < this.attributes_values.values.length; j++) {
            var yourFontName = this.attributes_values.values[j].name;
            var yourFontURL = 'commonH5/textfonts/'+yourFontName+'/'+yourFontName+'.woff';
            str += '<dl value_name="'+this.attributes_values.values[j].name+'" class="inl_block" webgl_value="Bold 50px '+yourFontName+'" vid="' + this.attributes_values.values[j].id + '" webgl_num="' + this.attributes_values.values[j].webgl_num + '">'
                +'<dd style="font-family:'+yourFontName+';">'+yourFontName+'</dd><span class="sign"></span></dl>';
            newStyle.appendChild(document.createTextNode("\
                @font-face {\
                    font-family: '" + yourFontName + "';\
                    src: url('" + yourFontURL + "');\
                    }\
                "));
            document.head.appendChild(newStyle);
        }
        str += '</ul><span class="three_btn three_btn_right"></span></div></div></div>';
        return str
    },
    sign : function(){
        var str = '<div count="0" attribute_name="'+this.name+'" attribute="' + this.attribute + '" is_custom="' + this.is_custom + '" class="option ' + this.webgl_key + '" webgl_key="' + this.webgl_key + '"><div class="contenttwo"><div class="contentthree"><span class="three_btn active three_btn_left"></span><ul class="contentthree_ul">'
        for (var j = 0; j < this.attributes_values.values.length; j++) {
            str += '<dl value_name="'+this.attributes_values.values[j].name+'" class="inl_block" img="'+ dataimgsrc(this.attributes_values.values[j].img)+'" vid="' + this.attributes_values.values[j].id + '" webgl_num="' + this.attributes_values.values[j].webgl_num + '">'
                + '<dt><img src="' + dataimgsrc(this.attributes_values.values[j].img) + '"></dt><dd>'+this.attributes_values.values[j].name+'</dd><span class="sign"></span></dl>'
        }
        str += '</ul><span class="three_btn three_btn_right"></span></div></div></div>';
        return str
    },
    picture:function(){
        var str= '<div count="0" attribute_name="'+this.name+'" attribute="' + this.attribute + '" is_custom="' + this.is_custom + '" class="option ' + this.webgl_key + '" webgl_key="' + this.webgl_key + '">'
        str += '<div class="contenttwonav">'
        for (var j = 0; j < this.attributes_values.attributes.subattributes.length; j++) {
            str += '<span>' + this.attributes_values.attributes.subattributes[j].name + '</span>'
        }
        str += '</div><div class="contenttwo">'
        for (var j = 0; j < this.attributes_values.attributes.subattributes.length; j++) {
            str += '<div class="contentthree"><span class="three_btn active three_btn_left"></span><ul class="contentthree_ul">'
            var id = this.attributes_values.attributes.subattributes[j].id;
            if (this.attributes_values.attributes.subattributes[j].name === "二维码") {
                str += '<div class="qr"><textarea></textarea><span class="empty"><img src="../img/common/empty.png"></span><div class="qrcodeimg"></div><span class="qrbtn">生成二维码</span></div>'
            } else {
                for (var k = 0; k < this.attributes_values.values.length; k++) {
                    if (id === this.attributes_values.values[k].attribute) {
                        str += '<dl value_name="'+this.attributes_values.values[k].name+'" class="inl_block" img="' + dataimgsrc(this.attributes_values.values[k].img) + '" vid="' + this.attributes_values.values[k].id + '" webgl_num="' + this.attributes_values.values[k].webgl_num + '">'
                            + '<dt><img src="'+ dataimgsrc(this.attributes_values.values[k].img) +'"></dt><dd>' + this.attributes_values.values[k].name + '</dd><span class="sign"></span></dl>'
                    }
                }
            }
            str += '</ul><span class="three_btn three_btn_right"></span></div>'
        }
        str += '</div></div>';
        return str
    },
    textinterval : function (){
        return this.str
    },
    material:function(){
        return this.str
    },
    stone : function(){
        return this.str
    },
    mainstone : function(){
        return this.str
    },
    color : function(){
        return this.str
    },
    size : function(){
        return this.str
    },
    ringstyle : function(){
        return this.str
    },
    linkstyle : function(){
        return this.str
    },
    chaincolor : function(){
        return this.str
    },
    bodycolor : function(){
        return this.str
    },
    chainstyle : function(){
        return this.str
    },
    embedtype : function (){
        return this.str
    },
    beiban : function (){
        return this.str
    },
    leftchain : function(){
        return this.str
    },
    rightchain : function(){
        return this.str
    }
}
