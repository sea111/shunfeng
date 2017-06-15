$(function(){
	$.ajax({
		url:"JSON/brand.json",
		async:true,
		success:function(data){
			console.log(data);
			var str="";
//			var mess=data.data;
			var mess=data;
			for(var j in mess){
				var mes=mess[j].brandVOList;
				if(mes.length == 0){
					continue;
				}
				//颜色
				var key = mess[j].breadTypeValue;
				str+="<div class='contents'>"
				str+='<div class="head">'
				str+='<p class="expensive" style="color:'+getColor(key)+'" ><img class="imgLeft" src="img/'+key+'.png" />'+mess[j].breadTypeName+'</p></div>'			
//				str+='<p class="expensive color"><i class="imgLeft number" src="" ></i>'+mess[j].breadTypeName+'</p></div>'			
				for(var k in mes){
					str+='<div class="cont">'
					str+='<dl class="dl" brandname="'+mes[k].brandName+'" brandid="'+mes[k].id+'">'
					if(mes[k].iconUrl){
						str+='<dt class="dt"><img class="brandImg" src="'+mes[k].iconUrl+'" /></dt>'
					}else{
						str+='<dt class="dt"><img class="brandImg" src="img/default_error2.png" /></dt>'
					}
					str+='<dd class="dd">'
					str+="<div class='dds'><p class='brand'>"+mes[k].brandName+"</p>"
					str+="<p class='num'>"+mes[k].brandCount+"个宝贝</p>"
					str+="<p class='starTime'>最近更新："+mes[k].gmtModified+"</p></div>"
					str+='<a href="javascript:;" class="right"></a>'
					if(mes[k].isNewBrand=="1"){
						str+='<div class="new">NEW</div>'
					}else if(mes[k].isNewBrand=="0"){
						str+=''
					}
					str+='</dd>'
					str+='</dl>'
					str+='</div>'				
				}
				str+="</div>"				
			}
			$(".list-good").html(str)
			/*Iscroll.scroll();*/
			$("#content").on("click",".cont dl",function(){
				$(this).find(".new").hide()
				var brandId=$(this).attr("brandid");
				var brandName=$(this).attr("brandname");
				localStorage.setItem("brandid",brandId)
				localStorage.setItem("brandname",brandName)
				window.location.href="list.html?pageId=H5_A006&otherId="+brandId;
			})	
			//字体颜色
			function getColor(key){
				var result = "";
				switch(key){		
					case "102701" : 
						result="#e5ae19";
						break;
					case "102702" : 
						result="#fd8317";
						break;
					case "102703" : 
						result="#5f7dff";
						break;
					case "102704" : 
						result="#ff3552";
						break;
					case "102705" : 
						result="#fd8317";
						break;
					case "102706" : 
						result="#ff3552";
						break;
					case "102707" : 
						result="#5f7dff";
						break;
					case "102708" : 
						result="#ff3552";
						break;
					case "102709" : 
						result="#fd8317";
						break;
					case "102710" : 
						result="#5f7dff";
						break;
					case "102711" : 
						result="#5f7dff";
						break;
					case "102712" : 
						result="#fd8317";
						break;
					case "102713" : 
						result="#ff3552";
						break;
					case "102714" : 
						result="#fd8317";
						break;	
					default:
						result="#e51a9";
						break;
				}	
				return result;
			}
/*			var str="";
			var mess=data.data;
			for(var j in mess){
				var mes=mess[j].brandVOList;
				if(mes.length == 0){
					continue;
				}
				str+="<div class='contents'>"
				str+='<div class="head">'
				str+='<img class="imgLeft" src="img/'+mess[j].breadTypeValue+'.png" />'
				str+='<p class="expensive">'+mess[j].breadTypeName+'</p></div>'*/
//				str+="</div>"
				/*for(var k in mes){*/					
//						str+="<div class='contents'>"
//						str+='<div class="head">'
//						str+='<img class="imgLeft" src="'+mess[j].breadTypeValue+'" />'
//						str+='<p class="expensive">'+mess[j].breadTypeName+'</p></div>'	
/*						str+='<div class="cont">'
						str+='<dl class="dl" brandid="'+mes[k].id+'">'
						str+='<dt class="dt"><img class="brandImg" src="'+mes[k].iconUrl+'" /></dt>'
						str+='<dd class="dd">'
						str+="<p class='brand'>"+mes[k].brandName+"</p>"
						str+="<p class='num'>"+mes[k].brandCount+"个宝贝</p>"
						str+="<p class='starTime'>最近更新："+mes[k].gmtModified+"</p>"
						str+='</dd>'
						str+='</dl>'
						str+='<a href="javascript:;" class="right"></a>'
						str+='</div>'*/
//						str+="</div>"					
/*				}
				str+="</div>"				
			}
			$(".list-goods").html(str)*/
			//console.log(str);
/*			$("#content").on("click","dl",function(){
				var brand=$(this).attr("brandid");
				console.log(brand)
				localStorage.setItem("brandid",brand)
				window.location.href="list.html"
			})*/
		}
		
	});

	
	
	
})
