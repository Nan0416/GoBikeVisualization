document.getElementById('btn-show-line-chart').addEventListener('click', ()=>{
    document.getElementById('line-chart-svg').classList.remove('bar-chart-in');
    document.getElementById('bar-chart-svg').classList.remove('bar-chart-in');
    document.getElementById('line-chart-svg').classList.add('line-chart-in');
    document.getElementById('bar-chart-svg').classList.add('line-chart-in');
}, false);
document.getElementById('btn-show-bar-chart').addEventListener('click', ()=>{
    document.getElementById('line-chart-svg').classList.remove('line-chart-in');
    document.getElementById('bar-chart-svg').classList.remove('line-chart-in');
    document.getElementById('line-chart-svg').classList.add('bar-chart-in');
    document.getElementById('bar-chart-svg').classList.add('bar-chart-in');
}, false);
