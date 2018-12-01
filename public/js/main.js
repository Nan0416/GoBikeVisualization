// Create a Map
var myMap = L.map('map').setView([37.805,-122.354849], 12);

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

// Intialize the Map
L.tileLayer.grayscale('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamFydmVlIiwiYSI6ImNqb2Y4Z3U4aDAxcnkza3BodmNndGM5M2wifQ.07r_YRi1y_H3YzEP5A4-vQ'
}).addTo(myMap);

var svgLayer = L.svg();
svgLayer.addTo(myMap);

// UI configuration & Global SVG handler
var mapSvg = d3.select('#map').select('svg');
var stationG = mapSvg.append('g');
var dots;
var dotsEnter;
var stations;
var colorScale = d3.scaleSequential(d3["interpolateBlues"]);
var station_names = [];
var barViewCounter = 0;
d3.json('../data/station_v4.json', (err, stations_)=>{
    if(err){
        console.log(err);
        alert("Error!");
        return;
    }
    
    stations = stations_;
    for (var key in stations) {
        if (stations.hasOwnProperty(key)) {
            station_names.push(key);
        }
    }

    createChart();
    drawStation();
    myMap.on('zoomend', drawStation);
    d3.select('#bar-chart-svg').on('click', ()=>{
        barViewCounter++;
        barViewCounter = barViewCounter % 3;
        barSVGDraw(null,  null, barViewCounter);
    });
});

function createChart() {

    dots = stationG.selectAll('.station')
        .data(station_names, (d)=>{
            return d;
        });

    dotsEnter = dots.enter()
        .append('circle')
        .attr('class', 'point')
        .attr("pointer-events","visible")
        .attr('fill', function(d){
            colorScale.domain([Math.pow(12, 0.3), Math.pow(74128, 0.3)]);
            return colorScale(Math.pow(stations[d].total, 0.3));
        })
        .attr('r', 5)
        .attr('cx', d=>{
            return myMap.latLngToLayerPoint(stations[d].location).x
        })
        .attr('cy', d=>{
            return myMap.latLngToLayerPoint(stations[d].location).y
        })
        .on('mouseover', function(d){
            console.log('mouseover');
            var markerGroup = L.layerGroup().addTo(myMap);
            L.circle([stations[d].location[0], stations[d].location[1]], {
                color: "none",
                stroke: 1,
                fillColor: colorScale(Math.pow(stations[d].total, 0.3)),
                fillOpacity: 1,
                radius: 5
            }).addTo(markerGroup)
            .bindPopup("Station Name: " + d)
            .on('mouseover', function () {
                this.openPopup();
                })
            .on('mouseout', function() {
                this.closePopup();
            })
        })
        .on('click', function(e){
            console.log(e);
            lineSVGdraw(e, stations[e]);
            barViewCounter = 0;
            barSVGDraw(e,  stations[e], barViewCounter);
        });
        
}

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

function drawStation() {
    dots.merge(dotsEnter)
        .attr('cx', d=>{
            return myMap.latLngToLayerPoint(stations[d].location).x
        })
        .attr('cy', d=>{
            return myMap.latLngToLayerPoint(stations[d].location).y
        })
}

