$(function(){
	//品牌id
	//var dataid=localStorage.getItem("dataid");
	//品牌id
	var brandId=localStorage.getItem("brandid");
	//列表页categoryId，categoryName
	var ResultName=localStorage.getItem("resultName");
	var Resultid=localStorage.getItem("resultid");
	$(".all").html(ResultName);
	iscroll();
	ajax();
	var myscroll;
	function iscroll(){
		myscroll = new IScroll("#content",{
			click:true
		});
	};
	function ajax(){
		$.ajax({
			type:"post",
			url:"http://127.0.0.1/wpwl/product/listByPage",
			async:true,
			data:{
				pageIndex:"2",
				pageSize:"2",
				versionId:"27"
			},
			success:function(datas){
				console.log(datas);
				var str="";
				var mes = datas.data.list
				console.log(mes)
				/*$.each(mes, function(inx,list) {
					if(mes.saleStatus=='1'){
						str+='<dl><dt><i class="hot"></i><img src="'+list.iconUrl+'" /></dt><dd><p class="p1">'+list.productName+'</p><p class="p2">'+list.standard+'</p></dd></dl>'
					}else{
						str+='<dl><dt><img src="'+list.iconUrl+'" /></dt><dd><p class="p1">'+list.productName+'</p><p class="p2">'+list.standard+'</p></dd></dl>'
					}
				});*/
				for(var i in datas){
					for( var j in mes){
						if(mes[j].saleStatus=='1'){
							str+='<dl><dt><i class="hot"></i><img src="'+mes[j].iconUrl+'" /></dt><dd><p class="p1">'+mes[j].productName+'</p><p class="p2">'+mes[j].standard+'</p></dd></dl>'
						}else{
							str+='<dl><dt><img src="'+mes[j].iconUrl+'" /></dt><dd><p class="p1">'+mes[j].productName+'</p><p class="p2">'+mes[j].standard+'</p></dd></dl>'
						}
					}
				}
				$('.con').html(str)
				myscroll.refresh();
				console.log($('#content').height());
				click();
			}
			
		});
		
	}
	function click(){
		$(".picture").on("click","dl",function(){
//			var dataId = $(this).attr("dataid")
//			console.log(dataId);
//			键值是图片的属性dataid;
//			localStorage.setItem("dataid",dataId);
			window.location.href="detail.html"
		});	
	}
	$("form").click(function(){
		window.location.href="search.html";
	})
	$(".more").click(function(){
		console.log(1)
		window.location.href="search.html";
	})
	
})
