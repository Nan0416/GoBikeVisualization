
let pieUserSVGHeight = d3.select('#pie-user-chart-svg').attr('height');
let pieUserSVGWidth = d3.select('#pie-user-chart-svg').attr('width');
let pieUserSVGPadding = {t: 60, r: 40, b: 30, l: 40};
let pieUserSVGChartWidth = pieUserSVGWidth - pieUserSVGPadding.l - pieUserSVGPadding.r;
let pieUserSVGChartHeight = pieUserSVGHeight - pieUserSVGPadding.t - pieUserSVGPadding.b;

let pieUserRadius = Math.min(pieUserSVGChartWidth, pieUserSVGChartHeight) / 2;
let arcUser = d3.arc().outerRadius(pieUserRadius - 10).innerRadius(0);

let labelUserArc = d3.arc().outerRadius(pieUserRadius - 40).innerRadius(pieUserRadius - 20);

let pieUser = d3.pie().sort(null).value(function(d) { return d.value; });


let pieUserSVG = d3.select('#pie-user-chart-svg').append('svg')
    .attr("width", pieUserSVGChartWidth)
    .attr("height", pieUserSVGChartHeight)
    .append("g")
    .attr("transform", "translate(" + pieUserSVGChartWidth / 2 + "," + pieUserSVGChartHeight / 2 + ")");

let pathUser = pieUserSVG.selectAll("path");
let textUserLabel = pieUserSVG.selectAll("text");
let pathUserEnter = null;


function pieUserSVGdraw(data, name, value){
    let filteredUserData = [];

    let sumUserTo = data[name][value].subscriber + data[name][value].customer;

    var susObj = {};
    susObj.label = "Subscriber";
    susObj.value = Math.round((data[name][value].subscriber / sumUserTo) * 100);
    filteredUserData.push(susObj);

    var cusObj = {};
    cusObj.label = "Customer";
    cusObj.value = Math.round((data[name][value].customer / sumUserTo) * 100);
    filteredUserData.push(cusObj);

    drawPieUserChart(filteredUserData);
}


function pieUserSVGdrawAll() {

	if (station_monthly_user  == null) {
		var tempUser = [{ label: "Subscriber", value: 84 }, { label: "Customer", value: 16 }];
		drawPieUserChart(tempUser);
	} else {
		let dataUser = [];

	    let sumSus = 0;
	    let sumCus = 0;

	    for (var key in station_monthly_user) {
	        for (i = 0; i < 10; i++) {
	            var sus = parseInt(station_monthly_user[key][i].subscriber, 10);
	            var cus = parseInt(station_monthly_user[key][i].customer, 10);
	            sumSus += sus;
	            sumCus += cus;
	        }
	    }

	    let sumUser = sumSus + sumCus;

	    var susObj = {};
	    susObj.label = "Subscriber";
	    susObj.value = Math.round((sumSus / sumUser) * 100);

	    dataUser.push(susObj);

	    var cusObj = {};
	    cusObj.label = "Customer";
	    cusObj.value = Math.round((sumCus / sumUser) * 100);
	    dataUser.push(cusObj);

	    drawPieUserChart(dataUser);
	}

}

function drawPieUserChart(data) {
    pathUser = pieUserSVG.selectAll("path").data(pie(data));
    textUserLabel = pieUserSVG.selectAll("text").data(pie(data));
        
    pathUserEnter = pathUser.enter()
        .append("path")
        .merge(pathUser)
        .transition(10)
        .attr("d", arcUser)
        .attr("fill", (d,i) => i ? "#D81B60" : "#039BE5")
        .attr("stroke", "gray");

    textUserLabel.enter()
        .append("text")
        .merge(textUserLabel)
        .transition(10)
        .attr("fill", "white")
        .attr("stroke-width", "0.5")
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .each(function(d) {
            var centroid = labelUserArc.centroid(d);
            d3.select(this)
                .attr('x', centroid[0] - 15)
                .attr('y', centroid[1])
                .attr('dy', '0.33em')
                .text(d.data.label + " " + d.data.value + "%");
        });
    
    pathUser.exit().remove();
    textUserLabel.exit().remove();
}