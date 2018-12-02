

let mainStationNames = [];
let mainStations = null;


let mainSelectedStation = null;

let mainBarViewCounter = 0;
let mainSelection = "all";
let mainSelectionMonthCounter = 0;
let mainSelectionWeekCounter = 0;

let mainMonthName = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October"];
let mainWeekName = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
updateArrows(false);
d3.json('../data/station_v6.json', (err, stations_)=>{
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
    showChart(mainStations, mainSelectedStation, "all", 0, 0);
    updateArrows(false);
});
/**
 * @param {*} stations 
 * @param {*} station_name string,
 * @param {*} division string: "all", "monthly", "weekly"
 * @param {*} value a number indicates the month or the week
 * @param {*} view a number indicates the view of bar chart 0, 1, 2
 */
function showChart(stations, station_name, division, value, view){
    if(division === 'monthly'){
        document.getElementById('text-container').innerHTML = mainMonthName[value];
        lineSVGdraw(station_name, stations[station_name].monthly[value]);
        barSVGDraw(station_name, stations[station_name].monthly[value], view);
    }else if(division==="weekly"){
        document.getElementById('text-container').innerHTML = mainWeekName[value];
        lineSVGdraw(station_name, stations[station_name].weekly[value]);
        barSVGDraw(station_name, stations[station_name].weekly[value], view);
    }else{
        document.getElementById('text-container').innerHTML = " ";
        lineSVGdraw(station_name, stations[station_name].total);
        barSVGDraw(station_name, stations[station_name].total, view);
    }
}
function updateArrows(isVisible){
    let tmp = document.getElementsByClassName('nav-btn');
    for(let i = 0; i < tmp.length; i++){
        tmp[i].style.display= isVisible? 'block':'none';
    }
}
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
        showChart(mainStations, mainSelectedStation, "monthly", mainSelectionMonthCounter, mainBarViewCounter);
    }else if(mainSelection === 'weekly'){
        mainSelectionWeekCounter += 6;
        mainSelectionWeekCounter %= 7;
        showChart(mainStations, mainSelectedStation, "weekly", mainSelectionWeekCounter, mainBarViewCounter);
    }
}, false);
/** next month or week */
document.getElementById('next-btn').addEventListener('click',()=>{
    if(mainSelection === 'monthly'){
        mainSelectionMonthCounter++;
        mainSelectionMonthCounter %= 10;
        showChart(mainStations, mainSelectedStation, "monthly", mainSelectionMonthCounter, mainBarViewCounter);
    }else if(mainSelection === 'weekly'){
        mainSelectionWeekCounter++;
        mainSelectionWeekCounter %= 7;
        showChart(mainStations, mainSelectedStation, "weekly", mainSelectionWeekCounter, mainBarViewCounter);
    }
}, false);

document.getElementById("select-division").addEventListener('change', ()=>{
    let selectField = document.getElementById("select-division").value;
    if(mainSelection !== selectField){
        // update
        mainBarViewCounter = 0;
        mainSelection = selectField;
        if(selectField === "monthly"){
            updateArrows(true);
            showChart(mainStations, mainSelectedStation, "monthly", mainSelectionMonthCounter, mainBarViewCounter);
        }else if(selectField === 'weekly'){
            updateArrows(true);
            showChart(mainStations, mainSelectedStation, "weekly", mainSelectionWeekCounter, mainBarViewCounter);
        }else{
            updateArrows(false);
            showChart(mainStations, mainSelectedStation, "all", 0, mainBarViewCounter);
        }
    }
}, false);
   