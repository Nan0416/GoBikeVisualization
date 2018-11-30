const csv = require('csv-parser');
const fs = require('fs');
const async = require('async');
const raw_filenames = require('./helper_functions').raw_filenames();
//<string, [Lat, Long]>
//<Mission Dolores Park, [37.7614205,-122.4264353]>
const _map_ = new Map();

function add_to_map(station_name, station_lat, station_long){
    if(typeof station_name === "string" && !isNaN(station_lat) && !isNaN(station_long)){
        _map_.set(station_name, [parseFloat(station_lat), parseFloat(station_long)]);
    }
}

function station_location(callback){
    async.each(raw_filenames, (filename, callback)=>{
        fs.createReadStream(filename)
        .pipe(csv())
        .on('data', function(data){
            if(data){
                add_to_map(
                    data.start_station_name, 
                    data.start_station_latitude, 
                    data.start_station_longitude
                );
                add_to_map(
                    data.end_station_name, 
                    data.end_station_latitude, 
                    data.end_station_longitude
                );
            }
        })
        .on('end', () => {
            callback();
        });
    }, ()=>{
        let result = {};
        _map_.forEach((v, k)=>{
            result[k] = v;
        });
        callback(result);
    });
}


station_location(data=>{
    fs.writeFileSync(`${__dirname}/../data/station_location.json`, JSON.stringify(data, null, 2));
});