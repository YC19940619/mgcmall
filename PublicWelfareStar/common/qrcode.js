(function(f) {
	f.fn.erweima = function(a) {
		if (null != a) {
			if (null != a.text) {
				var c = a.text,
				b, e, g, d;
				b = "";
				g = c.length;
				for (e = 0; e < g; e++) d = c.charCodeAt(e),
				1 <= d && 127 >= d ? b += c.charAt(e) : (2047 < d ? (b += String.fromCharCode(224 | d >> 12 & 15), b += String.fromCharCode(128 | d >> 6 & 63)) : b += String.fromCharCode(192 | d >> 6 & 31), b += String.fromCharCode(128 | d >> 0 & 63));
				a.text = b
			}
			null != a.radius && (c = .01 * parseInt(a.radius), a.radius = c);
			null != a.mSize && (c = .01 * parseInt(a.mSize), a.mSize = c);
			null != a.mPosX && (c = .01 * parseInt(a.mPosX), a.mPosX = c);
			null != a.mPosY && (c = .01 * parseInt(a.mPosY), a.mPosY = c)
		}
		a = f.extend({
			render: "image",
			ecLevel: "H",
			minVersion: 6,
			fill: "#000",
			background: "",
			text: "",
			size: 500,
			radius: 0,
			quiet: 4,
			mode: 2,
			mSize: .1,
			mPosX: .5,
			mPosY: .5,
			label: "",
			fontname: "Microsoft YaHei",
			fontcolor: "#ededed"
		},
		a);
		f(this).empty().qrcode(a)
	}
})(jQuery);

//render：canvas / image / div   渲染模式     
//ecLevel：L:7% / M:15% / Q:25% / H:30%    二维码识别度（越大越容易扫描）
//-----------------------------------------------------------------------------------
//minVersion：6              二维码密度，推荐0-10
//fill：'#666'               二维码颜色
//background：'#fff'           二维码背景颜色
//text：'www.baidu.com'         最后扫出来的结果
//size：300                 二维码大小
//radius：50                点圆滑度,50以内
//quiet：4                  二维码边框
//------------------------------------------------------------------------------------
//mode：2                  不显示LOGO：0 / 文字且占整行：1 / 文字居中：2 / 图片且占整行：3 / 图片居中：4
//mSize：20                 logo大小
//mPosX：50                 logo水平坐标,50居中
//mPosY：50                 logo垂直坐标,50居中
//label:'扫码关注我'           logo文字
//fontname:'微软雅黑'          logo字体名
//fontcolor：'orange'          logo字体颜色
//image：image:$("#imgLogo")[0]   设置的时候，需要把mode改成4，调用整个图片控件