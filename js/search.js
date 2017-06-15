$(function(){
	//品牌id
	WPBridge.callMethod("JsInvokeNative", "wpShowLoadingDialog", {},function() {});
	window.aseFail = "";
	var brandId=localStorage.getItem("brandid");
	//搜索keyword
	var searchname=localStorage.getItem("searchName");
	var resultId=localStorage.getItem("resultid");
	var ResultName=localStorage.getItem("resultName");
	//加密时获取key值。
	$.ajax({
		type:"post",
		url:wpCommon.Url+'/wpwl/getKey',
		async:true,
		success:function(res){
			key = res.data;
			localStorage.setItem('key',res.data)
			search(key);
//			result(key);
		}
	})
	//点击搜索进入的页面搜索发现下面展示的内容。
	function search(key){
		WPBridge.callMethod("JsInvokeNative","wpEncrypt",{key:key,params:[brandId,1,20]},function(msg){codeValue=msg.data.result;
			$.ajax({
				type:"post",
				data:{
					"brandId":codeValue[0],
					"pageIndex":codeValue[1],
					"pageSize":codeValue[2]
				},
				url:wpCommon.Url+"/wpwl/category/listByPage",
				async:true,
				timeout:2000,
				success:function(datas){
					if(datas.errMsg == "AES加密解密失败"){
						if(!aseFail){
							$.ajax({
								type:"post",
								url:wpCommon.Url+'/wpwl/getKey',
								success:function(res){
									key = res.data;
									localStorage.setItem('key',res.data)
									search(key);
									result(key)
								}
							})
							aseFail=true;
						}
					}else{
						try{
							if(datas.success){
								var message=datas.data.list;		
								var str="";
								for(var i in message){
									str+="<ul>";
									str+="<li resultid='"+ message[i].categoryId +"' resultName='"+message[i].categoryName+"' class='l xiLie'>"+message[i].categoryName+"</li>"
									str+="</ul>"
								}
								$("#content").append(str);
								wpCommon.viewShow();
							}							
						}catch(e){
							$("#hide").show();
							$("#box").hide();
							$(".middle img").attr('src', "img/bg_search_03.png");
							$(".middle p").html("抱歉，未找到符合条件的商品");
							$(".name").html("页面异常");
						}						
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					wpCommon.viewShow();
		            if(textStatus=="timeout"){
            			$("#hide").show();
						$("#box").hide();
            		}
				},
				complete:function(xml,status){
					if(status=='timeout'){
						wpCommon.viewShow();
					}	
				}
			})
		});
	}
	$("#content").on('click','.xiLie',function(event){	
		event.preventDefault();
		var resultId = $(this).attr("resultid")
		var resultName = $(this).attr("resultName")
		//键值是图片的属性dataid;
		localStorage.setItem("resultid",resultId);
		localStorage.setItem("resultName",resultName)
		WPBridge.callMethod("JsInvokeNative", "wpHitDotEvent", {
            eventId:"h5_e008",
            otherId:resultId
       	},
        function() {});
		window.location.href="result.html?pageId=H5_A007";	
	})
	$("#inp").focus()
	$("#inp").on("keyup",function(e){
		var inpt=$("#inp").val();
		localStorage.setItem("searchVal",inpt);
		if(e.keyCode===13){
			if($(this).val()){
				WPBridge.callMethod("JsInvokeNative", "wpHitDotEvent", {
	                eventId:"h5_e008",
	                otherId:inpt
	           	},
	            function() {});
				var pat=new RegExp("[ /a-zA-Z0-9\u4e00-\u9fa5-——()（）]")
				if(pat.test($(this).val())){
					var inpt=$(this).val().replace(/（/g,'(');
					var inpt=inpt.replace(/）/g,')');
					var inpt=inpt.replace(/—/g,'-');
					var inpt=inpt.replace(/　/g,' ');
					localStorage.setItem("searchVal",inpt);
					window.location.href="searchResult.html?pageId=H5_A007";
				}else{
//					result(key)					
					WPBridge.callMethod('JsInvokeNative','wpShowToast',{message:'字符格式不合法'},function(){});
				}
			}else{
				//框中为空时，搜索的页面。
				WPBridge.callMethod("JsInvokeNative", "wpShowToast", {
                    message: "型号和名称不能为空"
                },
                function() {})
			}
		}
	});
})
$(function(){
	$(".cancle").on("touchstart",function(){
	      WPBridge.callMethod("JsInvokeNative", "wpFinishH5", {},
	      function() {})
	})	
})
