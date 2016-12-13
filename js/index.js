(function() {
	var showMenu = false; //显示左侧菜单 控制
	mui.init({
		swipeBack: false,
		statusBarBackground: '#f7f7f7',
		gestureConfig: {
			doubletap: true
		}
	});

	//消息按钮
	var subWebview = null,
		template = null;
	document.getElementById("info").addEventListener('tap', function() {
		alert("info");
		if(!mui.os.plus) {
			mui.openWindow({
				url: 'template/info.html',
				id: 'info',
				show: {
					aniShow: 'zoom-fade-out',
					duration: 300
				}
			});
			return;
		}
		if(subWebview == null) {
			//				获取公用父窗体
			template = plus.webview.getWebviewById("default-main");
		}
		if(template) {
			subWebview = template.children()[0];
			subWebview.loadURL('template/info.html');
			//				修改父标题模板的标题
			mui.fire(template, 'updateHeader', {
				title: '关于',
				showMenu: false
			});
			template.show('slide-in-right', 150);
		}
	});

	var _back = mui.back;
	mui.back = function() {
			console.log("back");
			if(showMenu) {
				closeMenu();
			} else {
				_back();
			}
		}
		//图片 定时轮播 
	var slider = mui("#slider");
	slider.slider({
		interval: 3000
	});
	
		//	ajax请求
	mui.ajax('js/test.json',{
		data:{
			username:'username',
			password:'password'
		},
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			var html = "";
			var list = data.list;
			mui.each(list,function(index,item){
				html += '<li class="mui-table-view-cell mui-media">'+
									'<a href="javascript:; ">'+
										'<img class="mui-media-object mui-pull-left " src="'+list[index].imgUrl+'">'+
										'<div class="mui-media-body ">'+
											list[index].title+
											'<p class="mui-ellipsis ">'+list[index].info+'</p>'+
										'</div>'+
									'</a>'+
								'</li>'
			})
			document.getElementById("muilist").innerHTML = html;
			
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			console.log(type);
		}
	});
	
	
})();