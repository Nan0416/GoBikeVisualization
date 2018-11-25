const csv = require('csv-parser')
const fs = require('fs')
var results = [];

var startData = [];
var endData = [];

fs.createReadStream('test.csv')
  .pipe(csv())
  .on('data', function(data){
  	  data_handler(data);
    })
  .on('end', () => {
  	merge();
  	fs.writeFileSync("result.json", JSON.stringify(results), 'utf-8');
    console.log("Completely Processed");
  });

function data_handler(data) {	
	var startHour = parseTime(data['start_time']);
  	var endHour = parseTime(data['end_time']);
  	
   	startData.push({
      'time':  startHour,
      'prop': 'start',
      'id': data['start_station_id'],
      'name': data['start_station_name'],
      'loc': [+data['start_station_latitude'], +data['start_station_longitude']]
    });

	endData.push({
      'time':  endHour,
      'prop': 'end',
      'id': data['end_station_id'],
      'name': data['end_station_name'],
      'loc': [+data['end_station_latitude'], +data['end_station_longitude']]
    });
}

function parseTime(s) {
	var arr = s.split(' ');
	var time = arr[1].split(':');
	var hour = time[0];
	return hour;
}

function merge() {
	results = (startData.concat(endData));
}