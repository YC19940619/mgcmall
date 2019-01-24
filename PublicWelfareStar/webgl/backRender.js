var THREERENDER = function(){
    this.showing = new SHOWING(document.getElementById('webgl'));
    this.paramlist = new SHOWING.ParamList();
    this.showing.lastParamlist = this.paramlist
}
THREERENDER.prototype = {
    init: function (data, callback) {
        var that = this;
        this.callback = callback;
        for (i in data) {eval('that.'+i+'(data[i])')}
        setTimeout(function(){
            that.showing.Reload(that.paramlist, function(){
                that.onload(callback)
            });
        },10)
    },
    onload: function(callback){
        var FileData = this.showing.GetFileData();
        var Volume = this.showing.GetVolume();
        callback(FileData,Volume)
    },
    jewelID:function(res){this.paramlist.jewelID= res},
    text: function(res){this.paramlist.text = res},
    lefttext : function(res){this.paramlist.text2 = res},
    righttext : function(res){this.paramlist.text = res},
    material : function(res){},
    font : function(res){this.paramlist.font= res},
    textfont : function(res){},
    stone : function(res){this.paramlist.stone= res},
    mainstone : function(res){this.paramlist.mainstone= res},
    color : function(res){this.paramlist.color= res},
    size : function(res){this.paramlist.size= res},
    ringstyle : function(res){this.paramlist.ringstyle= res},
    sign : function(){},
    picture : function(){},
    linkstyle : function(res){this.paramlist.linkstyle= res},
    chaincolor : function(res){this.paramlist.chaincolor= res},
    bodycolor : function(res){this.paramlist.bodycolor= res},
    chainstyle : function(res){this.paramlist.chainstyle= res},
    leftchain : function(res){this.showing.ChangeGroupOption('chain', res, null, '2', false)},
    rightchain : function(res){this.showing.ChangeGroupOption('chain', res, null, '1', false)},
    embedtype : function(res){this.paramlist.embedtype= res},
    textinterval : function(res){this.paramlist.textinterval= res},
    beiban : function (res){this.paramlist.compGroupOptions['beiban']= res}
}

function getDataVolume(data, callback){
    var threeRender = new THREERENDER();
    threeRender.init(data, callback)
}
