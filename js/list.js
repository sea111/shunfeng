var page=1;//页码
	scrollDown=true;//加载是否完成
	complete=false;//请求数据是否还有下一页
$(function(){
	WPBridge.callMethod("JsInvokeNative", "wpShowLoadingDialog", {},function() {});
	window.aesFail = "";
	//品牌id列表页categoryName categoryId header中p标签中的内容存入brandName
	var brandId=localStorage.getItem("brandid");
	var ResultName=localStorage.getItem("resultName")
	var resultId=localStorage.getItem("resultid")
	var brandName=localStorage.getItem("brandname")
	$(".name").html(brandName)
	//加密时获取key值。
	$.ajax({
		type:"post",
		url:wpCommon.Url+'/wpwl/getKey',
		success:function(res){
			key = res.data;
			localStorage.setItem('key',res.data);
			listByPage.getMes()
		}
	})
	var cateArr=new Array();
	//系列接口
	window.listByPage={
		getMes:function(fn){
			cateArr = new Array();
			var that=this;
	//临时加密方法 wpEncrypt(key,params),params是要加密的请求参数，msg是请求加密时获取的数据，codeValue=msg.data.result是加密的值。
			WPBridge.callMethod("JsInvokeNative","wpEncrypt",{key:key,params:[brandId,page,4]},function(msg){
				codeValue=msg.data.result;
				$.ajax({
					type:"post",
					url:wpCommon.Url+"/wpwl/category/listByPage",
					data:{
						"brandId":codeValue[0],
						"pageIndex":codeValue[1],
						"pageSize":codeValue[2]
					},
					async:true,
					success:function(mes){
						if(mes.errMsg == "AES加密解密失败"){
							if(!aesFail){
								$.ajax({
									type:"post",
									url:wpCommon.Url+'/wpwl/getKey',
									success:function(res){
										key = res.data;
										localStorage.setItem('key',res.data)
										ajax(key);
									}
								})
								aesFail=true;
							}
						}else{
							var mess=mes.data.list;
							if(mess.length < 4){//是否有下一页
								complete=true;
							}
							//获取的系列是一个展示所有的产品，否则展示2个产品
							if(mess.length==1){
								ajax(key,mess[0].categoryId,mess[0],0,ajaxCallback,1000,1);
							}else{
								ajax(key,mess[0].categoryId,mess[0],0,ajaxCallback,2);
							}
							function ajaxCallback(inx){
								var i=inx+1;
								if(mess[i]){
									ajax(key,mess[i].categoryId,mess[i],i,ajaxCallback,2);
									scrollDown=false;//加载未完成
								}else{
									scrollDown=true;//加载完成
								}
							}	
						}
						page++;
					}
				})
			})
		}
	}	
	//wpwl/product/listByPage 从brand进入列表页中显示的图片
	function ajax(key,catId,cateArr,j,fn,num,length){
		WPBridge.callMethod("JsInvokeNative","wpEncrypt",{key:key,params:[brandId,1,num,catId]},function(msg){codeValue=msg.data.result;
			$.ajax({
				type:"post",
				url:wpCommon.Url+"/wpwl/product/listByPage",
				dataType:"json",
				cache:false,
				data:{
					"brandId":codeValue[0],
					"categoryId":codeValue[3],
					"pageIndex":codeValue[1],
					"pageSize": codeValue[2],
					"versionId":"27"
				},
				async:true,
				timeout:10000,
				success:function(datas){//遍历第一层获取的数据
					if(datas.errMsg == "AES加密解密失败"){			
						if(!aesFail){
							$.ajax({
								type:"post",
								url:wpCommon.Url+'/wpwl/getKey',
								success:function(res){
									key = res.data;
									localStorage.setItem('key',res.data)
									ajax(key);
								}
							})
							aesFail=true;
						}
					}else{
						if(datas.success){
							str="";
							var mes=datas.data.list;
								str+='<ul class="ul">';
								str+="<p class='backG'></p>"
								if(length==1){
									str+='<li class="li listTitle" resultName="'+cateArr.categoryName+'" resultid="'+cateArr.categoryId+'"><i class="bgLift">'+cateArr.categoryName+'</i></li>'																			
								}else{
									str+='<li class="li listTitle" resultName="'+cateArr.categoryName+'" resultid="'+cateArr.categoryId+'"><i class="bgLift">'+cateArr.categoryName+'</i><span resultName="'+cateArr.categoryName+'" resultid='+cateArr.categoryId+' class="more">更多</span><i resultName="'+cateArr.categoryName+'" resultid='+cateArr.categoryId+' class="bgRight"></i></li>'														
								}
								str+='<li class="two"><i class="lineL"></i><span class="center"></span><i class="lineR"></i></li>'
								str+='<li class="three">'
								for(var i in mes){
									if(mes.length > 1){
										if(mes[i].saleStatus=='1'){
											str+='<dl dataid="'+mes[i].productId+'">'
											str+='<dt><i class="hot"></i><img src="'+mes[i].iconUrl+'" /></dt><dd><p class="lines"></p><p searchName="'+mes[i].productName+'" class="p1">'+mes[i].productName+'</p><p class="p2">'+mes[i].standard+'</p></dd>'
											str+='</dl>'									//str+='<dl dataid="'+mes[inx].productId+'"><dt><i class="hot"></i><img src="'+list.iconUrl+'" /></dt><dd><p searchName="'+list.productName+'" class="p1">'+list.productName+'</p><p class="p2">'+list.standard+'</p></dd></dl>'
										}else{
											str+='<dl dataid='+mes[i].productId+'><dt><img src="'+mes[i].iconUrl+'" /></dt><dd><p class="lines"></p><p searchName="'+mes[i].productName+'" class="p1">'+mes[i].productName+'</p><p class="p2">'+mes[i].standard+'</p></dd></dl>'
										}
									}else{
										str+='<dl dataid='+mes[i].productId+'><dt><img src="'+mes[i].iconUrl+'" /></dt><dd><p class="lines"></p><p searchName="'+mes[i].productName+'" class="p1">'+mes[i].productName+'</p><p class="p2">'+mes[i].standard+'</p></dd></dl>'
										str+='<div class="end"></div>'
									}
								}
								str+='</li>'
								str+='</ul>'
							$('.con').append(str)
							Iscroll.scroll();//调用Iscroll方法。
							click();
							WPBridge.callMethod("JsInvokeNative", "wpShowWebView", {},
						    function() {});
						    WPBridge.callMethod("JsInvokeNative", "wpDismissLoadingDialog", {},
						    function() {});
						    fn && fn(j)//执行函数		
						}else{
							$("#content").hide();
							$(".search").hide();
							$(".top .name").html("异常页面");
							$("#wrongs").find("img").attr("src","img/error_else.png");
							$("#wrongs").find(".sorry").html("出错了，请稍后再试");
							$("#wrongs").show();
							wpCommon.viewShow();
						}			
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					if(textStatus=="timeout"){
						$("#content").hide();
						$(".search").hide();
						$(".top .name").html("网络异常");
						$("#wrongs").show();						
					}
					WPBridge.callMethod("JsInvokeNative", "wpShowWebView", {},
		            function() {});
		            WPBridge.callMethod("JsInvokeNative", "wpDismissLoadingDialog", {},
		            function() {});
		            WPBridge.callMethod("JsInvokeNative", "wpNetError", {url:wpCommon.Url+"/h5/list.html"},
		            function() {});
				}
			})
		});
	}
	function click(){
		$(".con dl ").on("click",function(){
			var dataId = $(this).attr("dataid")
			var searchname=$(this).attr("searchName")
			localStorage.setItem("searchName",searchname)
			window.location.href="details.html?pageId=H5_A008&productId="+dataId;
		});			
	}
	//点击搜索框进入搜索页
	$(".search").click(function(){
		document.activeElement.blur();
		window.location.href="search.html?pageId=H5_A000";
	})
	//点击整个li进入结果页。
	$(".con").on("click","ul .more",function(){
		var ResultName=$(this).attr("resultName");
		var ResultId=$(this).attr("resultid");
		localStorage.setItem("resultName",ResultName);
		localStorage.setItem("resultid",ResultId);
		window.location.href="result.html?pageId=H5_A007&otherId="+ResultId
	})
	$(".con").on("click","ul .bgRight",function(){
		var ResultName=$(this).attr("resultName");
		var ResultId=$(this).attr("resultid");
		localStorage.setItem("resultName",ResultName);
		localStorage.setItem("resultid",ResultId);
		window.location.href="result.html?pageId=H5_A007&otherId="+ResultId
	})
})
$(function(){
	$(".back").click(function(){
        WPBridge.callMethod("JsInvokeNative", "wpFinishH5", {},
        function() {})
    });
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
        scrollBars: true,
        probeType:3
 	});
 	myScroll.on('scroll', function(){
 		if(this.y>=0){
 			$(".backG").hide();
 			$('.ul').eq(0).find('.listTitle').css({
	 			position:'relative',
	 			top:'0rem',
	 			zIndex:1
	 		});
 		}else{
 			var _t=this;
			var h=$('.ul').height();
	 		$('.ul').each(function(inx){
	 			if(Math.abs(_t.y)>inx*h && Math.abs(_t.y)<(inx+1)*h){
	 				$(this).find('.backG').show();
	 				if(inx==0){
	 					$(this).find('.listTitle').css({
		 					position:'fixed',
		 					zIndex:100000000,
		 					top:Math.abs(_t.y)-12+'px',
		 					background:"white"
		 				});
	 				}else{
	 					$(this).find('.listTitle').css({
		 					position:'fixed',
		 					zIndex:100000000,
		 					top:Math.abs(_t.y)-1+"px",
		 					background:"white"
		 				});
	 				}
	 			}else{
	   				$(this).find('.backG').hide();
	 				$(this).find('.listTitle').css({
	 					position:'relative',
	 					zIndex:1,
	 					top:0
	 				});
	 			}
	 		})
 		}
 	});
 	myScroll.on("scrollEnd",function(){
   		if(Math.abs(myScroll.y) > Math.abs((myScroll.maxScrollY+15))){
   			if(!complete && scrollDown){
   				listByPage.getMes();
   				//myScroll.refresh();	  
   			}
   		}
   	});
 	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
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
			var wholeHei=contextHeight('#head','.search');
			$("#content").css("height",wholeHei+'px');
			myScroll.refresh();
		}
	}

