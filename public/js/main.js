let mainStationNames = [];
let mainStations = null;


let mainSelectedStation = null;

let mainBarViewCounter = 0;
let mainSelection = "All";
let mainSelectionMonthCounter = 0;
let mainSelectionWeekCounter = 0;


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

    createChart(mainSelection, 0);
    drawStation();
    myMap.on('zoomend', drawStation);

    mainSelectedStation = mainStationNames[0];
    lineSVGdraw(mainSelectedStation, mainStations[mainSelectedStation].weekly[3]);            
    barSVGDraw(mainSelectedStation, mainStations[mainSelectedStation].weekly[3], mainBarViewCounter);
    
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
    barSVGDraw(mainSelectedStation, mainStations[mainSelectedStation].weekly[0], mainBarViewCounter);
}, false);

/** last month or week */
document.getElementById('last-btn').addEventListener('click',()=>{
    if(mainSelection === 'monthly'){
        mainSelectionMonthCounter += 9;
        mainSelectionMonthCounter %= 10;
        createChart(mainSelection, mainSelectionMonthCounter);
        drawStation();
        lineSVGdraw(mainSelectedStation, mainStations[mainSelectedStation].monthly[mainSelectionMonthCounter]);            
        barSVGDraw(mainSelectedStation, mainStations[mainSelectedStation].monthly[mainSelectionMonthCounter], mainBarViewCounter);
    }else if(mainSelection === 'weekly'){

    }
}, false);

/** next month or week */
document.getElementById('next-btn').addEventListener('click',()=>{
    if(mainSelection === 'monthly'){
        mainSelectionMonthCounter++;
        mainSelectionMonthCounter %= 10;
        createChart(mainSelection, mainSelectionMonthCounter);
        drawStation();
        lineSVGdraw(mainSelectedStation, mainStations[mainSelectedStation].monthly[mainSelectionMonthCounter]);            
        barSVGDraw(mainSelectedStation, mainStations[mainSelectedStation].monthly[mainSelectionMonthCounter], mainBarViewCounter);
    }else if(mainSelection === 'weekly'){
        
    }
}, false);

/** Weekly or Monthly or All */
document.getElementById('typeSelection').addEventListener('click',()=>{
    mainSelection = document.getElementById("typeSelection").value;
    if(mainSelection === 'monthly'){
        createChart(mainSelection, mainSelectionMonthCounter);
        drawStation();
    }else if(mainSelection === 'weekly'){
        createChart(mainSelection, mainSelectionWeekCounter);
        drawStation();
    }else{
        createChart(mainSelection, 0);
        drawStation();
    }
    
}, false);

