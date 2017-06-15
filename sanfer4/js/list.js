$(function(){
	//品牌id
	var brandId=localStorage.getItem("brandid");
//	console.log(brandId)
	var listByPage={
		getMes:function(fn){
			var cateArr=[];
			$.ajax({
				type:"post",
				url:"http://127.0.0.1/wpwl/category/listByPage",
				data:{
					"brandId":brandId,
					"pageIndex":"1",
					"pageSize":"1"
				},
				async:true,
				success:function(mes){
					console.log(mes);
					var str="";
					var mess=mes.data.list;
					console.log(mess);//
						for(var i in mess){
							cateArr.push(mess[i]);

						}
						fn && fn(cateArr);
					}
			})
		}
	}
	
	$.ajax({
		type:"post",
		url:"http://127.0.0.1/wpwl/product/listByPage",
		data:{
			pageIndex:"2",
			pageSize: "8",
			versionId:"27"
		},
		async:true,
		success:function(datas){//遍历第一层获取的数据
			listByPage.getMes(function(cateArr){
				console.log(cateArr)
				var str="";
				var mes=datas.data.list;
				console.log(mes)
				//if(mes.length>1){}
				$.each(mes,function(inx,list){
					console.log(list)
					str += '<ul>'
					//如果上面接口中cateArr返回多条数据的话，把0替换成inx.
					str+='<li class="li" resultName="'+cateArr[0].categoryName+'" resultid="'+cateArr[0].categoryId+'"><i class="bgLift">'+cateArr[0].categoryName+'</i><span moreid='+cateArr[0].categoryId+' class="more">更多</span><i class="bgRight"></i></li>'
					str+='<li><i class="lineL"></i><span class="center"></span><i class="lineR"></i></li>'
					str+='<li>'
					if(mes.length>1){
						//hot
						if(list.saleStatus=='1'){
							str+='<dl><dt><i class="hot"></i><img src="'+list.iconUrl+'" /></dt><dd><p class="p1">'+list.productName+'</p><p class="p2">'+list.standard+'</p></dd></dl>'
						}else{
							str+='<dl><dt><img src="'+list.iconUrl+'" /></dt><dd><p class="p1">'+list.productName+'</p><p class="p2">'+list.standard+'</p></dd></dl>'
						}
					}else{
						str+='<dl><dt><img src="'+list.iconUrl+'" /></dt><dd><p class="p1">'+list.productName+'</p><p class="p2">'+list.standard+'</p></dd></dl>'
						//str+='<dl><dt><img src="'+mes[0].iconUrl+'" /></dt><dd><p class="p1">'+mes[0].productName+'</p><p class="p2">'+mes[0].standard+'</p></dd></dl>'
						str+='<dl class="end"></dl>'
					}
					

					str+='</li>'
					str+='</ul>'
				})
				$('.con').html(str)
				Iscroll.scroll();//调用Iscroll方法。
				click();
			});
		}
	});
	function click(){
		$("ul li").on("click","dl",function(){
			var dataId = $(this).attr("dataid")
			localStorage.setItem("dataid",dataId);
			window.location.href="detail.html"
		});	
	}
	//点击搜索框进入搜索页
	$(".search").click(function(){
		window.location.href="search.html";
	})
	//点击更多进入结果页
	$(".con").on("click",".more",function(){
		var dataid=$(this).attr("moreid");
		localStorage.setItem("moreid",dataid);
		//console.log(moreId);
		window.location.href="result.html"
	})
	//点击整个li进入结果页。
	$(".con").on("click","ul .li",function(){
		var ResultName=$(this).attr("resultName");
		var Resultid=$(this).attr("resultid");
		localStorage.setItem("resultName",ResultName);
		localStorage.setItem("resultid",Resultid);
		window.location.href="result.html"
	})
	
})

//iscroll方法
$(function(){	
 	myScroll = new IScroll( "#content",{
 		click:true,
 		fixedScrollbar:true
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
		var wholeHei=contextHeight('#head','.search');
		$("#content").css("height",wholeHei+'px');
		//$(".loading").css("height",wholeHei+'px');
		myScroll.refresh();
//		console.log(wholeHei)
	}
}
