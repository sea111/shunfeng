$(function(){
	//品牌id
	var brandId=localStorage.getItem("brandid");
	//console.log(brandId);
	$.ajax({
		type:"post",
		data:{
			brandId:brandId,
			sign:""
		},
		url:"http://127.0.0.1/wpwl/category/list",
		async:true,
		success:function(datas){
			console.log(datas);
			var message=datas.data.list;
			console.log(message)			
			var str="";
			for(var i in message){
				str+="<ul>";
				str+="<li resultid='"+ message[i].categoryId +"' class='l li'>"+message[i].categoryName+"</li>"
				str+="</ul>"
			}
			$("#content").append(str);
		}
	});
	$("#content").on('click','.li',function(){
		var resultId = $(this).attr("resultid")
			console.log(resultId);
			//键值是图片的属性dataid;
		localStorage.setItem("resultid",resultId);
		window.location.href="result.html";
	})
})
