// 首页轮播
$(function(){
    FastClick.attach(document.body);
    $.ajax({
	    type:"get",
	    url:index_htnk,
	    async:true,
	    crossDomain: true,
	    data:{},
	    beforeSend:function(){},
	    success:function(data){
	    	console.log(data)
	        var carousel_pictures = data.data.carousel_pictures;//顶部轮播
	        var bannerstr='';
	        for(var i = 0;i<carousel_pictures.length;i++){
	            bannerstr += '<div class="swiper-slide" spuid="'+carousel_pictures[i].link+'"><img class="swiper-lazy" data-src="'+dataimgsrc(carousel_pictures[i].medium_picture)+'"/><div class="swiper-lazy-preloader"></div></div>'
	        }
	        $(".banner .list").html(bannerstr);
	        var swiper = new Swiper('.banner', {
	            pagination: '.swiper-pagination',
	            paginationClickable: true,
	            autoplay: 3000,
	            autoplayDisableOnInteraction: false,
	            loop:true,
	            lazyLoading : true
	        });
	    },
	    error:function(){
	        var swiper = new Swiper('.swiper-containerNew', {
	            pagination: '.swiper-pagination',
	            paginationClickable: true,
//	            autoplay: 2500,
	            autoplayDisableOnInteraction: false,
	            loop:true,
	            lazyLoading : true
	        });
	        new Toast({context:$('body'),message:"网络加载失败"}).show();
	    }
	})
	//首页商城定制跳转
	$('.madeAred').click(function(){
		//localStorage.removeItem('made_parameter');
        localStorage.removeItem('made_parameter');
		window.location.href="html/made.html"
        //window.history.pushState(null, null, "html/made.html");
	})
	$('.shopingArea').click(function(){
        localStorage.removeItem('mall_parameter');
		window.location.href="html/ShoppingMall.html"
	})
    $('.activity').click(function(){
        window.location.href="html/activity.html"
    })
	// 获取数据函数
	getData('10002','.seriesWrap1',3);
	getData('10000','.seriesWrap2',3);
    getData('10001','.seriesWrap3',1);
    getData('10034','.seriesWrap4',1);
	function getData(seriesNum,wrap,num){
		$.ajax({
			type:'post',
			url:series,
			data:{
				'series_id':seriesNum
			},
			success:function(data){
				var data=data.data;
				var tit=data[0].name.split("-")[0];
				console.log(tit);
				var str="";
				str+='<p class="tit">'
					+tit
					+'</p><p class="descript">'
					+data[0].description
					+'</p><div class="ban swiper-container"><div class="swiper-wrapper" >'
				for(var i=0;i<data.length;i++){
					str+='<div class="swiper-slide" spuid="'
						+data[i].id
						+'" is_custom="'
						+data[i].is_custom
						+'"><dl><dt><img src="'
						+dataimgsrc(data[i].img)
						+'" alt="" /></dt><dd>'
						+data[i].name
						+'</dd></dl></div>'
				}
				str+='</div></div><div class="swiper-button-prev swiper-button-black">'
					+'</div><div class="swiper-button-next swiper-button-black"></div>'
				$(wrap).html(str);
				console.log(num)
				new Swiper(wrap+' .ban', {
			        nextButton:wrap+' .swiper-button-next',
			    	prevButton:wrap+' .swiper-button-prev',
			//	    autoplay: 3000,
					slidesPerView:num,//每个slide显示几条数据
					slidesPerGroup: 3,
					spaceBetween: 15,//设置slide间的间距
			        autoplayDisableOnInteraction: false,
//				    loop:true,
			        lazyLoading : true
			   });
			},
			error:function(){
				
			}
		})
	}
    $(".seriesWrap").delegate(".swiper-slide","click",function(){
        var is_custom = $(this).attr("is_custom");
        var spuid = $(this).attr("spuid");
        var screen_id = $(".screen").find(".active").attr("id");
        var mall_parameter ={
            list:$(".itemnav .active").index(),
            scrollTop:$(".mescroll").scrollTop(),
            salesvolumebtn:$(".salesvolumebtn").attr("class"),
            pricebtn:$(".pricebtn").attr("sort"),
            screen_id:screen_id
        }
        mall_parameter = JSON.stringify(mall_parameter);
        localStorage.setItem("mall_parameter", mall_parameter);
        if(is_custom == "true"){
            window.location.href="webgl/customizations.html?spuid="+spuid;
        }else{
            window.location.href="html/itemdetails.html?spuid="+spuid;
        }
    })
})
	
