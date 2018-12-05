
let barSVGHeight = d3.select('#bar-chart-svg').attr('height');
let barSVGWidth = d3.select('#bar-chart-svg').attr('width');
let barSVGPadding = {t: 60, r: 40, b: 30, l: 60};
let barSVGChartWidth = barSVGWidth - barSVGPadding.l - barSVGPadding.r;
let barSVGChartHeight = barSVGHeight - barSVGPadding.t - barSVGPadding.b;
let barWidth_ = barSVGChartWidth / 24;
let barWidth = barWidth_  / 2;


let barSVGXScale = d3.scaleLinear().domain([0, 24]).range([0, barSVGChartWidth]);
let barSVGYScale = d3.scaleLinear().range([0, barSVGChartHeight]);

let barSVG = d3.select('#bar-chart-svg');
// setup y axis
let barYAxis = d3.axisLeft(barSVGYScale).tickSizeInner(-barSVGChartWidth).ticks(4).tickFormat(d=>Math.abs(d));
let barSVGYAxis = barSVG.append('g')
    .attr('transform', `translate(${barSVGPadding.l}, ${barSVGPadding.t})`)
    .attr('class', 'y axis');
// setup paths (bars)
let barSVGChartG = barSVG.append('g')
    .attr('class', 'barG')
    .attr('transform', `translate(${barSVGPadding.l},${barSVGPadding.t})`);


// setup x axis
let barXAxis = d3.axisBottom(barSVGXScale)
    //.tickSize(-barSVGChartHeight)
    .tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
let barSVGXAxis = barSVG.append('g')
    .attr('transform', `translate(${barSVGPadding.l}, ${barSVGPadding.t + barSVGChartHeight})`)
    .attr('class', 'x axis');
let barIsXTitleOn = false;
let barXTitle = barSVG.append('g')
    .attr("transform",`translate(${barSVGPadding.l / 2 - 5},${barSVGPadding.t + barSVGChartHeight / 2 + 20}) rotate(270)`)
    //.text("Planet Mass (relative to Earth)");



// setup title
let barSVGTitle = barSVG.append('text')
    .attr("x", (barSVGChartWidth / 2))             
    .attr("y", (barSVGPadding.t / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px");

let barSVGLegend = barSVG.append('g')
    .attr('transform', `translate(${barSVGPadding.l + barSVGChartWidth - 60}, ${barSVGPadding.t / 2})`)
    .attr('class', 'legend');

let barChartName = null;
let barChartData = null;

let bar2 = null;
let bar = null;

let barPickColor = "#42A5F5";
let barReturnColor = "#66BB6A";
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
 * type 0: sum, type 1: diff, type 2: middle baseline
 */
function barSVGDraw(name, data, type, duration_ = 200){
    if(bar === null|| bar2 === null){
        barSVGDraw__(name, data, type, duration_);
        return;
    }
    if(name && data){
        barChartData = data;
        barChartName = name;
    }else if(barChartData && barChartName){
        name = barChartName;
        data = barChartData;
    }else{
        return;
    }
    // prepare scale.
    let pick_extent = d3.extent(data.pick);
    let return_extent = d3.extent(data.return);
    let pick_return_extent = [ pick_extent[1], -return_extent[1]];
    let diff_extent = d3.extent(data.diff);
    let sum_extent = [0, pick_extent[1] + return_extent[1]];
    
   

    let bar2s = barSVGChartG.selectAll('.bar2')
        .data(data.pick);
    let bars = bar2.selectAll('.bar')
        .data((d, i)=>{
            return [
                {
                    pick:data.pick[i],
                    return: data.return[i]
                },
                {
                    pick:data.pick[i],
                    return: data.return[i]
                }
            ];
        });
        
    if(type === 0){
        barSVGYScale.domain(sum_extent);
        bar2.merge(bar2s)
            .transition().duration(duration_)
            .attr('transform', (d, i)=>{
                return `translate(${i * barWidth_ + barWidth / 2}, ${barSVGChartHeight - barSVGYScale(data.pick[i] + data.return[i])})`;
            });
        bar.merge(bars)
            .transition().duration(duration_)
            .attr('height', (d, i)=>{
                if(i === 0){
                    return barSVGYScale(d.pick);
                }else{
                    return barSVGYScale(d.return);
                }
            })
            .attr('y', (d, i)=>{
                return (1 - i) * barSVGYScale(d.return);
            })
            .attr('x', 0)
            .attr('fill', (d, i)=>{
                return i === 0? barPickColor: barReturnColor;
            });
        
        barSVGYScale.domain([sum_extent[1], sum_extent[0]]);
        barSVGXAxis.transition().duration(duration_)
            .attr('transform', `translate(${barSVGPadding.l}, ${barSVGPadding.t + barSVGChartHeight})`)
            .call(barXAxis);
    }else if(type === 1){
        barSVGYScale.domain(pick_return_extent);
        let barBaseline = barSVGYScale(0);
        barSVGYScale.domain(sum_extent);

        bar2.merge(bar2s)
            .transition().duration(duration_)
            .attr('transform', (d, i)=>{
                return `translate(${i * barWidth_ + barWidth / 2}, ${0})`;
            });
        bar.merge(bars)
            .transition().duration(duration_)
            .attr('height', (d, i)=>{
                if(i === 0){
                    return barSVGYScale(d.pick);
                }else{
                    return barSVGYScale(d.return);
                }
            })
            .attr('y', (d, i)=>{
                return i === 0? barBaseline: barBaseline - barSVGYScale(d.return);
            })
            .attr('x', 0)
            .attr('fill', (d, i)=>{
                return i === 0? barPickColor: barReturnColor;
            });
        
        barSVGYScale.domain(pick_return_extent);
        barSVGXAxis.transition().duration(duration_)
            .attr('transform', `translate(${barSVGPadding.l}, ${barSVGPadding.t + barBaseline})`)
            .call(barXAxis);
    }else{
        barSVGYScale.domain(pick_return_extent);
        let barBaseline = barSVGYScale(0);
        barSVGYScale.domain(sum_extent);

        bar2.merge(bar2s)
            .transition().duration(duration_)
            .attr('transform', (d, i)=>{
                return `translate(${i * barWidth_ + barWidth / 2}, ${0})`;
            });
        bar.merge(bars)
            .transition().duration(duration_)
            .attr('height', (d, i)=>{
                return barSVGYScale(Math.abs(d.pick - d.return));
            })
            .attr('y', (d, i)=>{
                if(d.pick > d.return){
                    return barBaseline;
                }else{
                    return barBaseline - barSVGYScale(Math.abs(d.return - d.pick));
                }
            })
            .attr('x', 0)
            .attr('fill', (d, i)=>{
                return d.pick > d.return? barPickColor: barReturnColor;
            });
        
        barSVGYScale.domain(pick_return_extent);
        barSVGXAxis.transition().duration(duration_)
            .attr('transform', `translate(${barSVGPadding.l}, ${barSVGPadding.t + barBaseline})`)
            .call(barXAxis);
    }
    barSVGYAxis.transition().duration(duration_).call(barYAxis);
    // draw title
    barSVGTitle.text(name);
    // update legend
    let legendItems;
    if(type === 0 || type === 1){
        legendItems = barSVGLegend.selectAll('.legend-item')
            .data(
                [
                    
                    {
                        color: barReturnColor,
                        text: "Return"
                    },
                    {
                        color: barPickColor,
                        text: "Rent"
                    }
                ]
            );   
    }else{
        legendItems = barSVGLegend.selectAll('.legend-item')
            .data(
                [
                    {
                        color: barReturnColor,
                        text: "Net Return"
                    },
                    {
                        color: barPickColor,
                        text: "Net Rent"
                    }
                ]
            );
    }
    legendItems.select('text').text(d=>d.text);
    legendItems.select('rect').attr('fill', d=>d.color);
}
function barSVGDraw__(name, data, type, duration_ = 200){
    if(name && data){
        barChartData = data;
        barChartName = name;
    }else if(barChartData && barChartName){
        name = barChartName;
        data = barChartData;
    }else{
        return;
    }
    // prepare scale.
    let pick_extent = d3.extent(data.pick);
    let return_extent = d3.extent(data.return);
    let pick_return_extent = [ pick_extent[1], -return_extent[1]];
    let diff_extent = d3.extent(data.diff);
    let sum_extent = [0, pick_extent[1] + return_extent[1]];
    

    let bar2s = barSVGChartG.selectAll('.bar2')
        .data(data.pick);
    bar2 = bar2s.enter()
        .append('g')
        .attr('class', 'bar2');

    let bars = bar2.selectAll('.bar')
        .data((d, i)=>{

            return [
                {
                    pick:data.pick[i],
                    return: data.return[i]
                },
                {
                    pick:data.pick[i],
                    return: data.return[i]
                }
            ];
        });
    bar = bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', barWidth);
        
    if(type === 0){
        barSVGYScale.domain(sum_extent);
        bar2.attr('transform', (d, i)=>{
                return `translate(${i * barWidth_ + barWidth / 2}, ${barSVGChartHeight - barSVGYScale(data.pick[i] + data.return[i])})`;
            });
        bar.attr('height', (d, i)=>{
                if(i === 0){
                    return barSVGYScale(d.pick);
                }else{
                    return barSVGYScale(d.return);
                }
            })
            .attr('y', (d, i)=>{
                return (1 - i) * barSVGYScale(d.return);
            })
            .attr('x', 0)
            .attr('fill', (d, i)=>{
                return i === 0? barPickColor: barReturnColor;
            })
            .attr('rx', 2).attr('ry', 2);
        
        barSVGYScale.domain([sum_extent[1], sum_extent[0]]);
        barSVGXAxis
            .attr('transform', `translate(${barSVGPadding.l}, ${barSVGPadding.t + barSVGChartHeight})`)
            .call(barXAxis);
    }else if(type === 1){
        barSVGYScale.domain(pick_return_extent);
        let barBaseline = barSVGYScale(0);
        barSVGYScale.domain(sum_extent);

        bar2.attr('transform', (d, i)=>{
                return `translate(${i * barWidth_ + barWidth / 2}, ${0})`;
            });
        bar.attr('height', (d, i)=>{
                if(i === 0){
                    return barSVGYScale(d.pick);
                }else{
                    return barSVGYScale(d.return);
                }
            })
            .attr('y', (d, i)=>{
                return i === 0? barBaseline: barBaseline - barSVGYScale(d.return);
            })
            .attr('x', 0)
            .attr('fill', (d, i)=>{
                return i === 0? barPickColor: barReturnColor;
            });
        
        barSVGYScale.domain(pick_return_extent);
        barSVGXAxis
            .attr('transform', `translate(${barSVGPadding.l}, ${barSVGPadding.t + barBaseline})`)
            .call(barXAxis);
    }else{
        barSVGYScale.domain(pick_return_extent);
        let barBaseline = barSVGYScale(0);
        barSVGYScale.domain(sum_extent);

        bar2.attr('transform', (d, i)=>{
                return `translate(${i * barWidth_ + barWidth / 2}, ${0})`;
            });
        bar.attr('height', (d, i)=>{
                return barSVGYScale(Math.abs(d.pick - d.return));
            })
            .attr('y', (d, i)=>{
                if(d.pick > d.return){
                    return barBaseline - barSVGYScale(Math.abs(d.pick - d.return));
                }else{
                    return barBaseline;
                }
            })
            .attr('x', 0)
            .attr('fill', (d, i)=>{
                return d.pick > d.return? barPickColor: barReturnColor;
            });
        
        barSVGYScale.domain(pick_return_extent);
        barSVGXAxis.attr('transform', `translate(${barSVGPadding.l}, ${barSVGPadding.t + barBaseline})`)
            .call(barXAxis);
    }
    barSVGYAxis.call(barYAxis);
    // draw title
    barSVGTitle.text(name);

    // draw legend;
    let legendItems
    if(type === 0 || type === 1){
        legendItems = barSVGLegend.selectAll('.legend-item')
            .data(
                [
                    {
                        color: barReturnColor,
                        text: "Return"
                    },
                    {
                        color: barPickColor,
                        text: "Rent"
                    }
                ]
            );   
    }else{
        legendItems = barSVGLegend.selectAll('.legend-item')
            .data(
                [
                   
                    {
                        color: barReturnColor,
                        text: "Net Return"
                    },
                    {
                        color: barPickColor,
                        text: "Net Rent"
                    }
                ]
            );
    }
    legendItems = legendItems.enter()
        .append('g').attr('class', 'legend-item')
        .attr('transform', (d, i)=>{
            return `translate(0, ${i * 20})`;
        });
    legendItems.append('rect')
        .attr('rx', 2).attr('ry', 2)
        .attr('x', 0).attr('y', 0).attr('width', 16).attr('height', 16)
        .attr('fill', d=>d.color)
    legendItems.append('text')
        .text(d=>d.text)
        .attr("x", 30).attr("y", 14);
    barXTitle.append('text')
        .text('#use')
        .attr('class', 'x-title');
}


