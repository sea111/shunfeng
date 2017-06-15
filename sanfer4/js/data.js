$(function(){
	$.ajax({
		url:"JSON/data.json",
		async:true,
		success:function(data){
			console.log(data);
			var arr=["102701.png","102702.png","102703.png","102704.png","102705.png","102706.png","102707.png","102708.png","102709.png","102710.png","102711.png","102712.png"];
			var str="";
//			console.log(data)
			$.each(data['data'],function(inx,list){
				str+="<div class='contents'>"
				str+='<div class="head">'
				str+='<img class="imgLeft" src="'+arr[inx]+'" />'
				str+='<p class="expensive">'+list.breadTypeName+'</p></div>'
				var mes=list.brandVOList;
				console.log(mes)
				$.each(mes, function(dt) {
					if(mes==""){
						
					}else{
						str+='<div class="cont">'
						str+='<dl class="dl" brandid="'+dt.id+'">'
						str+='<dt class="dt"><img class="brandImg" src="'+dt.iconUrl+'" /></dt>'
						str+='<dd class="dd">'
						str+="<p class='brand'>"+dt.brandName+"</p>"
						str+="<p class='num'>"+dt.brandCount+"个宝贝</p>"
						str+="<p class='starTime'>最近更新："+dt.gmtModified+"</p>"
						str+='</dd>'
						str+='</dl>'
						str+='<a href="javascript:;" class="right"></a>'
						str+='</div>'
					}
					
				});
				str+="</div>"
			})
			$(".list-goods").html(str)
			$("#content").on("click","dl",function(){
				var brand=$(this).attr("brandid");
				console.log(brand)
				localStorage.setItem("brandid",brand)
				window.location.href="list.html"
			})
		}
			
		
	});

	
	
	
})
