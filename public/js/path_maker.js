
let lineSVGHeight = d3.select('#line-chart-svg').attr('height');
let lineSVGWidth = d3.select('#line-chart-svg').attr('width');
let lineSVGPadding = {t: 60, r: 40, b: 30, l: 60};
let lineSVGChartWidth = lineSVGWidth - lineSVGPadding.l - lineSVGPadding.r;
let lineSVGChartHeight = lineSVGHeight - lineSVGPadding.t - lineSVGPadding.b;

let lineSVGXScale = d3.scaleLinear().domain([0, 23]).range([0, lineSVGChartWidth]);
let lineSVGYScale = d3.scaleLinear().range([0, lineSVGChartHeight]);

let linePickColor = "#42A5F5";
let lineReturnColor = "#66BB6A";

let lineSVG = d3.select('#line-chart-svg');
// setup y axis
let lineYAxis = d3.axisLeft(lineSVGYScale).tickSizeInner(-lineSVGChartWidth).ticks(4);
let lineSVGYAxis = lineSVG.append('g')
    .attr('transform', `translate(${lineSVGPadding.l}, ${lineSVGPadding.t})`)
    .attr('class', 'y axis');

// setup x axis
let lineXAxis = d3.axisBottom(lineSVGXScale)
    .tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
let lineSVGXAxis = lineSVG.append('g')
    .attr('transform', `translate(${lineSVGPadding.l}, ${lineSVGPadding.t + lineSVGChartHeight})`)
    .attr('class', 'x axis');
let lineIsXTitleOn = false;
let lineXTitle = lineSVG.append('g')
    .attr("transform",`translate(${lineSVGPadding.l / 2 - 5},${lineSVGPadding.t + lineSVGChartHeight / 2 + 20}) rotate(270)`)
    //.text("Planet Mass (relative to Earth)");

    
// setup paths (lines)
let lineSVGPathG = lineSVG.append('g')
    .attr('class', 'pathG')
    .attr('transform', `translate(${lineSVGPadding.l},${lineSVGPadding.t})`);
let lineSVGPathFun = d3.line()
    .x((d, i)=>{ return lineSVGXScale(i);})
    .y((d, i)=>{ return lineSVGYScale(d);})
    .curve(d3.curveBasis);

    
let lineSVGPaths = {
    pick: null,
    return: null,
    diff: null
}
lineSVGPaths.pick = lineSVGPathG.append('path')
    .attr('class', 'pick-path')
    .attr('fill', 'none')
    .attr('stroke', linePickColor)
    .attr('stroke-width', '2px');
lineSVGPaths.return = lineSVGPathG.append('path')
    .attr('class', 'return-path')
    .attr('fill', 'none')
    .attr('stroke', lineReturnColor)
    .attr('stroke-width', '2px');
lineSVGPaths.diff = lineSVGPathG.append('diff')
    .attr('class', 'diff-path')
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', '2px');

let lineIsDrawnLegend = false;
let lineSVGLegend = lineSVG.append('g')
    .attr('transform', `translate(${lineSVGPadding.l + lineSVGChartWidth - 60}, ${lineSVGPadding.t / 2})`)
    .attr('class', 'legend');

function lineSVGDrawLegend(g){
    let return_ = g.append('g');
    let pick = g.append('g')
        .attr('transform', 'translate(0, 20)');
    pick.append('line')
        .attr('x1', 0)
        .attr('x2', 40)
        .attr('y1', 5)
        .attr('y2', 5)
        .attr('stroke', linePickColor)
        .attr('stroke-width', 2);
    pick.append('text')
        .text('Rent')
        .attr("x", 50)             
        .attr("y", 10);
    return_.append('line')
        .attr('x1', 0)
        .attr('x2', 40)
        .attr('y1', 5)
        .attr('y2', 5)
        .attr('stroke', lineReturnColor)
        .attr('stroke-width', 2);
    return_.append('text')
        .text('Return')
        .attr("x", 50)             
        .attr("y", 10);
}


// setup title
let lineSVGTitle = lineSVG
    .append('text')
    .attr("x", (lineSVGChartWidth / 2))             
    .attr("y", (lineSVGPadding.t / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px");
    

/**
 * 
 * @param {*} data 
 * [
 *      name,
 *      [lat, long],
 *      total,
 *      {
 *          diff:[],
 *          pick:[],
 *          return:[]
 *      }
 * ]
 */
function lineSVGdraw(name, data, duration_ = 200){
    // draw X and Y scale
    let pick_extent = d3.extent(data.pick);
    let return_extent = d3.extent(data.return);
    let diff_extent = d3.extent(data.diff);
    let yaxis_extent = [Math.max(pick_extent[1], return_extent[1]), 0];
    lineSVGYScale.domain(yaxis_extent);
    lineSVGYAxis.transition().duration(duration_).call(lineYAxis);
    lineSVGXAxis.call(lineXAxis);
    // draw path
    lineSVGPaths.pick.datum(data.pick);
    lineSVGPaths.pick.transition().duration(duration_).attr('d', lineSVGPathFun);
    lineSVGPaths.return.datum(data.return);
    lineSVGPaths.return.transition().duration(duration_).attr('d', lineSVGPathFun);
    // draw title
    lineSVGTitle.text(name);
    // draw legend for once.
    if(!lineIsDrawnLegend){
        lineSVGDrawLegend(lineSVGLegend);
        lineXTitle.append('text').text('#use').attr('class', 'x-title');
        lineIsDrawnLegend = true;
    }


}


