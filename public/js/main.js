

let mainStationNames = [];
let mainStations = null;

let mainSelectedData = null;
let mainSelectedStation = null;

let mainBarViewCounter = 0;

d3.json('../data/station_v5.json', (err, stations_)=>{
    if(err){
        console.log(err);
        alert("Error: d3 failed to read data.");
        return;
    }
    mainStations = stations_;

    for (var key in stations_) {
        if (stations_.hasOwnProperty(key)) {
            mainStationNames.push(key);
        }
    }
   
    mainSelectedStation = mainStationNames[0];
    mainSelectedData = mainStations[mainSelectedStation].monthly[0];

    console.log(mainSelectedStation, mainSelectedData);
    lineSVGdraw(mainSelectedStation, mainSelectedData);            
    barSVGDraw(mainSelectedStation, mainSelectedData, mainBarViewCounter);
    
});

//////////////// Configure Event Listener Below ///////////////////////////
/* switch between line chart and bar chart*/
document.getElementById('btn-show-line-chart').addEventListener('click', ()=>{
    document.getElementById('line-chart-svg').classList.remove('bar-chart-in');
    document.getElementById('bar-chart-svg').classList.remove('bar-chart-in');
    document.getElementById('line-chart-svg').classList.add('line-chart-in');
    document.getElementById('bar-chart-svg').classList.add('line-chart-in');
    /* switch to line chart */
    document.getElementById('btn-show-bar-chart').addEventListener('click', ()=>{
        document.getElementById('line-chart-svg').classList.remove('line-chart-in');
        document.getElementById('bar-chart-svg').classList.remove('line-chart-in');
        document.getElementById('line-chart-svg').classList.add('bar-chart-in');
        document.getElementById('bar-chart-svg').classList.add('bar-chart-in');
    }, false);
}, false);

/** switch to different view of bar chart */
document.getElementById('bar-chart-svg').addEventListener('click', ()=>{
    mainBarViewCounter++;
    mainBarViewCounter = mainBarViewCounter % 3;
    barSVGDraw(mainSelectedStation, mainSelectedData, mainBarViewCounter);
}, false);

let month_ = 0;
function mainUpdateMonth(){
    month_ ++;
    month_ = month_ % 10;
    mainSelectedData = mainStations[mainSelectedStation].monthly[month_];
    lineSVGdraw(mainSelectedStation, mainSelectedData);            
    barSVGDraw(mainSelectedStation, mainSelectedData, mainBarViewCounter);
}