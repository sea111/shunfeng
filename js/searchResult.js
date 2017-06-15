$(function(){
	var searchVals=localStorage.getItem("searchVal");
	$(".all").html(searchVals);
	//品牌id
	if(localStorage.getItem("brandid")){
		var brandId=localStorage.getItem("brandid");
	}else{
		var brandId='';
	}
	//搜索keyword
	var resultId=localStorage.getItem("resultid");
	WPBridge.callMethod("JsInvokeNative", "wpShowLoadingDialog", {},function() {});
	window.aseFail = "";
	//加密时获取key值。
	$.ajax({
		type:"post",
		url:wpCommon.Url+'/wpwl/getKey',
		success:function(res){
			key = res.data;
			localStorage.setItem('key',res.data)
			searchResult(key);
		}
	})
	function searchResult(key){
		WPBridge.callMethod("JsInvokeNative","wpEncrypt",{key:key,params:[brandId,searchVals,'1','1000']},function(msg){codeValue=msg.data.result;
			if(brandId==''){
				codeValue[0]='';
			}
			$.ajax({
				type:"post",
				url:wpCommon.Url+"/wpwl/product/searchByPage",
				async:true,
				cache:false,
				data:{
					"brandId":codeValue[0],
					"categoryId":'',
					"keyword":codeValue[1],
					"pageIndex":codeValue[2],
					"pageSize":codeValue[3]
				},
				timeout:10000,
				success:function(datas){
					if(datas.data.total==0){
						$(".loading").show();
						$("#content").hide();
						$(".middle img").attr('src', "img/bg_search_03.png");
						$(".middle p").html("抱歉，未找到符合条件的商品");
					}
					if(datas.success==false){
						$(".loading").show();
						$("#content").hide();
						$(".middle img").attr('src', "img/error_else.png");
						$(".middle p").html("出错了，请稍后再试");
						$(".all").html("页面异常");
						wpCommon.viewShow();
					}else{
						try{
							if(datas.success){
								var str="";
								var mes=datas.data.list;
								for(var j in mes){
									str+='<dl dataid="'+mes[j].productId+'">'
									str+='<dt><img src="'+mes[j].iconUrl+'" /></dt>'
									str+='<dd><p class="lines"></p><p class="p1">'+mes[j].productName+'</p><p class="p2">'+mes[j].standard+'</p></dd>'
									str+='</dl>'				
								}
								$(".con").html(str);
								Iscroll.scroll();
								click()
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
		             WPBridge.callMethod("JsInvokeNative", "wpNetError", {url:wpCommon.Url+"/h5/searchResult.html"},
		    		function() {});
		    		if(textStatus=="timeout"){
		    			$(".loading").show();
		    			$("#content").hide();
		    			$(".all").html("网络异常")
		    		}
				}
			})		
		});
	}
})
	function click(){
		$(".con").on("click","dl",function(){
			var dataId = $(this).attr("dataid")
			//键值是图片的属性dataid;
			localStorage.setItem("dataid",dataId);
			WPBridge.callMethod("JsInvokeNative", "wpHitDotEvent", {
	            eventId:"h5_e039",
	            otherId:dataId
	       	},
	        function() {});
			window.location.href="details.html?pageId=H5_A008&productId="+dataId;			
		});	
	}
//回到上一页
$(function(){
	$(".goback").on("touchstart",function() {
        WPBridge.callMethod("JsInvokeNative", "wpFinishH5", {},
        function() {})
    });
    $("#wpReload").click(function(){
    	searchResult(key)
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
			//arguments是要减去的参数例如head,search.
	//		var wholeHei=contextHeight('#header');
	//		$("#content").css("height",wholeHei+'px');
			myScroll.refresh();
		}
	}