const csv = require('csv-parser');
const fs = require('fs');
const async = require('async');
const raw_filenames = require('./helper_functions').raw_filenames();

const MONTH = 10;
const data_container = new Map();


function count(start_station, end_station){
    if(start_station === end_station){
        return;
    }
    if(!data_container.has(start_station)){
        data_container.set(start_station, new Map());
    }
    if(!data_container.get(start_station).has(end_station)){
        data_container.get(start_station).set(end_station, 0);
    }
    let count_ = data_container.get(start_station).get(end_station);
    data_container.get(start_station).set(end_station, count_ + 1);
}

function station_routes(callback){
    async.each(raw_filenames, (filename, callback)=>{
        fs.createReadStream(filename)
        .pipe(csv())
        .on('data', function(data){
            try{
                let start_station = data.start_station_name;
                let end_station = data.end_station_name;
                count(start_station, end_station);
            }catch(err){
                console.log(err)
            }
        })
        .on('end', callback);
    },()=>{
        let set_record = new Set();
        let result = [];
        data_container.forEach((data, start_station)=>{
            data.forEach((count, end_station)=>{
                if(data_container.get(end_station).has(start_station)){
                    count += data_container.get(end_station).get(start_station);
                }
                if(!set_record.has(end_station + start_station)){
                    result.push({source: start_station, target: end_station, value: count});
                    set_record.add(start_station + end_station);
                }
            });
        });
        callback(result);
    });
}

station_routes((data)=>{
    fs.writeFileSync(`${__dirname}/../data/station_routes.json`, JSON.stringify(data, null, 2));
})