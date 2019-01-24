/**
 * Created by tanglong on 2017/7/27.
 */
document.write("<script src='build/three.js'></script>");
document.write("<script src='js/loaders/BinaryLoader.js'></script>");
//document.write("<script src='js/loaders/STLLoader.js'></script>");
document.write("<script src='js/loaders/OBJLoader.js'></script>");
//document.write("<script src='js/loaders/OBJLoader2.js'></script>");

document.write("<script src='js/Detector.js'></script>");
document.write("<script src='js/libs/stats.min.js'></script>");
document.write("<script src='js/controls/OrbitControls.js'></script>");
document.write("<script src='js/loaders/RGBELoader.js'></script>");
document.write("<script src='js/loaders/HDRCubeTextureLoader.js'></script>");
document.write("<script src='js/pmrem/PMREMGenerator.js'></script>");
document.write("<script src='js/pmrem/PMREMCubeUVPacker.js'></script>");
document.write("<script src='js/libs/dat.gui.min.js'></script>");
document.write("<script src='js/postprocessing/EffectComposer.js'></script>");
document.write("<script src='js/postprocessing/RenderPass.js'></script>");
document.write("<script src='js/postprocessing/MaskPass.js'></script>");
document.write("<script src='js/postprocessing/ShaderPass.js'></script>");
document.write("<script src='js/shaders/CopyShader.js'></script>");
document.write("<script src='js/shaders/FXAAShader.js'></script>");
document.write("<script src='js/postprocessing/BloomPass.js'></script>");
document.write("<script src='js/shaders/ConvolutionShader.js'></script>");
document.write("<script src='js/exporters/OBJExporterNew.js'></script>");
document.write("<script src='js/exporters/STLExporterNew.js'></script>");

document.write("<script src='js/modifiers/DentModifier.js'></script>");
document.write("<script src='js/modifiers/CircleModifier.js'></script>");
document.write("<script src='js/libs/csv.js'></script>");
document.write("<script src='js/utils/MeshVolume.js'></script>");

document.write("<script src='js/jszip/jszip.js'></script>");
document.write("<script src='cnfont.js'></script>");

g_showing = null;
LoadTaskItem = function (filepath, type, id) {
    this.filepath = filepath;
    this.taskType =  type;
    this.taskIdList = new Array();
    this.taskIdList.push('' + id);
    this.taskflag = false;
}

MeshDataItem = function(type, mesh) {
    this.meshType = type;
    this.mesh = mesh;
}

SHOWING = function(mainCont, noRender)
{
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    this.dispose();

    if (null != g_showing)
        g_showing.dispose();
    g_showing = this;

    this.loadingmanager = new THREE.LoadingManager();
    this.loadingmanager.onProgress = function ( item, loaded, total ) {
        //console.log( item, loaded, total );
    };

    this.loadFontConfig();
    this.loadPartConfig();
    this.loadLinkConfig();
    this.loadStyleConfig();
    this.loadRingSizeConfig();
    this.loadStyleComponentConfig();
    this.loadChainConfig();
    this.initOptionMap();

    this.mainCont = mainCont;

    this.scene = new THREE.Scene();
    this.jewelGroup = new THREE.Group();
    this.chainGroup = new THREE.Group();
    this.lightGroup = new THREE.Group();
    this.showallGroup = new THREE.Group();
    this.showallGroup.visible = false;

    this.scene.add(this.jewelGroup);
    this.scene.add(this.chainGroup);
    this.scene.add(this.lightGroup);
    this.scene.add(this.showallGroup);

    //this.scene.fog = new THREE.Fog( 0xe3e3e3, 0.1, 10000 );
    this.bkgcolor = new THREE.Color();
    this.bkgcolor.setHex(0xffffff);

    // stats
    //this.stats = new Stats();
    //this.mainCont.appendChild( this.stats.dom );

    this.noRender = (undefined != noRender && noRender);

    this.initRenderer();
    this.mainCont.appendChild(this.renderer.domElement);

    this.initMaterials();
    this.initLights();
    this.initCamera();
    this.initControls();
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    this.animate();
}

SHOWING.ParamList = function () {
    this.jewelID = 'ring';  //ring、neck、brace、star分别代表戒指、项链、手链、星牌
    this.text = 'Love'; //文字
    this.text2 = 'You';
    this.font = 1;      //字体 1、2、3...对应fontcfg.csv表
    this.textfont = "40px Arial";
    this.material = 1;  //材质(金还是银），用于价格计算和工厂制造，本模块用不着。
    this.stone = 4; //宝石类型（颜色） 1、2、3...
    this.color = 1; //珐琅颜色  1、2、3...
    this.size = 1; //尺寸（戒指和手镯用）   1、2、3...
    this.ringstyle = 1; //戒环样式（仅戒指用） 1、2、3...
    this.sign = null;   //签名，前端传进来的图片对象（Image）仅用于星牌
    this.picture = null; //图案，前端传进来的图片对象（Image）仅用于星牌
    this.starPlateText = null; //背面文字，前端传进来的图片对象（Image）仅用于星牌
    this.linkstyle = 1; //款式，其定义见本模块的LinkStyle结构
    this.textcolor = 1;     //字符颜色，其定义见this.matLib
    this.chaincolor = 1;    //链子颜色，其定义见this.matLib
    this.bodycolor = 1;     //主体颜色，其定义见this.matLib（非星牌）或this.matLibDark(星牌）
    this.chainstyle = 1;    //链子类型，1）在chaincfg.csv中定义，2）"chaincolor_chainstyle"组成的key索引到this.matLibLowChain（试戴模式下的链子）
    this.tailstyle = 1; //尾缀类型，暂不使用
    this.mainstone = 1; //外圈宝石颜色，其定义见this.matLibStone
    this.mainpearl = 1;
    this.textinterval = 1; //字母间隔选项，已弃用
    this.compGroupOptions = new Array();    //保存各组件组的选项
};

SHOWING.prototype.constructor = SHOWING;
SHOWING.prototype.dispose = function ()
{
    this.cnFont = null;
    this.camera=null;
    this.cameraShowall=null;
    this.stats = null;
    this.renderer=null;
    this.controls = null;
    this.controlsShowall = null;
    this.matLib = null;
    this.matLibDark = null;
    this.matLibFalang = null;
    this.scene=null;
    this.mainCont = null;
    this.lastParamlist = null;

    this.fontCfgMap = null;
    this.partCfgMap = null;
    this.linkCfgMap = null;
    this.styleCfgMap = null;
    this.chainCfgMap = null;
    this.ringsizeCfgMap = null;
    this.stylecompCfgMap = null;

    this.meshShowAllChainL = null;
    this.meshShowAllChainR = null;
    this.meshShowAllModel = null;

    this.isShowall = false;
    this.reloadFlag = 'no';
    this.loadTask = null;
    this.meshArray = null;
    this.loadmeshGroup = null;

    //终止循环线程
    if (undefined != this.animateHandle && null != this.animateHandle)
        cancelAnimationFrame(this.animateHandle);

    if (null != this.meshUnionArray && undefined != this.meshUnionArray)
    {
        for(var i=0, il=this.meshUnionArray.length; i<il; i++){
            this.meshUnionArray[i].dispose();
        }

        this.meshUnionArray = null;
    }
}

MeshUnion = function(showing, unionid)
{
    this.showing = showing;
    this.unionid = unionid;
}

MeshUnion.prototype.constructor = MeshUnion;
MeshUnion.prototype.dispose = function(){

    this.symboltext = null;
    this.meshFirst = null;
    this.meshWhole = null;
    this.meshWhole2 = null;
    this.meshFalang = null;
    this.meshFalang2 = null;

    this.chainL = null;
    this.chainR = null;
    this.stones = null;
    this.stones2 = null;
    this.meshMain = null;
    this.meshMain2 = null;
    this.meshExtra = null;
    this.meshSymbols = null;
    this.meshSymbols2 = null;
    this.meshMainStones = null;
    this.meshMainSymbols = null;
    this.meshMainPearl = null;
    this.meshChain = null;
    this.meshTail = null;

    this.chainOffset = null;
    this.MainStoneNum = 0;
    this.textMeshGroup = null;

    this.plateTFront = null;
    this.plateTBack = null;
}

//初始化摄像机
SHOWING.prototype.initCamera = function (){
    //普通视角摄像机
    this.camera = new THREE.PerspectiveCamera( 5, this.mainCont.clientWidth/this.mainCont.clientHeight, 1, 100000 );
    this.camera.position.set(300,0,0);

    //试戴模式摄像机
    this.cameraShowall = new THREE.PerspectiveCamera( 5, this.mainCont.clientWidth/this.mainCont.clientHeight, 1, 100000 );
    this.cameraShowall.position.set(0,0,300);

    //截图正视图
    this.cameraCap = new THREE.PerspectiveCamera( 5, this.mainCont.clientWidth/this.mainCont.clientHeight, 1, 100000 );
    this.cameraCap.position.set(300,0,0);

    //截图背视图
    this.cameraCap2 = new THREE.PerspectiveCamera( 5, this.mainCont.clientWidth/this.mainCont.clientHeight, 1, 100000 );
    this.cameraCap2.position.set(300,0,0);

    //截图正上斜视图
    this.cameraCap3 = new THREE.PerspectiveCamera( 5, this.mainCont.clientWidth/this.mainCont.clientHeight, 1, 100000 );
    this.cameraCap3.position.set(300,0,0);

    //截图左前斜视图
    this.cameraCap4 = new THREE.PerspectiveCamera( 5, this.mainCont.clientWidth/this.mainCont.clientHeight, 1, 100000 );
    this.cameraCap4.position.set(300,0,0);

    //截图右前斜视图
    this.cameraCap5 = new THREE.PerspectiveCamera( 5, this.mainCont.clientWidth/this.mainCont.clientHeight, 1, 100000 );
    this.cameraCap5.position.set(300,0,0);
}

SHOWING.prototype.IsCnFont = function()
{
    return this.lastParamlist.font >= 101;
}

SHOWING.prototype.InitCnFont = function()
{
    if (!this.IsCnFont())
        return true;

    var fontcfg  = this.fontCfgMap['' + this.lastParamlist.font];
    if (undefined == fontcfg)
        return false;

    this.cnFontParams = new CnFontParams();
    this.cnFont = new CnFont(fontcfg['FontName'], this.cnFontParams, null);
    return true;
}

SHOWING.prototype.IfCnFontReady = function()
{
    if (!this.IsCnFont())
        return true;
    if (this.cnFont == undefined || null == this.cnFont)
        return false;
    return this.cnFont.IsReady();
}

SHOWING.prototype.initOptionMap = function()
{
    //款式定义
    this.LinkStyle = {"piaoliu" : 1, "jianjie" : 2, "jiaxin" : 3, "jianshi" : 4,
        "maomi" : 5, "zidan" : 6, "gougou" : 7};

    //珐琅颜色定义
    this.FalangColor = {"white" :9 , "black" : 10, "purple" : 1, "orange" : 2, "red" : 3, "yellow" : 4,
        "yinghuang" : 5, "yinglan" : 6, "baolan" : 7, "green" : 8, "no" : 11};

    //材质颜色定义，仅前三个有用
    this.MatType = {"rose" : 1, "white" : 2, "gold" : 3, "silverrose" : 4, "silverwhite" : 5, "silvergold" : 6};

    //宝石类型（颜色）定义
    this.StoneColor = {"green" : 4, "pink":5, "blue":3 , "white" : 1, "yellow" : 2, "purple": 6};
}

/*SHOWING.prototype.linkStyleName = function()
{
    if (this.lastParamlist == undefined || this.lastParamlist == null)
        return '';
    return this.linkstyleMap[this.lastParamlist.linkstyle];
}*/

//初始化渲染器
SHOWING.prototype.initRenderer = function ()
{
    // renderer
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setClearColor( this.bkgcolor );
    this.renderer.setPixelRatio(2);//( mainCont.clientWidth / mainCont.clientHeight );
    this.renderer.setSize( this.mainCont.clientWidth, this.mainCont.clientHeight);
    //this.renderer.gammaFactor = 1;
    //this.renderer.gammaInput = true;
    //this.renderer.gammaOutput = true;
    //this.renderer.shadowMap.enabled = false;
    //this.renderer.shadowMap.renderReverseSided = false;
    this.renderer.setFaceCulling( THREE.CullFaceNone );
    //this.renderer.toneMappingExposure = 1.0;
}

SHOWING.prototype.RestoreControls = function(){
    this.controls.enableZoom = true;    //允许缩放
    //this.controls.enableDamping = true;
    this.controls.autoRotate = true;    //自动旋转
    this.controls.autoRotateSpeed = 0.3;
    this.controls.minDistance = 400;
    this.controls.maxDistance = 1600;

    this.controlsShowall.enableZoom = true;
    //this.controls.enableDamping = true;
    this.controlsShowall.autoRotate = true;
    this.controlsShowall.autoRotateSpeed = 0.6;
    this.controlsShowall.minDistance = 2000;
    this.controlsShowall.maxDistance = 4000;
}

//初始化相机控制器
SHOWING.prototype.initControls = function () {

    //普通模式下的相机控制器
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.addEventListener( 'change', this.render.bind(this) );

    //试戴模型下的相机控制器
    this.controlsShowall = new THREE.OrbitControls( this.cameraShowall, this.renderer.domElement );
    this.controlsShowall.addEventListener( 'change', this.render.bind(this) );

    this.RestoreControls();
}

/*SHOWING.prototype.addShadowedLight = function ( x, y, z, color, intensity ) {

 var directionalLight = new THREE.DirectionalLight( color, intensity );
 directionalLight.position.set( x, y, z ).normalize();
 directionalLight.castShadow = false;
 /!*var d = 1;
 directionalLight.shadow.camera.left = -d;
 directionalLight.shadow.camera.right = d;
 directionalLight.shadow.camera.top = d;
 directionalLight.shadow.camera.bottom = -d;
 directionalLight.shadow.camera.near = 1;
 directionalLight.shadow.camera.far = 40;
 directionalLight.shadow.mapSize.width = 1024;
 directionalLight.shadow.mapSize.height = 1024;
 directionalLight.shadow.bias = -0.005;*!/
 this.lightGroup.add( directionalLight );
 }*/

SHOWING.prototype.initLights = function (){
    // Lights

    //环境光
    this.ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1.0);
    this.lightGroup.add(this.ambientLight);

    //var light = new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 2 );
    //this.lightGroup.add( light );

    /*this.pointLight1 = new THREE.PointLight( 0xEEBB88, 0.79 );
     this.pointLight1.position.set( 2000, 1000, 1000 );
     this.pointLight1.shadow = false;
     this.lightGroup.add( this.pointLight1 );*/

    //聚光灯
    var spotLight = new THREE.SpotLight( 0xFFFFFF, 0.1 );
    spotLight.position.set( 1000, 0, 0 );
    spotLight.castShadow = false;
    //spotLight.distance = 3000;
    //spotLight.angle = 1.0;
    //spotLight.penumbra = 0.5;
    //spotLight.decay = 1;
    this.lightGroup.add( spotLight );

    /*var spotLight = new THREE.SpotLight( 0xFFFFFF, 0.1 );
    spotLight.position.set( 1500, -100, 0 );
    spotLight.castShadow = false;
    //spotLight.distance = 3000;
    //spotLight.angle = 1.0;
    //spotLight.penumbra = 0.5;
    //spotLight.decay = 1;
    this.lightGroup.add( spotLight );*/
}

//环境贴图
SHOWING.prototype.createCubeTex = function(name)
{
    var panofiles = new Array();
    var panofilepre = name;
    for(var i=0; i<6; i++)
    {
        panofiles.push(panofilepre + '_' + i + '.jpg');
    }

    var tCube = new THREE.CubeTextureLoader()
        .setPath( 'textures/cube/')
        .load( [ panofiles[1],panofiles[3],panofiles[4],panofiles[5],panofiles[0],panofiles[2]  ] );

    return tCube;
}

/*SHOWING.prototype.createCubeTex2 = function(name)
{
    var panofiles = new Array();
    var panofilepre = name;
    for(var i=0; i<6; i++)
    {
        panofiles.push(panofilepre + '_' + i + '.jpg');
    }

    var tCube = new THREE.CubeTextureLoader()
        .setPath( 'textures/cube/')
        .load( [ panofiles[4],panofiles[5],panofiles[0],panofiles[2], panofiles[1],panofiles[3] ] );

    return tCube;
}*/

//3d材质初始化
SHOWING.prototype.initMaterials = function ()
{
    //黄金环境贴图
    var tCubeGold = this.createCubeTex('g14');
    //白金环境贴图
    var tCubeWhite = this.createCubeTex('w08');
    //玫瑰金环境贴图
    var tCubeRose = this.createCubeTex('r06');

    this.matLib = new Array();
    //var _reflectivity = 1.0;
    var _shininess = 100;
    //var _emissiveIntensity = 0.00;

    //0xFFC0A0 bak 0117
    var roseColor = 0xFFFFFF;

    //0xC0C0C0 bak 0117
    var whiteColor = 0xFFFFFF;

    //0xD6D0E0 0116 bak
    var goldColor = 0xFFFFFF;

    //玫瑰金
    this.matLib['' + this.MatType.rose] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: roseColor, specular:0x111111, shininess:_shininess,
        envMap: tCubeRose, reflectivity:1.0, combine: THREE.MultiplyOperation, shading:THREE.SmoothShading, side: THREE.FrontSide } );

    //白金
    this.matLib['' + this.MatType.white] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: whiteColor, specular:0x111111, shininess:_shininess,
        envMap: tCubeWhite, reflectivity:1.0, combine: THREE.MultiplyOperation, shading:THREE.SmoothShading, side: THREE.FrontSide } );

    //黄金
    this.matLib['' + this.MatType.gold] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: goldColor, specular:0x111111, shininess:_shininess,
        envMap: tCubeGold, reflectivity:1.0, combine: THREE.MultiplyOperation, shading:THREE.SmoothShading, side: THREE.FrontSide } );

    //哑光环境贴图
    var tCubeGoldM = this.createCubeTex('g14m');
    var tCubeWhiteM = this.createCubeTex('w08m');
    var tCubeRoseM = this.createCubeTex('r06m');

    this.matLibDark = new Array();

    //玫瑰金哑光
    //0xC8A08C
    //0xC8A090 bak 0117
    this.matLibDark['' + this.MatType.rose] = new THREE.MeshLambertMaterial( { overdraw:0.5,
        color: 0xFFFFFF,
        envMap: tCubeRoseM, reflectivity:1.0, combine: THREE.MultiplyOperation, shading:THREE.SmoothShading, side: THREE.FrontSide } );

    //白金哑光
    //0xC0C0C0 bak 0117
    this.matLibDark['' + this.MatType.white] = new THREE.MeshLambertMaterial( { overdraw:0.5,
        color: 0xFFFFFF,
        envMap: tCubeWhiteM, reflectivity:1.0, combine: THREE.MultiplyOperation, shading:THREE.SmoothShading, side: THREE.FrontSide } );

    //黄金哑光
    //0xCFC470
    //0xD6C472 0116 bak
    this.matLibDark['' + this.MatType.gold] = new THREE.MeshLambertMaterial( { overdraw:0.5,
        color: 0xFFFFFF,
        envMap: tCubeGoldM, reflectivity:1.0, combine: THREE.MultiplyOperation, shading:THREE.SmoothShading, side: THREE.FrontSide } );

    /*//玫瑰金哑光
    this.matLibDark['' + this.MatType.rose] = new THREE.MeshStandardMaterial( { overdraw:0.5,
        color: roseColor, roughness:0.8, metalness:1,
        envMap: tCubeRose, envMapIntensity:1.99, combine: THREE.MultiplyOperation, shading:THREE.SmoothShading, side: THREE.FrontSide } );

    //白金哑光
    this.matLibDark['' + this.MatType.white] = new THREE.MeshStandardMaterial( { overdraw:0.5,
        color: whiteColor, roughness:0.8, metalness:1,
        envMap: tCubeWhite, envMapIntensity:1.99, combine: THREE.MultiplyOperation, shading:THREE.SmoothShading, side: THREE.FrontSide } );

    //黄金哑光
    this.matLibDark['' + this.MatType.gold] = new THREE.MeshStandardMaterial( { overdraw:0.5,
        color: goldColor, roughness:0.8, metalness:1,
        envMap: tCubeGold, envMapIntensity:1.99, combine: THREE.MultiplyOperation, shading:THREE.SmoothShading, side: THREE.FrontSide } );*/

    /*var moshaTex = new THREE.TextureLoader().load('textures/mosha256.png');
    moshaTex.needsUpdate = true;
    moshaTex.wrapS = THREE.RepeatWrapping;
    moshaTex.wrapT = THREE.RepeatWrapping;
    moshaTex.repeat.set( 2, 2 );
    moshaTex.magFilter = THREE.LinearMipMapLinearFilter;
    moshaTex.minFilter = THREE.LinearMipMapLinearFilter;
    moshaTex.anisotropy = Math.max(1, this.renderer.getMaxAnisotropy());
    for(var matid in this.matLib)
    {
        var mat = this.matLibDark[matid];
        mat.bumpMap = moshaTex;
        mat.bumpScale = 0.3;
    }*/

    //珐琅颜色（也是一种3d材质）
    this.matLibFalang = new Array();
    var falangShine = 0;
    var falangSpecular = 0x000000;
    var falangEmInt = 1.00;
    //白色255。255。255
    this.matLibFalang['' + this.FalangColor.white] = new THREE.MeshPhongMaterial( { emissive: 0xFFFFFF, emissiveIntensity:falangEmInt, color: 0xFFFFFF, specular:falangSpecular, shininess:falangShine, } );

    //黑色0。0。0
    this.matLibFalang['' + this.FalangColor.black] = new THREE.MeshPhongMaterial( { emissive: 0x000000, emissiveIntensity:falangEmInt, color: 0x000000, specular:falangSpecular, shininess:falangShine,} );

    //透明紫76。0。178
    this.matLibFalang['' + this.FalangColor.purple] = new THREE.MeshPhongMaterial( { emissive: 0x4C00B2, emissiveIntensity:falangEmInt, color: 0x4C00B2, specular:falangSpecular, shininess:falangShine,} );

    //橘红色204.51.0
    this.matLibFalang['' + this.FalangColor.orange] = new THREE.MeshPhongMaterial( { emissive: 0xCC3300, emissiveIntensity:falangEmInt, color: 0xCC3300, specular:falangSpecular, shininess:falangShine,} );

    //鲜红色153。0。0
    this.matLibFalang['' + this.FalangColor.red] = new THREE.MeshPhongMaterial( { emissive: 0x990000, emissiveIntensity:falangEmInt, color: 0x990000, specular:falangSpecular, shininess:falangShine,} );

    //明黄色255.204.0
    this.matLibFalang['' + this.FalangColor.yellow] = new THREE.MeshPhongMaterial( { emissive: 0xFFAA00, emissiveIntensity:falangEmInt, color: 0xFFAA00, specular:falangSpecular, shininess:falangShine,} );

    //荧光黄153。204。51
    this.matLibFalang['' + this.FalangColor.yinghuang] = new THREE.MeshPhongMaterial( { emissive: 0x66FF33, emissiveIntensity:falangEmInt, color: 0x66FF33, specular:falangSpecular, shininess:falangShine,} );

    //荧光蓝0。25。127
    this.matLibFalang['' + this.FalangColor.yinglan] = new THREE.MeshPhongMaterial( { emissive: 0x00197F, emissiveIntensity:falangEmInt, color: 0x00197F, specular:falangSpecular, shininess:falangShine,} );

    //宝蓝色0。0。64
    this.matLibFalang['' + this.FalangColor.baolan] = new THREE.MeshPhongMaterial( { emissive: 0x000040, emissiveIntensity:falangEmInt, color: 0x000040, specular:falangSpecular, shininess:falangShine,} );

    //透明绿0。76。25
    this.matLibFalang['' + this.FalangColor.green] = new THREE.MeshPhongMaterial( { emissive: 0x004C19, emissiveIntensity:falangEmInt, color: 0x004C19, specular:falangSpecular, shininess:falangShine,} );

    var textureLoader = new THREE.TextureLoader();
    var texture1 = textureLoader.load( "textures/jewel_001_color.jpg" );

    //锆石（宝石）
    var tCubeStone = this.createCubeTex('jewelCube');
    tCubeStone.mapping = THREE.CubeReflectionMapping;
    this.matLibStone = new Array();

    var opacityStone = 0.9;
    var reflectivityStone = 0.8;
    this.matLibStone['' + this.StoneColor.green] = new THREE.MeshPhongMaterial( { color:0x74FA8E, specular:0x000000, shininess:0, map:texture1,
        envMap: tCubeStone, reflectivity:reflectivityStone, combine: THREE.MultiplyOperation,
        opacity: opacityStone, transparent: true ,shading:THREE.FlatShading, refractionRatio:0.5} );

    this.matLibStone['' + this.StoneColor.pink] = new THREE.MeshPhongMaterial( { color:0xFD88CC, specular:0x000000, shininess:0, map:texture1,
        envMap: tCubeStone, reflectivity:reflectivityStone, combine: THREE.MultiplyOperation,
        opacity: opacityStone, transparent: true ,shading:THREE.FlatShading, refractionRatio:0.5} );

    //0x3551DE
    this.matLibStone['' + this.StoneColor.blue] = new THREE.MeshPhongMaterial( { color:0x5571FE, specular:0x5571FE, shininess:0, map:texture1,
        envMap: tCubeStone, reflectivity:reflectivityStone, combine: THREE.MultiplyOperation,
        opacity: opacityStone, transparent: true ,shading:THREE.FlatShading, refractionRatio:0.5} );

    this.matLibStone['' + this.StoneColor.white] = new THREE.MeshPhongMaterial( { color:0xF4F2F0, specular:0x000000, shininess:0, map:texture1,
        envMap: tCubeStone, reflectivity:0.6, combine: THREE.MultiplyOperation,

        opacity: opacityStone, transparent: true ,shading:THREE.FlatShading, refractionRatio:0.5} );

    this.matLibStone['' + this.StoneColor.yellow] = new THREE.MeshPhongMaterial( { color:0xFFFA4E, specular:0x000000, shininess:0, map:texture1,
        envMap: tCubeStone, reflectivity:reflectivityStone, combine: THREE.MultiplyOperation,
        opacity: opacityStone, transparent: true ,shading:THREE.FlatShading, refractionRatio:0.5} );

    //0xC878E8
    this.matLibStone['' + this.StoneColor.purple] = new THREE.MeshPhongMaterial( { color:0xD888F8, specular:0xD888F8, shininess:0, map:texture1,
        envMap: tCubeStone, reflectivity:reflectivityStone, combine: THREE.MultiplyOperation,
        opacity: opacityStone, transparent: true ,shading:THREE.FlatShading, refractionRatio:0.5} );

    this.matLibStone['' + 0] = this.matLibStone['' + this.StoneColor.white];

    this.matLibPearl = new Array();
    this.matLibPearl['' + 1] = new THREE.MeshPhongMaterial( { color:0xE8E0E0, specular:0xC0C0C0, shininess:30, map:null,
        envMap: null, reflectivity:reflectivityStone, combine: THREE.MultiplyOperation,
        opacity: opacityStone, transparent: false ,shading:THREE.SmoothShading, refractionRatio:0.1} );

    //加载低模链子贴图（试戴模式用）
    textureLoader = new THREE.TextureLoader();
    var textureChainD = textureLoader.load( "models/obj/showall/chain/D/Chain_LowD_normal.png" );
    var textureChainD_T = textureLoader.load( "models/obj/showall/chain/D/Chain_LowD_T.png" );

    var textureChainA = textureLoader.load( "models/obj/showall/chain/A/Chain_LowA_normal.png" );
    var textureChainA_T = textureLoader.load( "models/obj/showall/chain/A/Chain_LowA_T.png" );

    var textureChainB = textureLoader.load( "models/obj/showall/chain/B/Chain_LowB_normal.png" );
    var textureChainB_T = textureLoader.load( "models/obj/showall/chain/B/Chain_LowB_T.png" );

    var textureChainE = textureLoader.load( "models/obj/showall/chain/E/Chain_LowE_normal.png" );
    var textureChainE_T = textureLoader.load( "models/obj/showall/chain/E/Chain_LowE_T.png" );
    /*textureChainE.mapping = THREE.UVMapping;
    textureChainE.wrapS = textureChainE_T.wrapT = THREE.RepeatWrapping;
    textureChainE.repeat.set(1, 1);
    textureChainE_T.mapping = THREE.UVMapping;
    textureChainE_T.wrapS = textureChainE_T.wrapT = THREE.RepeatWrapping;
    textureChainE_T.repeat.set(1, 1);*/

    var textureChainF = textureLoader.load( "models/obj/showall/chain/F/Chain_LowF_normal.png" );
    var textureChainF_T = textureLoader.load( "models/obj/showall/chain/F/Chain_LowF_T.png" );

    var textureChainG = textureLoader.load( "models/obj/showall/chain/G/Chain_LowG_normal.png" );
    var textureChainG_T = null;//textureLoader.load( "models/obj/showall/chain/F/Chain_LowF_T.png" );

    //低模链子的材质
    this.matLibLowChain = new Array();

    //chaincolor_chainstyle
    var opacityLowChain = 1.0;
    this.matLibLowChain['1_1'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: roseColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeRose, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainD_T, normalMap:textureChainD, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['1_2'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: roseColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeRose, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainA_T, normalMap:textureChainA, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['1_3'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: roseColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeRose, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainB_T, normalMap:textureChainB, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['1_4'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: roseColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeRose, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainE_T, normalMap:textureChainE, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['1_5'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: roseColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: false ,
        envMap: tCubeRose, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainF_T, normalMap:textureChainF, shading:THREE.FlatShading, side: THREE.FrontSide} );

    this.matLibLowChain['1_6'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: roseColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeRose, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainG_T, normalMap:textureChainG, shading:THREE.SmoothShading, side: THREE.DoubleSide} );


    this.matLibLowChain['2_1'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: whiteColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeWhite, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainD_T, normalMap:textureChainD, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['2_2'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: whiteColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeWhite, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainA_T, normalMap:textureChainA, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['2_3'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: whiteColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeWhite, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainB_T, normalMap:textureChainB, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['2_4'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: whiteColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeWhite, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainE_T, normalMap:textureChainE, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['2_5'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: whiteColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeWhite, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainF_T, normalMap:textureChainF, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['2_6'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: whiteColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeWhite, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainG_T, normalMap:textureChainG, shading:THREE.SmoothShading, side: THREE.DoubleSide} );


    this.matLibLowChain['3_1'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: goldColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeGold, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainD_T, normalMap:textureChainD, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['3_2'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: goldColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeGold, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainA_T, normalMap:textureChainA, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['3_3'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: goldColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeGold, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainB_T, normalMap:textureChainB, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['3_4'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: goldColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeGold, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainE_T, normalMap:textureChainE, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['3_5'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: goldColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeGold, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainF_T, normalMap:textureChainF, shading:THREE.SmoothShading, side: THREE.DoubleSide} );

    this.matLibLowChain['3_6'] = new THREE.MeshPhongMaterial( { overdraw:0.5,
        color: goldColor, specular:0x111111, shininess:_shininess, opacity: opacityLowChain, transparent: true ,
        envMap: tCubeGold, reflectivity:1.0, combine: THREE.MultiplyOperation, alphaMap:textureChainG_T, normalMap:textureChainG, shading:THREE.SmoothShading, side: THREE.DoubleSide} );


    this.matLibModel = new THREE.MeshPhongMaterial( { color:0xC0C0C0, specular:0xFFFFFF, shininess:50,
        opacity: 0.8, transparent: true ,shading:THREE.SmoothShading, refractionRatio:0.5} );
    this.matLibModelEar = new THREE.MeshPhongMaterial( { color:0xC0C0C0, specular:0xFFFFFF, shininess:50,
        opacity: 1.0, transparent: false, shading:THREE.SmoothShading, refractionRatio:0.5} );

}

SHOWING.prototype.onWindowResize = function () {
    this.camera.aspect = this.mainCont.clientWidth/ this.mainCont.clientHeight;
    this.camera.updateProjectionMatrix();

    this.cameraShowall.aspect = this.mainCont.clientWidth/ this.mainCont.clientHeight;
    this.cameraShowall.updateProjectionMatrix();

    this.renderer.setSize( this.mainCont.clientWidth, this.mainCont.clientHeight);
}

SHOWING.prototype.render = function () {
    if ('no' != this.reloadFlag)
        return;

    if (this.isShowall) //试戴模式
        this.renderer.render(this.scene, this.cameraShowall );
    else    //普通模式
        this.renderer.render(this.scene, this.camera );
}

SHOWING.prototype.onProgress = function  ( xhr )
{
    if ( xhr.lengthComputable )
    {
        var percentComplete = xhr.loaded / xhr.total * 100;
        //console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
}

SHOWING.prototype.onError = function ( xhr ) {
};

//动画帧循环
SHOWING.prototype.animate = function ()
{
    if (this.isShowall) //试戴
    {
        if (this.controlsShowall != null && this.controlsShowall != undefined)
            this.controlsShowall.update();
    }
    else {
        if (this.controls != null && this.controls != undefined)
            this.controls.update();
    }

    if (this.stats != null && this.stats != undefined)
        this.stats.update();    //左上角的信息显示（一般是关闭显示的）

    if (this.scene != null) {

        if (!this.noRender) //不渲染，用于后端
            this.render();

        this.DoReload();    //执行重新加载

        var uniteOver = false;
        if (null != this.lastParamlist && null != this.styleCfgMap) {

            var styleid = '' + this.lastParamlist.jewelID + this.lastParamlist.linkstyle;

            //新款还是旧款，如果在styleCfgMap里找不到就是旧款
            if (undefined != this.styleCfgMap[styleid]) {
                if (this.DoUniteNew())
                    uniteOver = true;
            }
            else {
                if (this.DoUniteOld())
                    uniteOver = true;
            }
        }

        //是否需要拼接链子（链子是可以单独进行重新加载的）
        if (this.reloadFlag == 'chain' && !uniteOver) {
            if (this.DoUniteChain())
                uniteOver = true;
        }

        //拼接完后要做的事情
        if (uniteOver) {
            //拼接完后，把刚才加载的模型丢弃掉，但也可能会有某些模型还被继续使用，直到下一次Reload
            if (undefined != this.loadmeshGroup && null != this.loadmeshGroup)
            {
                this.scene.remove(this.loadmeshGroup);
                this.loadmeshGroup = null;
            }
        }

        //触发下一次animate的执行
        this.animateHandle = requestAnimationFrame(this.animate.bind(this));
    }
}

//加载试戴模式所需的模型（脖子、手腕等）
SHOWING.prototype.loadModelShowAll = function ()
{
    var styleCfgData = this.styleCfgMap[this.styleid];
    if (undefined == styleCfgData)
    {
        //旧款，借用新款的配置
        if (this.lastParamlist.jewelID == 'neck' || this.lastParamlist.jewelID == 'star')
            styleCfgData = this.styleCfgMap['neck9'];
        else if (this.lastParamlist.jewelID == 'brace')
            styleCfgData = this.styleCfgMap['brace7'];
        else if (this.lastParamlist.jewelID == 'ring')
            styleCfgData = this.styleCfgMap['ring7'];
        else
            return;
    }

    //试戴模型是在styleCfg.csv里配置的
    var modelname = styleCfgData['model_showall'].trim();
    if (modelname != '')
    {
        this.loadModelObj('models/obj/showall/' + modelname, 'modelall', 0);
    }
}

//加载试戴模式的链子
SHOWING.prototype.loadChainsShowAll = function ()
{
    var styleCfgData = this.styleCfgMap[this.styleid];
    if (undefined == styleCfgData)
    {
        //旧款借用新款的配置
        if (this.lastParamlist.jewelID == 'neck' || this.lastParamlist.jewelID == 'star')
            styleCfgData = this.styleCfgMap['neck9'];
        else if (this.lastParamlist.jewelID == 'brace')
            styleCfgData = this.styleCfgMap['brace7'];
        else if (this.lastParamlist.jewelID == 'ring')
            styleCfgData = this.styleCfgMap['ring7'];
        else
            return;
    }

    //链子id在stylecfg。csv里配置
    var chainid = styleCfgData['chainid_showall'].trim();
    if (chainid != '')
    {
        var chainidArray = chainid.split('/');
        var chainid = chainidArray[this.lastParamlist.chainstyle - 1];
        //链子的具体数据在chaincfg。csv里配置
        var chainCfg = this.chainCfgMap[chainid];
        if (undefined != chainCfg)
        {
            var chainL = chainCfg['chainL'];
            if (undefined != chainL && '' != chainL.trim()  && 'no' != chainL.toLowerCase())
            {
                this.loadModelObj('models/obj/' + chainL, 'chainall', 0);
            }

            var chainR = chainCfg['chainR'];
            if (undefined != chainR && '' != chainR.trim()  && 'no' != chainR.toLowerCase())
            {
                this.loadModelObj('models/obj/' + chainR, 'chainall', 1);
            }
        }
    }
}

//执行拼接试戴模式下的模特模型（简单，只需加入到场景里，并设置材质）
SHOWING.prototype.DoUniteModelShowAll = function(){
    meshData = this.meshArray['modelall0'];
    if (undefined != meshData) {
        if (this.meshShowAllModel != undefined && this.meshShowAllModel != null) {
            this.showallGroup.remove(this.meshShowAllModel);
            this.meshShowAllModel = null;
        }
        this.meshShowAllModel = meshData.mesh;
        this.showallGroup.add(this.meshShowAllModel);
        this.loadmeshGroup.remove(this.meshShowAllModel);
        if (this.lastParamlist.jewelID == 'ear')
            this.meshShowAllModel.material = this.matLibModelEar;
        else
            this.meshShowAllModel.material = this.matLibModel;
    }
}

//执行拼接试戴模式下的链子模型
SHOWING.prototype.DoUniteChainsShowAll = function(){

    //星牌的链子类型和颜色是固定的
    if (this.lastParamlist.jewelID == 'star')
    {
        this.lastParamlist.chaincolor = 1;
        this.lastParamlist.chainstyle = 1;
    }

    //右边的链子，如果只有一条链子，就没有它了
    var meshData = this.meshArray['chainall1'];
    if (undefined != meshData) {
        if (this.meshShowAllChainR != undefined && this.meshShowAllChainR != null) {
            this.showallGroup.remove(this.meshShowAllChainR);
            this.meshShowAllChainR = null;
        }
        this.meshShowAllChainR = meshData.mesh;
        this.showallGroup.add(this.meshShowAllChainR);
        this.loadmeshGroup.remove(this.meshShowAllChainR);
        this.meshShowAllChainR.material = this.matLibLowChain['' + this.lastParamlist.chaincolor + '_' + this.lastParamlist.chainstyle];
    }

    //左边的链子，或唯一的链子
    meshData = this.meshArray['chainall0'];
    if (undefined != meshData) {
        if (this.meshShowAllChainL != undefined && this.meshShowAllChainL != null) {
            this.showallGroup.remove(this.meshShowAllChainL);
            this.meshShowAllChainL = null;
        }
        this.meshShowAllChainL = meshData.mesh;
        this.showallGroup.add(this.meshShowAllChainL);
        this.loadmeshGroup.remove(this.meshShowAllChainL);
        this.meshShowAllChainL.material = this.matLibLowChain['' + this.lastParamlist.chaincolor + '_' + this.lastParamlist.chainstyle];
    }
}

//显示试戴模式（带模特和试戴链子（低模链子））
SHOWING.prototype.ShowAll = function (OnLoad)
{
    var extraX=0, extraY=0, extraZ=0;   //坐标偏移
    var styleCfgData = this.styleCfgMap[this.styleid];
    if (undefined == styleCfgData)
    {
        //旧款借用新款的配置
        if (this.lastParamlist.jewelID == 'neck')
        {
            styleCfgData = this.styleCfgMap['neck9'];
        }
        else if (this.lastParamlist.jewelID == 'star')
        {
            styleCfgData = this.styleCfgMap['neck9'];
            extraY = -11;
            extraZ = 5;
        }
        else if (this.lastParamlist.jewelID == 'brace')
        {
            styleCfgData = this.styleCfgMap['brace7'];
            extraZ = 8;
            extraX = 2;
        }
        else if (this.lastParamlist.jewelID == 'ring') {
            styleCfgData = this.styleCfgMap['ring7'];
            extraY = -2;
        }
        else
            return;
    }

    this.isShowall = true;

    //显示模特和完整的链子
    this.showallGroup.visible = true;

    //隐藏不完整的链子
    this.chainGroup.visible = false;

    //旋转首饰，参数在stylecfg.csv里配置
    var x=0, y=0, z=0;
    var rotate_showall = styleCfgData['rotate_showall'].trim();
    if ('' != rotate_showall) {

        var rotateMainArray = rotate_showall.split('/');
        x = parseFloat(rotateMainArray[0]) / 180 * Math.PI;
        y = parseFloat(rotateMainArray[1]) / 180 * Math.PI;
        z = parseFloat(rotateMainArray[2]) / 180 * Math.PI;

        this.jewelGroup.rotation.set(x, y, z);
    }
    else{
        this.jewelGroup.rotation.set(0, 0, 0);
    }

    //偏移首饰，参数在stylecfg.csv里配置
    var offset_showall = styleCfgData['offset_showall'].trim();
    if ('' != offset_showall) {
        var offsetMainArray = offset_showall.split('/');
        x = parseFloat(offsetMainArray[0]) ;
        y = parseFloat(offsetMainArray[1]) ;
        z = parseFloat(offsetMainArray[2]) ;

        this.jewelGroup.position.set(x + extraX, y + extraY, z + extraZ);
    }
    else{
        this.jewelGroup.position.set(extraX, extraY, extraZ);
    }

}

//显示普通模式（非试戴）
SHOWING.prototype.ShowPart = function (OnLoad)
{
    var styleCfgData = this.styleCfgMap[this.styleid];

    if (undefined == styleCfgData)
    {
        //旧款借用新款的配置
        if (this.lastParamlist.jewelID == 'neck' || this.lastParamlist.jewelID == 'star')
            styleCfgData = this.styleCfgMap['neck9'];
        else if (this.lastParamlist.jewelID == 'brace')
            styleCfgData = this.styleCfgMap['brace7'];
        else if (this.lastParamlist.jewelID == 'ring')
            styleCfgData = this.styleCfgMap['ring7'];
        else
            return;
    }

    this.isShowall = false;

    //隐藏模特和完整的链子
    this.showallGroup.visible = false;

    //显示不完整的链子
    this.chainGroup.visible = true;

    //旋转首饰
    this.jewelGroup.rotation.set(0, 0, 0);

    //偏移首饰
    this.jewelGroup.position.set(0, 0, 0);
}

MeshUnion.prototype.BeforeReload = function(){
    if (null != this.meshExtra)     //首饰中仅用于前端展示的模型（导出时忽略），如耳钉的针
    {
        this.showing.jewelGroup.remove(this.meshExtra);
        this.meshExtra = null;
    }

    if (null != this.meshMain)      //首饰主体1，不包括文字和符号
    {
        this.showing.jewelGroup.remove(this.meshMain);
        this.meshMain = null;
    }

    if (null != this.meshMain2)     //首饰主体2，不包括文字和符号，少数首饰才有，如分成两部件的手镯
    {
        this.showing.jewelGroup.remove(this.meshMain2);
        this.meshMain2 = null;
    }

    if (null != this.meshMainStones)    //首饰主体上的宝石，导出时也要忽略
    {
        this.showing.jewelGroup.remove(this.meshMainStones);
        this.meshMainStones = null;
    }

    if (null != this.meshMainSymbols)   //首饰主体上的符号，性质跟meshMain一样，独立出来暂时没什么必要
    {
        this.showing.jewelGroup.remove(this.meshMainSymbols);
        this.meshMainSymbols = null;
    }

    if (null != this.meshMainPearl)    //首饰主体上的宝石，导出时也要忽略
    {
        this.showing.jewelGroup.remove(this.meshMainPearl);
        this.meshMainPearl = null;
    }

    if (null != this.meshSymbols)   //首饰上的文字和符号（用户自定义的）
    {
        this.showing.jewelGroup.remove(this.meshSymbols);
        this.meshSymbols = null;
    }

    if (null != this.meshSymbols2)//首饰上的文字和符号（用户自定义的），对应this。meshMain2，少数首饰如手镯才有
    {
        this.showing.jewelGroup.remove(this.meshSymbols2);
        this.meshSymbols2 = null;
    }

    if (null != this.meshChain) //链子（普通模式下），导出时忽视
    {
        this.showing.chainGroup.remove(this.meshChain);
        this.meshChain = null;
    }

    if (null != this.meshTail)  //尾缀，暂时无用
    {
        this.showing.chainGroup.remove(this.meshTail);
        this.meshTail = null;
    }

    if (null != this.meshWhole) //导出时用，合并了需要导出的各个模型
    {
        this.meshWhole = null;
    }

    if (null != this.meshWhole2) //导出时用，合并了需要导出的各个模型，只有少数首饰如手镯用到
    {
        this.meshWhole2 = null;
    }

    if (null != this.meshFirst) //旧款式的主体模型（不包括文字和符号）
    {
        this.showing.jewelGroup.remove(this.meshFirst);
        this.meshFirst = null;
    }

    if (null != this.meshFalang)    //珐琅模型，仅用于展示，不导出
    {
        this.showing.jewelGroup.remove(this.meshFalang);
        this.meshFalang = null;
    }

    if (null != this.meshFalang2)   //珐琅模型，仅用于展示，不导出，少数首饰如手镯用
    {
        this.showing.jewelGroup.remove(this.meshFalang2);
        this.meshFalang2 = null;
    }

    if (null != this.chainL)    //旧款专用，左边的链子，仅用于展示，不导出
    {
        this.showing.chainGroup.remove(this.chainL);
        this.showing.jewelGroup.remove(this.chainL);
        this.chainL = null;
    }

    if (null != this.chainR)    //旧款专用，右边的链子，仅用于展示，不导出
    {
        this.showing.chainGroup.remove(this.chainR);
        this.showing.jewelGroup.remove(this.chainR);
        this.chainR = null;
    }

    if (null != this.stones)    //文字和符号上的宝石，不包括主体上的宝石
    {
        this.showing.jewelGroup.remove(this.stones);
        this.stones = null;
    }

    if (null != this.stones2)   //文字和符号上的宝石，不包括主体上的宝石，少数首饰如手镯用
    {
        this.showing.jewelGroup.remove(this.stones2);
        this.stones2 = null;
    }

    if (null != this.plateTFront)   //星牌正面图案
    {
        this.showing.jewelGroup.remove(this.plateTFront);
        this.plateTFront = null;
    }

    if (null != this.plateTBack)    //星牌背面图案
    {
        this.showing.jewelGroup.remove(this.plateTBack);
        this.plateTBack = null;
    }

    if (null != this.textMeshGroup)
    {
        this.showing.jewelGroup.remove(this.textMeshGroup);
        this.textMeshGroup = null;
    }

    //链子的偏移坐标
    this.chainOffset = null;

    //主体上宝石的数量（用于价格计算）
    this.MainStoneNum = 0;
}

//重新加载，由前端代码调用
SHOWING.prototype.Reload = function (paramlist, OnLoad)
{
    //清理之前的资源

    if(this.reloadFlag != 'no') //已经准备重新加载了，不重复执行下面的代码
        return false;

    this.onLoadOver = OnLoad;   //记录加载完后的回调函数

    if (null != this.meshUnionArray && undefined != this.meshUnionArray) {
        for (var i = 0, il = this.meshUnionArray.length; i < il; i++) {
            this.meshUnionArray[i].BeforeReload();
            this.meshUnionArray[i].dispose();
        }
        this.meshUnionArray = null;
    }

    if (null != this.meshShowAllChainL) //试戴模式链子左或唯一链子
    {
        this.showallGroup.remove(this.meshShowAllChainL);
        this.meshShowAllChainL = null;
    }

    if (null != this.meshShowAllChainR) //试戴模式链子右，可能不存在
    {
        this.showallGroup.remove(this.meshShowAllChainR);
        this.meshShowAllChainR = null;
    }

    if (null != this.meshShowAllModel)  //试戴模式的模特
    {
        this.showallGroup.remove(this.meshShowAllModel);
        this.meshShowAllModel = null;
    }

    //保存参数
    if (null == paramlist || undefined == paramlist)
    {

    }
    else
        this.lastParamlist = paramlist;

    if (null == this.lastParamlist || undefined == this.lastParamlist)
        return;

    this.SetTestParams();

    //加载中文字体，必须在此之前先把lastParamlist.font设定好
    this.InitCnFont();
    //设定此标志，准备重新加载
    this.reloadFlag = 'reload';
    return true;
}

SHOWING.prototype.SetTestParams = function()
{
    //testparam
    //this.lastParamlist.text = '张';

    //this.lastParamlist.jewelID = 'ear';
    //this.lastParamlist.linkstyle = 7;

    //this.lastParamlist.chainstyle = 1;
    //this.lastParamlist.ringstyle = 2;
    //this.lastParamlist.size = 1;f
    //this.lastParamlist.font = 104;

    //this.lastParamlist.text = 'ABC';
    //this.lastParamlist.text2 = 'ERF';
    //this.lastParamlist.textfont = "Bold 24px Zapfino";
    //this.ChangeGroupOption('chain', '2', null, '1', false);
    //this.ChangeGroupOption('chain', '3', null, '2', false);
}

//更换签名图
SHOWING.prototype.ChangeSign = function (newSign, OnLoad)
{
    if (this.lastParamlist.sign == newSign)
        return;

    this.lastParamlist.sign = newSign;

    var context = this.canvasSign.getContext("2d");
    context.clearRect(0,0, this.canvasSign.width, this.canvasSign.height);

    newSign.onload = function() {
        context.drawImage(this.lastParamlist.sign,
            this.canvasSign.width / 2 - this.lastParamlist.sign.width / 2, this.canvasSign.height / 2 - this.lastParamlist.sign.height / 2);
        if (null != this.mapSign)
            this.mapSign.needsUpdate = true;

        var meshUnion = this.meshUnionArray[0];
        if (undefined != meshUnion.plateTFront && null != meshUnion.plateTFront) {
            meshUnion.plateTFront.visible = true;
            meshUnion.plateTFront.material.needsUpdate = true;
        }
    }.bind(this);

    if (newSign.width > 0 && newSign.height > 0) {
        newSign.onload();
    }

    if (undefined != OnLoad)
        OnLoad();
}

//更换生肖图
SHOWING.prototype.ChangePicture = function (newPicture, OnLoad, forceChange)
{
    if (true != forceChange && this.lastParamlist.picture == newPicture)
        return;

    this.lastParamlist.picture = newPicture;

    var context = this.canvasPicture.getContext("2d");
    context.clearRect(0, 0, this.canvasPicture.width, this.canvasPicture.height);

    newPicture.onload = function () {
        if(null != this.lastParamlist.starPlateText)
        {
            this.lastParamlist.starPlateText.onload = function() {
                context.drawImage(this.lastParamlist.starPlateText,
                    this.canvasSign.width / 2 - this.lastParamlist.starPlateText.width / 2,
                    this.canvasSign.height / 2 - this.lastParamlist.starPlateText.height / 2);
            }.bind(this);
            if (this.lastParamlist.starPlateText.width > 0 && this.lastParamlist.starPlateText.height > 0)
            {
                this.lastParamlist.starPlateText.onload();
            }
        }
        context.drawImage(this.lastParamlist.picture,
            this.canvasPicture.width / 2 - this.lastParamlist.picture.width / 2, this.canvasPicture.height / 2 - this.lastParamlist.picture.height / 2);

        if (null != this.mapPicture)
            this.mapPicture.needsUpdate = true;

        var meshUnion = this.meshUnionArray[0];
        if (undefined != meshUnion.plateTBack && null != meshUnion.plateTBack) {
            meshUnion.plateTBack.visible = true;
            meshUnion.plateTBack.material.needsUpdate = true;
        }
    }.bind(this);

    if (newPicture.width > 0 && newPicture.height > 0) {
        newPicture.onload();
    }

    if (undefined != OnLoad)
        OnLoad();
}

/*SHOWING.prototype.ChangeMaterial = function (matID, OnLoad)
{
    this.lastParamlist.material = matID;

    if (this.meshFirst != undefined && this.meshFirst != null && this.matLib != null) {
        this.meshFirst.material = this.matLib['' + matID];
    }

    if (this.chainL != null)
        this.chainL.material = this.matLib['' + matID];
    if (this.chainR != null)
        this.chainR.material = this.matLib['' + matID];

    if (undefined != OnLoad)
        OnLoad();

}*/

//改变字母间距，已弃用
SHOWING.prototype.ChangeTextInterval = function (intervalID, OnLoad)
{
    if (intervalID == this.lastParamlist.textinterval){
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    if ( ! this.IsNewStyle(this.lastParamlist.jewelID , this.lastParamlist.linkstyle))
    {
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    this.lastParamlist.textinterval = intervalID;
    this.Reload(this.lastParamlist, OnLoad);
}

SHOWING.prototype.ChangeTextFont = function(textfont, OnLoad)
{
    if (textfont == this.lastParamlist.textfont){
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    this.lastParamlist.textfont = textfont;
    this.Reload(this.lastParamlist, OnLoad);
}

MeshUnion.prototype.ChangeBodyColor = function(colorID){
    if (this.meshExtra != undefined && this.meshExtra != null) {
        this.meshExtra.material = this.showing.matLib['' + colorID];
    }

    if (this.meshMain != undefined && this.meshMain != null) {
        this.meshMain.material = this.showing.matLib['' + colorID];
    }

    if (this.meshMain2 != undefined && this.meshMain2 != null) {
        this.meshMain2.material = this.showing.matLib['' + colorID];
    }

    if (this.meshMainSymbols != undefined && this.meshMainSymbols != null) {
        this.meshMainSymbols.material = this.showing.matLib['' + colorID];
    }

    if (this.meshFirst != undefined && this.meshFirst != null) {
        if(this.showing.lastParamlist.jewelID == 'star')
            this.meshFirst.material = this.showing.matLibDark['' + colorID];
        else
            this.meshFirst.material = this.showing.matLib['' + colorID];
    }

    if (this.meshSymbols != undefined && this.meshSymbols != null) {
        this.meshSymbols.material = this.showing.matLib['' + colorID];
    }

    if (this.meshSymbols2 != undefined && this.meshSymbols2 != null) {
        this.meshSymbols2.material = this.showing.matLib['' + colorID];
    }
}

//改变主体颜色
SHOWING.prototype.ChangeBodyColor = function (colorID, OnLoad)
{
    //this.ChangeTextFont("Bold 32px Zapfino");

    /*if (this.isShowall)
        this.ShowPart()
    else
        this.ShowAll();*/
    //var num = this.getMainStoneNum();
    //console.log('getMainStoneNum = ' + num);

    if (colorID == this.lastParamlist.bodycolor){
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    if (undefined == this.matLib || null == this.matLib){
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    this.lastParamlist.bodycolor = colorID;
    this.lastParamlist.textcolor = colorID;

    for(var i=0, il=this.meshUnionArray.length; i<il; i++){
        this.meshUnionArray[i].ChangeBodyColor(colorID);
    }

    if (this.lastParamlist.jewelID == 'brace' ||this.lastParamlist.jewelID == 'star')
    {
        this.ChangeChainColor(colorID);
    }

    if (undefined != OnLoad)
        OnLoad();
}

MeshUnion.prototype.ChangeTextColor = function(colorID){
    if (this.meshSymbols != undefined && this.meshSymbols != null) {
        this.meshSymbols.material = this.showing.matLib['' + colorID];
    }

    if (this.meshSymbols2 != undefined && this.meshSymbols2 != null) {
        this.meshSymbols2.material = this.showing.matLib['' + colorID];
    }
}

//改变文字颜色
SHOWING.prototype.ChangeTextColor = function (colorID, OnLoad)
{
    if (colorID == this.lastParamlist.textcolor){
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    if (undefined == this.matLib || null == this.matLib)
    {
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    this.lastParamlist.textcolor = colorID;

    for(var i=0, il=this.meshUnionArray.length; i<il; i++){
        this.meshUnionArray[i].ChangeTextColor(colorID);
    }

    if (undefined != OnLoad)
        OnLoad();
}

MeshUnion.prototype.ChangeChainColor = function (colorID){
    if (undefined != this.meshChain && null != this.meshChain) {
        this.meshChain.material = this.showing.matLib['' + colorID];
    }

    if (this.chainL != null)
        this.chainL.material = this.showing.matLib['' + colorID];
    if (this.chainR != null)
        this.chainR.material = this.showing.matLib['' + colorID];
}

//改变主链颜色
SHOWING.prototype.ChangeChainColor = function (colorID, OnLoad)
{
    if (colorID == this.lastParamlist.chaincolor){
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    if (undefined == this.matLib || null == this.matLib){
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    this.lastParamlist.chaincolor = colorID;

    for(var i=0, il=this.meshUnionArray.length; i<il; i++){
        this.meshUnionArray[i].ChangeChainColor(colorID);
    }

    if (null != this.meshShowAllChainR)
        this.meshShowAllChainR.material = this.matLibLowChain['' + this.lastParamlist.chaincolor + '_' + this.lastParamlist.chainstyle];

    if (null != this.meshShowAllChainL)
        this.meshShowAllChainL.material = this.matLibLowChain['' + this.lastParamlist.chaincolor + '_' + this.lastParamlist.chainstyle];

    if (undefined != OnLoad)
        OnLoad();
}

//改变组件选项
SHOWING.prototype.ChangeGroupOption = function (groupname, option, OnLoad, unionid, IfReload)
{
    if (undefined == IfReload)
        IfReload = true;
    if (undefined == unionid)
        unionid = '1';

    var unionArray = this.lastParamlist.compGroupOptions[unionid];
    if (undefined == unionArray){
        unionArray = new Array();
        this.lastParamlist.compGroupOptions[unionid] = unionArray;
    }

    unionArray[groupname] = option;

    if (IfReload)
        this.Reload(this.lastParamlist, OnLoad);
}

//改变主链类型
SHOWING.prototype.ChangeChainStyle = function (chainstyle, OnLoad)
{
    if (this.lastParamlist.chainstyle == chainstyle)
    {
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    this.lastParamlist.chainstyle = chainstyle;
    this.loadTask = new Array();
    this.meshArray = new Array();

    if (this.IsNewStyle(this.lastParamlist.jewelID, this.lastParamlist.linkstyle))
        this.loadChainModelsNew();
    else
        this.loadChainModelsOld();

    this.loadChainsShowAll();

    this.reloadFlag = 'chain';
    this.onLoadOver = OnLoad;
}

MeshUnion.prototype.ClearChains = function(){
    if (this.meshChain != null)
    {
        this.showing.chainGroup.remove(this.meshChain);
        this.meshChain = null;
    }

    if (null != this.meshTail)
    {
        this.showing.chainGroup.remove(this.meshTail);
        this.meshTail = null;
    }

    if (this.chainL != null)
    {
        this.showing.chainGroup.remove(this.chainL);
        this.chainL = null;
    }

    if (this.chainR != null)
    {
        this.showing.chainGroup.remove(this.chainR);
        this.chainR = null;
    }
}

MeshUnion.prototype.DoUniteChains = function(){
    if (undefined == this.lastUniteModule || null == this.lastUniteModule)
        var uniteModule = new SHOWING.UniteModule(this.showing, this);
    else
        var uniteModule = this.lastUniteModule;

    if (this.showing.IsNewStyle(this.showing.lastParamlist.jewelID, this.showing.lastParamlist.linkstyle)) {
        this.meshChain = new THREE.Mesh(new THREE.Geometry(), this.showing.matLib['' + this.showing.lastParamlist.chaincolor]);
        this.showing.chainGroup.add(this.meshChain);

        this.meshTail = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);
        this.showing.chainGroup.add(this.meshTail);

        uniteModule.uniteChainsNew(false);
    }
    else{
        uniteModule.uniteChainsOld();
    }
}

//拼接链子
SHOWING.prototype.DoUniteChain = function()
{
    if ('chain' != this.reloadFlag)
        return false;

    if (this.meshShowAllChainL != null)
    {
        this.showallGroup.remove(this.meshShowAllChainL);
        this.meshShowAllChainL = null;
    }

    if (this.meshShowAllChainR != null)
    {
        this.showallGroup.remove(this.meshShowAllChainR);
        this.meshShowAllChainR = null;
    }

    for(var i=0, il=this.meshUnionArray.length; i<il; i++){
        this.meshUnionArray[i].ClearChains();
    }

    if (!this.CheckLoadTask())
        return false;

    for(var i=0, il=this.meshUnionArray.length; i<il; i++){
        this.meshUnionArray[i].DoUniteChains();
    }

    this.DoUniteChainsShowAll();

    if (this.isShowall)
        this.ShowAll();
    else
        this.ShowPart();

    this.reloadFlag = 'no';
    if (undefined != this.onLoadOver && null != this.onLoadOver)
        this.onLoadOver();
    this.meshArray = null;

    return true;
}

//尾缀类型
SHOWING.prototype.ChangeTailStyle = function (tailstyle, OnLoad)
{
    this.lastParamlist.tailstyle = tailstyle;

    if (undefined != OnLoad)
        OnLoad();

}

/*//镶嵌类型 1：无，2：宝石，3：刻字
SHOWING.prototype.ChangeEmbedType = function (embedtype, OnLoad)
{
    if (embedtype == this.lastParamlist.embedtype)
    {
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    this.lastParamlist.embedtype = embedtype;
    this.Reload(this.lastParamlist, OnLoad);
}*/

MeshUnion.prototype.ChangeStone = function (){
    if (undefined != this.stones && null != this.stones) {
        this.stones.material = this.showing.matLibStone['' + this.showing.lastParamlist.stone];
    }

    if (undefined != this.stones2 && null != this.stones2) {
        this.stones2.material = this.showing.matLibStone['' + this.showing.lastParamlist.stone];
    }
}
//内圈宝石颜色
SHOWING.prototype.ChangeStone = function (stoneID, OnLoad)
{
    if (stoneID == this.lastParamlist.stone)
    {
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    if (undefined == this.matLibStone || null == this.matLibStone)
    {
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    if (stoneID < 1 || stoneID > 6)
        return;

    this.lastParamlist.stone = stoneID;

    for(var i=0, il=this.meshUnionArray.length; i<il; i++){
        this.meshUnionArray[i].ChangeStone();
    }

    if (undefined != OnLoad)
        OnLoad();
}

//外圈宝石数量
SHOWING.prototype.getMainStoneNum = function ()
{
    var result = 0;
    for(var i=0, il=this.meshUnionArray.length; i<il; i++){
        result += this.meshUnionArray[i].MainStoneNum;
    }
    return result;
}

MeshUnion.prototype.ChangeMainStone = function(){
    if (undefined != this.meshMainStones && null != this.meshMainStones) {
        this.meshMainStones.material = this.showing.matLibStone['' + this.showing.lastParamlist.mainstone];
    }
}

MeshUnion.prototype.ChangeMainPearl = function(){
    if (undefined != this.meshMainPearl && null != this.meshMainPearl) {
        this.meshMainPearl.material = this.showing.matLibPearl['' + this.showing.lastParamlist.mainpearl];
    }
}

//外圈珍珠颜色
SHOWING.prototype.ChangeMainPearl = function (stoneID, OnLoad)
{
    if (stoneID == this.lastParamlist.mainpearl)
    {
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    if (undefined == this.matLibPearl || null == this.matLibPearl)
    {
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    if (stoneID < 0 || stoneID > 6)
        return;

    var needReload = false;
    if (stoneID * this.lastParamlist.mainpearl == 0 )
        needReload = true;

    this.lastParamlist.mainpearl = stoneID;

    for(var i=0, il=this.meshUnionArray.length; i<il; i++){
        this.meshUnionArray[i].ChangeMainPearl();
    }
    if (needReload)
        this.Reload(this.lastParamlist, OnLoad);
    else if (undefined != OnLoad)
        OnLoad();
}

//外圈宝石颜色
SHOWING.prototype.ChangeMainStone = function (stoneID, OnLoad)
{
    if (stoneID == this.lastParamlist.mainstone)
    {
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    if (undefined == this.matLibStone || null == this.matLibStone)
    {
        if (undefined != OnLoad)
            OnLoad();
        return;
    }

    if (stoneID < 0 || stoneID > 6)
        return;

    var needReload = false;
    if (stoneID * this.lastParamlist.mainstone == 0 )
        needReload = true;

    this.lastParamlist.mainstone = stoneID;

    for(var i=0, il=this.meshUnionArray.length; i<il; i++){
        this.meshUnionArray[i].ChangeMainStone();
    }
    if (needReload)
        this.Reload(this.lastParamlist, OnLoad);
    else if (undefined != OnLoad)
        OnLoad();
}

MeshUnion.prototype.ChangeColor = function(){
    if (this.meshFalang != undefined && this.meshFalang != null && this.showing.matLibFalang != null) {
        this.meshFalang.material = this.showing.matLibFalang['' + this.showing.lastParamlist.color];
        if (this.meshFalang2 != undefined && this.meshFalang2 != null) {
            this.meshFalang2.material = this.showing.matLibFalang['' + this.showing.lastParamlist.color];
        }
    }
}

//珐琅颜色
SHOWING.prototype.ChangeColor = function (colorID, OnLoad)
{
    //this.ChangeGroupOption('beiban', '' + colorID, OnLoad, '1', true);
    //return;

    var oldColor = this.lastParamlist.color;
    this.lastParamlist.color = colorID;
    if (oldColor != colorID && (oldColor == this.FalangColor.no || colorID == this.FalangColor.no))
    {
        this.Reload(this.lastParamlist, OnLoad);
    }
    else {
        for (var i = 0, il = this.meshUnionArray.length; i < il; i++) {
            this.meshUnionArray[i].ChangeColor();
        }
        if (undefined != OnLoad)
            OnLoad();
    }
}

MeshUnion.prototype.DoReload = function(){
    if (undefined == this.showing.styleCfgMap[this.showing.styleid]) {
        //老款
        if (this.showing.lastParamlist.jewelID == 'ring')
            this.showing.loadRing(this);
        else if (this.showing.lastParamlist.jewelID == 'neck')
            this.showing.loadNecklace(this);
        else if (this.showing.lastParamlist.jewelID == 'brace')
            this.showing.loadBracelet(this);
        else if (this.showing.lastParamlist.jewelID == 'star')
            this.showing.loadStarplate(this);
        else
            console.warn("wrong jewelID");
    }
    else {
        //新款
        this.showing.loadMainMesh(this);
        //加载字符模型，赋予指定的材质
        this.showing.loadCharModels(this);
    }
}

SHOWING.prototype.DoReload = function ()
{
    if (this.reloadFlag != 'reload')
        return;
    if (null == this.lastParamlist)
        return;
    if (null == this.fontCfgMap)
        return;
    if (null == this.partCfgMap)
        return;
    if (null == this.styleCfgMap)
        return;
    if (null == this.stylecompCfgMap)
        return;
    if (null == this.ringsizeCfgMap)
        return;
    if (null == this.chainCfgMap)
        return;
    if (null == this.linkCfgMap)
        return;
    if (!this.IfCnFontReady())
        return; //加载中文字体未完成

    this.styleid = '' + this.lastParamlist.jewelID + this.lastParamlist.linkstyle;

    this.loadTask = new Array();
    this.meshArray = new Array();

    this.meshUnionArray = new Array();

    if (this.IsNewStyle(this.lastParamlist.jewelID, this.lastParamlist.linkstyle))
    {
        var unioncnt = parseInt(this.styleCfgMap[this.styleid]['unioncnt']);
        for(var i=0; i<unioncnt; i++)
        {
            var meshUnion = new MeshUnion(this, i+1);
            if (i == 0)
                meshUnion.symboltext = this.lastParamlist.text;
            else if (i == 1)
                meshUnion.symboltext = this.lastParamlist.text2;
            this.meshUnionArray[i] = meshUnion;
            meshUnion.DoReload();
        }
        //加载链子和挂环模型，赋予指定的材质
        this.loadChainModelsNew();
    }
    else{
        //随我系列
        var meshUnion = new MeshUnion(this, 1);
        meshUnion.symboltext = this.lastParamlist.text;
        this.meshUnionArray[0] = meshUnion;
        meshUnion.DoReload();
    }

    //加载整体展示所需的模型
    this.loadModelShowAll();
    this.loadChainsShowAll();
    this.reloadFlag = 'unite';
}

//加载特殊符号（表情符号）的配置
SHOWING.prototype.loadPartConfig = function ()
{
    if (this.partCfgMap != null)
        return;
    var loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
    loader.load( "./cfg/partcfg.csv", function ( text ) {
        var partCfgData = CSV.parse(text);
        var len = partCfgData.length;
        this.partCfgMap = new Array();
        for(var i=1; i<len; i++)
        {
            var id = partCfgData[i][0];
            if (id == '')
                break;
            var partCfgRow = new Array();
            var fieldlen = partCfgData[i].length;
            for(var j=1; j<fieldlen; j++)
            {
                var fieldname = partCfgData[0][j];
                partCfgRow[fieldname] = partCfgData[i][j];
            }
            this.partCfgMap['' + id] = partCfgRow;
        }
        partCfgData = null;
    }.bind(this) , this.onProgress.bind(this));
}

SHOWING.prototype.loadFontConfig = function ()
{
    if (this.fontCfgMap != null)
        return;
    var loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
    loader.load( "./cfg/fontcfg.csv", function ( text ) {
        var fontCfgData = CSV.parse(text);
        var len = fontCfgData.length;
        this.fontCfgMap = new Array();
        for(var i=1; i<len; i++)
        {
            var id = fontCfgData[i][0];
            if (id == '')
                break;
            var fontCfgRow = new Array();
            var fieldlen = fontCfgData[i].length;
            for(var j=1; j<fieldlen; j++)
            {
                var fieldname = fontCfgData[0][j];
                fontCfgRow[fieldname] = fontCfgData[i][j];
            }
            this.fontCfgMap[id] = fontCfgRow;
        }
        fontCfgData = null;
    }.bind(this) , this.onProgress.bind(this));
}

SHOWING.prototype.loadLinkConfig = function ()
{
    if (this.linkCfgMap != null)
        return;
    var loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
    loader.load( "./cfg/linkcfg.csv", function ( text ) {
        var cfgdata = CSV.parse(text);
        var len = cfgdata.length;
        this.linkCfgMap = new Array();
        for(var i=1; i<len; i++)
        {
            var id = cfgdata[i][0];
            if (id == '')
                break;
            var cfgrow = new Array();
            var fieldlen = cfgdata[i].length;
            for(var j=1; j<fieldlen; j++)
            {
                var fieldname = cfgdata[0][j];
                cfgrow[fieldname] = cfgdata[i][j];
            }
            this.linkCfgMap[id] = cfgrow;
        }
        cfgdata = null;
    }.bind(this) , this.onProgress.bind(this));
}

SHOWING.prototype.loadStyleConfig = function ()
{
    if (this.styleCfgMap != null)
        return;
    var loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
    loader.load( "./cfg/stylecfg.csv", function ( text ) {
        var fontCfgData = CSV.parse(text);
        var len = fontCfgData.length;
        this.styleCfgMap = new Array();
        for(var i=1; i<len; i++)
        {
            var id = fontCfgData[i][0];
            if (id == '')
                break;
            var fontCfgRow = new Array();
            var fieldlen = fontCfgData[i].length;
            for(var j=1; j<fieldlen; j++)
            {
                var fieldname = fontCfgData[0][j];
                fontCfgRow[fieldname] = fontCfgData[i][j];
            }
            this.styleCfgMap[id] = fontCfgRow;
        }
        fontCfgData = null;
    }.bind(this) , this.onProgress.bind(this));
}

SHOWING.prototype.loadChainConfig = function ()
{
    if (this.chainCfgMap != null)
        return;
    var loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
    loader.load( "./cfg/chaincfg.csv", function ( text ) {
        var fontCfgData = CSV.parse(text);
        var len = fontCfgData.length;
        this.chainCfgMap = new Array();
        for(var i=1; i<len; i++)
        {
            var id = fontCfgData[i][0];
            if (id == '')
                break;
            var fontCfgRow = new Array();
            var fieldlen = fontCfgData[i].length;
            for(var j=1; j<fieldlen; j++)
            {
                var fieldname = fontCfgData[0][j];
                fontCfgRow[fieldname] = fontCfgData[i][j];
            }
            this.chainCfgMap[id] = fontCfgRow;
        }
        fontCfgData = null;
    }.bind(this) , this.onProgress.bind(this));

    this.MaxChainStyle = 6;
}

SHOWING.prototype.loadRingSizeConfig = function ()
{
    if (this.ringsizeCfgMap != null)
        return;
    var loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
    loader.load( "./cfg/ringsize.csv", function ( text ) {
        var cfgData = CSV.parse(text);
        var len = cfgData.length;
        this.ringsizeCfgMap = new Array();
        for(var i=1; i<len; i++)
        {
            var id = cfgData[i][0];
            if (id == '')
                break;
            var size = cfgData[i][1];
            if (size == '')
                break;
            var fontCfgRow = new Array();
            var fieldlen = cfgData[i].length;
            for(var j=1; j<fieldlen; j++)
            {
                var fieldname = cfgData[0][j];
                fontCfgRow[fieldname] = cfgData[i][j];
            }
            if (undefined == this.ringsizeCfgMap[id])
            {
                var styleArray = new Array();
                styleArray[size] = fontCfgRow;
                this.ringsizeCfgMap[id] = styleArray;
            }
            else{
                var styleArray = this.ringsizeCfgMap[id];
                styleArray[size] = fontCfgRow;
            }
        }
        cfgData = null;
    }.bind(this) , this.onProgress.bind(this));
}

//加载款式组件配置
SHOWING.prototype.loadStyleComponentConfig = function ()
{
    if (this.stylecompCfgMap != null)
        return;
    var loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
    loader.load( "./cfg/stylecomp.csv", function ( text ) {
        var cfgData = CSV.parse(text);
        var len = cfgData.length;
        this.stylecompCfgMap = new Array();
        for(var i=1; i<len; i++)
        {
            var id = cfgData[i][0];
            if (id == '')
                break;
            var union = cfgData[i][1];
            var order = cfgData[i][2];
            if (union == '' || order == '')
                break;
            var cfgRow = new Array();
            var fieldlen = cfgData[i].length;
            for(var j=1; j<fieldlen; j++)
            {
                var fieldname = cfgData[0][j];
                cfgRow[fieldname] = cfgData[i][j];
            }

            var unionArray = this.stylecompCfgMap[id];
            if (undefined == unionArray) {
                unionArray = new Array();
                this.stylecompCfgMap[id] = unionArray;
            }

            var styleArray = unionArray[union];
            if (undefined == styleArray)
            {
                var styleArray = new Array();
                unionArray[union] = styleArray;
            }

            styleArray[order] = cfgRow;
        }
        cfgData = null;
    }.bind(this) , this.onProgress.bind(this));
}

//解析自定义文字，返回文字或配饰名称组成的数组
SHOWING.prototype.parseText = function (text, fontcfg, canLowercase)
{
    //text = '1个字';
    var onlyUp = false;
    var onlyLow = false;
    if (fontcfg['OnlyUpcase'] == '1' || false == canLowercase)//||sticks
    {
        onlyUp = true;
        text = text.toUpperCase();
    }
    else if (fontcfg['OnlyLowercase'] == '1') {
        onlyLow = true;
        text = text.toLowerCase();
    }

    text = text.trim();
    var code0 = '0'.charCodeAt(0);
    var code9 = '9'.charCodeAt(0);
    var code_a = 'a'.charCodeAt(0);
    var code_z = 'z'.charCodeAt(0);
    var code_A = 'A'.charCodeAt(0);
    var code_Z = 'Z'.charCodeAt(0);
    var codeBlank = ' '.charCodeAt(0);
    var textLength = Math.min(text.length, 48);
    var charArray = new Array();
    for(var i=0; i<textLength; i++)
    {
        var char = text.charAt(i);
        if (char == '[')
        {
            for(var j=i+1; j<textLength; j++)
            {
                if(text.charAt(j) == ']')
                {
                    break;
                }
            }

            if (j < textLength)
            {
                charArray.push('#' + text.substr(i+1, j-i-1));
            }
            i = j;
        }

        var charCode = char.charCodeAt(0);
        //if (charCode > 0xFF)
        if(this.IsCnFont())
            charArray.push('@' + char);
        else if (charCode >= code0 && charCode <= code9)
            charArray.push('0' + char);
        else if (charCode >= code_a && charCode <= code_z)
            charArray.push('UC_' + char.toLowerCase());
        else if (charCode >= code_A && charCode <= code_Z)
            charArray.push('LC_' + char.toLowerCase());
        else if (charCode == codeBlank)
            charArray.push('blank');
    }
    //console.log(charArray)
    return charArray;
}

SHOWING.prototype.loadModelObj = function (filepath, type, id)
{
    if (undefined == this.loadmeshGroup || null == this.loadmeshGroup)
    {
        this.loadmeshGroup = new THREE.Group();
        this.loadmeshGroup.visible = false;
        this.scene.add(this.loadmeshGroup);
    }

    for(var i=0; i<this.loadTask.length; i++) {
        if (this.loadTask[i].filepath == filepath) {
            this.loadTask[i].taskIdList.push('' + id);
            return;
        }
    }

    var newLoadTaskItem = new LoadTaskItem(filepath, type, id);
    this.loadTask.push(newLoadTaskItem);
    var loader = new THREE.OBJLoader( this.loadingmanager );
    loader.loadzip(filepath, this.OnModelLoad.bind(this, this.loadTask.length - 1, this.lastParamlist.bodycolor),
        this.onProgress.bind(this), this.onError.bind(this) );
}

SHOWING.prototype.OnModelLoad= function(index, matID, object)
{
    this.loadTask[index].taskflag = true;
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh)
        {
            for(var i = 0; i<this.loadTask[index].taskIdList.length; i++) {
                var taskId = this.loadTask[index].taskIdList[i];
                var directGeo = new THREE.Geometry();
                directGeo.fromBufferGeometry(child.geometry);
                var newMesh = new THREE.Mesh(directGeo, this.matLib['' + matID]);
                this.loadmeshGroup.add(newMesh);

                //newMesh.geometry.computeFaceNormals();

                this.meshArray[this.loadTask[index].taskType + taskId] = new MeshDataItem(this.loadTask[index].taskType, newMesh);
            }
        }
    }.bind(this));
}

SHOWING.prototype.LoadCnFontModel = function(text, taskType, taskId, matID)
{
    if (!this.IfCnFontReady())
        return false;

    var newMesh = this.cnFont.createTextMesh(text);
    if (null == newMesh)
        return false;

    if (undefined == this.loadmeshGroup || null == this.loadmeshGroup)
    {
        this.loadmeshGroup = new THREE.Group();
        this.loadmeshGroup.visible = false;
        this.scene.add(this.loadmeshGroup);
    }

    this.loadmeshGroup.add(newMesh);
    this.meshArray[taskType + taskId] = new MeshDataItem(taskType, newMesh);
    return true;
}

//加载自定义文字所需要的每个模型
SHOWING.prototype.loadCharModels = function (meshUnion) {

    //this.lastParamlist.text = '一';//'AaBbCcDdEeFfGgHhIiJjLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
    var text = meshUnion.symboltext;//this.lastParamlist.text;
    var fontcfg = this.fontCfgMap['' + this.lastParamlist.font];
    //console.log(this.fontCfgMap)
    var styleCfgData = this.styleCfgMap[this.styleid];
    // console.log(this.styleCfgMap)
    // console.log(styleCfgData)
    var canLowercase = true;
    if (undefined != styleCfgData)
    {
        if ('no' == styleCfgData['lower'].toLowerCase())
            canLowercase = false;

        if (0 == parseInt(styleCfgData['height']))
            text = '';
    }

    //解析文字
    var charArray = this.parseText(text, fontcfg, canLowercase);
    //根据字体和是否有珐琅加载所有字符
    var havecolor = fontcfg['Havecolor'] == '1' ? true : false;
    var fontname = fontcfg['FontName'];
    // console.log(styleCfgData)
    if (undefined != styleCfgData) {
        var minSymbolNum = parseInt(styleCfgData['symmin']);
        var maxSymbolNum = parseInt(styleCfgData['symmax']);
        var charLen = Math.min(maxSymbolNum, charArray.length);
    }
    else{
        var charLen = Math.min(12, charArray.length);
    }

    meshUnion.blankChars = new Array();

    var index = 0;
    for (var i=0; i<charLen; i++)
    {
        var str = charArray[i];
        //console.log(str)
        if (str.charAt(0) == '#')
        {
            //配饰
            var filepath = 'models/obj/part/';
            var partid = str.substr(1, str.length - 1);
            var partCfgItem = this.partCfgMap[partid];
            this.loadModelObj(filepath + partCfgItem['Name'] + '.obj', 'symbol', '' + meshUnion.unionid + '_' + index);
            for(var j=1; j<=5; j++)
            {
                var jewelName = partCfgItem['jewel' + j];
                jewelName = jewelName.trim();
                if (jewelName != undefined && jewelName != '')
                    this.loadModelObj(filepath + jewelName + '.obj', 'stone' + j + '_', '' + meshUnion.unionid + '_' + index);
            }

            index ++;
        }
        else if (str.charAt(0) == '@')
        {
            //中文字体
            this.LoadCnFontModel(str.substr(1), 'symbol', '' + meshUnion.unionid + '_' + index);
            index ++;
        }
        else if (str == 'blank')    //空格
        {
            meshUnion.blankChars.push(index);
        }
        else
        {
            //字母还是配饰
            var filepath = 'models/obj/alphabet/' + fontname + '/T_' + fontname + '_';

            if (havecolor && this.lastParamlist.color != this.FalangColor.no)
                filepath += 'GR_';
            else
                filepath += 'SO_';
            filepath += charArray[i] + '.obj';
            this.loadModelObj(filepath, 'symbol', '' + meshUnion.unionid + '_' + index);

            if (havecolor && this.lastParamlist.color != this.FalangColor.no)
            {
                //珐琅模型
                var falangPath = 'models/obj/alphabet/' + fontname + '/T_' + fontname + '_';
                falangPath += 'CE_' + charArray[i] + '.obj';
                this.loadModelObj(falangPath, 'falang', '' + meshUnion.unionid + '_' + index);
            }

            index ++;
        }
    }
}

//加载本款式所需要的模型
SHOWING.prototype.loadLinkModels = function (linkstyle) {

    if (linkstyle == this.LinkStyle.jianjie)
        return true;

    var filepath = 'models/obj/';
    if (linkstyle == this.LinkStyle.jiaxin)
    {
        this.loadModelObj(filepath + 'link_50_001.obj', 'link', 0);
        this.loadModelObj(filepath + 'link_50_001.obj', 'link', 1);
    }
    else if (linkstyle == this.LinkStyle.zidan)
    {
        /*this.loadModelObj(filepath + 'bullet/front.obj', 'link', 0);
        this.loadModelObj(filepath + 'bullet/back.obj', 'link', 1);
        this.loadModelObj(filepath + 'bullet/middle.obj', 'link', 2);*/
        this.loadModelObj(filepath + 'bullet/P_bulletlong_A_001.obj', 'link', 0);
        this.loadModelObj(filepath + 'bullet/P_bulletlong_C_001.obj', 'link', 1);
        this.loadModelObj(filepath + 'bullet/P_bulletlong_B_001.obj', 'link', 2);
        //this.loadModelObj(filepath + 'bullet/P_bulletshort_A_001.obj', 'link', 0);
        //this.loadModelObj(filepath + 'bullet/P_bulletshort_C_001.obj', 'link', 1);
        //this.loadModelObj(filepath + 'bullet/P_bulletshort_B_001.obj', 'link', 2);
    }
    else if (linkstyle == this.LinkStyle.jianshi)
    {
        this.loadModelObj(filepath + 'arrow/front.obj', 'link', 0);
        this.loadModelObj(filepath + 'arrow/back.obj', 'link', 1);
        this.loadModelObj(filepath + 'arrow/middle.obj', 'link', 2);
    }
    else if (linkstyle == this.LinkStyle.piaoliu)
    {
        this.loadModelObj(filepath + 'bottle/front.obj', 'link', 0);
        this.loadModelObj(filepath + 'bottle/back.obj', 'link', 1);
        this.loadModelObj(filepath + 'bottle/up.obj', 'link', 2);
        this.loadModelObj(filepath + 'bottle/down.obj', 'link', 3);
    }
    else if (linkstyle == this.LinkStyle.jiaopian)
    {
        this.lastParamlist.linkstyle = this.LinkStyle.piaoliu;
        //this.loadModelObj(filepath + 'movie/front.obj', 'link', 0);
        //this.loadModelObj(filepath + 'movie/back.obj', 'link', 1);
        //this.loadModelObj(filepath + 'movie/up.obj', 'link', 2);
        //this.loadModelObj(filepath + 'movie/down.obj', 'link', 3);
    }
    else if (linkstyle == this.LinkStyle.maomi)
    {
        //this.lastParamlist.linkstyle = this.LinkStyle.piaoliu;
        this.loadModelObj(filepath + 'cat/P_CAT_A_001.obj', 'link', 0);
        this.loadModelObj(filepath + 'cat/P_CAT_B_001.obj', 'link', 1);
    }
    else if (linkstyle == this.LinkStyle.gougou)
    {
        this.lastParamlist.linkstyle = this.LinkStyle.piaoliu;
        //this.loadModelObj(filepath + 'dog/front.obj', 'link', 0);
        //this.loadModelObj(filepath + 'dog/back.obj', 'link', 1);
    }
    else if (linkstyle == this.LinkStyle.yumao)
    {
        this.lastParamlist.linkstyle = this.LinkStyle.piaoliu;
        //this.loadModelObj(filepath + 'dog/front.obj', 'link', 0);
        //this.loadModelObj(filepath + 'dog/back.obj', 'link', 1);
    }
}

SHOWING.prototype.loadChainModelsNew = function () {

    var styleCfg = this.styleCfgMap[this.styleid];
    if(undefined == styleCfg)
        return;
    var chainidStr = '' + styleCfg['chainid'];
    if ('' == chainidStr.trim() )
        return;

    if ('no' == chainidStr.toLowerCase())
        return;

    var chainidArray = chainidStr.split('/');
    if (this.lastParamlist.chainstyle > chainidArray.length)
        return;

    var chainid = chainidArray[this.lastParamlist.chainstyle - 1];
    var chainCfg = this.chainCfgMap[chainid];
    if (undefined == chainCfg)
        return;

    var filepath = 'models/obj/';
    var chainL = chainCfg['chainL'];
    if (undefined != chainL && '' != chainL.trim()  && 'no' != chainL.toLowerCase())
    {
        this.loadModelObj(filepath + chainL, 'chain', 0);
    }

    var chainR = chainCfg['chainR'];
    if (undefined != chainR && '' != chainR.trim()  && 'no' != chainR.toLowerCase())
    {
        this.loadModelObj(filepath + chainR, 'chain', 1);
    }

    var circleL = chainCfg['circleL'];
    if (undefined != circleL && '' != circleL.trim()  && 'no' != circleL.toLowerCase())
    {
        this.loadModelObj(filepath + circleL, 'chain', 2);
    }

    var circleR = chainCfg['circleR'];
    if (undefined != circleR && '' != circleR.trim()  && 'no' != circleR.toLowerCase())
    {
        this.loadModelObj(filepath + circleR, 'chain', 3);
    }

    /*var tailL = chainCfg['tailL'];
    if (undefined != tailL && '' != tailL.trim()  && 'no' != tailL.toLowerCase())
    {
        this.loadModelObj(filepath + tailL, 'chain', 4);
    }

    var tailR = chainCfg['tailR'];
    if (undefined != tailR && '' != tailR.trim()  && 'no' != tailR.toLowerCase())
    {
        this.loadModelObj(filepath + tailR, 'chain', 5);
    }*/
}

SHOWING.prototype.loadChainModelsOld = function () {
    var filepath = 'models/obj/chain/';
    if(this.lastParamlist.jewelID == 'neck')
    {
        if (this.lastParamlist.chainstyle == 1)
        {
            this.loadModelObj(filepath + 'necklace/NecklaceD_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'necklace/NecklaceD_R_001.obj', 'chain', 1);
        }
        else if (this.lastParamlist.chainstyle == 2)
        {
            this.loadModelObj(filepath + 'necklace/NecklaceA_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'necklace/NecklaceA_R_001.obj', 'chain', 1);
        }
        else if (this.lastParamlist.chainstyle == 3)
        {
            this.loadModelObj(filepath + 'necklace/NecklaceB_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'necklace/NecklaceB_R_001.obj', 'chain', 1);
        }
        else if (this.lastParamlist.chainstyle == 4)
        {
            this.loadModelObj(filepath + 'necklace/NecklaceE_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'necklace/NecklaceE_R_001.obj', 'chain', 1);
        }
        else if (this.lastParamlist.chainstyle == 5)
        {
            this.loadModelObj(filepath + 'necklace/NecklaceF_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'necklace/NecklaceF_R_001.obj', 'chain', 1);
        }
        else if (this.lastParamlist.chainstyle == 6)
        {
            this.loadModelObj(filepath + 'necklace/NecklaceG_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'necklace/NecklaceG_R_001.obj', 'chain', 1);
        }

        this.loadModelObj('models/obj/circle/' + 'circle_003.obj', 'circle', 0);
        this.loadModelObj('models/obj/circle/' + 'circle_003.obj', 'circle', 1);
    }
    else if(this.lastParamlist.jewelID == 'brace')
    {
        if (this.lastParamlist.chainstyle == 1)
        {
            this.loadModelObj(filepath + 'bracelet/D/braceletD_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'bracelet/D/braceletD_R_001.obj', 'chain', 1);
        }
        else if (this.lastParamlist.chainstyle == 2)
        {
            this.loadModelObj(filepath + 'bracelet/B/braceletA_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'bracelet/B/braceletA_R_001.obj', 'chain', 1);
        }
        else if (this.lastParamlist.chainstyle == 3)
        {
            this.loadModelObj(filepath + 'bracelet/E/braceletB_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'bracelet/E/braceletB_R_001.obj', 'chain', 1);
        }
        else if (this.lastParamlist.chainstyle == 4)
        {
            this.loadModelObj(filepath + 'bracelet/A/braceletE_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'bracelet/A/braceletE_R_001.obj', 'chain', 1);
        }
        else if (this.lastParamlist.chainstyle == 5)
        {
            this.loadModelObj(filepath + 'bracelet/F/braceletF_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'bracelet/F/braceletF_R_001.obj', 'chain', 1);
        }
        else if (this.lastParamlist.chainstyle == 6)
        {
            this.loadModelObj(filepath + 'bracelet/G/braceletG_L_001.obj', 'chain', 0);
            this.loadModelObj(filepath + 'bracelet/G/braceletG_R_001.obj', 'chain', 1);
        }

        this.loadModelObj('models/obj/circle/' + 'circle_003.obj', 'circle', 0);
        this.loadModelObj('models/obj/circle/' + 'circle_003.obj', 'circle', 1);
    }
}

SHOWING.prototype.loadStoneModels = function () {

}

SHOWING.prototype.loadMainMesh = function(meshUnion)
{
    if (this.lastParamlist.jewelID == 'ring')
    {
        this.loadRingMainMesh();
    }
    else if (this.lastParamlist.jewelID == 'brace')
    {
        this.loadBraceMainMesh();
    }
    else if (this.lastParamlist.jewelID == 'neck' || this.lastParamlist.jewelID == 'ear')
    {
        this.loadNecklaceMainMesh(meshUnion);
    }
}

//此组件的组内编号应该与指定编号相同
SHOWING.prototype.CheckCompGroup = function(unionid, groupname, groupoption)
{
    groupoption = '' + groupoption;
    if (groupname.trim() == '' || groupoption.trim() == '' )
        return true;

    var unionOptions = this.lastParamlist.compGroupOptions[unionid];
    if (unionOptions == undefined)
    {
        var optionShould = '1';
        unionOptions = new Array();
        unionOptions[groupname] = optionShould;
        this.lastParamlist.compGroupOptions[unionid] = unionOptions;
    }
    else {
        var optionShould = unionOptions[groupname];
        if (optionShould == undefined) {
            optionShould = '1';
            this.lastParamlist.compGroupOptions[unionid][groupname] = optionShould;
        }
    }

    return groupoption == optionShould;
}

SHOWING.prototype.getCompData = function(meshUnion, groupname)
{
    var unionArray = this.stylecompCfgMap[this.styleid];
    if (undefined == unionArray)
        return null;
    var orderArray = unionArray[meshUnion.unionid];
    if (undefined == orderArray)
        return null;

    for(var order in orderArray) {
        var compData = orderArray[order];
        if (compData['groupname'] != groupname)
            continue;

        if (!this.CheckCompGroup(meshUnion.unionid, groupname, compData['groupoption']))
            continue;

        return compData;
    }

    return null;
}

SHOWING.prototype.loadNecklaceMainMesh = function(meshUnion)
{
    var orderArray = this.stylecompCfgMap[this.styleid][meshUnion.unionid];
    if (undefined == orderArray)
        return;

    var filepath = 'models/obj/';
    for(var order in orderArray)
    {
        var compData = orderArray[order];
        var groupname = compData['groupname'];
        var groupoption = compData['groupoption'];
        if ( !this.CheckCompGroup(meshUnion.unionid, groupname, groupoption))
            continue;

        if (this.lastParamlist.mainstone == 0 || compData['type'].toLowerCase() != 'body') {
            if (compData['model'].trim() != '')
                this.loadModelObj(filepath + compData['model'], 'neck', '' + meshUnion.unionid + '_' + order);
        }
        else{
            //当选择了镶嵌宝石的模式时，要根据stonemodel和stones来加载模型
            if (compData['stonemodel'].trim() != '')
                this.loadModelObj(filepath + compData['stonemodel'], 'neck', '' + meshUnion.unionid + '_' + order);
            else if (compData['model'].trim() != '')
                this.loadModelObj(filepath + compData['model'], 'neck', '' + meshUnion.unionid + '_' + order);

            if (compData['stones'].trim() != '')
                this.loadModelObj(filepath + compData['stones'], 'neckstone', '' + meshUnion.unionid + '_' + order);
        }
    }
}

SHOWING.prototype.loadBraceMainMesh = function()
{
    var sizeArray = this.ringsizeCfgMap[this.styleid];
    if (undefined == sizeArray)
        return;
    var ringSizeData = sizeArray[this.lastParamlist.size];
    if (undefined == ringSizeData)
        return;

    var filepath = 'models/obj/';

    if (this.lastParamlist.mainstone == 0) {
        if (ringSizeData['model'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['model'], 'brace', 0);
        if (ringSizeData['model2'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['model2'], 'brace', 1);
    }
    else{
        if (ringSizeData['stonemodel'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['stonemodel'], 'brace', 0);
        else if (ringSizeData['model'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['model'], 'brace', 0);

        if (ringSizeData['stonemodel2'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['stonemodel2'], 'brace', 1);
        else if (ringSizeData['model2'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['model2'], 'brace', 1);

        if (ringSizeData['stone'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['stone'], 'bracestone', 0);
        if (ringSizeData['stone2'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['stone2'], 'bracestone', 1);
    }

    if (ringSizeData['pearl'].trim() != '')
        this.loadModelObj(filepath + ringSizeData['pearl'], 'pearl', 0);

    if (ringSizeData['pearl2'].trim() != '')
        this.loadModelObj(filepath + ringSizeData['pearl2'], 'pearl', 1);

    if (ringSizeData['texture'].trim() != '')
        this.loadModelObj(filepath + ringSizeData['texture'], 'texture', 0);
}

SHOWING.prototype.loadRingMainMesh = function()
{
    var sizeArray = this.ringsizeCfgMap[this.styleid];
    if (undefined == sizeArray)
        return;
    var ringSizeData = sizeArray[this.lastParamlist.size];
    if (undefined == ringSizeData)
        return;

    var filepath = 'models/obj/';
    if (this.lastParamlist.mainstone > 0)
    {
        if (ringSizeData['stonemodel'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['stonemodel'], 'ring', 0);
        else if (ringSizeData['model'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['model'], 'ring', 0);

        if (ringSizeData['stone'].trim() != '')
            this.loadModelObj(filepath + ringSizeData['stone'], 'ringstone', 0);
    }
    else if (ringSizeData['model'].trim() != '')
        this.loadModelObj(filepath + ringSizeData['model'], 'ring', 0);

    if (ringSizeData['texture'].trim() != '')
        this.loadModelObj(filepath + ringSizeData['texture'], 'texture', 0);
}

SHOWING.prototype.loadRing = function(meshUnion)
{
    //加载字符模型，赋予指定的材质
    this.loadCharModels(meshUnion);

    //根据字符样式判断是否需要加载连接器模型，赋予指定的材质
    this.loadLinkModels(this.lastParamlist.linkstyle);

    //根据戒环样式加载戒指环模型，赋予指定的材质
    var ringfile = 'models/obj/ring/ring_';

    this.loadModelObj(ringfile + this.lastParamlist.ringstyle + '.obj', 'ring', 0);
    //this.loadModelObj(ringfile + this.lastParamlist.ringstyle + '.obj', 'ring', 1);

    //根据特殊字符和宝石类型加载宝石
    this.loadStoneModels();
}

SHOWING.prototype.loadNecklace = function (meshUnion)
{
    //加载字符模型，赋予指定的材质
    this.loadCharModels(meshUnion);

    //加载链子和挂环模型模型，赋予指定的材质
    this.loadChainModelsOld();

    //根据字符样式判断是否需要加载连接器模型，赋予指定的材质
    this.loadLinkModels(this.lastParamlist.linkstyle);

    //根据特殊字符和宝石类型加载宝石
    this.loadStoneModels();
}

SHOWING.prototype.loadBracelet = function (meshUnion)
{
    //加载字符模型，赋予指定的材质
    this.loadCharModels(meshUnion);

    //加载链子和挂环模型模型，赋予指定的材质
    this.loadChainModelsOld();

    //根据字符样式判断是否需要加载连接器模型，赋予指定的材质
    this.loadLinkModels(this.lastParamlist.linkstyle);

    //根据特殊字符和宝石类型加载宝石
    this.loadStoneModels();
}

SHOWING.prototype.loadStarplate = function (meshUnion)
{
    var filepath = 'models/obj/starplate/';
    this.loadModelObj(filepath + 'star_001.obj', 'plate', 0);
    this.loadModelObj(filepath + 'star_jewel_001.obj', 'plate', 1);
    this.loadModelObj(filepath + 'Star_Tex_001.obj', 'plate', 2);
    this.loadModelObj(filepath + 'Star_Tex_002.obj', 'plate', 3);
    //this.loadModelObj(filepath + 'star_002.obj', 'plate', 1);

    this.mapSign = null;
    this.mapPicture = null;

    this.canvasPicture = document.createElement("canvas");
    this.canvasPicture.width = 896;
    this.canvasPicture.height = 896;

    this.canvasSign = document.createElement("canvas");
    this.canvasSign.width = 896;
    this.canvasSign.height = 896;
}

SHOWING.prototype.CheckLoadTask = function()
{
    if(this.loadTask == undefined || this.loadTask == null)
        return true;

    //是否全部加载完毕
    for (var i=0; i< this.loadTask.length; i++)
    {
        if (this.loadTask[i].taskflag == false){
            return false;
        }
    }

    this.loadTask = null;
    return true;
}

SHOWING.prototype.adjustCameras = function(styleCfg, meshUnion)
{
    var cam_zoomStr = '' + styleCfg['cam_zoom'];
    cam_zoomStr = cam_zoomStr.trim();
    var cam_zoom = 1.0;
    if ('' != cam_zoomStr)
        cam_zoom = parseFloat(cam_zoomStr);

    this.RestoreControls();
    this.controls.maxDistance *= cam_zoom;

    var cam_target = styleCfg['cam_target'];
    var meshCamTarget = meshUnion.meshMain;
    if (cam_target == 'extra')
    {
        meshCamTarget = meshUnion.meshExtra;
        meshCamTarget.geometry.computeBoundingBox();
    }
    else if (cam_target == 'symbol')
    {
        meshCamTarget = meshUnion.meshSymbols;
        meshCamTarget.geometry.computeBoundingBox();
    }

    var meshWidth = Math.abs(meshCamTarget.geometry.boundingBox.max.z - meshCamTarget.geometry.boundingBox.min.z);
    var meshHeight = Math.abs(meshCamTarget.geometry.boundingBox.max.y - meshCamTarget.geometry.boundingBox.min.y);
    var cameraDis = Math.max(45, Math.min(this.controls.maxDistance / 30, Math.max(meshHeight,meshWidth)) );

    var camTargetY = 0.4 * meshCamTarget.geometry.boundingBox.max.y + 0.6 * meshCamTarget.geometry.boundingBox.min.y;
    if (this.lastParamlist.jewelID == 'neck' || this.lastParamlist.jewelID == 'star') {
        this.camera.position.set(cameraDis * 25, camTargetY, 0);
    }
    else
    {
        this.camera.position.set(cameraDis * 25, camTargetY + cameraDis * 5, 0);
    }


    this.controls.target.y = camTargetY;

    var cam_offset = styleCfg['cam_offset'].split('/');
    if (cam_offset.length >= 3)
    {
        this.controls.target.x += parseFloat(cam_offset[0]);
        this.controls.target.y += parseFloat(cam_offset[1]);
        this.controls.target.z += parseFloat(cam_offset[2]);
    }

    if (this.lastParamlist.jewelID == 'neck')
        this.controlsShowall.target.y = camTargetY + 40;
    else{
        this.controlsShowall.target.y = camTargetY;
    }

    this.cameraShowall.position.set(0, camTargetY + cameraDis * 5, cameraDis * 25);

    this.correctCaptureCams(this.camera.position.x, this.camera.position.y, 0, this.controls.target.y);
}

MeshUnion.prototype.createUniteModule = function(){
    var uniteModule = new SHOWING.UniteModule(this.showing, this);
    this.lastUniteModule = uniteModule;

    uniteModule.fontcfg  = this.showing.fontCfgMap['' + this.showing.lastParamlist.font];
    uniteModule.styleCfg = this.showing.styleCfgMap[this.showing.styleid];

    return uniteModule;
}

MeshUnion.prototype.clearOldMeshes = function(){
    this.stones = null;
    this.meshFalang = null;
    this.stones2 = null;
    this.meshFalang2 = null;
}

SHOWING.prototype.DoUniteNew = function()
{
    if(this.reloadFlag != 'unite'){
        return false;
    }

    if (!this.CheckLoadTask())
        return false;

    console.log('DoUniteNew:' + this.lastParamlist.jewelID + ', linkstyle:' + this.lastParamlist.linkstyle + ', text:' + this.lastParamlist.text);

    this.reloadFlag = 'waiting';

    for(var i=0, il=this.meshUnionArray.length; i<il; i++)
    {
        this.meshUnionArray[i].DoUniteNew();
    }
    //以第一个MeshUnion为基准调节摄像机
    this.adjustCameras(this.styleCfgMap[this.styleid], this.meshUnionArray[0]);

    //试戴模型拼接
    this.DoUniteModelShowAll();
    //试戴链子拼接
    this.DoUniteChainsShowAll();

    console.timeEnd('总时间');
    this.reloadFlag = 'no';

    if (undefined != this.onLoadOver && null != this.onLoadOver)
        this.onLoadOver();

    this.meshArray = null;

    //试戴模式或普通模式
    if (this.isShowall)
        this.ShowAll();
    else
        this.ShowPart();

}

MeshUnion.prototype.AttachSymbolsToMain = function(uniteModule)
{
    var styleCfgData = this.showing.styleCfgMap[this.showing.styleid];
    if (undefined == styleCfgData || null == styleCfgData)
        return;
    var attach_target = styleCfgData['attach_target'].trim();
    if (attach_target == '')
        return;

    if ('main' == attach_target)
        var meshTarget = this.meshMain;
    else if ('extra' == attach_target)
        var meshTarget = this.meshExtra;
    else if ('stone' == attach_target)
        var meshTarget = this.stones;

    var attach_dir = styleCfgData['attach_dir'].trim();
    if (attach_dir == '')
        attach_dir = 'down';

    if ('down' == attach_dir) {
        var mergeDist = this.showing.getMergeDistanceVert(this.meshSymbols.geometry, meshTarget.geometry,
            uniteModule.firstSymbolFaceStart, uniteModule.firstSymbolFaceEnd, false, this.meshSymbols.scale, meshTarget.scale,
            this.meshSymbols.position, meshTarget.position, 1.0);
        this.meshSymbols.position.y += mergeDist;
    }
    else if ('up' == attach_dir)
    {
        var mergeDist = this.showing.getMergeDistanceVert(this.meshSymbols.geometry, meshTarget.geometry,
            uniteModule.finalSymbolFaceStart, uniteModule.finalSymbolFaceEnd, true, this.meshSymbols.scale, meshTarget.scale,
            this.meshSymbols.position, meshTarget.position, 1.0);
        this.meshSymbols.position.y += mergeDist;
    }
    else if ('left' == attach_dir)
    {
        var mergeDist = this.showing.getMergeDistance(this.meshSymbols.geometry, meshTarget.geometry,
            uniteModule.finalSymbolFaceStart, uniteModule.finalSymbolFaceEnd, true, this.meshUnion.meshSymbols.scale, meshTarget.scale,
            this.meshSymbols.position, meshTarget.position, 1.0);
        this.meshSymbols.position.x += mergeDist;
    }
    else if ('right' == attach_dir)
    {
        var mergeDist = this.showing.getMergeDistance(this.meshSymbols.geometry, meshTarget.geometry,
            uniteModule.firstSymbolFaceStart, uniteModule.firstSymbolFaceEnd, false, this.meshSymbols.scale, meshTarget.scale,
            this.meshSymbols.position, meshTarget.position, 1.0);
        this.meshSymbols.position.x += mergeDist;
    }

    var attach_offset = styleCfgData['attach_offset'].trim();
    if (attach_offset != '')
    {
        var offsetArray = attach_offset.split('/');
        if (offsetArray.length >= 3)
        {
            this.meshSymbols.position.x += parseFloat(offsetArray[0]);
            this.meshSymbols.position.y += parseFloat(offsetArray[1]);
            this.meshSymbols.position.z += parseFloat(offsetArray[2]);
        }
    }

    if (null != this.meshFalang)
    {
        //this.meshFalang.scale.copy(this.meshSymbols.scale);
        this.meshFalang.position.copy(this.meshSymbols.position);
        //this.meshFalang.rotation.copy(this.meshSymbols.rotation);
        this.meshFalang.updateMatrix();
        //this.meshFalang.geometry.applyMatrix(this.meshFalang.matrix);
        //this.meshFalang.position.set(0,0,0);
        //this.meshFalang.scale.set(1,1,1);
        //this.meshFalang.rotation.set(0,0,0);
        //this.meshFalang.updateMatrix();
    }

    //宝石坐标
    if (null != this.stones)
    {
        //this.stones.scale.copy(this.meshSymbols.scale);
        this.stones.position.copy(this.meshSymbols.position);
        //this.stones.rotation.copy(this.meshSymbols.rotation);
        this.stones.updateMatrix();
        //this.stones.geometry.applyMatrix(this.stones.matrix);
        //this.stones.position.set(0,0,0);
        //this.stones.scale.set(1,1,1);
        //this.stones.rotation.set(0,0,0);
        //this.stones.updateMatrix();
    }
}

MeshUnion.prototype.DoUniteNew = function()
{
    var uniteModule = this.createUniteModule();

    console.time('总时间');

    //清除旧的模型
    this.clearOldMeshes();

    var rotateMainArray = uniteModule.styleCfg['rotate'].split('/');
    this.meshSymbols = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);
    this.meshSymbols.rotation.set(parseFloat(rotateMainArray[0])/180*Math.PI,
        parseFloat(rotateMainArray[1])/180*Math.PI,
        parseFloat(rotateMainArray[2])/180*Math.PI,
        'YXZ');
    this.meshSymbols.updateMatrix();
    this.showing.jewelGroup.add(this.meshSymbols);

    console.time('符号拼接');
    uniteModule.uniteSymbolsNew();
    console.timeEnd('符号拼接');

    //附加模型（不打印，颜色同主体）
    this.meshExtra = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);
    this.showing.jewelGroup.add(this.meshExtra);

    //主体模型

    //饰品主体（如环、框等）
    this.meshMain = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);
    //主体上附带的宝石
    this.meshMainStones = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLibStone['' + this.showing.lastParamlist.mainstone]);
    //主体上附带的符号
    this.meshMainSymbols = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);
    //主体上附带的珍珠
    this.meshMainPearl = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLibPearl['' + this.showing.lastParamlist.mainpearl]);

    this.showing.jewelGroup.add(this.meshMain);
    this.showing.jewelGroup.add(this.meshMainStones);
    this.showing.jewelGroup.add(this.meshMainSymbols);
    this.showing.jewelGroup.add(this.meshMainPearl);

    console.time('主体拼接');
    uniteModule.uniteMain();
    console.timeEnd('主体拼接');

    //链子
    this.meshChain = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.chaincolor]);
    this.showing.chainGroup.add(this.meshChain);

    if (null != this.meshTail) {
        this.showing.chainGroup.remove(this.meshTail);
        this.meshTail = null;
    }
    this.meshTail = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);
    this.showing.chainGroup.add(this.meshTail);

    console.time('链子拼接');
    uniteModule.uniteChainsNew(true);
    console.timeEnd('链子拼接');

    //动态的将字符串模型拼接到主模型上
    this.AttachSymbolsToMain(uniteModule);

    console.time('合并顶点');
    this.meshMain.geometry.mergeVertices();
    if (null != this.meshMain2)
        this.meshMain2.geometry.mergeVertices();

    this.meshMainSymbols.geometry.mergeVertices();
    this.meshSymbols.geometry.mergeVertices();
    console.timeEnd('合并顶点');

    this.meshMain.geometry.computeBoundingBox();
    if (null != this.meshMain2)
        this.meshMain2.geometry.computeBoundingBox();


    /*setTimeout(function() {
        this.capturePicture(this.lastParamlist.jewelID + this.lastParamlist.linkstyle + this.lastParamlist.bodycolor + '.png');
    }.bind(this), 1000);*/

    //var helper0 = new THREE.BoxHelper(this.meshMain, 0xff0000);
    //helper0.update();
    //this.scene.add(helper0);
    //var helperL = new THREE.WireframeHelper(this.meshMain, 0xff0000);
    //FaceNormalsHelper
    //VertexNormalsHelper
    /*if (undefined != this.helperL)
        this.scene.remove(this.helperL);
    this.helperL = new THREE.FaceNormalsHelper(this.meshSymbols, 1, 0xff0000);
    this.helperL.scale.copy(this.meshSymbols.scale);
    this.helperL.rotation.copy(this.meshSymbols.rotation);
    this.helperL.position.copy(this.meshSymbols.position);
    this.scene.add(this.helperL);*/

    /*var volume = this.GetVolume();
    console.log("volume:" + volume);

    var filedata = this.GetFileData();
    console.log('filedata:' + filedata);*/

    return true;
}

SHOWING.prototype.CheckStarResLoad = function()
{
    if (this.lastParamlist.jewelID != 'star')
        return true;

    if (null != this.lastParamlist.starPlateText)
    {
        if (this.lastParamlist.starPlateText.width <= 0 && this.lastParamlist.starPlateText.height <= 0)
            return false;
    }

    if (null != this.lastParamlist.picture)
    {
        if (this.lastParamlist.picture.width <= 0 && this.lastParamlist.picture.height <= 0)
            return false;
    }

    if (null != this.lastParamlist.sign)
    {
        if (this.lastParamlist.sign.width <= 0 && this.lastParamlist.sign.height <= 0)
            return false;
    }

    return true;
}

MeshUnion.prototype.DoUniteOld = function()
{
    this.stones = null;

    var uniteModule = new SHOWING.UniteModule(this.showing, this);
    this.lastUniteModule = uniteModule;
    uniteModule.fontcfg  = this.showing.fontCfgMap['' + this.showing.lastParamlist.font];

    if (this.showing.lastParamlist.jewelID == 'star')
        this.meshFirst = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLibDark['' + this.showing.lastParamlist.bodycolor]);
    else
        this.meshFirst = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);

    this.showing.jewelGroup.add(this.meshFirst);
    this.meshFirst.rotation.set(0, Math.PI / 2, 0);
    this.meshFirst.updateMatrix();

    this.meshSymbols = null;
    this.meshFalang = null;
    this.chainL = null;
    this.chainR = null;

    if (this.showing.lastParamlist.jewelID == 'star')
    {
        //拼接星牌
        //使用星牌纹理
        //使用星牌签名
        //使用星牌图案
        //拼接宝石
        console.time('星牌拼接');
        uniteModule.uniteStarPlate(1.0);
        console.timeEnd('星牌拼接');
    }
    else
    {
        this.meshSymbols = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);
        this.meshSymbols.rotation.set(0, Math.PI / 2, 0, 'YXZ');
        this.meshSymbols.updateMatrix();
        this.showing.jewelGroup.add(this.meshSymbols);

        uniteModule.linkcfg = this.showing.linkCfgMap['' + this.showing.lastParamlist.linkstyle];
        uniteModule.havecolor = uniteModule.fontcfg['Havecolor'] == '1' ? true : false;

        //珐琅
        if (uniteModule.havecolor && this.showing.lastParamlist.color != this.showing.FalangColor.no)
        {
            var geometryFalang = new THREE.BoxGeometry( 0, 0, 0 );
            this.meshFalang = new THREE.Mesh(geometryFalang, this.showing.matLibFalang['' + this.showing.lastParamlist.color]);
            this.showing.jewelGroup.add(this.meshFalang);
            this.meshFalang.position.set(0, -10, 0);
            this.meshFalang.rotation.set(0, Math.PI / 2, 0);
            this.meshFalang.updateMatrix();
        }

        var fontDepth_need = parseFloat(uniteModule.fontcfg['depth']);
        if (fontDepth_need <= 0 )
            fontDepth_need = 1.8;

        //符号拉伸比例
        var totalscale = parseFloat(uniteModule.fontcfg['totalscale']);
        if (totalscale <= 0)
            totalscale = 1.0;

        var symbolScale = new THREE.Vector3(totalscale, totalscale, 1);
        fontDepth_need *= totalscale;

        //符号
        console.time('符号拼接');
        symbolScale = uniteModule.uniteSymbolsOld(symbolScale, fontDepth_need);
        console.timeEnd('符号拼接');

        //连接
        console.time('连接拼接');
        var linkDepth_need = parseFloat(uniteModule.linkcfg['depth']);
        if (linkDepth_need <= 0 )
            linkDepth_need = 1.8;
        linkDepth_need *= totalscale;
        var linkScale = symbolScale;
        var whscale = parseFloat(uniteModule.linkcfg['whscale']);
        if (whscale <= 0)
            whscale = 1.0;
        linkScale.multiplyScalar(whscale);

        var offsetZ = parseFloat(uniteModule.linkcfg['offsetz']);

        if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jiaxin)
        {
            uniteModule.uniteSticks(linkScale, linkDepth_need, offsetZ);
        }
        else if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.zidan)
        {
            uniteModule.uniteBullet(linkDepth_need, offsetZ);
        }
        else if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jianshi)
        {
            uniteModule.uniteArrow(linkScale, linkDepth_need, offsetZ);
        }
        else if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.piaoliu)
        {
            uniteModule.uniteBottle(linkScale, linkDepth_need, offsetZ);
        }
        else if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jiaopian)
        {
            uniteModule.uniteMovie(linkScale, linkDepth_need, offsetZ);
        }
        else if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.maomi)
        {
            if (this.showing.lastParamlist.jewelID == 'ring')
                whscale *= 0.55;
            linkScale.set(whscale, whscale, whscale);
            uniteModule.uniteCat(linkScale, linkDepth_need, offsetZ);
        }
        else if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.gougou)
        {
            uniteModule.uniteDog(linkScale, linkDepth_need, offsetZ);
        }
        else if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.yumao)
        {
            uniteModule.uniteDog(linkScale, linkDepth_need, offsetZ);
        }
        console.timeEnd('连接拼接');

        //挂环
        if (this.showing.lastParamlist.jewelID == 'neck' || this.showing.lastParamlist.jewelID == 'brace')
        {
            console.time('挂环拼接');
            uniteModule.uniteCircles();
            console.timeEnd('挂环拼接');
        }

        if (this.showing.lastParamlist.jewelID == 'brace') {
            uniteModule.braceLength = Math.abs(this.meshFirst.geometry.boundingBox.max.x - this.meshFirst.geometry.boundingBox.min.x);
            uniteModule.braceCenterX = 0.5 * this.meshFirst.geometry.boundingBox.max.x + 0.5 * this.meshFirst.geometry.boundingBox.min.x;
            uniteModule.thetaBrace = Math.min(uniteModule.braceLength / 100 * Math.PI ,Math.PI);
            uniteModule.radiusBrace = uniteModule.braceLength / uniteModule.thetaBrace;
            //手链弯曲为0.7PI
            console.time('手镯拼接');
            var braceCenterX = 0.5 * this.meshFirst.geometry.boundingBox.max.x + 0.5 * this.meshFirst.geometry.boundingBox.min.x;
            var origin = new THREE.Vector3(uniteModule.braceCenterX, 0, -uniteModule.radiusBrace);
            var modifier = new THREE.CircleModifier();
            var circumBrace = uniteModule.radiusBrace * 2 * Math.PI;
            modifier.set(origin).modify(this.meshFirst.geometry, circumBrace);
            modifier.set(origin).modify(this.meshSymbols.geometry, circumBrace);
            if (null != this.meshFalang)
                modifier.set(origin).modify(this.meshFalang.geometry, circumBrace);
            if (null != this.stones)
                modifier.set(origin).modify(this.stones.geometry, circumBrace);
            console.timeEnd('手镯拼接');
        }
        else if (this.showing.lastParamlist.jewelID == 'ring') {
            //拼接戒指环
            console.time('戒指拼接');
            var RING_HEIGHT = 8.0 * totalscale;
            this.uniteRingOneBody(uniteModule, fontDepth_need, RING_HEIGHT);
            console.timeEnd('戒指拼接');
        }
    }

    this.meshFirst.geometry.computeBoundingBox();
    var centerX = (this.meshFirst.geometry.boundingBox.max.x + this.meshFirst.geometry.boundingBox.min.x)/2;

    if (this.showing.lastParamlist.jewelID == 'star') {
        this.meshFirst.position.set(0, 0, centerX);
    }
    else if (this.showing.lastParamlist.jewelID == 'ring')
        this.meshFirst.position.set(uniteModule.radiusRing, 0, centerX);
    else if (this.showing.lastParamlist.jewelID == 'brace')
        this.meshFirst.position.set(uniteModule.radiusBrace * 0.5, 0, centerX);
    else{
        var neckY = this.meshFirst.geometry.boundingBox.max.y;// *0.6 + this.meshFirst.geometry.boundingBox.min.y * 0.4;
        this.meshFirst.position.set(0, 4-neckY, centerX);
    }

    this.meshFirst.updateMatrix();

    if (null != this.meshSymbols)
    {
        this.meshSymbols.position.copy(this.meshFirst.position);
        this.meshSymbols.updateMatrix();
    }

    //this.meshFirst.geometry.computeVertexNormals();
    //this.meshFirst.geometry.computeFaceNormals();

    console.time('合并顶点');
    this.meshFirst.geometry.mergeVertices();
    console.timeEnd('合并顶点');

    if (this.stones != null && undefined != this.stones) {
        console.time('宝石拼接');
        this.stones.scale.copy(this.meshFirst.scale);
        this.stones.geometry.computeBoundingBox();
        this.stones.position.copy(this.meshFirst.position);
        this.stones.updateMatrix();
        //this.stones.geometry.computeFaceNormals();
        //this.stones.geometry.computeVertexNormals();
        console.timeEnd('宝石拼接');
        console.time('合并宝石顶点');
        this.stones.geometry.mergeVertices();
        console.timeEnd('合并宝石顶点');
    }

    console.time('链子拼接');
    uniteModule.uniteChainsOld();
    console.timeEnd('链子拼接');

    if (null != this.meshFalang)
    {
        this.meshFalang.scale.copy(this.meshFirst.scale);
        this.meshFalang.position.copy(this.meshFirst.position);
        this.meshFalang.updateMatrix();
    }

    if (this.showing.lastParamlist.jewelID == 'star')
    {
        if (null != this.plateTFront)
        {
            this.plateTFront.scale.copy(this.meshFirst.scale);
            this.plateTFront.position.add(this.meshFirst.position);
            this.plateTFront.updateMatrix();
        }

        if (null != this.plateTBack)
        {
            this.plateTBack.scale.copy(this.meshFirst.scale);
            this.plateTBack.position.add(this.meshFirst.position);
            this.plateTBack.updateMatrix();
        }
    }

    var meshWidth = Math.abs(this.meshFirst.geometry.boundingBox.max.x - this.meshFirst.geometry.boundingBox.min.x);
    var meshHeight = Math.abs(this.meshFirst.geometry.boundingBox.max.y - this.meshFirst.geometry.boundingBox.min.y);
    meshWidth = Math.max(meshWidth, meshHeight);
    if (this.showing.lastParamlist.jewelID == 'ring')
        var cameraDist = Math.max(45, meshWidth*1.0);
    else if (this.showing.lastParamlist.jewelID == 'star')
        var cameraDist = Math.max(45, meshWidth*1.0);
    else
        var cameraDist = Math.max(45, meshWidth*1.0);

    var cameraX = this.meshFirst.position.x + cameraDist;
    if (this.showing.lastParamlist.jewelID == 'ring' || this.showing.lastParamlist.jewelID == 'brace')
    {
        var cameraY = this.meshFirst.position.y + cameraDist * 0.4;
        this.showing.controls.target.y = 0;
        this.showing.controlsShowall.target.y = 0;
    }
    else if (this.showing.lastParamlist.jewelID == 'neck')
    {
        var cameraY = this.meshFirst.position.y - meshHeight * 0.5;
        this.showing.controls.target.y = cameraY;
        this.showing.controlsShowall.target.y = cameraY;
    }
    else
    {
        var cameraY = 0;
        this.showing.controls.target.y = 0;
        this.showing.controlsShowall.target.y = 0;
    }

    this.showing.camera.position.set(cameraX * 25, cameraY * 25, 0);
    this.showing.cameraShowall.position.set(0, cameraY * 25, cameraX * 25);
}

SHOWING.prototype.DoUniteOld = function()
{
    if(this.reloadFlag != 'unite')
        return false;

    if (!this.CheckLoadTask())
        return false;

    if (!this.CheckStarResLoad())
        return false;

    console.log('DoUniteOld:' + this.lastParamlist.jewelID + ', linkstyle:' + this.lastParamlist.linkstyle + ', text:' + this.lastParamlist.text);

    this.reloadFlag = 'waiting';

    this.meshUnionArray[0].DoUniteOld();

    console.time('总时间');

    this.correctCaptureCams(this.camera.position.x, this.camera.position.y, 0, this.controls.target.y);

    this.DoUniteModelShowAll();
    this.DoUniteChainsShowAll();

    console.timeEnd('总时间');
    this.reloadFlag = 'no';

    if (undefined != this.onLoadOver && null != this.onLoadOver)
        this.onLoadOver();

    this.meshArray = null;

    if (this.isShowall)
        this.ShowAll();
    else
        this.ShowPart();

    /*setTimeout(function() {
        this.capturePicture(this.lastParamlist.jewelID + this.lastParamlist.linkstyle + this.lastParamlist.bodycolor + '.png');
    }.bind(this), 1000);*/
    //uniteModule.changeStarPlateSign(image);
    //uniteModule.changeStarPlatePicture(image);
    //var textureLoader = new THREE.TextureLoader();
    //var texture1 = textureLoader.load( image.src );



    //var helper0 = new THREE.BoxHelper(this.meshFirst, 0xff0000);
    //helper0.update();
    //this.scene.add(helper0);
    /*var helperW = new THREE.WireframeHelper(this.meshSymbols, 0x00ff00);
    helperW.scale.copy(this.meshSymbols.scale);
    helperW.rotation.copy(this.meshSymbols.rotation);
    helperW.position.copy(this.meshSymbols.position);
    //this.scene.add(helperW);

    //FaceNormalsHelper
    //VertexNormalsHelper
    if (undefined != this.helperL)
        this.scene.remove(this.helperL);
    this.helperL = new THREE.VertexNormalsHelper(this.meshSymbols, 1, 0xff0000);
    this.helperL.scale.copy(this.meshSymbols.scale);
    this.helperL.rotation.copy(this.meshSymbols.rotation);
    this.helperL.position.copy(this.meshSymbols.position);
    this.scene.add(this.helperL);*/
    //var files = this.GetFileData();
    //var content = files[0].content;
    //var leng = content.length;
    //console.log("export obj length:" + leng/1024/1024);

    //console.log("vols:" + this.GetVolume());
    //console.log("area:" + this.GetSuperArea());
    return true;
}

SHOWING.prototype.correctCaptureCams = function(cameraX, cameraY, cameraZ, targetY)
{
    if (undefined != this.cameraCap && null != this.cameraCap)
    {
        this.cameraCap.position.set(cameraX, cameraY, cameraZ);
    }

    if (undefined != this.cameraCap2 && null != this.cameraCap2)
    {
        this.cameraCap2.position.set( - cameraX, cameraY, cameraZ);
    }

    //正面斜上方
    if (undefined != this.cameraCap3 && null != this.cameraCap3)
    {
        this.cameraCap3.position.set( cameraX*0.766, cameraY + cameraX*0.643, cameraZ);
    }

    //左前方
    if (undefined != this.cameraCap4 && null != this.cameraCap4)
    {
        this.cameraCap4.position.set( cameraX*0.707, cameraY + cameraX*0.707, cameraZ + cameraX*0.707);
    }

    //右前方
    if (undefined != this.cameraCap5 && null != this.cameraCap5)
    {
        this.cameraCap5.position.set( cameraX*0.707, cameraY + cameraX*0.707, cameraZ - cameraX*0.707);
    }

    this.cameraCap.lookAt(new THREE.Vector3(0, targetY, 0));
    this.cameraCap2.lookAt(new THREE.Vector3(0, targetY, 0));
    this.cameraCap3.lookAt(new THREE.Vector3(0, targetY, 0));
    this.cameraCap4.lookAt(new THREE.Vector3(0, targetY, 0));
    this.cameraCap5.lookAt(new THREE.Vector3(0, targetY, 0));
}

MeshUnion.prototype.MergeAllExportMesh = function()
{
    if (null != this.meshWhole && undefined != this.meshWhole)
        return;

    this.meshWhole = new THREE.Mesh(new THREE.Geometry(), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);
    if (this.showing.IsNewStyle(this.showing.lastParamlist.jewelID, this.showing.lastParamlist.linkstyle)) {
        if (null != this.meshMain)
            this.meshWhole.geometry.merge(this.meshMain.geometry, this.meshMain.matrix);
        if (null != this.meshMainSymbols)
            this.meshWhole.geometry.merge(this.meshMainSymbols.geometry, this.meshMainSymbols.matrix);
        if (null != this.meshSymbols)
            this.meshWhole.geometry.merge(this.meshSymbols.geometry, this.meshSymbols.matrix);
        this.meshWhole.geometry.mergeVertices();

        if (null != this.meshSymbols2 || null != this.meshMain2)
        {
            this.meshWhole2 = new THREE.Mesh(new THREE.Geometry(), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);

            if (null != this.meshMain2)
                this.meshWhole2.geometry.merge(this.meshMain2.geometry, this.meshMain2.matrix);
            if (null != this.meshSymbols2)
                this.meshWhole2.geometry.merge(this.meshSymbols2.geometry, this.meshSymbols2.matrix);
        }
    }
    else
    {
        if (null != this.meshFirst)
            this.meshWhole.geometry.merge(this.meshFirst.geometry, this.meshFirst.matrix);
        if (null != this.meshSymbols)
            this.meshWhole.geometry.merge(this.meshSymbols.geometry, this.meshSymbols.matrix);
    }
}

MeshUnion.prototype.GetVolume = function()
{
    if (undefined == this.meshWhole2 || null == this.meshWhole2)
        return THREE.MeshVolume.GetVolume(this.meshWhole);
    else
        return THREE.MeshVolume.GetVolume(this.meshWhole) + THREE.MeshVolume.GetVolume(this.meshWhole2);
}

SHOWING.prototype.GetVolume = function()
{
    if (this.reloadFlag != 'no')
        return 0;

    for(var i=0, il=this.meshUnionArray.length; i<il; i++)
    {
        this.meshUnionArray[i].MergeAllExportMesh();
    }

    var result = 0;
    for(var i=0, il=this.meshUnionArray.length; i<il; i++)
    {
        result += this.meshUnionArray[i].GetVolume();
    }
    return result;
}

SHOWING.prototype.GetSuperArea = function()
{
    if (this.reloadFlag != 'no')
        return 0;

    for(var i=0, il=this.meshUnionArray.length; i<il; i++)
    {
        this.meshUnionArray[i].MergeAllExportMesh();
    }

    var result = 0;
    for(var i=0, il=this.meshUnionArray.length; i<il; i++)
    {
        result += THREE.MeshVolume.SuperficialAreaOfMesh(this.meshUnionArray[i].meshWhole);
    }

    return result;
}

MeshUnion.prototype.GetFileData = function(files, exporter, matrixRot)
{
    if (null == this.meshWhole || undefined == this.meshWhole)
        return;

    this.meshWhole.geometry.applyMatrix(matrixRot);

    var result = exporter.parse(this.meshWhole);

    // var modelFile = {};
    // modelFile.content = result;
    // modelFile.name = 'model';
    // modelFile.type = 'stl';
    files.push(result);

    if (undefined != this.meshWhole2 && null != this.meshWhole) {
        this.meshWhole2.geometry.applyMatrix(matrixRot);
        var result = exporter.parse(this.meshWhole2);
        // var modelFile2 = {};
        // modelFile2.content = result;
        // modelFile2.name = 'model';
        // modelFile2.type = 'stl';
        files.push(result);
    }
}

SHOWING.prototype.GetFileData = function()
{
    if (this.reloadFlag != 'no')
        return null;

    for(var i=0, il=this.meshUnionArray.length; i<il; i++)
    {
        this.meshUnionArray[i].MergeAllExportMesh();
    }

    var files = new Array();
    var exporter = new THREE.STLExporterNew();
    var matrixRot = new THREE.Matrix4();

    matrixRot.makeRotationAxis(new THREE.Vector3(0, 1, 0), - Math.PI / 2);

    for(var i=0, il=this.meshUnionArray.length; i<il; i++)
    {
        this.meshUnionArray[i].GetFileData(files, exporter, matrixRot);
    }

    return files;
}

SHOWING.UniteModule = function(showing, meshUnion)
{
    this.showing = showing;
    this.meshUnion = meshUnion;

    this.circleYNeck = 0;
    this.circleYBrace = 0;
    this.circleZ = 0;
    this.rightCircleX = 0;
    this.leftCircleX = 0;

    this.stickfaceStart = 0;
    this.stickfaceEnd = 0;

    this.stickY_0 = 0;
    this.stickY_1 = 0;

    this.firstSymbolFaceStart = 0;
    this.firstSymbolFaceEnd = 0;
    this.finalSymbolFaceStart = 0;
    this.finalSymbolFaceEnd = 0;

    this.fontcfg = null;
    this.havecolor = false;

    this.firstSymbolFaceStart = 0;
    this.firstSymbolFaceEnd = 0;
    this.finalSymbolFaceStart = 0;
    this.finalSymbolFaceEnd = 0;
    this.maxSymbolBottomY = -1000;
    this.minSymbolTopY = 1000;
    this.aveSymbolBottomY = 0;
    this.aveSymbolTopY = 0;

    this.symbolCnt = 0;
}

SHOWING.UniteModule.prototype = {

    changeStarPlateSign:function(image){
        if (undefined != image && null != image) {

            image.onload = function() {
                this.showing.canvasSign.getContext("2d").drawImage(image,
                    this.showing.canvasSign.width / 2 - image.width / 2,
                    this.showing.canvasSign.height / 2 - image.height / 2);
            }.bind(this);
            if (image.width >0 && image.height >0)
            {
                image.onload();
            }
        }

        this.showing.mapSign = new THREE.Texture(this.showing.canvasSign);
        //this.showing.mapSign.premultiplyAlpha = true;
        this.showing.mapSign.needsUpdate = true;
        this.showing.mapSign.wrapS = this.showing.mapSign.wrapT = THREE.ClampToEdgeWrapping;
        this.showing.mapSign.repeat.set(1, 1);
        this.showing.mapSign.anisotropy = 1;//this.showing.renderer.getMaxAnisotropy();

        var signMat = new THREE.MeshBasicMaterial({map: this.showing.mapSign});
        signMat.transparent = true;
        signMat.blending = THREE.CustomBlending;
        signMat.blendSrc = THREE.SrcAlphaFactor;
        signMat.blendDst = THREE.OneMinusSrcAlphaFactor;
        signMat.blendEquation = THREE.AddEquation;
        signMat.needsUpdate = true;

        this.meshUnion.plateTFront.material = signMat;
    },

    changeStarPlatePicture:function(image){
        if (undefined != image && null != image) {

            image.onload = function() {
                this.showing.canvasPicture.getContext("2d").drawImage(image,
                    this.showing.canvasPicture.width / 2 - image.width / 2,
                    this.showing.canvasPicture.height / 2 - image.height / 2);
            }.bind(this);
            if (image.width >0 && image.height >0)
            {
                image.onload();
            }
        }

        this.showing.mapPicture = new THREE.Texture(this.showing.canvasPicture);
        //this.showing.mapPicture.premultiplyAlpha = true;
        this.showing.mapPicture.needsUpdate = true;
        this.showing.mapPicture.wrapS = this.showing.mapPicture.wrapT = THREE.ClampToEdgeWrapping;
        this.showing.mapPicture.repeat.set(1, 1);
        this.showing.mapPicture.anisotropy = 1; //this.showing.renderer.getMaxAnisotropy();

        var pictureMat = new THREE.MeshBasicMaterial({map: this.showing.mapPicture});
        pictureMat.transparent = true;
        pictureMat.blending = THREE.CustomBlending;
        pictureMat.blendSrc = THREE.SrcAlphaFactor;
        pictureMat.blendDst = THREE.OneMinusSrcAlphaFactor;
        pictureMat.blendEquation = THREE.AddEquation;
        pictureMat.needsUpdate = true;

        this.meshUnion.plateTBack.material = pictureMat;
    },

    uniteStarPlate:function(scale){
        this.meshUnion.MainStoneNum = 0;
        var offsetY = 0;
        var plate = this.showing.meshArray['plate0'].mesh;
        this.meshUnion.stones = this.showing.meshArray['plate1'].mesh;
        this.showing.jewelGroup.add(this.meshUnion.stones);
        plate.scale.set(scale,scale,scale);
        plate.position.set(0, offsetY, 0);
        plate.updateMatrix();

        this.meshUnion.meshFirst.geometry.mergeFast(plate.geometry, plate.matrix);
        this.showing.meshArray['plate0'] = null;

        this.meshUnion.stones.scale.set(scale,scale,scale);
        this.meshUnion.stones.rotation.copy(this.meshUnion.meshFirst.rotation);
        this.meshUnion.stones.position.set(0, offsetY, 0);
        this.meshUnion.stones.updateMatrix();
        this.meshUnion.stones.visible = true;

        this.meshUnion.stones.material = this.showing.matLibStone['' + this.showing.lastParamlist.stone];

        //正面签名
        if (undefined != this.showing.lastParamlist.sign && null != this.showing.lastParamlist.sign) {

            this.showing.lastParamlist.sign.onload = function() {
                this.showing.canvasSign.getContext("2d").drawImage(this.showing.lastParamlist.sign,
                    this.showing.canvasSign.width / 2 - this.showing.lastParamlist.sign.width / 2,
                    this.showing.canvasSign.height / 2 - this.showing.lastParamlist.sign.height / 2);
                this.showing.canvasSign.needsUpdate = true;
            }.bind(this);
            if (this.showing.lastParamlist.sign.width >0 && this.showing.lastParamlist.sign.height >0)
            {
                this.showing.lastParamlist.sign.onload();
            }
        }

        this.showing.mapSign = new THREE.Texture(this.showing.canvasSign);
        //this.showing.mapSign.premultiplyAlpha = true;
        this.showing.mapSign.needsUpdate = true;
        this.showing.mapSign.wrapS = this.showing.mapSign.wrapT = THREE.ClampToEdgeWrapping;
        this.showing.mapSign.repeat.set(1, 1);
        this.showing.mapSign.anisotropy = 1;//this.showing.renderer.getMaxAnisotropy();

        var signMat = new THREE.MeshBasicMaterial({map: this.showing.mapSign});
        signMat.transparent = true;
        signMat.blending = THREE.CustomBlending;
        signMat.blendSrc = THREE.SrcAlphaFactor;
        signMat.blendDst = THREE.OneMinusSrcAlphaFactor;
        signMat.blendEquation = THREE.AddEquation;
        signMat.needsUpdate = true;

        this.meshUnion.plateTFront = this.showing.meshArray['plate2'].mesh;
        this.meshUnion.plateTFront.scale.set(scale, scale, scale);
        this.meshUnion.plateTFront.rotation.copy(this.meshUnion.meshFirst.rotation);
        this.meshUnion.plateTFront.position.set(0.05, offsetY, 0);
        this.meshUnion.plateTFront.updateMatrix();
        this.meshUnion.plateTFront.material = signMat;
        this.meshUnion.plateTFront.visible = false;
        this.showing.jewelGroup.add(this.meshUnion.plateTFront);

        if (undefined != this.showing.lastParamlist.sign && null != this.showing.lastParamlist.sign) {
            this.meshUnion.plateTFront.visible = true;
        }

        if (null != this.showing.lastParamlist.starPlateText) {
            this.showing.lastParamlist.starPlateText.onload = function(){
                //this.showing.ChangePicture(this.showing.lastParamlist.picture, null, true);
                this.showing.canvasPicture.getContext("2d").drawImage(this.showing.lastParamlist.starPlateText,
                    this.showing.canvasPicture.width / 2 - this.showing.lastParamlist.starPlateText.width / 2,
                    this.showing.canvasPicture.height / 2 - this.showing.lastParamlist.starPlateText.height / 2);
            }.bind(this);
            if(this.showing.lastParamlist.starPlateText.width >0 && this.showing.lastParamlist.starPlateText.height >0)
            {
                this.showing.lastParamlist.starPlateText.onload();
            }
        }

        if (undefined != this.showing.lastParamlist.picture && null != this.showing.lastParamlist.picture) {
            //背面图案
            this.showing.lastParamlist.picture.onload = function() {
                //this.showing.ChangePicture(this.showing.lastParamlist.picture, null, true);
                this.showing.canvasPicture.getContext("2d").drawImage(this.showing.lastParamlist.picture,
                    this.showing.canvasPicture.width / 2 - this.showing.lastParamlist.picture.width / 2,
                    this.showing.canvasPicture.height / 2 - this.showing.lastParamlist.picture.height / 2);
            }.bind(this);

            if(this.showing.lastParamlist.picture.width >0 && this.showing.lastParamlist.picture.height >0)
            {
                this.showing.lastParamlist.picture.onload();
            }
        }

        this.showing.mapPicture = new THREE.Texture(this.showing.canvasPicture);
        //this.showing.mapPicture.premultiplyAlpha = true;
        this.showing.mapPicture.needsUpdate = true;
        this.showing.mapPicture.wrapS = this.showing.mapPicture.wrapT = THREE.ClampToEdgeWrapping;
        this.showing.mapPicture.repeat.set(1, 1);
        this.showing.mapPicture.anisotropy = 1;//this.showing.renderer.getMaxAnisotropy();

        var pictureMat = new THREE.MeshBasicMaterial({map: this.showing.mapPicture});
        pictureMat.transparent = true;
        pictureMat.blending = THREE.CustomBlending;
        pictureMat.blendSrc = THREE.SrcAlphaFactor;
        pictureMat.blendDst = THREE.OneMinusSrcAlphaFactor;
        pictureMat.blendEquation = THREE.AddEquation;
        pictureMat.needsUpdate = true;

        this.meshUnion.plateTBack = this.showing.meshArray['plate3'].mesh;
        this.meshUnion.plateTBack.scale.set(scale, scale, scale);
        this.meshUnion.plateTBack.rotation.copy(this.meshUnion.meshFirst.rotation);
        this.meshUnion.plateTBack.position.set(-0.05, offsetY, 0);
        this.meshUnion.plateTBack.updateMatrix();
        this.meshUnion.plateTBack.material = pictureMat;
        this.meshUnion.plateTBack.visible = true;
        this.showing.jewelGroup.add(this.meshUnion.plateTBack);
    },

    uniteChainsNew:function(changeCircle){

        var styleCfg = this.showing.styleCfgMap[this.showing.styleid];
        if(undefined == styleCfg)
            return;
        var chainidStr = '' + styleCfg['chainid'];
        if ('' == chainidStr.trim() )
            return;

        if ('no' == chainidStr.toLowerCase())
            return;

        var chainidArray = chainidStr.split('/');
        if (this.showing.lastParamlist.chainstyle > chainidArray.length)
            return;

        var chainid = chainidArray[this.showing.lastParamlist.chainstyle - 1];
        var chainCfg = this.showing.chainCfgMap[chainid];
        if (undefined == chainCfg)
            return;

        var chainLData = this.showing.meshArray['chain0'];
        var chainRData = this.showing.meshArray['chain1'];
        var circleLData = this.showing.meshArray['chain2'];
        var circleRData = this.showing.meshArray['chain3'];
        var tailLData = this.showing.meshArray['chain4'];
        var tailRData = this.showing.meshArray['chain5'];

        if (undefined != chainLData)
        {
            var chainL = chainLData.mesh;
            var chainLoffset = chainCfg['chainLoffset'].split('/');
            chainL.position.set(parseFloat(chainLoffset[0]), parseFloat(chainLoffset[1]), parseFloat(chainLoffset[2]));
            if (this.meshUnion.chainOffset != undefined && null != this.meshUnion.chainOffset)
                chainL.position.add(this.meshUnion.chainOffset);
            var chainLrot = chainCfg['chainLrot'].split('/');
            chainL.rotation.set(parseFloat(chainLrot[0])/180*Math.PI, parseFloat(chainLrot[1])/180*Math.PI, parseFloat(chainLrot[2])/180*Math.PI);
            var scale = parseFloat(chainCfg['chainLscale']);
            chainL.scale.set(scale, scale, scale);
            chainL.updateMatrix();
            this.meshUnion.meshChain.geometry.mergeFast(chainL.geometry, chainL.matrix);
            this.showing.meshArray['chain0'] = null;
        }

        if (undefined != chainRData)
        {
            var chainR = chainRData.mesh;
            var chainRoffset = chainCfg['chainRoffset'].split('/');
            chainR.position.set(parseFloat(chainRoffset[0]), parseFloat(chainRoffset[1]), parseFloat(chainRoffset[2]));
            if (this.meshUnion.chainOffset != undefined && null != this.meshUnion.chainOffset)
                chainR.position.add(this.meshUnion.chainOffset);
            var chainRrot = chainCfg['chainRrot'].split('/');
            chainR.rotation.set(parseFloat(chainRrot[0])/180*Math.PI, parseFloat(chainRrot[1])/180*Math.PI, parseFloat(chainRrot[2])/180*Math.PI);
            var scale = parseFloat(chainCfg['chainRscale']);
            chainR.scale.set(scale, scale, scale);
            chainR.updateMatrix();
            this.meshUnion.meshChain.geometry.mergeFast(chainR.geometry, chainR.matrix);
            this.showing.meshArray['chain1'] = null;
        }

        if (undefined != circleLData && changeCircle)
        {
            var circleL = circleLData.mesh;
            var circleLoffset = chainCfg['circleLoffset'].split('/');
            circleL.position.set(parseFloat(circleLoffset[0]), parseFloat(circleLoffset[1]), parseFloat(circleLoffset[2]));
            if (this.meshUnion.chainOffset != undefined && null != this.meshUnion.chainOffset)
                circleL.position.add(this.meshUnion.chainOffset);
            var circleLrot = chainCfg['circleLrot'].split('/');
            circleL.rotation.set(parseFloat(circleLrot[0])/180*Math.PI, parseFloat(circleLrot[1])/180*Math.PI, parseFloat(circleLrot[2])/180*Math.PI);
            circleL.updateMatrix();
            this.meshUnion.meshMain.geometry.mergeFast(circleL.geometry, circleL.matrix);
            this.showing.meshArray['chain2'] = null;
        }

        if (undefined != circleRData && changeCircle)
        {
            var circleR = circleRData.mesh;
            var circleRoffset = chainCfg['circleRoffset'].split('/');
            circleR.position.set(parseFloat(circleRoffset[0]), parseFloat(circleRoffset[1]), parseFloat(circleRoffset[2]));
            if (this.meshUnion.chainOffset != undefined && null != this.meshUnion.chainOffset)
                circleR.position.add(this.meshUnion.chainOffset);
            var circleRrot = chainCfg['circleRrot'].split('/');
            circleR.rotation.set(parseFloat(circleRrot[0])/180*Math.PI, parseFloat(circleRrot[1])/180*Math.PI, parseFloat(circleRrot[2])/180*Math.PI);
            circleR.updateMatrix();
            this.meshUnion.meshMain.geometry.mergeFast(circleR.geometry, circleR.matrix);
            this.showing.meshArray['chain3'] = null;
        }

        if (undefined != tailLData)
        {
            var tailL = tailLData.mesh;
            var tailLoffset = chainCfg['tailLoffset'].split('/');
            tailL.position.set(parseFloat(tailLoffset[0]), parseFloat(tailLoffset[1]), parseFloat(tailLoffset[2]));
            if (this.meshUnion.chainOffset != undefined && null != this.meshUnion.chainOffset)
                tailL.position.add(this.meshUnion.chainOffset);
            var tailLrot = chainCfg['tailLrot'].split('/');
            tailL.rotation.set(parseFloat(tailLrot[0])/180*Math.PI, parseFloat(tailLrot[1])/180*Math.PI, parseFloat(tailLrot[2])/180*Math.PI);
            tailL.updateMatrix();
            this.meshUnion.meshTail.geometry.mergeFast(tailL.geometry, tailL.matrix);
            this.showing.meshArray['chain4'] = null;
        }

        if (undefined != tailRData)
        {
            var tailR = tailRData.mesh;
            var tailRoffset = chainCfg['tailRoffset'].split('/');
            tailR.position.set(parseFloat(tailRoffset[0]), parseFloat(tailRoffset[1]), parseFloat(tailRoffset[2]));
            if (this.meshUnion.chainOffset != undefined && null != this.meshUnion.chainOffset)
                tailR.position.add(this.meshUnion.chainOffset);
            var tailRrot = chainCfg['tailRrot'].split('/');
            tailR.rotation.set(parseFloat(tailRrot[0])/180*Math.PI, parseFloat(tailRrot[1])/180*Math.PI, parseFloat(tailRrot[2])/180*Math.PI);
            tailR.updateMatrix();
            this.meshUnion.meshTail.geometry.mergeFast(tailR.geometry, tailR.matrix);
            this.showing.meshArray['chain5'] = null;
        }
    },

    uniteChainsOld:function(){
        //链子
        if (this.showing.lastParamlist.jewelID == 'neck')
        {
            this.meshUnion.chainL = this.showing.meshArray['chain0'].mesh;
            this.meshUnion.chainR = this.showing.meshArray['chain1'].mesh;
            this.meshUnion.chainL.material = this.meshUnion.chainR.material = this.showing.matLib['' + this.showing.lastParamlist.chaincolor];
            this.showing.chainGroup.add(this.meshUnion.chainL);
            this.showing.chainGroup.add(this.meshUnion.chainR);
        }
        else if (this.showing.lastParamlist.jewelID == 'brace')
        {
            this.meshUnion.chainL = this.showing.meshArray['chain0'].mesh;
            this.meshUnion.chainR = this.showing.meshArray['chain1'].mesh;
            this.meshUnion.chainL.material = this.meshUnion.chainR.material = this.showing.matLib['' + this.showing.lastParamlist.chaincolor];
            this.showing.jewelGroup.add(this.meshUnion.chainL);
            this.showing.jewelGroup.add(this.meshUnion.chainR);
        }
        else
            return;

        //设置链子的位置
        if (this.showing.lastParamlist.jewelID == 'brace')
        {
            var deltaX_l = this.leftCircleX - this.braceCenterX;
            var deltaX_r = this.rightCircleX - this.braceCenterX ;
            var theta_l = deltaX_l / this.radiusBrace;
            var theta_r = deltaX_r / this.radiusBrace;
            var newX_l = this.braceCenterX + this.radiusBrace * Math.sin(theta_l);
            var newX_r = this.braceCenterX + this.radiusBrace * Math.sin(theta_r);
            var newZ_l = this.meshUnion.meshFirst.position.x - this.radiusBrace + this.radiusBrace * Math.cos(theta_l);
            var newZ_r = this.meshUnion.meshFirst.position.x - this.radiusBrace + this.radiusBrace * Math.cos(theta_r);

            var rotateBase = Math.PI/2;
            var rotateDeltaL = deltaX_l / 25 * Math.PI/4;
            if (null != this.meshUnion.chainL) {
                this.meshUnion.chainL.scale.set(1.5, 1.5, 1.5);
                this.meshUnion.chainL.rotation.set(0, rotateBase + rotateDeltaL , 0);
                this.meshUnion.chainL.position.set(newZ_l, this.meshUnion.meshFirst.position.y + this.circleYBrace,
                    this.meshUnion.meshFirst.position.z - newX_l);
            }

            var rotateDeltaR = deltaX_r / 25 * Math.PI/4;
            if (null != this.meshUnion.chainR){
                this.meshUnion.chainR.scale.set(1.5, 1.5, 1.5);
                this.meshUnion.chainR.rotation.set(0, rotateBase + rotateDeltaR, 0);
                this.meshUnion.chainR.position.set(newZ_r, this.meshUnion.meshFirst.position.y + this.circleYBrace,
                    this.meshUnion.meshFirst.position.z - newX_r);
            }
        }
        else if (this.showing.lastParamlist.jewelID == 'neck')
        {
            if (null != this.meshUnion.chainL)
            {
                this.meshUnion.chainL.rotation.set(-Math.PI * 0.4, Math.PI / 2, 0);

                this.meshUnion.chainL.position.set(this.meshUnion.meshFirst.position.x + this.circleZ,
                    this.meshUnion.meshFirst.position.y + this.circleYNeck,
                    this.meshUnion.meshFirst.position.z - this.leftCircleX);
            }

            if (null != this.meshUnion.chainR)
            {
                if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jianshi)
                    var offsetZ = 0.5;
                else
                    var offsetZ = 0;
                this.meshUnion.chainR.rotation.set(Math.PI * 0.4, Math.PI / 2, 0);
                this.meshUnion.chainR.position.set(this.meshUnion.meshFirst.position.x + this.circleZ,
                    this.meshUnion.meshFirst.position.y + this.circleYNeck,
                    this.meshUnion.meshFirst.position.z - this.rightCircleX - offsetZ);
            }
        }

        //this.showing.chainL.material = this.showing.matLib[3];
        //this.showing.chainR.material = this.showing.matLib[3];
    },

    uniteCircles:function()
    {
        var circleScale = 1.25;
        var circleL = this.showing.meshArray['circle0'].mesh;
        circleL.scale.set(circleScale, circleScale, 1);

        if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.zidan)
            var circleR = null;
        else {
            var circleR = this.showing.meshArray['circle1'].mesh;
            circleR.scale.set(circleScale, circleScale, 1);
        }

        var circleY = 0;
        //拼接挂环
        if(this.showing.lastParamlist.jewelID == "brace") {
            if (undefined == this.circleYBrace)
                circleY = 0.5 * this.aveSymbolTopY + 0.5 * this.aveSymbolBottomY;
            else
                circleY = this.circleYBrace;

        }
        else
        {
            if (undefined != this.circleYNeck)
                circleY = this.circleYNeck;
            else
                circleY = 0.8 * this.aveSymbolTopY + 0.2 * this.aveSymbolBottomY;
        }

        //     if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jianjie ||
        //         this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.gougou)
        //     {
        //         this.circleY = (this.aveSymbolBottomY + this.aveSymbolTopY) / 2;
        //     }
        //     else if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.maomi)
        //     {
        //     }
        //     else
        //         this.circleY = 0.5 * this.stickY_0 + 0.5 * this.stickY_1;
        // }
        // else{
        //
        // }

        if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jianjie ||
            (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jiaxin && this.showing.lastParamlist.jewelID == "brace")) {
            this.circleZ = (this.meshUnion.meshSymbols.geometry.boundingBox.max.z + this.meshUnion.meshSymbols.geometry.boundingBox.min.z) / 2;

            circleL.geometry.computeBoundingBox();
            circleL.position.set(0, circleY, this.circleZ);

            var mergeDistL = this.showing.getMergeDistance(this.meshUnion.meshSymbols.geometry, circleL.geometry,
                this.firstSymbolFaceStart, this.firstSymbolFaceEnd, false, this.meshUnion.meshSymbols.scale, circleL.scale,
                this.meshUnion.meshSymbols.position, circleL.position, 2.0);

            this.leftCircleX = this.meshUnion.meshSymbols.position.x + mergeDistL;
            // this.leftCircleX = this.showing.getMeshEdgeX(this.showing.meshSymbols.geometry, this.showing.meshSymbols.scale,
            //     this.circleY - circleHeight * 0.5, this.circleY + circleHeight * 0.5, this.firstSymbolFaceStart, this.firstSymbolFaceEnd, false);

            if (null != circleR) {
                circleR.geometry.computeBoundingBox();
                circleR.position.set(0, circleY, this.circleZ);
                var mergeDistR = this.showing.getMergeDistance(this.meshUnion.meshSymbols.geometry, circleR.geometry,
                    this.finalSymbolFaceStart, this.finalSymbolFaceEnd, true, this.meshUnion.meshSymbols.scale, circleR.scale,
                    this.meshUnion.meshSymbols.position, circleR.position, 2.0);
                this.rightCircleX = this.meshUnion.meshSymbols.position.x - mergeDistR;
                // this.rightCircleX = this.showing.getMeshEdgeX(this.showing.meshSymbols.geometry, this.showing.meshSymbols.scale,
                //     this.circleY - circleHeight * 0.5, this.circleY + circleHeight * 0.5, this.finalSymbolFaceStart, this.finalSymbolFaceEnd, true);
            }
        }
        else if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.zidan )
        {
            this.leftCircleX = this.rightCircleX = 0.5 * this.meshUnion.meshFirst.geometry.boundingBox.max.x +
                0.5 * this.meshUnion.meshFirst.geometry.boundingBox.min.x;
        }
        else
        {
            circleL.geometry.computeBoundingBox();
            circleL.position.set(0, circleY, this.circleZ);

            var mergeDistL = this.showing.getMergeDistance(this.meshUnion.meshFirst.geometry, circleL.geometry,
                this.stickfaceStart, this.stickfaceEnd, false, this.meshUnion.meshSymbols.scale, circleL.scale,
                this.meshUnion.meshSymbols.position, circleL.position, 2.5);

            this.leftCircleX = this.meshUnion.meshFirst.position.x + mergeDistL;

            if (null != circleR) {
                circleR.geometry.computeBoundingBox();
                circleR.position.set(0, circleY, this.circleZ);
                var mergeDistR = this.showing.getMergeDistance(this.meshUnion.meshFirst.geometry, circleR.geometry,
                    this.stickfaceStart, this.stickfaceEnd, true, this.meshUnion.meshSymbols.scale, circleR.scale,
                    this.meshUnion.meshSymbols.position, circleR.position, 2.5);
                this.rightCircleX = this.meshUnion.meshFirst.position.x - mergeDistR;
            }

            /*this.rightCircleX = this.showing.getMeshEdgeX(this.showing.meshFirst.geometry, this.showing.meshFirst.scale,
                this.circleY, this.circleY, this.stickfaceStart, this.stickfaceEnd, true);
            this.leftCircleX = this.showing.getMeshEdgeX(this.showing.meshFirst.geometry, this.showing.meshFirst.scale,
                this.circleY, this.circleY, this.stickfaceStart, this.stickfaceEnd, false);
            var widthCircle = circleScale * Math.abs(circleL.geometry.boundingBox.max.x - circleL.geometry.boundingBox.min.x);
            this.leftCircleX -= widthCircle * 0.3;
            this.rightCircleX += widthCircle * 0.3;*/
        }

        //拼接环
        if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.zidan){
            var heightCircle = circleScale * Math.abs(circleL.geometry.boundingBox.max.y - circleL.geometry.boundingBox.min.y);
            circleY += heightCircle * 0.1;
        }

        circleL.position.set(this.leftCircleX, circleY, this.circleZ);
        circleL.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(circleL.geometry, circleL.matrix);

        if (null != circleR) {
            circleR.position.set(this.rightCircleX, circleY, this.circleZ);
            circleR.updateMatrix();
            this.meshUnion.meshFirst.geometry.mergeFast(circleR.geometry, circleR.matrix);
        }

        this.showing.meshArray['circle0'] = null;
        this.showing.meshArray['circle1'] = null;
        this.meshUnion.meshFirst.geometry.computeBoundingBox();
    },

    uniteSymbolsOld:function(symbolScale, DEPTH_NEED)
    {
        var firstSymbol = true;
        var prevFaceLength = 0;

        var needInterect = parseInt(this.linkcfg['interect']) > 0;

        if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.zidan)
            var interval = 0.75;
        else
            var interval = needInterect ?
                parseFloat(this.fontcfg['Interval_nolink']) :
                parseFloat(this.fontcfg['Interval_link']);

        this.high1 = -1000;
        this.high2 = -1000;
        this.low1 = 1000;
        this.low2 = 1000;
        var sumSymbolBottomY = 0;
        var sumSymbolTopY = 0;
        var maxSysmbols = 12;

        var sumSymbolHeight = 0;
        var sumSymbolWidth = 0;
        var matrixRot;
        if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.zidan) {
            //var matrixRot = new THREE.Matrix4();
            //matrixRot.makeRotationAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
        }
        for (var i = 0; i < maxSysmbols; i++)
        {
            var meshData = this.showing.meshArray['symbol' + this.meshUnion.unionid + '_' + i];
            if (undefined == meshData || null == meshData)
                break;

            if (meshData.meshType != 'symbol')
                break;

            var currMesh = meshData.mesh;

            if (matrixRot != undefined) {
                currMesh.geometry.applyMatrix(matrixRot);
            }

            currMesh.geometry.computeBoundingBox();
            var HEIGHT_X = Math.abs(currMesh.geometry.boundingBox.max.y - currMesh.geometry.boundingBox.min.y) * 1;
            sumSymbolHeight += HEIGHT_X;

            var WIDTH_X = Math.abs(currMesh.geometry.boundingBox.max.x - currMesh.geometry.boundingBox.min.x) * 1;
            sumSymbolWidth += WIDTH_X;
            this.symbolCnt ++;
        }

        this.aveSymbolHeight = this.symbolCnt == 0 ? 0 : (sumSymbolHeight / this.symbolCnt);
        this.aveSymbolWidth = this.symbolCnt == 0 ? 0 : (sumSymbolWidth / this.symbolCnt);

        if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.zidan)
            var whscale = 4.0 / this.aveSymbolHeight;
        else
            var whscale = (this.showing.lastParamlist.jewelID == 'ring' ? 4.0 : 7.0) / this.aveSymbolHeight;

        symbolScale.x *= whscale;
        symbolScale.y *= whscale;

        this.circleYNeck = 1000;
        for (var i = 0; i < maxSysmbols; i++)
        {
            var meshData = this.showing.meshArray['symbol' + this.meshUnion.unionid + '_' + i];
            if (undefined == meshData || null == meshData)
                break;

            if (meshData.meshType != 'symbol')
                break;

            var currMesh = meshData.mesh;

            //this.finalSymbolWidth = Math.abs(currMesh.geometry.boundingBox.max.x - currMesh.geometry.boundingBox.min.x) * symbolScale.x;
            this.finalSymbolFaceStart = this.meshUnion.meshSymbols.geometry.faces.length;
            this.finalSymbolFaceEnd = this.finalSymbolFaceStart + currMesh.geometry.faces.length;

            var DEPTH_ORIG_X = Math.abs(currMesh.geometry.boundingBox.max.z - currMesh.geometry.boundingBox.min.z);
            symbolScale.z = DEPTH_NEED / DEPTH_ORIG_X;

            if (firstSymbol) {
                firstSymbol = false;
                //this.firstSymbolWidth = Math.abs(currMesh.geometry.boundingBox.max.x - currMesh.geometry.boundingBox.min.x) * symbolScale.x;

                this.firstSymbolFaceStart = 0;
                this.firstSymbolFaceEnd = currMesh.geometry.faces.length;

                //if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.piaoliu)
                //    currMesh.position.set(-currMesh.geometry.boundingBox.min.x * symbolScale.x,
                //        -currMesh.geometry.boundingBox.min.y * symbolScale.y, 0);
                //else
                currMesh.position.set(-currMesh.geometry.boundingBox.min.x * symbolScale.x, 0, 0);
            }
            else {

                //if(this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.piaoliu)
                //    currMesh.position.set(0, -currMesh.geometry.boundingBox.min.y * symbolScale.y, 0);
                //else
                currMesh.position.set(0, 0, 0);

                //智能拼接
                var mergeDist = this.showing.getMergeDistance(this.meshUnion.meshSymbols.geometry, currMesh.geometry,
                    prevFaceLength, this.meshUnion.meshSymbols.geometry.faces.length, true, this.meshUnion.meshSymbols.scale, symbolScale,
                    this.meshUnion.meshSymbols.position, currMesh.position, 1.0);
                currMesh.position.x = -mergeDist + interval * symbolScale.x;
            }

            var thisHigh = currMesh.geometry.boundingBox.max.y * symbolScale.y;
            var thisLow = currMesh.geometry.boundingBox.min.y * symbolScale.y;
            this.minSymbolTopY = Math.min(thisHigh, this.minSymbolTopY);
            this.maxSymbolBottomY = Math.max(thisLow, this.maxSymbolBottomY);

            sumSymbolBottomY += currMesh.geometry.boundingBox.min.y * symbolScale.y;
            sumSymbolTopY += currMesh.geometry.boundingBox.max.y * symbolScale.y;

            if (thisHigh > this.high1)
            {
                this.high2 = this.high1;
                this.high1 = thisHigh;
            }
            else if (thisHigh > this.high2)
                this.high2 = thisHigh;

            if (thisLow < this.low1)
            {
                this.low2 = this.low1;
                this.low1 = thisLow;
            }
            else if (thisLow < this.low2)
                this.low2 = thisLow;

            currMesh.scale.copy(symbolScale);
            currMesh.updateMatrix();

            if (this.showing.lastParamlist.jewelID == "neck")
                this.circleYNeck = Math.min(this.circleYNeck, 0.8 * currMesh.geometry.boundingBox.max.y*symbolScale.y +
                    0.2 * currMesh.geometry.boundingBox.min.y * symbolScale.y);

            prevFaceLength = this.meshUnion.meshSymbols.geometry.faces.length;
            this.meshUnion.meshSymbols.geometry.mergeFast(currMesh.geometry, currMesh.matrix);
            this.meshUnion.meshSymbols.geometry.computeBoundingBox();
            this.showing.meshArray['symbol' + this.meshUnion.unionid + '_' + i] = null;

            //拼接珐琅
            if (this.havecolor && this.showing.lastParamlist.color != this.showing.FalangColor.no && null != this.meshUnion.meshFalang)
            {
                var falangMeshData = this.showing.meshArray['falang' + this.meshUnion.unionid + '_' + i];
                if (undefined != falangMeshData && null != falangMeshData)
                {
                    var falangMesh = falangMeshData.mesh;
                    if (matrixRot != undefined) {
                        falangMesh.geometry.applyMatrix(matrixRot);
                    }
                    falangMesh.position.copy(currMesh.position);
                    falangMesh.scale.copy(currMesh.scale);
                    falangMesh.updateMatrix();
                    this.meshUnion.meshFalang.geometry.mergeFast(falangMesh.geometry, falangMesh.matrix);
                    this.meshUnion.meshFalang.geometry.computeBoundingBox();
                }
                this.showing.meshArray['falang' + this.meshUnion.unionid + '_' + i] = null;
            }

            //拼接宝石
            for(var j=1; j<=5; j++) {
                var stoneMeshData = this.showing.meshArray['stone' + j + '_' + this.meshUnion.unionid + '_' + i];
                if (undefined != stoneMeshData && null != stoneMeshData) {
                    var stoneMesh = stoneMeshData.mesh;
                    if (null == this.meshUnion.stones) {
                        this.meshUnion.stones = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0),
                            this.showing.matLibStone['' + this.showing.lastParamlist.stone]);
                        this.meshUnion.stones.rotation.copy(this.meshUnion.meshSymbols.rotation);
                        this.meshUnion.stones.position.copy(this.meshUnion.meshSymbols.position);
                        this.meshUnion.stones.scale.copy(this.meshUnion.meshSymbols.scale);
                        this.showing.jewelGroup.add(this.meshUnion.stones);
                    }

                    if (matrixRot != undefined) {
                        stoneMesh.geometry.applyMatrix(matrixRot);
                    }

                    stoneMesh.scale.copy(currMesh.scale);
                    stoneMesh.rotation.copy(currMesh.rotation);
                    stoneMesh.position.copy(currMesh.position);
                    stoneMesh.updateMatrix();
                    this.meshUnion.stones.geometry.mergeFast(stoneMesh.geometry, stoneMesh.matrix);
                }
            }
        }

        if (this.symbolCnt == 1) {
            this.high2 = this.high1;
            this.low2 = this.low1;
        }

        this.aveSymbolBottomY = this.symbolCnt == 0 ? 0 :(sumSymbolBottomY / this.symbolCnt);
        this.aveSymbolTopY = this.symbolCnt == 0 ? 0 :(sumSymbolTopY / this.symbolCnt);
        this.circleYBrace = 0.5 * this.aveSymbolBottomY + 0.5 * this.aveSymbolTopY;
        this.meshUnion.meshSymbols.geometry.computeBoundingBox();

        //this.symbolLength = Math.abs(this.showing.meshFirst.geometry.boundingBox.max.x - this.showing.meshFirst.geometry.boundingBox.min.x);
        //this.symbolDepth = Math.abs(this.showing.meshFirst.geometry.boundingBox.max.z - this.showing.meshFirst.geometry.boundingBox.min.z);
        //var symbolHeight = Math.abs(this.meshFirst.geometry.boundingBox.max.y - this.meshFirst.geometry.boundingBox.min.y);

        return symbolScale;
    },

    uniteMain:function()
    {
        if (this.showing.lastParamlist.jewelID == 'ring')
        {
            this.uniteRingMain();
        }
        else if (this.showing.lastParamlist.jewelID == 'brace')
        {
            this.uniteBraceMain();
        }
        else if (this.showing.lastParamlist.jewelID == 'neck' || this.showing.lastParamlist.jewelID == 'ear')
        {
            this.uniteNecklaceOrEarMain();
        }

        //挂环
        if (this.showing.lastParamlist.jewelID == 'neck' || this.showing.lastParamlist.jewelID == 'brace') {
            console.time('挂环拼接');
            this.uniteCirclesNew();
            console.timeEnd('挂环拼接');
        }
    },

    uniteNecklaceOrEarMain:function()
    {
        var orderArray = this.showing.stylecompCfgMap[this.showing.styleid][this.meshUnion.unionid];
        if (undefined == orderArray)
            return;

        this.meshUnion.MainStoneNum = 0;
        for (var order in orderArray)
        {
            var meshDataComp = this.showing.meshArray['neck' + this.meshUnion.unionid + '_' + order];
            if (undefined == meshDataComp || null == meshDataComp)
                continue;

            var compCfgData = orderArray[order];
            var type = compCfgData['type'].toLowerCase();

            //可变长度组件的判断
            var tmpVarLength = compCfgData['varlength'];
            if (undefined != this.myVarLength && this.myVarLength > 0 && undefined != tmpVarLength && tmpVarLength != '') {
                var varlength = parseFloat(compCfgData['varlength']);
                //略过长度不对的组件
                if (varlength != this.myVarLength)
                    continue;
            }

            var offsetArray = compCfgData['offset'].split('/');
            var scaleArray = compCfgData['scale'].split('/');
            var rotateArray = compCfgData['rotate'].split('/');

            var meshComp = meshDataComp.mesh;
            meshComp.position.set(parseFloat(offsetArray[0]), parseFloat(offsetArray[1]), parseFloat(offsetArray[2]));
            meshComp.scale.set(parseFloat(scaleArray[0]), parseFloat(scaleArray[1]), parseFloat(scaleArray[2]));
            meshComp.rotation.set(parseFloat(rotateArray[0])/180*Math.PI, parseFloat(rotateArray[1])/180*Math.PI, parseFloat(rotateArray[2])/180*Math.PI);
            meshComp.geometry.computeBoundingBox();

            //判断生效条件
            var condition1 = compCfgData['condition1'].trim();
            if ('sym exist' == condition1)
            {
                if (undefined == this.meshUnion.symboltext || '' == this.meshUnion.symboltext)
                    continue;
            }

            //根据"挂点"修正自己的坐标
            var attach_groupname = compCfgData['attach_group'].trim();
            if (attach_groupname != '')
                var attach_compData = this.showing.getCompData(this.meshUnion, attach_groupname);
            else
                var attach_compData = null;
            if (undefined != attach_compData && null != attach_compData)
            {
                var attachpointArray = attach_compData['be_attach_point'].split('/');
                if (attachpointArray.length >= 3)
                {
                    meshComp.position.x += parseFloat(attachpointArray[0]);
                    meshComp.position.y += parseFloat(attachpointArray[1]);
                    meshComp.position.z += parseFloat(attachpointArray[2]);
                }

                // var offsetArray = attach_compData['offset'].split('/');
                // if (offsetArray.length >= 3)
                // {
                //     meshComp.position.x += parseFloat(offsetArray[0]);
                //     meshComp.position.y += parseFloat(offsetArray[1]);
                //     meshComp.position.z += parseFloat(offsetArray[2]);
                // }
            }

            var symlengthArray = compCfgData['symlength'].split('/');
            if (symlengthArray.length >= 3) {
                var symlenX = parseFloat(symlengthArray[0]);
                var symlenY = parseFloat(symlengthArray[1]);
                var symlenZ = parseFloat(symlengthArray[2]);
                if (symlenX > 0) {
                    var meshCompWidth = Math.abs(meshComp.geometry.boundingBox.max.x - meshComp.geometry.boundingBox.min.x);
                    meshComp.scale.x = this.symbolLength * symlenX / meshCompWidth;
                }

                if (symlenY > 0) {
                    var meshCompHeight = Math.abs(meshComp.geometry.boundingBox.max.y - meshComp.geometry.boundingBox.min.y);
                    meshComp.scale.y = this.symbolLength * symlenY / meshCompHeight;
                }

                if (symlenZ > 0) {
                    var meshCompDepth = Math.abs(meshComp.geometry.boundingBox.max.z - meshComp.geometry.boundingBox.min.z);
                    meshComp.scale.z = this.symbolLength * symlenZ / meshCompDepth;
                }
            }

            meshComp.updateMatrix();
            meshComp.geometry.applyMatrix(meshComp.matrix);

            if (this.showing.lastParamlist.mainstone > 0 && type == 'body')  //镶嵌宝石
            {
                var meshDataStone = this.showing.meshArray['neckstone' + this.meshUnion.unionid + '_' + order];
                if (undefined != meshDataStone && null != meshDataStone)
                {
                    var meshStone = meshDataStone.mesh;
                    meshStone.geometry.applyMatrix(meshComp.matrix);
                }
                else
                    var meshStone = null;
            }
            else
                var meshStone = null;

            meshComp.position.set(0,0,0);
            meshComp.scale.set(1,1,1);
            meshComp.rotation.set(0,0,0);
            meshComp.updateMatrix();

            //模型位置是否紧贴字母的某个方向
            var linkchain = 'yes' == compCfgData['linkchain'].toLowerCase();
            var symdir = compCfgData['symdir'];
            if ('' != symdir)
            {
                var offsetX=0, offsetY=0, offsetZ = 0;

                if ('down' == symdir) {
                    var mergeDist = this.showing.getMergeDistanceVert(this.meshUnion.meshSymbols.geometry, meshComp.geometry,
                        this.firstSymbolFaceStart, this.firstSymbolFaceEnd, false, this.meshUnion.meshSymbols.scale, meshComp.scale,
                        this.meshUnion.meshSymbols.position, meshComp.position, 1.0);
                    offsetY -= mergeDist;
                }
                else if ('up' == symdir)
                {
                    var mergeDist = this.showing.getMergeDistanceVert(this.meshUnion.meshSymbols.geometry, meshComp.geometry,
                        this.finalSymbolFaceStart, this.finalSymbolFaceEnd, true, this.meshUnion.meshSymbols.scale, meshComp.scale,
                        this.meshUnion.meshSymbols.position, meshComp.position, 1.0);
                    offsetY -= mergeDist;
                }
                else if ('left' == symdir)
                {
                    var mergeDist = this.showing.getMergeDistance(this.meshUnion.meshSymbols.geometry, meshComp.geometry,
                        this.finalSymbolFaceStart, this.finalSymbolFaceEnd, true, this.meshUnion.meshSymbols.scale, meshComp.scale,
                        this.meshUnion.meshSymbols.position, meshComp.position, 1.0);
                    offsetX -= mergeDist;
                }
                else if ('right' == symdir)
                {
                    var mergeDist = this.showing.getMergeDistance(this.meshUnion.meshSymbols.geometry, meshComp.geometry,
                        this.firstSymbolFaceStart, this.firstSymbolFaceEnd, false, this.meshUnion.meshSymbols.scale, meshComp.scale,
                        this.meshUnion.meshSymbols.position, meshComp.position, 1.0);
                    offsetX -= mergeDist;
                }

                meshComp.position.x += offsetX;
                meshComp.position.y += offsetY;
                meshComp.position.z += offsetZ;

                if (linkchain)
                {
                    if (this.meshUnion.chainOffset == undefined || null == this.meshUnion.chainOffset)
                        this.meshUnion.chainOffset = new THREE.Vector3(offsetX, offsetY, offsetZ);
                    else{
                        this.meshUnion.chainOffset.x += offsetX;
                        this.meshUnion.chainOffset.y += offsetY;
                        this.meshUnion.chainOffset.z += offsetZ;
                    }
                }
            }
            else if (linkchain)
            {
                if (undefined != this.meshUnion.chainOffset && null != this.meshUnion.chainOffset)
                {
                    meshComp.position.add(this.meshUnion.chainOffset);
                }
            }

            meshComp.updateMatrix();

            if (type == 'body')
                this.meshUnion.meshMain.geometry.mergeFast(meshComp.geometry, meshComp.matrix);
            else if (type == 'stone')
                this.meshUnion.meshMainStones.geometry.mergeFast(meshComp.geometry, meshComp.matrix);
            else if (type == 'symbol')
                this.meshUnion.meshMainSymbols.geometry.mergeFast(meshComp.geometry, meshComp.matrix);
            else if (type == 'extra')
                this.meshUnion.meshExtra.geometry.mergeFast(meshComp.geometry, meshComp.matrix);
            else if (type == 'pearl')
                this.meshUnion.meshMainPearl.geometry.mergeFast(meshComp.geometry, meshComp.matrix);

            if (meshStone != undefined && meshStone != null)
            {
                this.meshUnion.meshMainStones.geometry.mergeFast(meshStone.geometry, meshComp.matrix);
            }

            if(this.showing.lastParamlist.mainstone > 0) {
                var stongnumStr = '' + compCfgData['stonenum'];
                if (stongnumStr.trim() != '')
                    this.meshUnion.MainStoneNum += parseInt(stongnumStr);
            }

            //在模型上印字
            if(compCfgData['text'].length > 0)
            {
                var text = compCfgData['text'];
                if (text == 'custom')
                    text = this.showing.lastParamlist.text;

                var texturesize = 512;
                if (compCfgData['texturesize'] > 0)
                    texturesize = parseInt(compCfgData['texturesize']);

                document.fonts.ready.then(function(_text, _texturesize, _meshComp) {
                    this.printText(_text, _texturesize, _meshComp);
                }.bind(this, text, texturesize, meshComp), function(){});
            }

            /*//修正字符串模型的位置
            if(compCfgData['linksymbol'].trim() == 'yes')
            {
                meshComp.position.set(parseFloat(offsetArray[0]), parseFloat(offsetArray[1]), parseFloat(offsetArray[2]));
                this.meshUnion.meshSymbols.position.x
                var mergeDist = this.showing.getMergeDistanceVert(this.meshUnion.meshSymbols.geometry, meshComp.geometry,
                    this.firstSymbolFaceStart, this.firstSymbolFaceEnd, false, this.meshUnion.meshSymbols.scale, meshComp.scale,
                    this.meshUnion.meshSymbols.position, meshComp.position, 1.0);
                this.meshUnion.meshSymbols.position.y -= mergeDist;
            }
            */
        }
    },

    printText:function(text, texturesize, MeshForTexture) {
        var a = text.indexOf('[');
        if (a >= 0)
        {
            var b = text.indexOf(']', a);
            if (b >= 0)
            {
                text = text.replace(text.substring(a, b+1), "");
            }
        }

        //创建画布，尺寸由配置文件决定
        if (undefined != this.canvasText && null != this.canvasText)
            document.removeChild(this.canvasText);
        this.canvasText = document.createElement("canvas");
        this.canvasText.width = texturesize;
        this.canvasText.height = texturesize;
        var context=this.canvasText.getContext('2d');
        context.font = this.showing.lastParamlist.textfont;//compCfgData['textfont'];
        var singleWidth = context.measureText('o').width;
        var margin = singleWidth * 1.5;
        var txtwidth = context.measureText(text).width + singleWidth * 1.5;
        var txtheight = (context.measureText('A').width +
            context.measureText('B').width +
            context.measureText('C').width) / 3;

        var minU=1, minV=1, maxU=0, maxV = 0;
        var faceVertexUv = MeshForTexture.geometry.faceVertexUvs[0];
        for ( var i = 0, il = faceVertexUv.length; i < il; i ++ ) {
            var vertexGroup = faceVertexUv[i];
            for (var j=0, jl = vertexGroup.length; j < jl; j++){
                var ver = vertexGroup[j];
                if (ver.x < minU)
                    minU = ver.x;
                if (ver.x > maxU)
                    maxU = ver.x;
                if (ver.y < minV)
                    minV = ver.y;
                if (ver.y > maxV)
                    maxV = ver.y;
            }
        }

        var HEIGHT_RATIO = 2.4;
        var rowheight = txtheight * HEIGHT_RATIO;
        //context.shadowBlur = 20;
        //ctx.fillStyle = 'blue';
        //context.shadowColor = 'black';
        //context.shadowOffsetX = 10;

        var totalHeight = texturesize * (maxV - minV);
        var row = Math.floor(totalHeight / rowheight);
        var ex_rowHeight = (totalHeight - row * rowheight) / (row + 1);
        var totalWidth = texturesize * (maxU - minU);
        var column = Math.ceil(totalWidth / txtwidth) + 2;

        for(var i=-1; i<column - 1; i++)
        {
            for(var j=0; j<row; j++)
            {
                var rowmargin = j*margin;
                if (rowmargin >= txtwidth)
                    rowmargin = rowmargin % txtwidth;
                var y = ex_rowHeight + txtheight * 0.5 * ( 1 + HEIGHT_RATIO) + j* (ex_rowHeight + rowheight);
                var x = i*txtwidth + rowmargin;
                y += texturesize * (1 - maxV);
                //x += texturesize * (1 - maxU);

                context.fillText(text, x, y);
            }
        }

        // if (undefined != this.showing.lastParamlist.picture && null != this.showing.lastParamlist.picture) {
        //
        //     this.showing.lastParamlist.picture.onload = function() {
        //         context.drawImage(this.showing.lastParamlist.picture,
        //             texturesize / 2 - this.showing.lastParamlist.picture.width / 2,
        //             texturesize / 2 - this.showing.lastParamlist.picture.height / 2);
        //         canvasText.needsUpdate = true;
        //     }.bind(this);
        //     if (this.showing.lastParamlist.picture.width >0 && this.showing.lastParamlist.picture.height >0)
        //     {
        //         this.showing.lastParamlist.picture.onload();
        //     }
        // }

        var textMatMap = new THREE.Texture(this.canvasText);
        //this.showing.mapSign.premultiplyAlpha = true;
        textMatMap.needsUpdate = true;
        textMatMap.wrapS = textMatMap.wrapT = THREE.ClampToEdgeWrapping;
        //textMatMap.mapping = THREE.CubeUVReflectionMapping;
        //textMatMap.repeat.set(5, 5);
        textMatMap.anisotropy = 1;//this.showing.renderer.getMaxAnisotropy();

        var textMat = new THREE.MeshBasicMaterial({map: textMatMap});
        textMat.transparent = true;
        textMat.blending = THREE.CustomBlending;
        textMat.blendSrc = THREE.SrcAlphaFactor;
        textMat.blendDst = THREE.OneMinusSrcAlphaFactor;
        textMat.blendEquation = THREE.AddEquation;

        if (this.meshUnion.textMeshGroup == undefined || null == this.meshUnion.textMeshGroup)
        {
            this.meshUnion.textMeshGroup = new THREE.Group();
            this.showing.jewelGroup.add(this.meshUnion.textMeshGroup);
        }
        //MeshForTexture.scale.set(this.showing.meshMain.scale.x * 1.01, this.showing.meshMain.scale.y * 1.01, this.showing.meshMain.scale.z * 1.01);
        MeshForTexture.rotation.copy(this.meshUnion.meshMain.rotation);
        //MeshForTexture.position.set(0.05, 0, 0);
        MeshForTexture.updateMatrix();
        MeshForTexture.material = textMat;
        MeshForTexture.visible = true;
        MeshForTexture.material.needsUpdate = true;
        this.meshUnion.textMeshGroup.add(MeshForTexture);
    },

    uniteBraceMain:function()
    {
        var mesh1Data = this.showing.meshArray['brace' + 0];
        if (undefined == mesh1Data || null == mesh1Data)
            return;

        var sizeArray = this.showing.ringsizeCfgMap[this.showing.styleid];
        if (undefined == sizeArray)
            return;
        var ringSizeData = sizeArray[this.showing.lastParamlist.size];
        if (undefined == ringSizeData)
            return;

        if(this.showing.lastParamlist.mainstone > 0) {
            var stonenumStr = '' + ringSizeData['stonenum'];
            if (stonenumStr.trim() != '')
                this.meshUnion.MainStoneNum = parseInt(stonenumStr);
            else
                this.meshUnion.MainStoneNum = 0;
        }
        else
            this.meshUnion.MainStoneNum = 0;

        var offset = ringSizeData['offset'].split('/');
        var scale = ringSizeData['scale'].split('/');
        var rotate = ringSizeData['rotate'].split('/');
        var mesh1 = mesh1Data.mesh;
        if (offset.length >= 3)
            mesh1.position.set(parseFloat(offset[0]), parseFloat(offset[1]), parseFloat(offset[2]));
        if (scale.length >= 3)
            mesh1.scale.set(parseFloat(scale[0]), parseFloat(scale[1]), parseFloat(scale[2]));
        if (rotate.length >= 3) {
            mesh1.rotation.set(parseFloat(rotate[0])/180*Math.PI,
                parseFloat(rotate[1])/180*Math.PI,
                parseFloat(rotate[2])/180*Math.PI,
                'YXZ');
        }
        mesh1.updateMatrix();
        this.meshUnion.meshMain.geometry.mergeFast(mesh1.geometry, mesh1.matrix);

        var mesh2Data = this.showing.meshArray['brace' + 1];
        if (undefined != mesh2Data && null != mesh2Data)
        {
            //主体（手镯需要两个主体）
            this.meshUnion.meshMain2 = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);
            this.showing.jewelGroup.add(this.meshUnion.meshMain2);

            var mesh2 = mesh2Data.mesh;
            mesh2.position.copy(mesh1.position);
            mesh2.scale.copy(mesh1.scale);
            mesh2.rotation.copy(mesh1.rotation);
            mesh2.updateMatrix();
            this.meshUnion.meshMain2.geometry.mergeFast(mesh2.geometry, mesh2.matrix);

            this.meshUnion.meshSymbols2 = new THREE.Mesh(new THREE.Geometry( ), this.showing.matLib['' + this.showing.lastParamlist.bodycolor]);
            this.meshUnion.meshSymbols2.rotation.copy(this.meshUnion.meshSymbols.rotation);
            this.meshUnion.meshSymbols2.rotation.set(0, Math.PI, 0, 'YXZ');
            this.meshUnion.meshSymbols2.updateMatrix();
            this.meshUnion.meshSymbols2.geometry.merge(this.meshUnion.meshSymbols.geometry, this.meshUnion.meshSymbols.matrix);
            this.showing.jewelGroup.add(this.meshUnion.meshSymbols2);

            if (null != this.meshUnion.meshFalang) {
                this.meshUnion.meshFalang2 = new THREE.Mesh(new THREE.Geometry(), this.showing.matLibFalang['' + this.showing.lastParamlist.color]);
                this.meshUnion.meshFalang2.rotation.copy(this.meshUnion.meshFalang.rotation);
                this.meshUnion.meshFalang2.rotation.set(0, Math.PI, 0, 'YXZ');
                this.meshUnion.meshFalang2.updateMatrix();
                this.meshUnion.meshFalang2.geometry.merge(this.meshUnion.meshFalang.geometry, this.meshUnion.meshFalang.matrix);
                this.showing.jewelGroup.add(this.meshUnion.meshFalang2);
            }

            if (null != this.meshUnion.stones) {
                this.meshUnion.stones2 = new THREE.Mesh(new THREE.Geometry(), this.showing.matLibStone['' + this.showing.lastParamlist.stone]);
                this.meshUnion.stones2.rotation.copy(this.meshUnion.stones.rotation);
                this.meshUnion.stones2.rotation.set(0, Math.PI, 0, 'YXZ');
                this.meshUnion.stones2.updateMatrix();
                this.meshUnion.stones2.geometry.merge(this.meshUnion.stones.geometry, this.meshUnion.stones.matrix);
                this.showing.jewelGroup.add(this.meshUnion.stones2);
            }
        }

        if (this.showing.lastParamlist.mainstone > 0)
        {
            var meshStoneData1 = this.showing.meshArray['bracestone' + 0];
            if (undefined != meshStoneData1 && null != meshStoneData1)
            {
                var meshStone = meshStoneData1.mesh;
                this.meshUnion.meshMainStones.geometry.mergeFast(meshStone.geometry, mesh1.matrix);
            }

            var meshStoneData2 = this.showing.meshArray['bracestone' + 1];
            if (undefined != meshStoneData2 && null != meshStoneData2)
            {
                var meshStone = meshStoneData2.mesh;
                this.meshUnion.meshMainStones.geometry.mergeFast(meshStone.geometry, mesh2.matrix);
            }
        }

        var meshPearl = this.showing.meshArray['pearl' + 0];
        if (undefined != meshPearl && null != meshPearl)
        {
            this.meshUnion.meshMainPearl.geometry.mergeFast(meshPearl.mesh.geometry, mesh1.matrix);
        }

        var meshPearl2 = this.showing.meshArray['pearl' + 1];
        if (undefined != meshPearl2 && null != meshPearl2)
        {
            this.meshUnion.meshMainPearl.geometry.mergeFast(meshPearl2.mesh.geometry, mesh2.matrix);
        }

        var meshTexture = this.showing.meshArray['texture' + 0];
        if (undefined != meshTexture && null != meshTexture) {
            var cfgText = ringSizeData['text'];
            if (cfgText.length > 0) {
                if (cfgText == 'custom')
                    cfgText = this.showing.lastParamlist.text;

                var texturesize = 512;
                var cfgTextureSize = parseInt(ringSizeData['texturesize']);
                if (cfgTextureSize > 0)
                    texturesize = cfgTextureSize;

                meshTexture.mesh.scale.copy(mesh1.scale);
                meshTexture.mesh.position.multiply(mesh1.scale);
                document.fonts.ready.then(function (_text, _texturesize, _meshTexture ) {
                    this.printText(_text, _texturesize, _meshTexture);
                }.bind(this, cfgText, texturesize, meshTexture.mesh), function () {
                });
            }
        }
    },

    uniteRingMain:function()
    {
        var meshRingData = this.showing.meshArray['ring' + 0];
        if (undefined == meshRingData || null == meshRingData)
            return;

        var sizeArray = this.showing.ringsizeCfgMap[this.showing.styleid];
        if (undefined == sizeArray)
            return;
        var ringSizeData = sizeArray[this.showing.lastParamlist.size];
        if (undefined == ringSizeData)
            return;

        if(this.showing.lastParamlist.mainstone > 0) {
            var stonenumStr = '' + ringSizeData['stonenum'];
            if (stonenumStr.trim() != '')
                this.meshUnion.MainStoneNum = parseInt(stonenumStr);
            else
                this.meshUnion.MainStoneNum = 0;
        }
        else
            this.meshUnion.MainStoneNum = 0;

        var offset = ringSizeData['offset'].split('/');
        var scale = ringSizeData['scale'].split('/');
        var meshRing = meshRingData.mesh;
        meshRing.position.set(parseFloat(offset[0]), parseFloat(offset[1]), parseFloat(offset[2]));
        meshRing.scale.set(parseFloat(scale[0]), parseFloat(scale[1]), parseFloat(scale[2]));
        meshRing.updateMatrix();
        this.meshUnion.meshMain.geometry.mergeFast(meshRing.geometry, meshRing.matrix);

        if (this.showing.lastParamlist.mainstone > 0)
        {
            var meshStoneData = this.showing.meshArray['ringstone' + 0];
            if (undefined != meshStoneData && null != meshStoneData)
            {
                var meshStone = meshStoneData.mesh;
                this.meshUnion.meshMainStones.geometry.mergeFast(meshStone.geometry, meshRing.matrix);
            }
        }

        var meshTexture = this.showing.meshArray['texture0'];
        if (undefined != meshTexture && null != meshTexture) {
            var cfgText = ringSizeData['text'];
            if (cfgText.length > 0) {
                if (cfgText == 'custom')
                    cfgText = this.showing.lastParamlist.text;

                var texturesize = 512;
                var cfgTextureSize = parseInt(ringSizeData['texturesize']);
                if (cfgTextureSize > 0)
                    texturesize = cfgTextureSize;

                meshTexture.mesh.scale.copy(meshRing.scale);
                meshTexture.mesh.position.multiply(meshRing.scale);

                document.fonts.ready.then(function (_text, _texturesize, _meshTexture ) {
                    this.printText(_text, _texturesize, _meshTexture);
                }.bind(this, cfgText, texturesize, meshTexture.mesh), function () {
                });
            }
        }

    },

    uniteCirclesNew:function()
    {
        if (this.showing.lastParamlist.jewelID != 'neck' && this.showing.lastParamlist.jewelID != 'brace')
            return;
    },

    uniteSymbolsNew:function()
    {
        //珐琅
        this.havecolor = this.fontcfg['Havecolor'] == '1' ? true : false;

        //珐琅模型初始化
        if (this.havecolor && this.showing.lastParamlist.color != this.showing.FalangColor.no)
        {
            var geometryFalang = new THREE.BoxGeometry( 0, 0, 0 );
            this.meshUnion.meshFalang = new THREE.Mesh(geometryFalang, this.showing.matLibFalang['' + this.showing.lastParamlist.color]);
            this.showing.jewelGroup.add(this.meshUnion.meshFalang);
            this.meshUnion.meshFalang.rotation.copy(this.meshUnion.meshSymbols.rotation);
            this.meshUnion.meshFalang.position.copy(this.meshUnion.meshSymbols.position);
            this.meshUnion.meshFalang.updateMatrix();
        }

        //是否弯曲成圆形
        var diameter = 0;
        var circlemode = 0;
        if (this.showing.lastParamlist.jewelID == 'ring' || this.showing.lastParamlist.jewelID == 'brace')
        {
            var sizeArray = this.showing.ringsizeCfgMap[this.showing.styleid];
            if (undefined != sizeArray) {
                var ringSizeData = sizeArray[this.showing.lastParamlist.size];
                if (undefined != ringSizeData)
                {
                    circlemode  = 1;
                    diameter = parseFloat(ringSizeData['diameter']);
                }
            }
        }
        else
        {
            var circlemodestr = this.styleCfg['circlemode'].toLowerCase();
            if (circlemodestr != 'no')
            {
                diameter = parseFloat(this.styleCfg['diameter']);
                if (circlemodestr == 'a')
                    circlemode = 1;
                else if (circlemodestr == 'b')
                    circlemode = 2;
                else if (circlemodestr == 'c')
                    circlemode = 3;
            }
        }

        this.uniteSymbolsByText(circlemode, diameter);

        if (this.meshUnion.stones != null && undefined != this.meshUnion.stones) {
            console.time('宝石拼接');
            this.meshUnion.stones.scale.copy(this.meshUnion.meshSymbols.scale);
            this.meshUnion.stones.geometry.computeBoundingBox();
            this.meshUnion.stones.position.copy(this.meshUnion.meshSymbols.position);
            this.meshUnion.stones.updateMatrix();

            console.timeEnd('宝石拼接');
            console.time('合并宝石顶点');
            this.meshUnion.stones.geometry.mergeVertices();
            console.timeEnd('合并宝石顶点');
        }

        if (circlemode > 0 && circlemode != 2)
        {
            console.time('字母链弯曲');
            var centerX = 0.5 * this.meshUnion.meshSymbols.geometry.boundingBox.max.x + 0.5 * this.meshUnion.meshSymbols.geometry.boundingBox.min.x;

            if (circlemode == 1) {
                diameter += 0.5 * this.symbolDepth;
                var origin = new THREE.Vector3(centerX, 0, - 0.5 * diameter);
            }
            /*else if (circlemode == 2)
            {
                var matrixRot = new THREE.Matrix4();
                matrixRot.makeRotationX(-Math.PI/2);
                this.showing.meshSymbols.geometry.applyMatrix(matrixRot);
                if (null != this.showing.meshFalang)
                    this.showing.meshFalang.geometry.applyMatrix(matrixRot);
                if (null != this.showing.stones)
                    this.showing.stones.geometry.applyMatrix(matrixRot);
                diameter += 1.5 * this.symbolHeight;
                var origin = new THREE.Vector3(centerX, 0, - 0.5 * diameter);
            }*/
            else if (circlemode == 3) {
                diameter += 0.5 * this.symbolDepth;
                var origin = new THREE.Vector3(0, 0, - 0.5 * diameter);
            }

            var circumBrace = diameter * Math.PI;
            var modifier = new THREE.CircleModifier();

            /*var interval = parseFloat(this.styleCfg['intermin']);
            if (circumBrace < this.symbolLength + minInter)
            {
                var lenScale = (circumBrace - minInter) / this.symbolLength;
                var matrixRot = new THREE.Matrix4();
                matrixRot.makeScale(lenScale, 1, 1);
                this.showing.meshSymbols.geometry.applyMatrix(matrixRot);
                if (null != this.showing.meshFalang)
                    this.showing.meshFalang.geometry.applyMatrix(matrixRot);
                if (null != this.showing.stones)
                    this.showing.stones.geometry.applyMatrix(matrixRot);
            }*/

            modifier.set(origin).modify(this.meshUnion.meshSymbols.geometry, circumBrace);
            if (null != this.meshUnion.meshFalang)
                modifier.set(origin).modify(this.meshUnion.meshFalang.geometry, circumBrace);
            if (null != this.meshUnion.stones)
                modifier.set(origin).modify(this.meshUnion.stones.geometry, circumBrace);

            var offsetArray = this.styleCfg['offset'].split('/');

            origin.x -= parseFloat(offsetArray[0]);
            origin.y -= parseFloat(offsetArray[1]);
            origin.z -= parseFloat(offsetArray[2]);
            origin.applyEuler(this.meshUnion.meshSymbols.rotation);
            this.meshUnion.meshSymbols.position.set(-origin.x, -origin.y, -origin.z);

            //var matrixOrigin = new THREE.Matrix4();
            //matrixOrigin.makeRotationFromEuler(this.showing.meshSymbols.rotation);
            console.timeEnd('字母链弯曲');
        }
        else{
            var offsetArray = this.styleCfg['offset'].split('/');
            this.meshUnion.meshSymbols.position.set(parseFloat(offsetArray[0]), parseFloat(offsetArray[1]), parseFloat(offsetArray[2]));
        }

        var attach_group = this.showing.styleCfgMap[this.showing.styleid]['attach_comp_group'];
        var compGroups = attach_group.split('|');
        if (compGroups.length > 0)
        {
            var groupname = compGroups[0];
            if (this.meshUnion.unionid > 1 && this.meshUnion.unionid <= compGroups.length)
            {
                groupname = compGroups[this.meshUnion.unionid - 1];
            }
            var compData = this.showing.getCompData(this.meshUnion, groupname);
            if (undefined != compData && null != compData)
            {

                var attachpointArray = compData['be_attach_point'].split('/');
                if (attachpointArray.length >= 3)
                {
                    this.meshUnion.meshSymbols.position.x += parseFloat(attachpointArray[0]);
                    this.meshUnion.meshSymbols.position.y += parseFloat(attachpointArray[1]);
                    this.meshUnion.meshSymbols.position.z += parseFloat(attachpointArray[2]);
                }

                var offsetArray = compData['offset'].split('/');
                if (offsetArray.length >= 3)
                {
                    this.meshUnion.meshSymbols.position.x += parseFloat(offsetArray[0]);
                    this.meshUnion.meshSymbols.position.y += parseFloat(offsetArray[1]);
                    this.meshUnion.meshSymbols.position.z += parseFloat(offsetArray[2]);
                }
            }
        }

        this.meshUnion.meshSymbols.geometry.computeBoundingBox();

        var alignV = this.styleCfg['alignV'];
        var alignH = this.styleCfg['alignH'];
        var offsetX = 0, offsetY = 0;

        if ( alignH == 'left')
        {
            offsetX -= this.meshUnion.meshSymbols.geometry.boundingBox.min.x;
        }
        else if (alignH == 'right')
        {
            offsetX -= this.meshUnion.meshSymbols.geometry.boundingBox.max.x;
        }
        else if (alignH == 'center')
        {
            offsetX -= 0.5 * this.meshUnion.meshSymbols.geometry.boundingBox.min.x +
                0.5 * this.meshUnion.meshSymbols.geometry.boundingBox.max.x;
        }

        if ( alignV == 'bottom')
        {
            offsetY -= this.meshUnion.meshSymbols.geometry.boundingBox.min.y;
        }
        else if (alignV == 'top')
        {
            offsetY -= this.meshUnion.meshSymbols.geometry.boundingBox.max.y;
        }
        else if (alignV == 'center')
        {
            offsetY -= 0.5 * this.meshUnion.meshSymbols.geometry.boundingBox.min.y +
                0.5 * this.meshUnion.meshSymbols.geometry.boundingBox.max.y;
        }

        if (offsetX != 0 || offsetY != 0) {
            var alignOffset = new THREE.Vector3(offsetX, offsetY, 0);
            alignOffset.applyEuler(this.meshUnion.meshSymbols.rotation);
            this.meshUnion.meshSymbols.position.add(alignOffset);
        }

        this.meshUnion.meshSymbols.updateMatrix();

        //珐琅坐标
        if (null != this.meshUnion.meshFalang)
        {
            this.meshUnion.meshFalang.scale.copy(this.meshUnion.meshSymbols.scale);
            this.meshUnion.meshFalang.position.copy(this.meshUnion.meshSymbols.position);
            this.meshUnion.meshFalang.rotation.copy(this.meshUnion.meshSymbols.rotation);
            this.meshUnion.meshFalang.updateMatrix();
            this.meshUnion.meshFalang.geometry.applyMatrix(this.meshUnion.meshFalang.matrix);
            this.meshUnion.meshFalang.position.set(0,0,0);
            this.meshUnion.meshFalang.scale.set(1,1,1);
            this.meshUnion.meshFalang.rotation.set(0,0,0);
            this.meshUnion.meshFalang.updateMatrix();
        }

        //宝石坐标
        if (null != this.meshUnion.stones)
        {
            this.meshUnion.stones.scale.copy(this.meshUnion.meshSymbols.scale);
            this.meshUnion.stones.position.copy(this.meshUnion.meshSymbols.position);
            this.meshUnion.stones.rotation.copy(this.meshUnion.meshSymbols.rotation);
            this.meshUnion.stones.updateMatrix();
            this.meshUnion.stones.geometry.applyMatrix(this.meshUnion.stones.matrix);
            this.meshUnion.stones.position.set(0,0,0);
            this.meshUnion.stones.scale.set(1,1,1);
            this.meshUnion.stones.rotation.set(0,0,0);
            this.meshUnion.stones.updateMatrix();
        }

        this.meshUnion.meshSymbols.geometry.applyMatrix(this.meshUnion.meshSymbols.matrix);
        this.meshUnion.meshSymbols.position.set(0,0,0);
        this.meshUnion.meshSymbols.scale.set(1,1,1);
        this.meshUnion.meshSymbols.rotation.set(0,0,0);
        this.meshUnion.meshSymbols.updateMatrix();
    },

    findVarLengthComp:function(symbolWidth, maxLengthCfg)
    {
        //根据字符宽度总和动态选择组件
        //找出可变长的组件中最短的一个
        var compData = this.showing.stylecompCfgMap[this.showing.styleid];
        if ( undefined == compData || null == compData)
            return maxLengthCfg;

        var orderArray = compData[this.meshUnion.unionid];
        if (undefined == orderArray)
            return maxLengthCfg;

        var myVarLength = maxLengthCfg;
        for (var order in orderArray)
        {
            var meshDataComp = this.showing.meshArray['neck' + this.meshUnion.unionid + '_' + order];
            if (undefined == meshDataComp || null == meshDataComp)
                continue;
            var compCfgData = orderArray[order];
            var tmpVarLength = compCfgData['varlength'];
            if (undefined == tmpVarLength || tmpVarLength == '0')
                continue;

            var varlength = parseFloat(compCfgData['varlength']);
            if (symbolWidth > varlength)
                continue;

            if (myVarLength < 0 || varlength < myVarLength)
            {
                myVarLength = varlength;
            }
        }

        return myVarLength;
    },

    //diameter: 由款式和所选尺寸型号决定，在ringsize表中配置
    uniteSymbolsByText:function(circlemode, diameter)
    {
        //符号整体缩放比例
        //新款的整体缩放比例固定为1
        var totalscale = 1.0;//parseFloat(this.fontcfg['totalscale']);
        if (totalscale <= 0)
            totalscale = 1.0;

        //款式所要求的字符厚度
        var DEPTH_NEED = parseFloat(this.styleCfg['depth']);
        if (DEPTH_NEED <= 0 )
            DEPTH_NEED = 1.5;
        DEPTH_NEED *= totalscale;

        //款式所要求的字符高度
        var HEIGHT_NEED = parseFloat(this.styleCfg['height']);
        HEIGHT_NEED *= totalscale;

        //款式所要求的字符最大数量
        var maxSymbolsNum = parseInt(this.styleCfg['symmax']);
        //款式所要求的字符串最大长度标准值
        var maxLengthCfg = parseFloat(this.styleCfg['maxlength']);
        maxLengthCfg *= totalscale;
        //款式所要求的弧形直径标准值
        var diameterCfg = parseFloat(this.styleCfg['diameter']);
        diameterCfg *= totalscale;

        //根据尺寸型号对最大长度做矫正
        if (maxLengthCfg > 0 && diameterCfg > 0)
            maxLengthCfg *= diameter / diameterCfg;

        var sumSymbolHeight = 0;
        var sumSymbolWidth = 0;
        this.symbolCnt = 0;

        //求所有字母的平均高度，字母数量，最大字母高度
        for (var i = 0; i < maxSymbolsNum; i++)
        {
            var meshData = this.showing.meshArray['symbol' + this.meshUnion.unionid + '_' + i];
            if (undefined == meshData || null == meshData)
                break;

            var currMesh = meshData.mesh;
            currMesh.geometry.computeBoundingBox();

            var HEIGHT_X = Math.abs(currMesh.geometry.boundingBox.max.y - currMesh.geometry.boundingBox.min.y);
            var WIDTH_X = Math.abs(currMesh.geometry.boundingBox.max.x - currMesh.geometry.boundingBox.min.x);
            sumSymbolHeight += HEIGHT_X;
            if (this.showing.IsCnFont())
                var xyScale = HEIGHT_NEED / Math.max(HEIGHT_X, WIDTH_X);
            else
                var xyScale = HEIGHT_NEED / HEIGHT_X;
            sumSymbolWidth += xyScale * WIDTH_X;
            this.symbolCnt ++;
        }

        this.aveSymbolHeight = this.symbolCnt == 0 ? 0 : (sumSymbolHeight / this.symbolCnt);
        //字符的平均宽度，作为空格的宽度
        this.aveSymbolWidth = this.symbolCnt == 0 ? 0 : (sumSymbolWidth / this.symbolCnt);

        //sumSymbolWidth += this.meshUnion.blankChars.length * this.aveSymbolWidth;

        var circumBrace = 0;
        if (circlemode > 0) {
            //字符串要弯曲时
            //circumLeft是周长要预留出多少长度，这部分长度是不能有字符的
            //diameter是字符中心点到圆心的距离的二倍
            var circumLeft = 0;
            if (circlemode == 2) {
                diameter += 1 * HEIGHT_NEED; //1.5 * HEIGHT_NEED;
                circumLeft = 6.0;
            }
            else {
                diameter += 0.5 * DEPTH_NEED;
            }

            //完整一圈的长度
            circumBrace = diameter * Math.PI;
            //预留出不能是字符的长度
            if (maxLengthCfg > 0)
                circumLeft = circumBrace - maxLengthCfg;

            //var sumInterval = this.symbolInterval * (this.symbolCnt + this.meshUnion.blankChars.length);

            //字符的最大可能长度
            maxSymbolsLength = circumBrace - circumLeft;
        }
        else{
            //非圆弧状的款式，先按照最大长度来拼接字符，后面还会修改最大长度
            maxSymbolsLength = maxLengthCfg;
        }

        //间距
        var inter_mode = this.styleCfg['inter_mode'];
        if ('even' == inter_mode) {
            //字符之间的间距是根据总长度均匀分布的，先把间距设为0，后面再计算间距
            //空格与其它字符之间的距离减半
            this.symbolInterval = 0;//(maxSymbolsLength - sumSymbolWidth) / (this.symbolCnt + this.meshUnion.blankChars.length * 0.5);
        }
        else if ('circle' == inter_mode) {
            //字符在整个圆弧上均匀分布
            if (circlemode == 2)
                this.symbolInterval = circumBrace  / (this.symbolCnt + this.meshUnion.blankChars.length * 0.5 + 1);
            else
                this.symbolInterval = circumBrace  / (this.symbolCnt + this.meshUnion.blankChars.length * 0.5);
            if(this.symbolInterval < this.aveSymbolWidth * 2.5)
            {
                this.symbolInterval = 0;
                inter_mode = 'even';
            }
        }
        else{
            //固定间距
            this.symbolInterval = parseFloat(this.styleCfg['fix_intervalue']);
        }

        var sumSymbolsWidth = 0;
        var curSumSymbolsWidth = 0;
        var symbolScaleArray = new Array();
        var meshArray = new Array();
        var offsetXArray = new Array();
        var firstMinX = 0;
        for (var i = 0; i < this.symbolCnt; i++)
        {
            var meshData = this.showing.meshArray['symbol' + this.meshUnion.unionid + '_' + i];
            if (undefined == meshData || null == meshData)
                break;
            var currMesh = meshData.mesh;

            //根据字符模型的原始高度和需要的高度，计算模型的缩放比例（x和y比例相同）
            var symbolScale = new THREE.Vector3(1, 1, 1);
            var WIDTH_X = Math.abs(currMesh.geometry.boundingBox.max.x - currMesh.geometry.boundingBox.min.x);
            var HEIGHT_X = Math.abs(currMesh.geometry.boundingBox.max.y - currMesh.geometry.boundingBox.min.y);
            if (this.showing.IsCnFont())
                symbolScale.x = symbolScale.y = HEIGHT_NEED / Math.max(HEIGHT_X, WIDTH_X);
            else
                symbolScale.x = symbolScale.y = HEIGHT_NEED / HEIGHT_X;

            var DEPTH_ORIG_X = Math.abs(currMesh.geometry.boundingBox.max.z - currMesh.geometry.boundingBox.min.z);
            symbolScale.z = DEPTH_NEED / DEPTH_ORIG_X;
            symbolScaleArray[i] = symbolScale;

            currMesh.position.set(0, 0, 0);
            if (0 == i)
            {
                //记录第一个符号的起始面，肯定是0
                this.firstSymbolFaceStart = 0;
                //记录第一个字符的结束面数
                this.firstSymbolFaceEnd = currMesh.geometry.faces.length;

                firstMinX = currMesh.geometry.boundingBox.min.x * symbolScale.x;
                offsetXArray[i] = - firstMinX;
                //计算拼接此字符后字符串总宽度
                curSumSymbolsWidth = WIDTH_X * symbolScale.x;
            }
            else{
                //如果文字中有空格的话，空格处字符和字符之间的距离会增大
                var extraInterval = 0;
                for (var id in this.meshUnion.blankChars) {
                    var blankIndex = this.meshUnion.blankChars[id];
                    if (i == blankIndex)
                    {
                        if (inter_mode == 'circle')
                            extraInterval += this.symbolInterval * 0.5;
                        else if (inter_mode == 'even')
                            extraInterval += this.aveSymbolWidth;
                        else
                            extraInterval += this.aveSymbolWidth;
                    }
                }

                var lastMeshX = meshArray[i - 1];
                var lastSymbolScale = symbolScaleArray[i - 1];

                if (inter_mode == 'circle') {

                    offsetXArray[i] = offsetXArray[i - 1] + this.symbolInterval + extraInterval;
                    //计算拼接此字符后字符串总宽度
                    curSumSymbolsWidth = offsetXArray[i] + currMesh.geometry.boundingBox.max.x * symbolScale.x;
                }
                else {
                    var needInterect = 0.0;
                    if (this.symbolInterval < 0){
                        needInterect = - this.symbolInterval;
                    }
                    var mergeDistX = this.showing.getMergeDistance(lastMeshX.geometry, currMesh.geometry,
                        0, lastMeshX.geometry.faces.length, true, lastSymbolScale, symbolScale,
                        lastMeshX.position, currMesh.position, this.needInterect);

                    offsetXArray[i] = offsetXArray[i - 1] - mergeDistX + extraInterval;
                    //计算拼接此字符后字符串总宽度
                    curSumSymbolsWidth = offsetXArray[i] + currMesh.geometry.boundingBox.max.x * symbolScale.x;
                }
            }

            //如果超长则忽略此字符和余下的字符（或者空格）
            /*if (curSumSymbolsWidth > maxSymbolsLength)
            {
                this.symbolCnt = i;
                break;
            }
            else*/{
            meshArray[i] = currMesh;
            sumSymbolsWidth = curSumSymbolsWidth;
        }
        }

        if(circlemode <= 0)
        {
            //非圆弧状的款式，可以自动选取最合适长度的组件
            maxSymbolsLength = this.findVarLengthComp(sumSymbolsWidth, maxLengthCfg);
            this.myVarLength = maxSymbolsLength;
        }

        if (inter_mode == 'even') {
            //计算间距（并且，字符与字符相拼接时会产生多余的空间）
            if (circlemode == 2) {
                var interTimes = this.symbolCnt;
            }
            else if (circlemode > 0) {
                var interTimes = this.symbolCnt;
            }
            else{
                var interTimes = this.symbolCnt - 1;
            }

            var plusIntervalAll = maxSymbolsLength - sumSymbolsWidth;
            if (interTimes > 0 && plusIntervalAll != 0) {
                this.symbolInterval = plusIntervalAll / interTimes;
                for (var i = 1; i < this.symbolCnt; i++) {
                    offsetXArray[i] = offsetXArray[i] + this.symbolInterval * i;
                }
            }
        }

        this.high1 = -1000;
        this.high2 = -1000;
        this.low1 = 1000;
        this.low2 = 1000;
        var sumSymbolBottomY = 0;
        var sumSymbolTopY = 0;
        this.circleYNeck = 1000;
        for (var i = 0; i < this.symbolCnt; i++)
        {
            var currMesh = meshArray[i];
            if (undefined == currMesh || null == meshData)
                break;

            var offsetX = offsetXArray[i];
            if (undefined == offsetX || null == offsetX)
                break;

            var symbolScale = symbolScaleArray[i];
            if (undefined == symbolScale || null == symbolScale)
                break;

            if (circlemode != 2)
            {
                //字符的高度计算，将字符下边缘放在y=0平面的下方0.2单位处
                var offsetY = -0.2 - currMesh.geometry.boundingBox.min.y * symbolScale.y;
                currMesh.position.set(offsetX, offsetY, 0);
            }
            else //if(circlemode == 2)
            {
                //双环吊坠款式，需要特殊处理每个字符的偏移和旋转 sumSymbolsWidth
                if (inter_mode == 'circle') {
                    var allCenterX = -firstMinX + (this.symbolInterval * (this.symbolCnt + this.meshUnion.blankChars.length * 0.5 - 1) / 2);//sumSymbolsWidth / 2;
                }
                else {
                    var allCenterX = (sumSymbolsWidth + this.symbolInterval * (this.symbolCnt-1)) / 2;
                }

                var innerCenterX = 0.5 * currMesh.geometry.boundingBox.min.x + 0.5 * currMesh.geometry.boundingBox.max.x;
                var offset2Center = offsetX + innerCenterX * symbolScale.x - allCenterX;

                //计算旋转弧度
                var rotateRadian = 2 * Math.PI * offset2Center / circumBrace;
                var rotateMatrix = new THREE.Matrix4();
                rotateMatrix.makeRotationZ(rotateRadian);
                //计算旋转后的坐标
                var dstPos = new THREE.Vector3(0, -diameter*0.5, 0);
                dstPos.applyMatrix4(rotateMatrix);
                //dstPos.y += diameter*0.5;
                currMesh.position.copy(dstPos);
                //字符自转
                currMesh.rotation.set(0, 0, rotateRadian, 'YXZ');
            }

            //用于排版的一些变量的计算
            var thisHigh = currMesh.geometry.boundingBox.max.y * symbolScale.y;
            var thisLow = currMesh.geometry.boundingBox.min.y * symbolScale.y;
            this.minSymbolTopY = Math.min(thisHigh, this.minSymbolTopY);
            this.maxSymbolBottomY = Math.max(thisLow, this.maxSymbolBottomY);

            sumSymbolBottomY += currMesh.geometry.boundingBox.min.y * symbolScale.y;
            sumSymbolTopY += currMesh.geometry.boundingBox.max.y * symbolScale.y;

            if (thisHigh > this.high1)
            {
                this.high2 = this.high1;
                this.high1 = thisHigh;
            }
            else if (thisHigh > this.high2)
                this.high2 = thisHigh;

            if (thisLow < this.low1)
            {
                this.low2 = this.low1;
                this.low1 = thisLow;
            }
            else if (thisLow < this.low2)
                this.low2 = thisLow;

            //项链的挂环高度要靠上一些，这个值只在那些未提供现成挂环的款式中才有用
            //计算出当前字符适合放置挂环的高度，所有字符计算结果的最小值作为被采用的挂环高度
            if (this.showing.lastParamlist.jewelID == "neck") {
                this.circleYNeck = Math.min(this.circleYNeck, 0.8 * currMesh.geometry.boundingBox.max.y*symbolScale.y +
                    0.2 * currMesh.geometry.boundingBox.min.y * symbolScale.y);
            }

            //新字符模型的缩放比例
            currMesh.scale.copy(symbolScale);
            currMesh.updateMatrix();

            //记录最后一次拼接，拼接前的总面数和拼接后的总面数
            this.finalSymbolFaceStart = this.meshUnion.meshSymbols.geometry.faces.length;
            //拼接新的字符模型
            this.meshUnion.meshSymbols.geometry.mergeFast(currMesh.geometry, currMesh.matrix);
            //记录最后一次拼接，拼接后的总面数
            this.finalSymbolFaceEnd = this.meshUnion.meshSymbols.geometry.faces.length;

            //抛弃用过的字符模型
            this.showing.meshArray['symbol' + this.meshUnion.unionid + '_' + i] = null;

            //拼接珐琅
            if (this.havecolor && this.showing.lastParamlist.color != this.showing.FalangColor.no && null != this.meshUnion.meshFalang)
            {
                var falangMeshData = this.showing.meshArray['falang' + this.meshUnion.unionid + '_' + i];
                if (undefined != falangMeshData && null != falangMeshData)
                {
                    var falangMesh = falangMeshData.mesh;
                    falangMesh.position.copy(currMesh.position);
                    falangMesh.scale.copy(currMesh.scale);
                    falangMesh.rotation.copy(currMesh.rotation);
                    falangMesh.updateMatrix();
                    this.meshUnion.meshFalang.geometry.mergeFast(falangMesh.geometry, falangMesh.matrix);
                    this.meshUnion.meshFalang.geometry.computeBoundingBox();
                }
                //抛弃用过的珐琅模型
                this.showing.meshArray['falang' + this.meshUnion.unionid + '_' + i] = null;
            }

            //拼接宝石，最多5个
            for(var j=1; j<=5; j++) {
                var stoneMeshData = this.showing.meshArray['stone' + j + '_' + this.meshUnion.unionid + '_' + i];
                if (undefined != stoneMeshData && null != stoneMeshData) {
                    var stoneMesh = stoneMeshData.mesh;
                    //创建宝石模型
                    if (null == this.meshUnion.stones)
                    {
                        this.meshUnion.stones = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0),
                            this.showing.matLibStone['' + this.showing.lastParamlist.stone]);
                        this.meshUnion.stones.rotation.copy(this.meshUnion.meshSymbols.rotation);
                        this.meshUnion.stones.position.copy(this.meshUnion.meshSymbols.position);
                        this.meshUnion.stones.scale.copy(this.meshUnion.meshSymbols.scale);
                        this.showing.jewelGroup.add(this.meshUnion.stones);
                    }

                    //拼接新宝石模型
                    stoneMesh.scale.copy(currMesh.scale);
                    stoneMesh.rotation.copy(currMesh.rotation);
                    stoneMesh.position.copy(currMesh.position);
                    stoneMesh.updateMatrix();
                    this.meshUnion.stones.geometry.mergeFast(stoneMesh.geometry, stoneMesh.matrix);
                }
            }
        }

        //用于排版
        if (this.symbolCnt == 1) {
            this.high2 = this.high1;
            this.low2 = this.low1;
        }
        this.aveSymbolBottomY = this.symbolCnt == 0 ? 0 :(sumSymbolBottomY / this.symbolCnt);
        this.aveSymbolTopY = this.symbolCnt == 0 ? 0 :(sumSymbolTopY / this.symbolCnt);
        this.circleYBrace = 0.5 * this.aveSymbolBottomY + 0.5 * this.aveSymbolTopY;
        //用于后续计算
        this.meshUnion.meshSymbols.geometry.computeBoundingBox();
        this.symbolLength = Math.abs(this.meshUnion.meshSymbols.geometry.boundingBox.max.x - this.meshUnion.meshSymbols.geometry.boundingBox.min.x);
        this.symbolDepth = Math.abs(this.meshUnion.meshSymbols.geometry.boundingBox.max.z - this.meshUnion.meshSymbols.geometry.boundingBox.min.z);
        this.symbolHeight = Math.abs(this.meshUnion.meshSymbols.geometry.boundingBox.max.y - this.meshUnion.meshSymbols.geometry.boundingBox.min.y);

        return symbolScale;
    },

    uniteSticks: function(linkScale, DEPTH_NEED, offsetZ)
    {
        //连接器
        var centerX = (this.meshUnion.meshSymbols.geometry.boundingBox.max.x + this.meshUnion.meshSymbols.geometry.boundingBox.min.x)/2;
        var stickScaleY = parseFloat(this.fontcfg['StickScale']) * linkScale.y;
        var symbolLength = Math.abs(this.meshUnion.meshSymbols.geometry.boundingBox.max.x - this.meshUnion.meshSymbols.geometry.boundingBox.min.x);

        for (var i = 0; i < 2; i++) {
            var meshData = this.showing.meshArray['link' + i];
            if (undefined == meshData || null == meshData)
                continue;

            if (meshData.meshType != 'link')
                continue;

            var stick = meshData.mesh;
            stick.geometry.computeBoundingBox();
            var STICK_LENGTH_ORIG = Math.abs(stick.geometry.boundingBox.max.x - stick.geometry.boundingBox.min.x);
            var STICK_DEPTH_ORIG = Math.abs(stick.geometry.boundingBox.max.z - stick.geometry.boundingBox.min.z);
            var STICK_HEIGHT_ORIG = Math.abs(stick.geometry.boundingBox.max.y - stick.geometry.boundingBox.min.y);

            var stickHeight = STICK_HEIGHT_ORIG * stickScaleY;

            stick.scale.set( symbolLength / STICK_LENGTH_ORIG, stickScaleY, DEPTH_NEED / STICK_DEPTH_ORIG);

            var stickY = 0;
            if (i == 0)
            {
                this.stickY_0 = stickY = this.high2 + stickHeight * 0.5 - 0.412 * stickScaleY;
                this.circleZ = offsetZ + stick.scale.z * 0.5 * (stick.geometry.boundingBox.max.z + stick.geometry.boundingBox.min.z);
            }
            else
                this.stickY_1 = stickY = this.low2 - stickHeight * 0.5 +  0.412 * stickScaleY;

            stick.position.set(centerX, stickY, offsetZ);
            stick.updateMatrix();

            if (i == 0)
                this.stickfaceStart = this.meshUnion.meshFirst.geometry.faces.length;

            this.meshUnion.meshFirst.geometry.mergeFast(stick.geometry, stick.matrix);
            this.meshUnion.meshFirst.geometry.computeBoundingBox();
            if (i == 0)
                this.stickfaceEnd = this.meshUnion.meshFirst.geometry.faces.length;

            this.showing.meshArray['link' + i] = null;
        }

        this.circleYNeck = this.stickY_0;
        this.circleYBrace = 0.5 * this.aveSymbolBottomY + 0.5 * this.aveSymbolTopY;
    },

    uniteBullet:function(DEPTH_NEED, offsetZ){
        var meshFront = this.showing.meshArray['link0'];
        if (undefined == meshFront || null == meshFront || meshFront.meshType != 'link' || meshFront.mesh == null)
            return;
        var meshBack = this.showing.meshArray['link1'];
        if (undefined == meshBack || null == meshBack || meshBack.meshType != 'link' || meshBack.mesh == null)
            return;
        var meshMiddle = this.showing.meshArray['link2'];
        if (undefined == meshMiddle || null == meshMiddle || meshMiddle.meshType != 'link' || meshMiddle.mesh == null)
            return;

        var matrixRot = new THREE.Matrix4();
        matrixRot.makeRotationAxis(new THREE.Vector3(0, 0, 1), Math.PI);
        meshFront.mesh.geometry.applyMatrix(matrixRot);
        meshBack.mesh.geometry.applyMatrix(matrixRot);
        meshMiddle.mesh.geometry.applyMatrix(matrixRot);

        meshFront.mesh.geometry.computeBoundingBox();
        meshBack.mesh.geometry.computeBoundingBox();
        meshMiddle.mesh.geometry.computeBoundingBox();

        var DEPTH_ORIG = Math.abs(meshFront.mesh.geometry.boundingBox.max.z - meshFront.mesh.geometry.boundingBox.min.z);
        var WIDTH_ORIG_MIDDLE = Math.abs(meshMiddle.mesh.geometry.boundingBox.max.x - meshMiddle.mesh.geometry.boundingBox.min.x);
        var WidthSymbols = Math.abs(this.meshUnion.meshSymbols.geometry.boundingBox.max.x - this.meshUnion.meshSymbols.geometry.boundingBox.min.x);
        var HeightMiddle = Math.abs(meshMiddle.mesh.geometry.boundingBox.max.y - meshMiddle.mesh.geometry.boundingBox.min.y);
        var SymbolHeight = Math.abs(this.meshUnion.meshSymbols.geometry.boundingBox.max.y - this.meshUnion.meshSymbols.geometry.boundingBox.min.y);

        var bulletScale = SymbolHeight * 3 / HeightMiddle;
        var WidthFront = bulletScale * Math.abs(meshFront.mesh.geometry.boundingBox.max.x - meshFront.mesh.geometry.boundingBox.min.x);
        var WidthMiddle = WidthSymbols - 0.25 * WidthFront;

        meshFront.mesh.scale.set(bulletScale, bulletScale, DEPTH_NEED / DEPTH_ORIG);
        meshBack.mesh.scale.set(bulletScale, bulletScale, DEPTH_NEED / DEPTH_ORIG);
        meshMiddle.mesh.scale.set(WidthMiddle / WIDTH_ORIG_MIDDLE, bulletScale, DEPTH_NEED/DEPTH_ORIG);

        var stickY = 0.5 * this.aveSymbolBottomY + 0.5 * this.aveSymbolTopY;
        var stickZ = this.meshUnion.meshSymbols.geometry.boundingBox.min.z + offsetZ;

        var OffsetX = 0;
        meshBack.mesh.position.set(OffsetX - meshBack.mesh.geometry.boundingBox.max.x*meshBack.mesh.scale.x + 0.3, stickY, stickZ);
        meshFront.mesh.position.set(OffsetX + WidthMiddle - meshFront.mesh.geometry.boundingBox.min.x*meshFront.mesh.scale.x - 0.3, stickY, stickZ);
        meshMiddle.mesh.position.set(OffsetX -meshMiddle.mesh.geometry.boundingBox.min.x*meshMiddle.mesh.scale.x, stickY, stickZ);

        this.stickfaceStart = this.meshUnion.meshFirst.geometry.faces.length;

        meshFront.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshFront.mesh.geometry, meshFront.mesh.matrix);

        meshBack.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshBack.mesh.geometry, meshBack.mesh.matrix);

        meshMiddle.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshMiddle.mesh.geometry, meshMiddle.mesh.matrix);
        this.meshUnion.meshFirst.geometry.computeBoundingBox();
        this.stickfaceEnd = this.meshUnion.meshFirst.geometry.faces.length;

        this.showing.meshArray['link0'] = null;
        this.showing.meshArray['link1'] = null;
        this.showing.meshArray['link2'] = null;

        var matrixRot = new THREE.Matrix4();
        matrixRot.makeRotationAxis(new THREE.Vector3(0, 0, 1), - Math.PI / 2);
        this.meshUnion.meshFirst.geometry.applyMatrix(matrixRot);
        this.meshUnion.meshSymbols.geometry.applyMatrix(matrixRot);
        if (null != this.meshUnion.meshFalang)
            this.meshUnion.meshFalang.geometry.applyMatrix(matrixRot);
        if (null != this.meshUnion.stones)
            this.meshUnion.stones.geometry.applyMatrix(matrixRot);

        this.meshUnion.meshFirst.geometry.computeBoundingBox();

        this.stickY_0 = this.meshUnion.meshFirst.geometry.boundingBox.max.y;
        this.stickY_1 = this.stickY_0;
        this.circleYNeck = this.circleYBrace = this.stickY_0;
        this.circleZ = stickZ;// + DEPTH_NEED * 0.5;
    },

    uniteArrow:function(linkScale, DEPTH_NEED, offsetZ){
        var meshFront = this.showing.meshArray['link0'];
        if (undefined == meshFront || null == meshFront || meshFront.meshType != 'link' || meshFront.mesh == null)
            return;
        var meshBack = this.showing.meshArray['link1'];
        if (undefined == meshBack || null == meshBack || meshBack.meshType != 'link' || meshBack.mesh == null)
            return;
        var meshMiddle = this.showing.meshArray['link2'];
        if (undefined == meshMiddle || null == meshMiddle || meshMiddle.meshType != 'link' || meshMiddle.mesh == null)
            return;

        meshFront.mesh.geometry.computeBoundingBox();
        meshBack.mesh.geometry.computeBoundingBox();
        meshMiddle.mesh.geometry.computeBoundingBox();

        var DEPTH_ORIG = Math.abs(meshFront.mesh.geometry.boundingBox.max.z - meshFront.mesh.geometry.boundingBox.min.z);
        var WIDTH_ORIG_MIDDLE = Math.abs(meshMiddle.mesh.geometry.boundingBox.max.x - meshMiddle.mesh.geometry.boundingBox.min.x);
        var WidthMiddle = Math.abs(this.meshUnion.meshSymbols.geometry.boundingBox.max.x - this.meshUnion.meshSymbols.geometry.boundingBox.min.x);
        var OffsetX = 0;
        meshFront.mesh.scale.set(linkScale.x, linkScale.y, DEPTH_NEED / DEPTH_ORIG);
        meshBack.mesh.scale.set(linkScale.x, linkScale.y, DEPTH_NEED / DEPTH_ORIG);
        meshMiddle.mesh.scale.set(WidthMiddle / WIDTH_ORIG_MIDDLE, linkScale.y, DEPTH_NEED/DEPTH_ORIG);

        var stickY = 0.5 * this.aveSymbolTopY + 0.5 * this.aveSymbolBottomY;
        var stickZ = this.meshUnion.meshSymbols.geometry.boundingBox.min.z + offsetZ + 0.5*DEPTH_NEED;

        meshFront.mesh.position.set(OffsetX - meshFront.mesh.geometry.boundingBox.max.x*meshFront.mesh.scale.x + 0.3, stickY, stickZ);
        meshBack.mesh.position.set(OffsetX + WidthMiddle - meshBack.mesh.geometry.boundingBox.min.x*meshBack.mesh.scale.x - 0.3, stickY, stickZ);
        meshMiddle.mesh.position.set(OffsetX -meshMiddle.mesh.geometry.boundingBox.min.x*meshMiddle.mesh.scale.x, stickY, stickZ);

        this.stickfaceStart = this.meshUnion.meshFirst.geometry.faces.length;

        meshFront.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshFront.mesh.geometry, meshFront.mesh.matrix);

        meshBack.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshBack.mesh.geometry, meshBack.mesh.matrix);

        meshMiddle.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshMiddle.mesh.geometry, meshMiddle.mesh.matrix);
        this.meshUnion.meshFirst.geometry.computeBoundingBox();
        this.stickfaceEnd = this.meshUnion.meshFirst.geometry.faces.length;

        this.stickY_0 = stickY + meshFront.mesh.scale.y * (0.5 * meshFront.mesh.geometry.boundingBox.max.y + 0.5 * meshFront.mesh.geometry.boundingBox.min.y);
        this.stickY_1 = stickY + meshBack.mesh.scale.y * (0.5 * meshBack.mesh.geometry.boundingBox.max.y + 0.5 * meshBack.mesh.geometry.boundingBox.min.y);
        this.circleYNeck = this.circleYBrace = this.stickY_0;
        this.circleZ = stickZ - 0.2;

        this.showing.meshArray['link0'] = null;
        this.showing.meshArray['link1'] = null;
        this.showing.meshArray['link2'] = null;
    },

    uniteBottle:function(linkScale, DEPTH_NEED, offsetZ){
        var meshFront = this.showing.meshArray['link0'];
        if (undefined == meshFront || null == meshFront || meshFront.meshType != 'link' || meshFront.mesh == null)
            return;
        var meshBack = this.showing.meshArray['link1'];
        if (undefined == meshBack || null == meshBack || meshBack.meshType != 'link' || meshBack.mesh == null)
            return;
        var meshUp = this.showing.meshArray['link2'];
        if (undefined == meshUp || null == meshUp || meshUp.meshType != 'link' || meshUp.mesh == null)
            return;
        var meshDown = this.showing.meshArray['link3'];
        if (undefined == meshDown || null == meshDown || meshDown.meshType != 'link' || meshDown.mesh == null)
            return;

        meshFront.mesh.geometry.computeBoundingBox();
        meshBack.mesh.geometry.computeBoundingBox();
        meshUp.mesh.geometry.computeBoundingBox();
        meshDown.mesh.geometry.computeBoundingBox();

        var interectLen = 0.412 * linkScale.y;
        var BottleInnerHeight = this.high1 - this.low2 - interectLen*2;
        var DEPTH_ORIG = Math.abs(meshFront.mesh.geometry.boundingBox.max.z - meshFront.mesh.geometry.boundingBox.min.z);
        var WIDTH_ORIG_MIDDLE = Math.abs(meshUp.mesh.geometry.boundingBox.max.x - meshUp.mesh.geometry.boundingBox.min.x);
        var WidthMiddle = Math.abs(this.meshUnion.meshSymbols.geometry.boundingBox.max.x - this.meshUnion.meshSymbols.geometry.boundingBox.min.x);
        var bottleScale = BottleInnerHeight / Math.abs(meshUp.mesh.geometry.boundingBox.min.y - meshDown.mesh.geometry.boundingBox.max.y);

        var OffsetX = Math.abs(meshFront.mesh.geometry.boundingBox.max.x - meshFront.mesh.geometry.boundingBox.min.x) / 6 * bottleScale;

        meshFront.mesh.scale.set(bottleScale, bottleScale, DEPTH_NEED / DEPTH_ORIG);
        meshBack.mesh.scale.set(bottleScale, bottleScale, DEPTH_NEED / DEPTH_ORIG);
        meshUp.mesh.scale.set(WidthMiddle / WIDTH_ORIG_MIDDLE, bottleScale, DEPTH_NEED/DEPTH_ORIG);
        meshDown.mesh.scale.set(WidthMiddle / WIDTH_ORIG_MIDDLE, bottleScale, DEPTH_NEED/DEPTH_ORIG);

        var stickY = this.low2 - meshDown.mesh.geometry.boundingBox.max.y * meshDown.mesh.scale.y + interectLen; //0.2为了结合更紧
        var stickZ = this.meshUnion.meshSymbols.geometry.boundingBox.min.z + offsetZ;

        meshFront.mesh.position.set(OffsetX - meshFront.mesh.geometry.boundingBox.max.x*meshFront.mesh.scale.x + interectLen, stickY, stickZ);
        meshBack.mesh.position.set(OffsetX + WidthMiddle - meshBack.mesh.geometry.boundingBox.min.x*meshBack.mesh.scale.x - interectLen, stickY, stickZ);
        meshUp.mesh.position.set(OffsetX -meshUp.mesh.geometry.boundingBox.min.x*meshUp.mesh.scale.x, stickY, stickZ);
        meshDown.mesh.position.set(OffsetX -meshDown.mesh.geometry.boundingBox.min.x*meshDown.mesh.scale.x, stickY, stickZ);

        this.stickfaceStart = this.meshUnion.meshFirst.geometry.faces.length;

        meshFront.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshFront.mesh.geometry, meshFront.mesh.matrix);

        meshBack.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshBack.mesh.geometry, meshBack.mesh.matrix);

        meshUp.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshUp.mesh.geometry, meshUp.mesh.matrix);

        meshDown.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshDown.mesh.geometry, meshDown.mesh.matrix);
        this.meshUnion.meshFirst.geometry.computeBoundingBox();
        this.stickfaceEnd = this.meshUnion.meshFirst.geometry.faces.length;

        this.stickY_0 = stickY + meshFront.mesh.scale.y * (0.5 * meshFront.mesh.geometry.boundingBox.max.y + 0.5 * meshFront.mesh.geometry.boundingBox.min.y);
        this.stickY_1 = stickY + meshBack.mesh.scale.y * (0.5 * meshBack.mesh.geometry.boundingBox.max.y + 0.5 * meshBack.mesh.geometry.boundingBox.min.y);
        this.circleYNeck = this.stickY_0;
        this.circleYBrace = this.stickY_0;
        this.circleZ = stickZ + 0.5 * DEPTH_NEED - 0.1;

        this.showing.meshArray['link0'] = null;
        this.showing.meshArray['link1'] = null;
        this.showing.meshArray['link2'] = null;
        this.showing.meshArray['link2'] = null;
    },
    uniteMovie:function(linkScale, DEPTH_NEED, offsetZ){

    },
    uniteDog:function (linkScale, DEPTH_NEED, offsetZ) {
        this.uniteCat(linkScale, DEPTH_NEED, offsetZ);
    },
    uniteCat:function(linkScale, DEPTH_NEED, offsetZ){
        var meshFront = this.showing.meshArray['link0'];
        if (undefined == meshFront || null == meshFront || meshFront.meshType != 'link' || meshFront.mesh == null)
            return;
        var meshBack = this.showing.meshArray['link1'];
        if (undefined == meshBack || null == meshBack || meshBack.meshType != 'link' || meshBack.mesh == null)
            return;

        meshFront.mesh.geometry.computeBoundingBox();
        meshBack.mesh.geometry.computeBoundingBox();

        var DEPTH_ORIG = Math.abs(meshFront.mesh.geometry.boundingBox.max.z - meshFront.mesh.geometry.boundingBox.min.z);
        var centerX = (this.meshUnion.meshSymbols.geometry.boundingBox.max.x + this.meshUnion.meshSymbols.geometry.boundingBox.min.x)/2;
        //var stickY = (this.minSymbolTopY + this.maxSymbolBottomY)/2;
        var stickY = 0.5 * this.aveSymbolTopY + 0.5 * this.aveSymbolBottomY;
        var stickZ = this.meshUnion.meshSymbols.geometry.boundingBox.min.z + offsetZ;

        meshFront.mesh.scale.set(linkScale.x, linkScale.y, DEPTH_NEED / DEPTH_ORIG);
        meshBack.mesh.scale.set(linkScale.x, linkScale.y, DEPTH_NEED / DEPTH_ORIG);

        meshFront.mesh.position.set(0, stickY, stickZ);
        meshBack.mesh.position.set(0, stickY, stickZ);

        var frontX = this.showing.getMergeDistance(this.meshUnion.meshSymbols.geometry, meshFront.mesh.geometry,
            this.firstSymbolFaceStart, this.firstSymbolFaceEnd,
            false, this.meshUnion.meshSymbols.scale, meshFront.mesh.scale, this.meshUnion.meshSymbols.position, meshFront.mesh.position, 3.0);

        var backX = this.showing.getMergeDistance(this.meshUnion.meshSymbols.geometry, meshBack.mesh.geometry,
            this.finalSymbolFaceStart, this.finalSymbolFaceEnd,
            true, this.meshUnion.meshSymbols.scale, meshBack.mesh.scale, this.meshUnion.meshSymbols.position, meshBack.mesh.position, 3.0);

        meshFront.mesh.position.x = frontX;
        meshBack.mesh.position.x = -backX;

        //var WIDTH_ORIG_FRONT = Math.abs(meshFront.mesh.geometry.boundingBox.max.x - meshFront.mesh.geometry.boundingBox.min.x);
        //var WIDTH_ORIG_BACK = Math.abs(meshBack.mesh.geometry.boundingBox.max.x - meshBack.mesh.geometry.boundingBox.min.x);
        //var WIDTH_ALL = WIDTH_ORIG_BACK + WIDTH_ORIG_FRONT;
        //if ( WIDTH_ALL <= 2 * this.symbolLength) {
        //    meshFront.mesh.position.set(1, stickY, stickZ);
        //    meshBack.mesh.position.set(this.showing.meshFirst.geometry.boundingBox.max.x - 1, stickY, stickZ);
        //}
        //else{
        //    meshFront.mesh.position.set( 1 + this.symbolLength/2 - meshFront.mesh.geometry.boundingBox.min.x - 0.5*WIDTH_ALL, stickY, stickZ);
        //    meshBack.mesh.position.set(-1 + this.symbolLength/2 + 0.5*WIDTH_ALL - meshBack.mesh.geometry.boundingBox.max.x, stickY, stickZ);
        //}

        this.stickfaceStart = this.meshUnion.meshFirst.geometry.faces.length;

        meshFront.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshFront.mesh.geometry, meshFront.mesh.matrix);

        meshBack.mesh.updateMatrix();
        this.meshUnion.meshFirst.geometry.mergeFast(meshBack.mesh.geometry, meshBack.mesh.matrix);
        this.meshUnion.meshFirst.geometry.computeBoundingBox();
        this.stickfaceEnd = this.meshUnion.meshFirst.geometry.faces.length;

        //this.stickY_0 = stickY + meshFront.mesh.scale.y * (0.5 * meshFront.mesh.geometry.boundingBox.max.y + 0.5 * meshFront.mesh.geometry.boundingBox.min.y);
        //this.stickY_1 = stickY + meshBack.mesh.scale.y * (0.5 * meshBack.mesh.geometry.boundingBox.max.y + 0.5 * meshBack.mesh.geometry.boundingBox.min.y);
        //this.circleY = this.stickY_0;

        this.stickY_0 = meshFront.mesh.position.y + meshFront.mesh.scale.y * meshFront.mesh.geometry.boundingBox.max.y - 1;
        this.stickY_1 = meshBack.mesh.position.y + meshBack.mesh.scale.y * meshBack.mesh.geometry.boundingBox.max.y - 1;
        this.circleYBrace = meshBack.mesh.position.y + linkScale.y*0.6;
        this.circleYNeck = Math.min(this.stickY_0, this.stickY_1);
        this.ringY = meshBack.mesh.position.y - linkScale.y*0.0;
        this.circleZ = stickZ + 0.2;// + DEPTH_NEED * 0.5 ;// + 0.5 * meshFront.mesh.geometry.boundingBox.max.z + 0.5 * meshFront.mesh.geometry.boundingBox.min.z;
        this.catTailWidth = (meshBack.mesh.geometry.boundingBox.max.x - meshBack.mesh.geometry.boundingBox.min.x) * meshBack.mesh.scale.x;
        this.showing.meshArray['link0'] = null;
        this.showing.meshArray['link1'] = null;
    },
}

SHOWING.prototype.scaleGeometry = function(mesh, scalex, scaley, scalez)
{
    var oldScale = mesh.scale.clone();
    var oldRotation = mesh.rotation.clone();
    var oldPosition = mesh.position.clone();

    mesh.scale.set(scalex, scaley, scalez);
    mesh.rotation.set(0,0,0);
    mesh.position.set(0,0,0);
    mesh.updateMatrix();
    mesh.geometry.applyMatrix(mesh.matrix);

    mesh.scale.copy(oldScale);
    mesh.position.copy(oldPosition);
    mesh.rotation.copy(oldRotation)
    mesh.updateMatrix();
    mesh.geometry.computeBoundingBox();
}

MeshUnion.prototype.uniteRingOneBody = function(params, DEPTH_NEED, RING_HEIGHT)
{
    this.meshSymbols.geometry.computeBoundingBox();
    var yCenter = 0;
    var currTotalHeight = 0;
    var minMergeDistR = 0;
    if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jiaxin){
        yCenter = 0.5 * Math.abs(this.meshFirst.geometry.boundingBox.max.y + this.meshFirst.geometry.boundingBox.min.y) * this.meshFirst.scale.y;
        //(params.stickY_0 + params.stickY_1) / 2;
        currTotalHeight = Math.abs(this.meshFirst.geometry.boundingBox.max.y - this.meshFirst.geometry.boundingBox.min.y) * this.meshFirst.scale.y;
        //Math.abs(params.stickY_1 - params.stickY_0);
    }
    else if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jianjie ||
        this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.gougou) {
        yCenter = (params.aveSymbolBottomY + params.aveSymbolTopY) / 2;
        currTotalHeight = params.aveSymbolTopY - params.aveSymbolBottomY;
    }
    else if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.maomi)
    {
        yCenter = params.ringY;
        currTotalHeight = params.aveSymbolTopY - params.aveSymbolBottomY;
        minMergeDistR = 0.15 * params.catTailWidth;
    }
    else {
        yCenter = (params.stickY_0 + params.stickY_1) / 2;
        currTotalHeight = Math.abs(this.meshSymbols.geometry.boundingBox.max.y - this.meshSymbols.geometry.boundingBox.min.y) * this.meshSymbols.scale.y;
    }

    var ringBody0 = this.showing.meshArray['ring0'].mesh;
    ringBody0.geometry.computeBoundingBox();
    var RING_LENGTH_ORIG = Math.abs(ringBody0.geometry.boundingBox.max.x - ringBody0.geometry.boundingBox.min.x);
    var RING_DEPTH_ORIG = Math.abs(ringBody0.geometry.boundingBox.max.z - ringBody0.geometry.boundingBox.min.z);
    var RING_HEIGHT_ORIG = Math.abs(ringBody0.geometry.boundingBox.max.y - ringBody0.geometry.boundingBox.min.y);

    var faceStartLeft, faceEndLeft, faceStartRight, faceEndRight;
    var linkMesh;
    if (this.showing.lastParamlist.linkstyle != this.showing.LinkStyle.jianjie && this.showing.lastParamlist.linkstyle != this.showing.LinkStyle.jiaxin)
    {
        //如果有连接棍，就让左侧戒指环和连接棍相连
        faceStartLeft = params.stickfaceStart;
        faceEndLeft = params.stickfaceEnd;
        faceStartRight = params.stickfaceStart;
        faceEndRight = params.stickfaceEnd;
        linkMesh = this.meshFirst;
    }
    else{
        //如果没有连接棍，就让左侧的戒指环和第一个字母相连
        faceStartLeft = params.firstSymbolFaceStart;
        faceEndLeft = params.firstSymbolFaceEnd;
        faceStartRight = params.finalSymbolFaceStart;
        faceEndRight = params.finalSymbolFaceEnd;
        linkMesh = this.meshSymbols;

    }

    //var HeadLength = Math.abs(linkMesh.geometry.boundingBox.max.x - linkMesh.geometry.boundingBox.min.x) * linkMesh.scale.x;

    var circum = (47 + parseFloat(this.showing.lastParamlist.size) + 7);
    //var ringBodyLen = circum - HeadLength;
    //var minRingBodyLen = 6;
    /*if (ringBodyLen < minRingBodyLen)
    {
        ringBodyLen = minRingBodyLen;
        var newSymbolsScale = (circum - ringBodyLen) / HeadLength;
        this.scaleGeometry(this.meshSymbols, newSymbolsScale, 1, 1);
        if (null != this.meshFalang)
            this.scaleGeometry(this.meshFalang, newSymbolsScale, 1, 1);
        if (null != this.stones)
            this.scaleGeometry(this.stones, newSymbolsScale, 1, 1);
    }*/

    ////ring body
    var ringHeightReal = Math.min(RING_HEIGHT, currTotalHeight);    //戒环高度
    ringBody0.scale.set ( circum / RING_LENGTH_ORIG, ringHeightReal / RING_HEIGHT_ORIG, DEPTH_NEED / RING_DEPTH_ORIG);

    //z对齐字母链
    var ZcenterSymbols = 0.5 * (this.meshSymbols.geometry.boundingBox.max.z + this.meshSymbols.geometry.boundingBox.min.z) * this.meshSymbols.scale.z;
    var ZcenterRingBody = 0.5 * (ringBody0.geometry.boundingBox.max.z + ringBody0.geometry.boundingBox.min.z) * ringBody0.scale.z;
    //y对齐字母链
    var YcenterRingBody = 0.5 * (ringBody0.geometry.boundingBox.max.y + ringBody0.geometry.boundingBox.min.y) * ringBody0.scale.y;

    ringBody0.position.set(0, yCenter - YcenterRingBody, ZcenterSymbols - ZcenterRingBody);
    var dist2Left = this.showing.getMergeDistance(linkMesh.geometry, ringBody0.geometry, faceStartLeft, faceEndLeft,
        false, linkMesh.scale, ringBody0.scale, linkMesh.position, ringBody0.position, 0.5);

    var dist2Right = this.showing.getMergeDistance(linkMesh.geometry, ringBody0.geometry, faceStartRight, faceEndRight,
        true, linkMesh.scale, ringBody0.scale, linkMesh.position, ringBody0.position, 0.5);

    var HeaderLength = - dist2Right - dist2Left - circum;  //0.6是结合部
    var ringBodyLen = circum - HeaderLength;
    var minRingBodyLen = 6;
    if (ringBodyLen < minRingBodyLen)
    {
        ringBodyLen = minRingBodyLen;
        var newSymbolsScale = (circum - ringBodyLen) / HeaderLength;
        this.scaleGeometry(this.meshSymbols, newSymbolsScale, 1, 1);
        if (null != this.meshFalang)
            this.scaleGeometry(this.meshFalang, newSymbolsScale, 1, 1);
        if (null != this.stones)
            this.scaleGeometry(this.stones, newSymbolsScale, 1, 1);
    }

    ringBody0.scale.x =  ringBodyLen / RING_LENGTH_ORIG;
    dist2Left = this.showing.getMergeDistance(linkMesh.geometry, ringBody0.geometry, faceStartLeft, faceEndLeft,
        false, linkMesh.scale, ringBody0.scale, linkMesh.position, ringBody0.position, 0.5);

    ringBody0.position.set(dist2Left, yCenter - YcenterRingBody, ZcenterSymbols - ZcenterRingBody);
    ringBody0.updateMatrix();
    this.meshFirst.geometry.mergeFast(ringBody0.geometry, ringBody0.matrix);

    //弯曲戒指
    params.radiusRing = circum / 2 / Math.PI;
    var centerX = 0.5 * this.meshSymbols.geometry.boundingBox.max.x + 0.5 * this.meshSymbols.geometry.boundingBox.min.x;
    var origin = new THREE.Vector3(centerX, 0, -params.radiusRing);
    var modifier = new THREE.CircleModifier();
    modifier.set(origin).modify(this.meshFirst.geometry, circum);
    modifier.set(origin).modify(this.meshSymbols.geometry, circum);
    if (null != this.meshFalang)
        modifier.set(origin).modify(this.meshFalang.geometry, circum);
    if (null != this.stones)
        modifier.set(origin).modify(this.stones.geometry, circum);
}

MeshUnion.prototype.uniteRingTwoBody = function(params, DEPTH_NEED, RING_HEIGHT)
{
    this.meshSymbols.geometry.computeBoundingBox();
    var yCenter = 0;
    var currTotalHeight = 0;
    var minMergeDistL = 0;
    var minMergeDistR = 0;
    if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jiaxin){
        yCenter = (params.stickY_0 + params.stickY_1) / 2;
        currTotalHeight = Math.abs(params.stickY_1 - params.stickY_0);
    }
    else if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.jianjie ||
        this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.gougou) {
        yCenter = (params.aveSymbolBottomY + params.aveSymbolTopY) / 2;
        currTotalHeight = params.aveSymbolTopY - params.aveSymbolBottomY;
    }
    else if (this.showing.lastParamlist.linkstyle == this.showing.LinkStyle.maomi)
    {
        yCenter = params.ringY;
        currTotalHeight = params.aveSymbolTopY - params.aveSymbolBottomY;
        minMergeDistR = 0.15 * params.catTailWidth;
    }
    else {
        yCenter = (params.stickY_0 + params.stickY_1) / 2;
        currTotalHeight = Math.abs(this.meshSymbols.geometry.boundingBox.max.y - this.meshSymbols.geometry.boundingBox.min.y) * this.meshSymbols.scale.y;
    }

    var ringBody0 = this.meshArray['ring0'].mesh;
    var ringBody1 = this.meshArray['ring1'].mesh;

    ringBody0.geometry.computeBoundingBox();
    var RING_LENGTH_ORIG = Math.abs(ringBody0.geometry.boundingBox.max.x - ringBody0.geometry.boundingBox.min.x);
    var RING_DEPTH_ORIG = Math.abs(ringBody0.geometry.boundingBox.max.z - ringBody0.geometry.boundingBox.min.z);
    var RING_HEIGHT_ORIG = Math.abs(ringBody0.geometry.boundingBox.max.y - ringBody0.geometry.boundingBox.min.y);

    var symbolLength = Math.abs(this.meshSymbols.geometry.boundingBox.max.x - this.meshSymbols.geometry.boundingBox.min.x);

    var circum = (47 + parseFloat(this.showing.lastParamlist.size) + 7);
    var minRingBodyLen = 3;
    var ringBodyLen = (circum - symbolLength)/2;
    if (ringBodyLen < minRingBodyLen)
    {
        ringBodyLen = minRingBodyLen + 1;
        var newSymbolsScale = (circum - minRingBodyLen * 2) / symbolLength;
        this.scaleGeometry(this.meshSymbols, newSymbolsScale, 1, 1);
        if (null != this.meshFalang)
            this.scaleGeometry(this.meshFalang, newSymbolsScale, 1, 1);
        if (null != this.stones)
            this.scaleGeometry(this.stones, newSymbolsScale, 1, 1);
    }
    else
        ringBodyLen += 1;

    ////ring body 1
    {
        var ringHeightReal = Math.min(RING_HEIGHT, currTotalHeight);    //戒环高度
        ringBody0.scale.set ( ringBodyLen / RING_LENGTH_ORIG, ringHeightReal / RING_HEIGHT_ORIG, DEPTH_NEED / RING_DEPTH_ORIG);
        var faceStart, faceEnd;
        var linkMesh;
        if (this.showing.lastParamlist.linkstyle != this.showing.LinkStyle.jianjie && this.showing.lastParamlist.linkstyle != this.showing.LinkStyle.jiaxin)
        {
            //如果有连接棍，就让左侧戒指环和连接棍相连
            faceStart = params.stickfaceStart;
            faceEnd = params.stickfaceEnd;
            linkMesh = this.meshFirst;
        }
        else{
            //如果没有连接棍，就让左侧的戒指环和第一个字母相连
            faceStart = params.firstSymbolFaceStart;
            faceEnd = params.firstSymbolFaceEnd;
            linkMesh = this.meshSymbols;
        }

        ringBody0.position.set(0, yCenter - ringHeightReal / 2, 0);

        var dist2Left = this.showing.getMergeDistance(linkMesh.geometry, ringBody0.geometry, faceStart, faceEnd,
            false, linkMesh.scale, ringBody0.scale, linkMesh.position, ringBody0.position, 1.0);

        //if (this.lastParamlist.linkstyle == this.LinkStyle.maomi)
        //    dist2Left += 0.2;

        ringBody0.position.set(dist2Left, yCenter - ringHeightReal / 2, 0);
        ringBody0.updateMatrix();
        this.meshFirst.geometry.mergeFast(ringBody0.geometry, ringBody0.matrix);

        /////ring body 2
        ringBody1.scale.copy(ringBody0.scale);
        if (this.showing.lastParamlist.linkstyle != this.showing.LinkStyle.jianjie && this.showing.lastParamlist.linkstyle != this.showing.LinkStyle.jiaxin)
        {
            //如果有连接棍，就让右侧戒指环和连接棍相连
            faceStart = params.stickfaceStart;
            faceEnd = params.stickfaceEnd;
            linkMesh = this.meshFirst;
        }
        else{
            //如果没有连接棍，就让右侧的戒指环和最后一个字母相连
            faceStart = params.finalSymbolFaceStart;
            faceEnd = params.finalSymbolFaceEnd;
            linkMesh = this.meshSymbols;
        }

        ringBody1.position.set(0, yCenter - ringHeightReal / 2, 0);

        var dist2Right = this.showing.getMergeDistance(linkMesh.geometry, ringBody1.geometry, faceStart, faceEnd,
            true, linkMesh.scale, ringBody1.scale, linkMesh.position, ringBody1.position, 1.0);

        ringBody1.position.set(-dist2Right, yCenter - ringHeightReal / 2, 0);
        ringBody1.updateMatrix();
        this.meshFirst.geometry.mergeFast(ringBody1.geometry, ringBody1.matrix);

        //弯曲戒指
        params.radiusRing = circum / 2 / Math.PI;
        var centerX = 0.5 * this.meshSymbols.geometry.boundingBox.max.x + 0.5 * this.meshSymbols.geometry.boundingBox.min.x;
        var origin = new THREE.Vector3(centerX, 0, -params.radiusRing);
        var modifier = new THREE.CircleModifier();
        modifier.set(origin).modify(this.meshFirst.geometry, circum);
        modifier.set(origin).modify(this.meshSymbols.geometry, circum);
        if (null != this.meshFalang)
            modifier.set(origin).modify(this.meshFalang.geometry, circum);
        if (null != this.stones)
            modifier.set(origin).modify(this.stones.geometry, circum);
    }
}

/*
SHOWING.prototype.getMeshEdgeX = function(geoSrc, scaleSrc, rayYmin, rayYmax, faceStart, faceEnd, toRight)
{
    if (null == geoSrc.boundingBox || undefined == geoSrc.boundingBox)
        geoSrc.computeBoundingBox();

    var MAXRANGE = 10000;
    var verta = new THREE.Vector3(0,0,0);
    var vertb = new THREE.Vector3(0,0,0);
    var vertc = new THREE.Vector3(0,0,0);
    var minFaceX = MAXRANGE;
    var maxFaceX = -MAXRANGE;

    var depthZ = geoSrc.boundingBox.max.z - geoSrc.boundingBox.min.z;
    if (Math.abs(depthZ) < 0.1)
        return 0;

    var diff = new THREE.Vector3();
    var edge1 = new THREE.Vector3();
    var edge2 = new THREE.Vector3();
    var normal = new THREE.Vector3();

    var startZ = geoSrc.boundingBox.min.z + depthZ / 4;
    var zzCnt = 4;
    var stepZ = depthZ / zzCnt;

    var startY = rayYmin;
    var yyCnt = 8;

    if (rayYmax == rayYmin)
    {
        var stepY = 0;
        yyCnt = 0;
    }
    else{
        var stepY = (rayYmax - rayYmin) / yyCnt;
    }

    if (scaleSrc.y == 0)
        scaleSrc.y = 1;
    if (scaleSrc.z == 0)
        scaleSrc.z = 1;

    for(var rayY = startY, yy=0; yy <= yyCnt; rayY += stepY, yy++)
        for(var rayZ = startZ, zz=0; zz <= zzCnt; rayZ += stepZ, zz++)
        {
            var ray = null;
            //从右向左打的射线
            if (toRight)
                ray = new THREE.Ray(new THREE.Vector3(MAXRANGE, rayY / scaleSrc.y, rayZ / scaleSrc.z), new THREE.Vector3(-1, 0, 0));
            else
                ray = new THREE.Ray(new THREE.Vector3(-MAXRANGE, rayY / scaleSrc.y, rayZ / scaleSrc.z), new THREE.Vector3(1, 0, 0));

            for (var i = faceStart + 1; i < faceEnd; i++) {
                var oldface = geoSrc.faces[i];
                if (toRight && oldface.normal.x <= 0)
                    continue;
                else if (!toRight && oldface.normal.x > 0)
                    continue;

                verta = geoSrc.vertices[oldface.a];
                vertb = geoSrc.vertices[oldface.b];
                vertc = geoSrc.vertices[oldface.c];

                if (toRight) {
                    if (verta.x > maxFaceX || vertb.x > maxFaceX || vertc.x > maxFaceX)
                    {
                        var intersectPt = ray.intersectTriangleFast(diff, edge1, edge2, normal, verta, vertb, vertc, true);
                        if (null == intersectPt)
                            continue;
                        maxFaceX = Math.max(maxFaceX, intersectPt.x);
                    }
                }
                else {
                    if (verta.x < minFaceX || vertb.x < minFaceX || vertc.x < minFaceX)
                    {
                        var intersectPt = ray.intersectTriangleFast(diff, edge1, edge2, normal, verta, vertb, vertc, true);
                        if (null == intersectPt)
                            continue;
                        minFaceX = Math.min(minFaceX, intersectPt.x);
                    }
                }
            }
        }

    if (-MAXRANGE == maxFaceX && MAXRANGE == minFaceX)
        return 0;   //射线和模型无交叉
    if (toRight)
        return maxFaceX * scaleSrc.x;
    else
        return minFaceX * scaleSrc.x;
}
*/

//merge后，geo1的z比geo2的z值要小
SHOWING.prototype.getMergeDistance = function(geoSrc, geoDst, faceStart, faceEnd, toRight, scaleSrc, scaleDst, posSrc, posDst, needInterect)
{
    if (null == geoSrc.boundingBox || undefined == geoSrc.boundingBox)
        geoSrc.computeBoundingBox();

    if (null == geoDst.boundingBox || undefined == geoDst.boundingBox)
        geoDst.computeBoundingBox();

    if (geoSrc.boundingBox.max.z < geoDst.boundingBox.min.z*scaleDst.z || geoDst.boundingBox.max.z*scaleDst.z < geoSrc.boundingBox.min.z)
        return 0;

    if (geoSrc.boundingBox.max.y < geoDst.boundingBox.min.y*scaleDst.y || geoDst.boundingBox.max.y*scaleDst.y < geoSrc.boundingBox.min.y)
        return 0;


    var intersectZ_min = Math.max(geoSrc.boundingBox.min.z*scaleSrc.z + posSrc.z, geoDst.boundingBox.min.z*scaleDst.z + posDst.z);
    var intersectZ_max = Math.min(geoSrc.boundingBox.max.z*scaleSrc.z + posSrc.z, geoDst.boundingBox.max.z*scaleDst.z + posDst.z);
    var intersectY_min = Math.max(geoSrc.boundingBox.min.y*scaleSrc.y + posSrc.y, geoDst.boundingBox.min.y*scaleDst.y + posDst.y);
    var intersectY_max = Math.min(geoSrc.boundingBox.max.y*scaleSrc.y + posSrc.y, geoDst.boundingBox.max.y*scaleDst.y + posDst.y);

    var depthZ = intersectZ_max - intersectZ_min;
    var heightY = intersectY_max - intersectY_min;
    if (Math.abs(depthZ) < 0.1 || Math.abs(heightY) < 0.1)
        return 0;

    var stepZ = depthZ / 4;
    var startZ = intersectZ_min;
    var endZ = intersectZ_max;

    var stepY = heightY / 8;
    var startY = intersectY_min;
    var endY = intersectY_max;

    var MAXRANGE = 10000;
    var minDist = MAXRANGE;
    var minDistRayVec = new THREE.Vector3();
    if (undefined == scaleSrc)
        scaleSrc = new THREE.Vector3(1,1,1);

    var ptPairs = new Array();
    var verta = new THREE.Vector3(0,0,0);
    var vertb = new THREE.Vector3(0,0,0);
    var vertc = new THREE.Vector3(0,0,0);
    var geo1, geo2;
    var face_start1,face_end1, face_start2, face_end2;
    var scale1 = null;
    var scale2 = null;
    var offset1 = null;
    var offset2 = null;

    if (scaleSrc.y == 0)
        scaleSrc.y = 1;
    if (scaleSrc.z == 0)
        scaleSrc.z = 1;
    if (scaleDst.y == 0)
        scaleDst.y = 1;
    if (scaleDst.z == 0)
        scaleDst.z = 1;

    var diff = new THREE.Vector3();
    var edge1 = new THREE.Vector3();
    var edge2 = new THREE.Vector3();
    var normal = new THREE.Vector3();

    for(var rayZ = startZ, zz=0; rayZ <= endZ; rayZ += stepZ, zz++)
        for(var rayY = startY, yy=0; rayY <= endY; rayY += stepY, yy++) {
            if (toRight) {
                geo1 = geoSrc;
                geo2 = geoDst;
                scale2 = scaleDst;
                scale1 = scaleSrc;
                face_start1 = faceStart;
                face_end1 = faceEnd;
                face_start2 = 0;
                face_end2 = geoDst.faces.length;
                offset1 = posSrc;
                offset2 = posDst;
            }
            else{
                geo2 = geoSrc;
                geo1 = geoDst;
                scale1 = scaleDst;
                scale2 = scaleSrc;
                face_start2 = faceStart;
                face_end2 = faceEnd;
                face_start1 = 0;
                face_end1 = geoDst.faces.length;
                offset1 = posDst;
                offset2 = posSrc;
            }

            //从右向左打的射线
            var ray1 = new THREE.Ray(new THREE.Vector3(MAXRANGE, (rayY - offset1.y) / scale1.y, (rayZ - offset1.z) / scale1.z), new THREE.Vector3(-1, 0, 0));
            //计算左边模型的最右端
            var maxFaceX = -MAXRANGE;
            for (var i = face_start1+1; i < face_end1; i++)
            {
                var oldface = geo1.faces[i];
                if (oldface.normal.x <= 0)
                    continue;

                verta = geo1.vertices[oldface.a];
                vertb = geo1.vertices[oldface.b];
                vertc = geo1.vertices[oldface.c];

                if (verta.x > maxFaceX || vertb.x > maxFaceX || vertc.x > maxFaceX) {
                    var intersectPt1 = ray1.intersectTriangleFast(diff, edge1, edge2, normal, verta, vertb, vertc, true);
                    if (null == intersectPt1)
                        continue;
                    else
                        maxFaceX = Math.max(maxFaceX, intersectPt1.x);
                }
            }
            if (-MAXRANGE == maxFaceX)
                continue;   //射线和模型无交叉

            maxFaceX *= scale1.x;

            //从左向右打的射线
            var minFaceX = MAXRANGE;
            var ray2 = new THREE.Ray(new THREE.Vector3(-MAXRANGE, (rayY - offset2.y) / scale2.y, (rayZ - offset2.z) / scale2.z), new THREE.Vector3(1, 0, 0));
            //计算右边模型的最左端
            for (var i = face_start2 +1; i < face_end2; i++)
            {
                var oldface = geo2.faces[i];
                if (oldface.normal.x >= 0)
                    continue;

                verta = geo2.vertices[oldface.a];
                vertb = geo2.vertices[oldface.b];
                vertc = geo2.vertices[oldface.c];

                if (verta.x < minFaceX || vertb.x < minFaceX || vertc.x < minFaceX) {
                    var intersectPt2 = ray2.intersectTriangleFast(diff, edge1, edge2, normal, verta, vertb, vertc, true);
                    if (null == intersectPt2)
                        continue;
                    else
                        minFaceX = Math.min(minFaceX, intersectPt2.x);
                }
            }
            if (MAXRANGE == minFaceX)
                continue;   //射线和模型无交叉

            minFaceX *= scale2.x;

            var dist = minFaceX - maxFaceX;
            if (dist < minDist) {
                //记录两模型间最近的距离
                minDist = dist;
                minDistRayVec.y = yy;
                minDistRayVec.z = zz;
            }

            //把所有被射线连接的两点间距离保存下来，用y和z坐标作为索引
            var ptPairKey = '' + yy + '/' + zz;
            ptPairs[ptPairKey] = dist;
        }

    if (MAXRANGE == minDist)
        return 0;

    if (undefined == needInterect || true == needInterect)
        needInterect = 1.0;
    else if (false == needInterect)
        needInterect = 0;

    if (needInterect > 0) {
        //计算最接近点周围的平均距离
        var sumDistDiff = 0;
        var count = 0;
        var areaSize = 2;
        for (var y = minDistRayVec.y - areaSize; y <= minDistRayVec.y + areaSize; y++)
            for (var z = minDistRayVec.z - areaSize; z <= minDistRayVec.z + areaSize; z++) {
                if (Math.abs(y - minDistRayVec.y) == 0 && Math.abs(z - minDistRayVec.z) == 0)
                    continue;
                var dist = ptPairs['' + y + '/' + z];
                if (dist != undefined) {
                    var power = 4 / ( Math.abs(y - minDistRayVec.y) + Math.abs(z - minDistRayVec.z));
                    sumDistDiff += Math.abs(dist - minDist) * power;
                    count += power;
                }
            }

        if (count == 0)
            return 0;   //不应出现

        var plusIntersect = 0.5 * needInterect;    //浮动上限
        var minIntersect = 0.3 * needInterect;     //浮动下限
        var diff = Math.abs(sumDistDiff / count);
        if (diff > plusIntersect)
            minDist += plusIntersect;
        else if (diff < minIntersect)
            minDist += minIntersect;
        else
            minDist += diff;
    }
    return minDist;
}

//merge后，geo1的z比geo2的z值要小
SHOWING.prototype.getMergeDistanceVert = function(geoSrc, geoDst, faceStart, faceEnd, toDown, scaleSrc, scaleDst, posSrc, posDst, needInterect)
{
    if (null == geoSrc.boundingBox || undefined == geoSrc.boundingBox)
        geoSrc.computeBoundingBox();

    if (null == geoDst.boundingBox || undefined == geoDst.boundingBox)
        geoDst.computeBoundingBox();

    if (geoSrc.boundingBox.max.z < geoDst.boundingBox.min.z*scaleDst.z || geoDst.boundingBox.max.z*scaleDst.z < geoSrc.boundingBox.min.z)
        return 0;

    if (geoSrc.boundingBox.max.x < geoDst.boundingBox.min.y*scaleDst.x || geoDst.boundingBox.max.y*scaleDst.x < geoSrc.boundingBox.min.x)
        return 0;


    var intersectZ_min = Math.max(geoSrc.boundingBox.min.z*scaleSrc.z + posSrc.z, geoDst.boundingBox.min.z*scaleDst.z + posDst.z);
    var intersectZ_max = Math.min(geoSrc.boundingBox.max.z*scaleSrc.z + posSrc.z, geoDst.boundingBox.max.z*scaleDst.z + posDst.z);
    var intersectX_min = Math.max(geoSrc.boundingBox.min.x*scaleSrc.x + posSrc.x, geoDst.boundingBox.min.x*scaleDst.x + posDst.x);
    var intersectX_max = Math.min(geoSrc.boundingBox.max.x*scaleSrc.x + posSrc.x, geoDst.boundingBox.max.x*scaleDst.x + posDst.x);

    var depthZ = intersectZ_max - intersectZ_min;
    var heightX = intersectX_max - intersectX_min;
    if (Math.abs(depthZ) < 0.1 || Math.abs(heightX) < 0.1)
        return 0;

    var stepZ = depthZ / 8;
    var startZ = intersectZ_min;
    var endZ = intersectZ_max;

    var stepX = heightX / 8;
    var startX = intersectX_min;
    var endX = intersectX_max;

    var MAXRANGE = 10000;
    var minDist = MAXRANGE;
    var minDistRayVec = new THREE.Vector3();
    if (undefined == scaleSrc)
        scaleSrc = new THREE.Vector3(1,1,1);

    var ptPairs = new Array();
    var verta = new THREE.Vector3(0,0,0);
    var vertb = new THREE.Vector3(0,0,0);
    var vertc = new THREE.Vector3(0,0,0);
    var geo1, geo2;
    var face_start1,face_end1, face_start2, face_end2;
    var scale1 = null;
    var scale2 = null;
    var offset1 = null;
    var offset2 = null;

    if (scaleSrc.x == 0)
        scaleSrc.x = 1;
    if (scaleSrc.z == 0)
        scaleSrc.z = 1;
    if (scaleDst.x == 0)
        scaleDst.x = 1;
    if (scaleDst.z == 0)
        scaleDst.z = 1;

    var diff = new THREE.Vector3();
    var edge1 = new THREE.Vector3();
    var edge2 = new THREE.Vector3();
    var normal = new THREE.Vector3();

    for(var rayZ = startZ, zz=0; rayZ <= endZ; rayZ += stepZ, zz++)
        for(var rayX = startX, xx=0; rayX <= endX; rayX += stepX, xx++) {
            if (toDown) {
                geo1 = geoSrc;
                geo2 = geoDst;
                scale2 = scaleDst;
                scale1 = scaleSrc;
                face_start1 = faceStart;
                face_end1 = faceEnd;
                face_start2 = 0;
                face_end2 = geoDst.faces.length;
                offset1 = posSrc;
                offset2 = posDst;
            }
            else{
                geo2 = geoSrc;
                geo1 = geoDst;
                scale1 = scaleDst;
                scale2 = scaleSrc;
                face_start2 = faceStart;
                face_end2 = faceEnd;
                face_start1 = 0;
                face_end1 = geoDst.faces.length;
                offset1 = posDst;
                offset2 = posSrc;
            }

            //从上向下打的射线
            var ray2 = new THREE.Ray(new THREE.Vector3( (rayX - offset2.x) / scale1.x, MAXRANGE, (rayZ - offset2.z) / scale2.z), new THREE.Vector3(0, -1, 0));
            //计算下边模型的最上端
            var downFaceY = -MAXRANGE;
            for (var i = face_start2+1; i < face_end2; i++)
            {
                var oldface = geo2.faces[i];
                if (oldface.normal.y <= 0)
                    continue;

                verta = geo2.vertices[oldface.a];
                vertb = geo2.vertices[oldface.b];
                vertc = geo2.vertices[oldface.c];

                if (verta.y > downFaceY || vertb.y > downFaceY || vertc.y > downFaceY) {
                    var intersectPt2 = ray2.intersectTriangleFast(diff, edge1, edge2, normal, verta, vertb, vertc, true);
                    if (null == intersectPt2)
                        continue;
                    else
                        downFaceY = Math.max(downFaceY, intersectPt2.y);
                }
            }
            if (-MAXRANGE == downFaceY)
                continue;   //射线和模型无交叉

            downFaceY *= scale2.y;

            //从下向上打的射线
            var upFaceY = MAXRANGE;
            var ray1 = new THREE.Ray(new THREE.Vector3((rayX - offset1.x) / scale2.x, -MAXRANGE, (rayZ - offset1.z) / scale1.z), new THREE.Vector3(0, 1, 0));
            //计算上边模型的最下端
            for (var i = face_start1 +1; i < face_end1; i++)
            {
                var oldface = geo1.faces[i];
                if (oldface.normal.y >= 0)
                    continue;

                verta = geo1.vertices[oldface.a];
                vertb = geo1.vertices[oldface.b];
                vertc = geo1.vertices[oldface.c];

                if (verta.y < upFaceY || vertb.y < upFaceY || vertc.y < upFaceY) {
                    var intersectPt1 = ray1.intersectTriangleFast(diff, edge1, edge2, normal, verta, vertb, vertc, true);
                    if (null == intersectPt1)
                        continue;
                    else
                        upFaceY = Math.min(upFaceY, intersectPt1.y);
                }
            }
            if (MAXRANGE == upFaceY)
                continue;   //射线和模型无交叉

            upFaceY *= scale1.y;

            var dist = upFaceY - downFaceY;
            //console.log("dist:" + dist + ", upFaceY:" + upFaceY + ", downFaceY:" + downFaceY + ", rayX:" + rayX + ", rayZ:" + rayZ);
            if (dist < minDist) {
                //记录两模型间最近的距离
                minDist = dist;
                minDistRayVec.x = xx;
                minDistRayVec.z = zz;
            }

            //把所有被射线连接的两点间距离保存下来，用x和z坐标作为索引
            var ptPairKey = '' + xx + '/' + zz;
            ptPairs[ptPairKey] = dist;
        }

    if (MAXRANGE == minDist)
        return 0;

    if (undefined == needInterect || true == needInterect)
        needInterect = 1.0;
    else if (false == needInterect)
        needInterect = 0.0;


    if (needInterect > 0) {
        //计算最接近点周围的平均距离
        var sumDistDiff = 0;
        var count = 0;
        var areaSize = 2;
        for (var x = minDistRayVec.x - areaSize; x <= minDistRayVec.x + areaSize; x++)
            for (var z = minDistRayVec.z - areaSize; z <= minDistRayVec.z + areaSize; z++) {
                if (Math.abs(x - minDistRayVec.x) == 0 && Math.abs(z - minDistRayVec.z) == 0)
                    continue;
                var dist = ptPairs['' + x + '/' + z];
                if (dist != undefined) {
                    var power = 4 / ( Math.abs(x - minDistRayVec.x) + Math.abs(z - minDistRayVec.z));
                    sumDistDiff += Math.abs(dist - minDist) * power;
                    count += power;
                }
            }

        if (count == 0)
            return 0;   //不应出现

        var plusIntersect = 0.5 * needInterect;    //浮动上限
        var minIntersect = 0.3 * needInterect;     //浮动下限
        var diff = Math.abs(sumDistDiff / count);
        if (diff > plusIntersect)
            minDist += plusIntersect;
        else if (diff < minIntersect)
            minDist += minIntersect;
        else
            minDist += diff;
    }
    return minDist;
}

SHOWING.prototype.IfHaveColor = function(fontid)
{
    if (undefined == this.fontCfgMap || null == this.fontCfgMap)
        this.loadFontConfig();
    var fontcfg = this.fontCfgMap['' + fontid];
    return fontcfg['Havecolor'] == '1' ? true : false;
}

MeshUnion.prototype.IfHaveStone = function()
{
    if (undefined != this.stones && null != this.stones)
        return true;
    if (undefined != this.meshMainStones && null != this.meshMainStones)
        return true;
}

SHOWING.prototype.IfHaveStone = function()
{
    for(var i=0, il=this.meshUnionArray.length; i<il; i++)
    {
        if (this.meshUnionArray[i].IfHaveStone())
            return true;
    }

    return false;
}

MeshUnion.prototype.IfHavePearl = function()
{
    if (undefined != this.meshMainPearl && null != this.meshMainPearl)
        return true;
}

SHOWING.prototype.IfHavePearl = function()
{
    for(var i=0, il=this.meshUnionArray.length; i<il; i++)
    {
        if (this.meshUnionArray[i].IfHavePearl())
            return true;
    }

    return false;
}

SHOWING.prototype.IfHaveChain = function(jewelID, linkstyle)
{
    if (null == this.styleCfgMap)
        return false;

    if (this.IsNewStyle(jewelID, linkstyle))
    {
        var styleid = '' + jewelID + linkstyle;
        var styleCfg = this.styleCfgMap[styleid];
        if(undefined == styleCfg)
            return false;
        var chainidStr = '' + styleCfg['chainid'];
        if ('' == chainidStr.trim() )
            return false;

        if ('no' == chainidStr.toLowerCase())
            return false;

        var chainidArray = chainidStr.split('/');
        return chainidArray.length > 0;
    }
    else{
        return jewelID == 'neck' || jewelID == 'brace' || jewelID == 'star';
    }
}

SHOWING.prototype.IsNewStyle = function(jewelID, linkstyle)
{
    var styleid = '' + jewelID + linkstyle;

    return (undefined != this.styleCfgMap[styleid]);
}

SHOWING.prototype.getSymbolMin = function(jewelID, linkstyle)
{
    if (null == this.styleCfgMap)
        return 0;

    var styleid = '' + jewelID + linkstyle;
    var styleCfgData = this.styleCfgMap[styleid];
    if (undefined == styleCfgData)
        return 1;

    return parseInt(styleCfgData['symmin']);
}

SHOWING.prototype.getSymbolMax = function(jewelID, linkstyle)
{
    if (null == this.styleCfgMap)
        return 0;

    var styleid = '' + jewelID + linkstyle;
    var styleCfgData = this.styleCfgMap[styleid];
    if (undefined == styleCfgData)
    {
        return 12;
    }

    return parseInt(styleCfgData['symmax']);
}

SHOWING.prototype.getSizeMin = function(jewelID, linkstyle)
{
    if (null == this.ringsizeCfgMap)
        return 0;
    var styleid = '' + jewelID + linkstyle;
    var sizeArray = this.ringsizeCfgMap[styleid];
    if (undefined == sizeArray)
        return 0;
    var minSize = 10000;
    for (var id in sizeArray)
    {
        var ringSizeData = sizeArray[id];
        if (undefined == ringSizeData)
            continue;

        var size = parseInt(ringSizeData['size']);
        if (size < minSize)
            minSize = size;
    }

    return minSize;
}

SHOWING.prototype.getSizeMax = function(jewelID, linkstyle)
{
    if (null == this.ringsizeCfgMap)
        return 0;
    var styleid = '' + jewelID + linkstyle;
    var sizeArray = this.ringsizeCfgMap[styleid];
    if (undefined == sizeArray)
        return 0;
    var maxSize = -1;
    for (var id in sizeArray)
    {
        var ringSizeData = sizeArray[id];
        if (undefined == ringSizeData)
            continue;

        var size = parseInt(ringSizeData['size']);
        if (size > maxSize)
            maxSize = size;
    }

    return maxSize;
}

// Converts canvas to an image
SHOWING.prototype.convertCanvasToImage = function(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/jpeg", 0.9);
    return image;
    /*var canvasT = document.createElement("canvas");
     canvasT.width = canvas.width;
     canvasT.height = canvas.width;
     var oCtx = canvasT.getContext('2d');
     oCtx.drawImage(image, 0, 0, canvas.width, canvas.width, 0, 0, canvasT.width, canvasT.height);

     var image2 = new Image();
     image2.src = canvasT.toDataURL("image/jpeg", 0.9);
    return image2;*/
}

SHOWING.prototype.CaptureFrontImage = function()
{
    if (undefined == this.cameraCap || null == this.cameraCap)
        return null;

    this.renderer.render(this.scene, this.cameraCap);
    var image = this.convertCanvasToImage(this.renderer.domElement);
    return image;
}

SHOWING.prototype.CaptureBackImage = function()
{
    if (undefined == this.cameraCap2 || null == this.cameraCap2)
        return null;

    this.renderer.render(this.scene, this.cameraCap2);
    var image = this.convertCanvasToImage(this.renderer.domElement);
    return image;
}

SHOWING.prototype.CaptureFrontUpImage = function()
{
    if (undefined == this.cameraCap3 || null == this.cameraCap3)
        return null;

    this.renderer.render(this.scene, this.cameraCap3);
    var image = this.convertCanvasToImage(this.renderer.domElement);
    return image;
}

SHOWING.prototype.CaptureLeftFrontUpImage = function()
{
    if (undefined == this.cameraCap4 || null == this.cameraCap4)
        return null;

    this.renderer.render(this.scene, this.cameraCap4);
    var image = this.convertCanvasToImage(this.renderer.domElement);
    return image;
}

SHOWING.prototype.CaptureRightFrontUpImage = function()
{
    if (undefined == this.cameraCap5 || null == this.cameraCap5)
        return null;

    this.renderer.render(this.scene, this.cameraCap5);
    var image = this.convertCanvasToImage(this.renderer.domElement);
    return image;
}

SHOWING.prototype.capturePictures = function()
{
    /**
     * 在本地进行文件保存
     * @param  {String} data     要保存到本地的图片数据
     * @param  {String} filename 文件名
     */
    /*var saveFile = function (data, _filename) {
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = _filename;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    };*/

    var imageArray = new Array();
    var image1 = this.CaptureFrontImage();
    imageArray.push(image1);
    //saveFile(image1.src, filename + '.jpg');

    var image2 = this.CaptureBackImage();
    imageArray.push(image2);
    //saveFile(image2.src, filename + '_2.jpg');

    var image3 = this.CaptureFrontUpImage();
    imageArray.push(image3);
    //saveFile(image3.src, filename + '_3.jpg');

    var image4 = this.CaptureLeftFrontUpImage();
    imageArray.push(image4);
    //saveFile(image4.src, filename + '_4.jpg');

    var image5 = this.CaptureRightFrontUpImage();
    imageArray.push(image5);
    //saveFile(image5.src, filename + '_5.jpg');
    return imageArray;
}

/*function initFileSystem(){
 console.info(window.TEMPORARY);  //0  临时
 console.info(window.PERSISTENT); //1  持久

 //如果使用持久存储，需要使用requestQuota
 window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
 //当前请求存储空间，如果不修改大小的话，只需要请求一次就可以了
 console.info(window.webkitStorageInfo);
 window.webkitStorageInfo.requestQuota(window.PERSISTENT, 1024 * 1024 * 5, function (gratedBytes) {
 console.log('请求成功的空间：' + gratedBytes);
 window.requestFileSystem(window.PERSISTENT, gratedBytes, initFs, errorHandler);
 }, errorHandler);

 function initFs(fs) {
 //创建文件，只能创建当前目录下的文件
 //如果不指定create=true，文件不存在抛出异常，‘DOMException: A requested file or directory could not be found at the time an operation was processed.’
 //如果不指定exclusive，create=true的话,不存在创建，存在重新覆盖
 //在文件件目录操作中create=true如果文件目录存在的话不清空
 /!*        fs.root.getFile('~/test/test1.txt', {
 create: true,  //true:创建新文件，如果文件存在抛出异常执行errorHandle，不影响程序执行
 exclusive: true //是否高级文件验证
 }, function (fileEntry) {
 console.info(fileEntry);
 console.log('文件创建成功，' + fileEntry.name);
 }, errorHandler);*!/

 //创建目录下的文件(不能直接指定路径创建文件)
 fs.root.getDirectory('tmpABC', { create: true }, function (dirEntry) {

 dirEntry.getFile('log3218.txt', { create: true }, function (fileEntity) {
 console.log('目录下文件创建成功：' + fileEntity.fullPath);
 if (fileEntity.isFile) {
 fileEntity.createWriter(function (fileWriter) {
 //写入的内容可以可是File 或者Blob
 var blob = new Blob(['hello 中国'], {
 type: 'text/plain'
 });
 fileWriter.write(blob);
 //显示文件内容
 showFile(fileEntity);
 }, errorHandler);
 }
 }, errorHandler);

 dirEntry.getFile('test1546.txt', { create: true }, function (fileEntry) {
 console.log('目录下文件创建成功：' + fileEntry.fullPath);
 }, errorHandler);
 }, errorHandler)
 }
 function errorHandler(err) {
 console.error(err);
 //console.info(typeof FileError);//FileError 目前不可用或已经放弃
 console.info('创建文件是失败');
 }

 //显示指定fileEntity中的内容
 function showFile(fileEntity) {
 fileEntity.file(function (file) {
 var reader = new FileReader();
 reader.onloadend = function (e) {
 var txt1 = document.getElementById('txt1');
 //txt1.innerHTML = '写入文件成功：' + reader.result;
 }
 reader.readAsText(file);
 });
 }


 }*/


