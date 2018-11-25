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

var mymap = L.map('mapid').setView([37.7749, -122.4194], 10);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamFydmVlIiwiYSI6ImNqb2Y4Z3U4aDAxcnkza3BodmNndGM5M2wifQ.07r_YRi1y_H3YzEP5A4-vQ'
}).addTo(mymap);


d3.csv('./data/201801-fordgobike-tripdata.csv',
    function(d){
        // This callback formats each row of the data
        return {
            duration: +d.duration_sec,
            start_time: d.start_time,
            end_time: d.start_time,
            start_long: +d.start_station_longitude,
            start_lat: +d.start_station_latitude,
            end_long: +d.end_station_longitude,
            end_lat: +d.end_station_latitude
        }
    },
    function(error, dataset){
        if(error) {
            console.error('Error loading dataset.');
            console.error(error);
            return;
        }

        // **** Set up your global variables and initialize the chart here ****
        console.log(dataset)
        updateChart(0);
    });

function updateChart(time) {
    // **** Update the chart based on the year here ****
}
