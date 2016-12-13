
	/**
	 * 字段含义
	 * "bankNumber": "银行卡号",
		"bankName": "银行名称",
		"bankCount": "卡片金额",
		"bankStartDate": 当月账单日,
		"bankEndDate": 账单后最后还款日,
		"differ":卡片可免息天数
	 */

	//每个月的账单日 最后还款日设置
	function newDate(m,day){
		var date0 = new Date();
		var newDate = dateFormat(new Date(date0.getFullYear(), date0.getMonth() + m, day));
		
		return newDate;
	}

	//格式化日期
	function FormatDate(strTime) {
		var date1 = new Date(strTime);
		return date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
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
	/*免息期计算   free(today,days,stday,obj.differ);
	 * days : 当前日期与账单日 相差天数  正值：账单日之前 负值：账单日之后
	 * stday 账单日
	 * eday 当月还款日
	 * differ 免息天数
	 */
	function free(today,days, stday, eday, differ) {
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
	function cardlist(dataList) {
			//当日日期
			var today = dateFormat(new Date());

			var obj = dataList;
			var html = "";
			for(var i = 0; i < dataList.length; i++) {
				//账单日
				var stday = obj[i].bankStartDate;
				var eday = obj[i].bankEndDate;
				//相差天数 = 账单日 - 当前日期
				var days = calb(today, stday);
				
				var lastday = free(today,days, stday, eday, obj[i].differ);
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
			// $("#cardlist").append(html);
			document.getElementById("cardlist").innerHTML = html;
	}
	function init() {

		var dataList = [{
			"bankNumber": "123456",
			"bankName": "招商银行",
			"bankCount": "2000",
			"bankStartDate": newDate(0,6),
			"bankEndDate": newDate(0,24),
			"differ": 48
		}, {
			"bankNumber": "58585",
			"bankName": "民生银行",
			"bankCount": "2500",
			"bankStartDate": newDate(0,23),
			"bankEndDate": newDate(1,13),
			"differ": 51
		}, {
			"bankNumber": "58585",
			"bankName": "广发银行",
			"bankCount": "2500",
			"bankStartDate": newDate(0,2),
			"bankEndDate": newDate(0,22),
			"differ": 51
		}, {
			"bankNumber": "58585",
			"bankName": "交通银行",
			"bankCount": "2500",
			"bankStartDate": newDate(0,14),
			"bankEndDate": newDate(1,8),
			"differ": 55
		}];
		
		cardlist(dataList);
	}
	
	window.onload = init();
	
	document.getElementById("info").addEventListener("click",function(){
		window.location.href = "template/info.html";
	});
