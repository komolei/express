$(function(){
        
	var tophtml="<div id=\"izl_rmenu\" class=\"izl-rmenu\"><div class=\"btn btn-qq\"><div class=\"qq\"><p><a target=\"_blank\" href=\"http://wpa.qq.com/msgrd?v=3&uin=383232711&site=qq&menu=yes\" class=\"q1\">市场部</a><a target=\"_blank\" href=\"http://wpa.qq.com/msgrd?v=3&uin=792434442&site=qq&menu=yes\" class=\"q1\">市场部2</a><a target=\"_blank\" href=\"http://wpa.qq.com/msgrd?v=3&uin=948789543&site=qq&menu=yes\" class=\"q1\">市场部3</a><a target=\"_blank\" href=\"http://wpa.qq.com/msgrd?v=3&uin=1551477059&site=qq&menu=yes\" class=\"q1\">市场部4</a><a target=\"_blank\" href=\"http://wpa.qq.com/msgrd?v=3&uin=1045771710&site=qq&menu=yes\" class=\"q1\">晚间咨询</a><a target=\"_blank\" href=\"http://wpa.qq.com/msgrd?v=3&uin=908270060&site=qq&menu=yes\" class=\"q1\">技术咨询</a></p></div></div><div class=\"btn btn-phone\"><div class=\"phone\"><img class=\"pica\" src=\"/images/phone.fw.png\" /></div></div><div class=\"btn btn-wx\"><img class=\"pic\" src=\"/images/weixin.fw.png\" /></div><div class=\"btn btn-top\"></div></div>";
	$("#top").html(tophtml);
	$("#izl_rmenu").each(function(){
		$(this).find(".btn-wx").mouseenter(function(){
			$(this).find(".pic").fadeIn("fast");
		});
		$(this).find(".btn-wx").mouseleave(function(){
			$(this).find(".pic").fadeOut("fast");
		});
		$(this).find(".btn-phone").mouseenter(function(){
			$(this).find(".phone").fadeIn("fast");
		});
		$(this).find(".btn-phone").mouseleave(function(){
			$(this).find(".phone").fadeOut("fast");
		});
		$(this).find(".btn-qq").mouseenter(function(){
			$(this).find(".qq").fadeIn("fast");
		});
		$(this).find(".btn-qq").mouseleave(function(){
			$(this).find(".qq").fadeOut("fast");
		});
		$(this).find(".btn-top").click(function(){
			$("html, body").animate({
				"scroll-top":0
			},"fast");
		});
	});
	var lastRmenuStatus=false;
	$(window).scroll(function(){//bug
		var _top=$(window).scrollTop();
		if(_top>200){
			$("#izl_rmenu").data("expanded",true);
		}else{
			$("#izl_rmenu").data("expanded",false);
		}
		if($("#izl_rmenu").data("expanded")!=lastRmenuStatus){
			lastRmenuStatus=$("#izl_rmenu").data("expanded");
			if(lastRmenuStatus){
				$("#izl_rmenu .btn-top").slideDown();
			}else{
				$("#izl_rmenu .btn-top").slideUp();
			}
		}
	});
});