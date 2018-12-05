var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 0.005,
    "maxOpacity": .8, 
    // scales the radius based on map zoom
    "scaleRadius": true, 
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries 
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count',
    /*gradient: {
        '0':'blue',
        '.001': 'green',
        '.8': 'red'
    }*/
  };
  var heatmapLayer = new HeatmapOverlay(cfg);
  


// Create a Map
var myMap = L.map('map', {
    minZoom: 11,
    maxZoom: 15
}).setView([37.805,-122.354849], 12);

// Set the Map to GreyScale
L.TileLayer.Grayscale = L.TileLayer.extend({
    options: {
        quotaRed: 21,
        quotaGreen: 71,
        quotaBlue: 8,
        quotaDividerTune: 0,
        quotaDivider: function() {
            return this.quotaRed + this.quotaGreen + this.quotaBlue + this.quotaDividerTune;
        }
    },

    initialize: function (url, options) {
        options = options || {}
        options.crossOrigin = true;
        L.TileLayer.prototype.initialize.call(this, url, options);

        this.on('tileload', function(e) {
            this._makeGrayscale(e.tile);
        });
    },

    _createTile: function () {
        var tile = L.TileLayer.prototype._createTile.call(this);
        tile.crossOrigin = "Anonymous";
        return tile;
    },

    _makeGrayscale: function (img) {
        if (img.getAttribute('data-grayscaled'))
            return;

                img.crossOrigin = '';
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pix = imgd.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
                        pix[i] = pix[i + 1] = pix[i + 2] = (this.options.quotaRed * pix[i] + this.options.quotaGreen * pix[i + 1] + this.options.quotaBlue * pix[i + 2]) / this.options.quotaDivider();
        }
        ctx.putImageData(imgd, 0, 0);
        img.setAttribute('data-grayscaled', true);
        img.src = canvas.toDataURL();
    }
});

L.tileLayer.grayscale = function (url, options) {
    return new L.TileLayer.Grayscale(url, options);
};
/*var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});*/
// Intialize the Map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamFydmVlIiwiYSI6ImNqb2Y4Z3U4aDAxcnkza3BodmNndGM5M2wifQ.07r_YRi1y_H3YzEP5A4-vQ'
}).addTo(myMap);
heatmapLayer.addTo(myMap);
var svgLayer = L.svg();
svgLayer.addTo(myMap);

// UI configuration & Global SVG handler
var mapSvg = d3.select('#map').select('svg');
var stationG = mapSvg.append('g');
var dots;
//var dotsEnter;
//var mapStations;
var colorScale = d3.scaleSequential(d3["interpolateBlues"]);
//var station_names = [];

/** update the color of each dot according to each month or each day */
function mapUpdate(station_names, stations, selection, value){
    let maxV = 0, minV = 10000;
    let rowData;
    let colorValue = {};
    for(let i = 0; i < station_names.length; i++){
        if(selection === 'weekly'){
            rowData = stations[station_names[i]].weekly[value].sum;
        }else if(selection === 'monthly'){
            rowData = stations[station_names[i]].monthly[value].sum;
        }else{
            rowData = stations[station_names[i]].total.sum;
        }
        let tmp = 0;
        for(let i = 0; i < rowData.length; i++){
            tmp += rowData[i];
        }
        if(maxV < tmp){
            maxV = tmp;
        }
        if(minV > tmp){
            minV = tmp;
        }
        colorValue[station_names[i]] = tmp;
    }

    colorScale.domain([0, Math.pow(maxV, 0.2)]);

    dots.attr('fill', (d)=>{
        return colorScale(Math.pow(colorValue[d], 0.2));
    });
    heatmapLayer.setData(quantifyStationsPattern(station_names, stations, selection, value));
}

function mapInitalizer(station_names, stations) {
    let maxV = 0, minV = 10000, rowData, colorValue = {}, tmp = 0;
    for(let i = 0; i < station_names.length; i++){
        rowData = stations[station_names[i]].total.sum;
        tmp = 0;
        for(let i = 0; i < rowData.length; i++){ tmp += rowData[i]; }
        if(maxV < tmp){  maxV = tmp; }
        if(minV > tmp){ minV = tmp; }
        colorValue[station_names[i]] = tmp;
    }
    colorScale.domain([0, Math.pow(maxV, 0.2)]);
    dots = stationG.selectAll('.station')
        .data(station_names, (d)=>{
            return d;
        });
    
    dots = dots.enter()
        .append('circle')
        .attr('class', 'point').attr('class', 'station')
        .attr('stroke', '#606060').attr('stroke-width', 1).attr('r', 3).attr('opacity', 0.5)
        .attr("pointer-events","visible")
        .attr('fill', function(d){
            /*colorScale.domain([Math.pow(12, 0.3), Math.pow(74128, 0.3)]);
            let colorValue = 0;
            for(let i = 0; i < stations[d].total.sum.length; i++){
                colorValue += stations[d].total.sum[i];
            }*/
            return colorScale(Math.pow(colorValue[d], 0.2));
        })
        .attr('cx', d=>{
            return myMap.latLngToLayerPoint(stations[d].location).x
        })
        .attr('cy', d=>{
            return myMap.latLngToLayerPoint(stations[d].location).y
        })
        .on('mouseover', function(d){
            var markerGroup = L.layerGroup().addTo(myMap);
            L.circle([stations[d].location[0], stations[d].location[1]], {
                color: "none",
                stroke: 1,
                fillColor: colorScale(Math.pow(stations[d].total, 0.3)),
                fillOpacity: 0,
                radius: 100
            }).addTo(markerGroup)
            .bindPopup("Station Name: " + d)
            .on('mouseover', function () {
                this.openPopup();
                })
            .on('mouseout', function() {
                this.closePopup();
                myMap.removeLayer(markerGroup);
            })
            .on('click', function(){
                let e = d;
                myMap.setView([stations[e].location[0], stations[e].location[1]], 14);
                updateStation(e);
            });
        });
    myMap.on('zoomend', ()=>{
        dots.attr('cx', d=>{
                return myMap.latLngToLayerPoint(stations[d].location).x;
            })
            .attr('cy', d=>{
                return myMap.latLngToLayerPoint(stations[d].location).y;
            })
    });
    
    
    heatmapLayer.setData(quantifyStationsPattern(station_names, stations, "all", 0));
}

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");


/** 
 * data:{
 *  sum:[]
 *  diff:[]
 *  return:[]
 *  pick:[]
 * }
*/
function quantifyPattern(data){
    let count = 0;
    for(let i = 0; i < 24; i++){
        if(i < 12){
            count -= data.diff[i];
        }else{
            count += data.diff[i];
        }
    }
    return count;
}
function quantifyStationsPattern(station_names, stations, selection, value){
    let data = [];
    let max = 0;
    let min = 0;
    if(selection === 'monthly'){
        for(let i = 0; i < station_names.length; i++){
            let count = quantifyPattern(stations[station_names[i]].monthly[value]);
            if(count > max){
                max = count;
            }else if(count < min){
                min = count;
            }
            data.push({
                lat: stations[station_names[i]].location[0],
                lng: stations[station_names[i]].location[1],
                count: count
            });
        }
    }else if(selection === 'weekly'){
        for(let i = 0; i < station_names.length; i++){
            let count = quantifyPattern(stations[station_names[i]].weekly[value]);
            count = count > 0? Math.pow(Math.abs(count), 1/2): -1 * Math.pow(Math.abs(count), 1/2);
            if(count > max){
                max = count;
            }else if(count < min){
                min = count;
            }
            data.push({
                lat: stations[station_names[i]].location[0],
                lng: stations[station_names[i]].location[1],
                count: count
            });
        }
    }else{
        for(let i = 0; i < station_names.length; i++){
            let count = quantifyPattern(stations[station_names[i]].total);
            
            count = count > 0? Math.pow(Math.abs(count), 1/3): -1 * Math.pow(Math.abs(count), 1/3);
            if(count > max){
                max = count;
            }else if(count < min){
                min = count;
            }
            data.push({
                lat: stations[station_names[i]].location[0],
                lng: stations[station_names[i]].location[1],
                count: count
            });
        }
    }
    //max = max - min;
    for(let  i = 0; i < data.length; i++){
        if(data[i].count < 0){
            data[i].count = max - data[i].count;
        }
    }
    return {
        max: max - min,
        min: 0,
        data: data
    }

}