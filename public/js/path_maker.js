
let lineSVGHeight = d3.select('#line-chart-svg').attr('height');
let lineSVGWidth = d3.select('#line-chart-svg').attr('width');
let lineSVGPadding = {t: 60, r: 40, b: 30, l: 40};
let lineSVGChartWidth = lineSVGWidth - lineSVGPadding.l - lineSVGPadding.r;
let lineSVGChartHeight = lineSVGHeight - lineSVGPadding.t - lineSVGPadding.b;

let lineSVGXScale = d3.scaleLinear().domain([0, 23]).range([0, lineSVGChartWidth]);
let lineSVGYScale = d3.scaleLinear().range([0, lineSVGChartHeight]);

let lineSVG = d3.select('#line-chart-svg');
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
    .attr('stroke', 'blue')
    .attr('stroke-width', '2px');
lineSVGPaths.return = lineSVGPathG.append('path')
    .attr('class', 'return-path')
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-width', '2px');
lineSVGPaths.diff = lineSVGPathG.append('diff')
    .attr('class', 'diff-path')
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', '2px');

// setup x axis
let lineXAxis = d3.axisBottom(lineSVGXScale)
    .tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
let lineSVGXAxis = lineSVG.append('g')
    .attr('transform', `translate(${lineSVGPadding.l}, ${lineSVGPadding.t + lineSVGChartHeight})`)
    .attr('class', 'x axis');

// setup y axis
let lineYAxis = d3.axisLeft(lineSVGYScale).ticks(4);
let lineSVGYAxis = lineSVG.append('g')
    .attr('transform', `translate(${lineSVGPadding.l}, ${lineSVGPadding.t})`)
    .attr('class', 'y axis');

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
    let pick_extent = d3.extent(data.data.pick);
    let return_extent = d3.extent(data.data.return);
    let diff_extent = d3.extent(data.data.diff);
    let yaxis_extent = [Math.max(pick_extent[1], return_extent[1]), 0];
    lineSVGYScale.domain(yaxis_extent);
    lineSVGYAxis.transition().duration(duration_).call(lineYAxis);
    lineSVGXAxis.call(lineXAxis);
    // draw path
    lineSVGPaths.pick.datum(data.data.pick);
    lineSVGPaths.pick.transition().duration(duration_).attr('d', lineSVGPathFun);
    lineSVGPaths.return.datum(data.data.return);
    lineSVGPaths.return.transition().duration(duration_).attr('d', lineSVGPathFun);
    // draw title
    lineSVGTitle.text(name);

}


