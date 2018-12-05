
let pieSVGHeight = d3.select('#pie-chart-svg').attr('height');
let pieSVGWidth = d3.select('#pie-chart-svg').attr('width');
let pieSVGPadding = {t: 60, r: 40, b: 30, l: 40};
let pieSVGChartWidth = pieSVGWidth - pieSVGPadding.l - pieSVGPadding.r;
let pieSVGChartHeight = pieSVGHeight - pieSVGPadding.t - pieSVGPadding.b;

let pieRadius = Math.min(pieSVGChartWidth, pieSVGChartHeight) / 2;
let color = d3.scaleOrdinal().range(["#98abc5", "#7b6888"]);
let arc = d3.arc().outerRadius(pieRadius - 10).innerRadius(0);

let labelArc = d3.arc().outerRadius(pieRadius - 40).innerRadius(pieRadius - 40);

let pie = d3.pie().sort(null).value(function(d) { return d.value; });


let pieSVG = d3.select('#pie-chart-svg').append('svg')
    .attr("width", pieSVGChartWidth)
    .attr("height", pieSVGChartHeight)
    .append("g")
    .attr("transform", "translate(" + pieSVGChartWidth / 2 + "," + pieSVGChartHeight / 2 + ")");

let label = ["Male", "Female"];
let path = pieSVG.selectAll("path");
let textLabel = pieSVG.selectAll("text");
let pathEnter = null;

let opacityHover = 1;
let otherOpacityOnHover = .8;

function pieSVGdraw(data, name, value){

    let filteredData = [];


    var maleObj = {};
    maleObj.label = "Male";
    maleObj.value = data[name][value].male;
    filteredData.push(maleObj);

    var femaleObj = {};
    femaleObj.label = "Female";
    femaleObj.value = data[name][value].female;
    filteredData.push(femaleObj);

    console.log(filteredData);
    drawPieChart(filteredData);
           
}


function pieSVGdrawAll() {

    let data = [];

    let sumMale = 0;
    let sumFemale = 0;

    for (var key in station_monthly_gender) {
        for (i = 0; i < 10; i++) {
            var male = parseInt(station_monthly_gender[key][i].male, 10);
            var female = parseInt(station_monthly_gender[key][i].female, 10);
            sumMale += male;
            sumFemale += female;
        }
    }
    var maleObj = {};
    maleObj.label = "Male";
    maleObj.value = sumMale;

    data.push(maleObj);

    var femaleObj = {};
    femaleObj.label = "Female";
    femaleObj.value = sumFemale;
    data.push(femaleObj);

    drawPieChart(data);
    
}

function drawPieChart(data) {
    path = pieSVG.selectAll("path").data(pie(data));

    textLabel = pieSVG.selectAll("text").data(pie(data));
        
    pathEnter = path.enter()
        .append("path")
        .merge(path)
        .transition(10)
        .attr("d", arc)
        .attr("fill", (d,i) => i ? "teal" : "brown")
        .attr("stroke", "gray");

    textLabel.enter()
        .append("text")
        .merge(textLabel)
        .transition(10)
        .attr("fill", "white")
        .attr("stroke-width", "0.5")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .each(function(d) {
            var centroid = labelArc.centroid(d);
            d3.select(this)
                .attr('x', centroid[0])
                .attr('y', centroid[1])
                .attr('dy', '0.33em')
                .text(d.data.value);
        });

    pieSVG.append('g')
        .attr('class', 'legend')
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text(function(d) { return '• ' + d.label; })
        .attr("fill", (d, i) => i ? "white" : "red")
        .attr('x', "120")
        .attr('y', function(d, i) { return 20 * (i - 3); })



    path.exit().remove();
    textLabel.exit().remove();
}