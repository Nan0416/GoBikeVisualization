// Creates a bootstrap-slider element
$("#timeSlider").slider({
    tooltip: 'always',
    tooltip_position:'bottom'
});
// Listens to the on "change" event for the slider
$("#timeSlider").on('change', function(event){
    // Update the chart on the new value
    updateChart(event.value.newValue);
    console.log(event.value.newValue);
});

var myMap = L.map('map').setView([37.805,-122.354849], 12);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamFydmVlIiwiYSI6ImNqb2Y4Z3U4aDAxcnkza3BodmNndGM5M2wifQ.07r_YRi1y_H3YzEP5A4-vQ'
}).addTo(myMap);

var svgLayer = L.svg();
svgLayer.addTo(myMap)
var svg = d3.select('#map').select('svg');

var brush = d3.brush()
    .extent([[0, 0], [500, 500]])
    .on("start", ()=>{

    })
    .on("brush", ()=>{

    })
    .on("end", ()=>{

    });

var completeData;
var heatmapData;
var stations;
var stationEnter;
var quickMap = new Map();

d3.json('../data/station.json', (err, stationData)=>{
    if(err){
        console.log(err);
        alert("Error!");
        return;
    }
    for(let i = 0; i < stationData.length; i++){
        quickMap.set(stationData[i].name, stationData[i]);
    }


    completeData = stationData;
    heatmapData = stationData.slice();
    
    
    //initalize map
    let stationG = svg.append('g');
    //stationG.call(brush);
    stations = stationG
        .selectAll('.station')
        .data(stationData, (d)=>{
            return d.name;
        });
    stationEnter = stations.enter()
        .append('circle')
        .attr('class', 'point')
        .attr('fill', 'green')
        .attr('r', 3)
        .attr('cx', d=>{return myMap.latLngToLayerPoint(d.location).x})
        .attr('cy', d=>{return myMap.latLngToLayerPoint(d.location).y});

    

    // setup listener
    myMap.on('zoomend', drawStation);

    
    drawStation();
    
    
    
});

function drawStation(){
    stationEnter.merge(stations)
        .attr('cx', d=>{
            return myMap.latLngToLayerPoint(d.location).x
        })
        .attr('cy', d=>{
            return myMap.latLngToLayerPoint(d.location).y
        });
}
function updateChart(time) {
    // **** Update the chart based on the year here ****
}


function aggregateDataByMonth(station_names){
    if(!station_names){
        return completeData.slice();
    }else{
        let result = [];
        for(let i = 0; i < station_names; i++){
            if(quickMap.has(station_names[i])){
                result.push(quickMap.get(station_names[i]));
            }
        }
    }
}
