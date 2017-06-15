$(function(){
	WPBridge.callMethod("JsInvokeNative", "wpShowLoadingDialog", {},function() {});
	window.aseFail = "";
	//品牌id	列表页categoryId，categoryName
	var brandId=localStorage.getItem("brandid");
	var ResultName=localStorage.getItem("resultName");
	var ResultId=localStorage.getItem("resultid");
	$(".all").html(ResultName);
	//加密时获取key值。
	$.ajax({
		type:"post",
		url:wpCommon.Url+'/wpwl/getKey',
		success:function(res){
			key = res.data;
			localStorage.setItem('key',res.data)
			result(key);
		}
	})
	//点击更多的时候进入显示的页面是listByPage
	function result(key){
		WPBridge.callMethod("JsInvokeNative","wpEncrypt",{key:key,params:[brandId,ResultId,1,1000]},function(msg){codeValue=msg.data.result;
			$.ajax({
				type:"post",
				url:wpCommon.Url+"/wpwl/product/listByPage",
				async:true,
				cache:false,
				data:{
					"brandId":codeValue[0],
					"categoryId":codeValue[1],
					"pageIndex":codeValue[2],
					"pageSize":codeValue[3],
					"versionId":"27"
				},
				timeout:10000,
				success:function(datas){
					if(datas.errMsg == "AES加密解密失败"){
						if(!aseFail){
							$.ajax({
								type:"post",
								url:wpCommon.Url+'/wpwl/getKey',
								success:function(res){
									key = res.data;
									localStorage.setItem('key',res.data)
									result(key);
								}
							})
							aseFail=true;
						}
					}else if(datas.success==false){
						$(".loading").show();
						$("#content").hide();
						$(".middle img").attr('src', "img/error_else.png");
						$(".middle p").html("出错了，请稍后再试");
						$(".all").html("页面异常");
					}else{
						try{
							if(datas.success){
								var str="";
								var mes = datas.data.list;
								for( var j in mes){
									if(mes[j].saleStatus=='1'){								
										str+='<dl dataid="'+mes[j].productId+'"><dt><i class="hot"></i><img src="'+mes[j].iconUrl+'" /></dt><dd><p class="lines"></p><p class="p1">'+mes[j].productName+'</p><p class="p2">'+mes[j].standard+'</p></dd></dl>'
									}else{
										str+='<dl dataid="'+mes[j].productId+'"><dt><img src="'+mes[j].iconUrl+'" /></dt><dd><p class="lines"></p><p class="p1">'+mes[j].productName+'</p><p class="p2">'+mes[j].standard+'</p></dd></dl>'
									}
								}
								$('.con').html(str)
								Iscroll.scroll();
								click();
								wpCommon.viewShow();						
							}							
						}catch(e){
							$(".loading").show();
							$("#content").hide();
							$(".middle img").attr('src', "img/error_else.png");
							$(".middle p").html("出错了，请稍后再试");
							$(".all").html("页面异常");							
						}
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					WPBridge.callMethod("JsInvokeNative", "wpShowWebView", {},
		            function() {});
		            WPBridge.callMethod("JsInvokeNative", "wpDismissLoadingDialog", {},
		            function() {});
		             WPBridge.callMethod("JsInvokeNative", "wpNetError", {url:wpCommon.Url+"/h5/result.html"},
            		function() {});
            		if(textStatus=="timeout"){
            			$(".loading").show();
						$("#content").hide();
						$(".all").html("网络异常");
            		}
				}
			})	
		});
	}
	function click(){
		$(".con dl").on("click",function(){
			var dataId = $(this).attr("dataid")
			//键值是图片的属性dataid;
			localStorage.setItem("dataid",dataId);
			WPBridge.callMethod("JsInvokeNative", "wpHitDotEvent", {
	            eventId:"h5_e039",
	            otherId:dataId
	       	},
	        function() {});
	        window.location.href="details.html?pageId=H5_A008&productId="+dataId;
			//window.location.href="detail.html"
		});	
	}
	$("form").click(function(){
		window.location.href="search.html";
	})
	$(".more").click(function(){
		window.location.href="search.html";
	})	
})
//返回上一页。
$(function(){
	$(".goback").on("touchstart",function() {
        WPBridge.callMethod("JsInvokeNative", "wpFinishH5", {},
        function() {})
    });
    $("#wpReload").click(function(){
    	result(key)
    })
})
//iscroll方法
$(function(){	
 	myScroll = new IScroll( "#content",{
 		click:true,
 		fixedScrollbar:true,
 		disableTouch: false,
        disablePointer: true,
        mouseWheel: true,
        disableMouse: false,
        scrollBars: true
 	});
 })
function contextHeight(){
	var hight=0;
	$.each(arguments, function(inx,obj) {
		hight+=$(obj).height()*1;
	});
	return document.documentElement.clientHeight-hight;
}
var Iscroll={
	scroll:function(){
//		arguments是要减去的参数例如head,search.
//		var wholeHei=contextHeight('#header');
//		$("#content").css("height",wholeHei+'px');
//		alert($('.content-box').height());
		myScroll.refresh();
	}
}

