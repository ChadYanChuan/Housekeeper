(function() {

	/**
	 * 字段含义
	 * "bankNumber": "银行卡号",
		"bankName": "银行名称",
		"bankCount": "卡片金额",
		"bankStartDate": 当月账单日,
		"bankEndDate": 账单后最后还款日,
		"differ":卡片可免息天数
	 */

	//当日日期
	var date = new Date();
	var today = dateFormat(date);

	function cardlist() {

		var obj = dataList;
		var html = "";
		for(var i = 0;i < dataList.length;i++){
			//账单日
			var stday = dateFormat(obj[i].bankStartDate);
			var eday = dateFormat(obj[i].bankEndDate);
			//相差天数 = 账单日 - 当前日期
			var days = calb(today, stday);

			var lastday = free(days, stday, eday, obj[i].differ);
			//免息天数计算
			var xxx = calb(stday, eday);

			html += '<div class="cardList">' +
				'<div class="cardListchild">' +
				'<p class="cardListTitle">' + obj[i].bankName + '</p>' +
				'<ul class="mui-table-view">' +
				'<li class="mui-table-view-cell">今日刷卡可免息使用<label class="ftbd">' + lastday.differ + '</label>天</li>' +
				'<li class="mui-table-view-cell">今日距离账单日<label class="ftbd">' + days + '</label>天</li>' +
				'<li class="mui-table-view-cell">信用额度：<label class="edu">' + obj[i].bankCount + '</label></li>' +
				'<li class="mui-table-view-cell">本月账单日:' + stday.ymd + '</li>' +
				'<li class="mui-table-view-cell">最后还款日:' + eday.ymd + '</li>' +
				'<li class="mui-table-view-cell">今日消费最后还款日:' + lastday.ymd + '</li>' +
				'<li class="mui-table-view-cell"><p>今日消费账单区间:</p><p>' + lastday.interval + '</p></li>' +
				'</ul>' +

				'</div>' +
				'</div>'
		}
		//cardlist 页面渲染
		document.getElementById("cardlist").innerHTML = html;
//		$("#cardlist").append(html);
	}
	//格式化日期
	function FormatDate(strTime) {
		var date = new Date(strTime);
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	}
	//计算日期 差 刷卡日 减去 账单日 = date2 - date1
	function calb(date1, date2) {

		var y1 = date1.year,
			m1 = date1.month,
			d1 = date1.day;

		var y2 = date2.year,
			m2 = date2.month,
			d2 = date2.day;

		var day1 = new Date(y1, m1 - 1, d1);
		var day2 = new Date(y2, m2 - 1, d2);
		var dateCount = (day2 - day1) / 86400000;

		return dateCount;
	}
	//日期格式化
	function dateFormat(da, isLong) {
		var dte;
		if(typeof(da) == "string") {
			dte = new Date(da.replace(/-/g, "/"));
		} else {
			dte = da;
		}

		var dateOBj = {
			"day": dte.getDate(),
			"month": isLong ? dte.getMonth() + 2 : dte.getMonth() + 1,
			"year": dte.getFullYear()
		}
		dateOBj.ymd = dateOBj.year + "-" + dateOBj.month + "-" + dateOBj.day;

		return dateOBj;
	};
	/*免息期计算   free(days,stday,obj.differ);
	 * days : 当前日期与账单日 相差天数  正值：账单日之前 负值：账单日之后
	 * stday 账单日
	 * eday 当月还款日
	 * differ 免息天数
	 */
	function free(days, stday, eday, differ) {
		var lastday = {};
		var differ = differ;
		// 当前日期在 当月账单日 之后
		if(days < 0) {
			//账单区间 的 账单日
			var sd = dateFormat(new Date(stday.year, stday.month, stday.day));
			//当日消费，最后还款日
			lastday = dateFormat(new Date(eday.year, eday.month, eday.day));
			//准确的免息期天数
			var differ = calb(stday, lastday);
			lastday.differ = differ + days;
			lastday.interval = sd.ymd + "至" + lastday.ymd;
		} else {
			lastday = eday;
			lastday.differ = calb(today, eday);
			lastday.interval = stday.ymd + "至" + lastday.ymd;
		}
		return lastday;
	}
	//根据天数 计算日期 dt当前日期 daynum距离天数
	function cala(dt, dayNum) {
		let y = dt.year,
			m = dt.month,
			d = dt.day,
			ddd = dayNum;

		ttt = new Date(y, m - 1, d).getTime() + ddd * 24000 * 3600;

		theday = new Date();
		theday.setTime(ttt);

		return theday;
	}

	
	//-----------------------

			var showMenu = false;
			mui.init({
				swipeBack: false,
				statusBarBackground: '#f7f7f7',
				gestureConfig: {
					doubletap: true
				}
				
			});
			mui.plusReady(function() {
				//仅支持竖屏显示
				plus.screen.lockOrientation("portrait-primary");
			});


				//处理右上角关于图标的点击事件；
			var subWebview = null,
				template = null;
			document.getElementById('info').addEventListener('tap', function() {
				if (!mui.os.plus) {
					mui.openWindow({
						url: "template/info.html",
						id: "info",
						show: {
							aniShow: 'zoom-fade-out',
							duration: 300
						}
					});
					return;
				}
				if (subWebview == null) {
					//获取共用父窗体
					template = plus.webview.getWebviewById("default-main");
				}
				if (template) {
					subWebview = template.children()[0];
					subWebview.loadURL('template/info.html');
					//修改共用父模板的标题
					mui.fire(template, 'updateHeader', {
						title: '关于',
						showMenu: false
					});
					template.show('slide-in-right', 150);
				}
				mui.openWindow({
					url:"template/info.html",
					id:"info",
					show:{
						aniShow:'zoom-fade-out',
						duration:300
					}
				});
			});
			//首页返回键处理
			//1、若侧滑菜单显示，则关闭侧滑菜单
			//2、否则，执行mui框架默认的关闭首页功能
			var _back = mui.back;
			mui.back = function() {
				if (showMenu) {
					closeMenu();
				} else {
					_back();
				}
			};
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
	cardlist();
})();