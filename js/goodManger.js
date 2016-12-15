var datalist = JSON.parse(localStorage.getItem("dataList"));

document.getElementById("back").addEventListener("click", function() {
	localStorage.removeItem("dataList");
	history.go(-1);
});

function gochart(obj) {
	var myChart = echarts.init(document.getElementById("allmoney"));
    
	option = {
    tooltip: {
    	show:false
    },
    color:['#cc0000','#2474BB','#ba1021','#1655a3'],
    legend: {
        orient: 'horizontal',
        data:obj.title
    },
    series: [
        {
            name:'信用总额',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            hoverAnimation:false,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:obj.amount
        }
    ]
};
	myChart.setOption(option);
	document.getElementById("allAdd").innerHTML = obj.sum;
	document.getElementById("payBank").innerHTML = obj.isBest.bankName;
	document.getElementById("noPay").innerHTML = obj.isBest.differ;
	document.getElementById("payCount").innerHTML = obj.isBest.bankCount;
	document.getElementById("payLastday").innerHTML = obj.isBest.lastday.ymd;
}

function init() {
//	console.log(datalist);
	var chartObj = {} || [],
		title = [],
		amount = [],
		sum = 0,
		isB = datalist[0].lastday.differ,
		isBest = {}||[];
	for(var i = 0; i < datalist.length; i++) {
		console.log(datalist[i].lastday.differ);
		var dt = {};
		var bc = parseInt(datalist[i].bankCount);
		title.push(datalist[i].bankName);
		dt = {
			"value":bc,
			'name':datalist[i].bankName
		}
		sum += bc;
		amount.push(dt);
		if(isB <= datalist[i].lastday.differ){
			isB = datalist[i].lastday.differ;
			isBest = datalist[i];
		}
	}
	console.log(isBest);
	chartObj = {
		title: title,
		amount: amount,
		sum:sum,
		isBest:isBest
	}
	gochart(chartObj);
}
init();