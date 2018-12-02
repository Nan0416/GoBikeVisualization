
const csv = require('csv-parser');
const fs = require('fs');
const async = require('async');
const raw_filenames = require('./helper_functions').raw_filenames();

const MONTH = 10;

const data_container = new Map();

function generate_empty_data(){
    let data = {};
    data['sum'] = (new Array(24)).fill(0);
    data['diff'] = (new Array(24)).fill(0);
    data['return'] = (new Array(24)).fill(0);
    data['pick'] = (new Array(24)).fill(0);
    return data;
}

function add_to(station_name, hour, is_return){
    if(typeof hour !== 'number' || hour < 0 || hour > 23){
        console.log(`assertion: invalid hour ${hour} @ add_to`);
        return;
    }
    if(!data_container.has(station_name)){
        data_container.set(station_name, generate_empty_data());
    }
    if(is_return){
        data_container.get(station_name)['return'][hour]++;
    }else{
        data_container.get(station_name)['pick'][hour]++;
    }
    data_container.get(station_name)['sum'][hour]++;
}

function toDate(str){
    //2018-08-01 05:03:03.6030
    let year = parseInt(str.substr(0, 4));
    let month = parseInt(str.substr(5, 7)) - 1;
    let date = parseInt(str.substr(8, 10));
    let hour = parseInt(str.substr(11, 13));
    let min = parseInt(str.substr(14, 16));
    let second = parseInt(str.substr(17, 19));
    //console.log(str, year, month, date, hour, min, second);
    return new Date(year, month, date, hour, min, second);
}

function station_usage(callback){
    async.each(raw_filenames, (filename, callback)=>{
        fs.createReadStream(filename)
        .pipe(csv())
        .on('data', function(data){
            try{
                let start_station = data.start_station_name;
                let end_station = data.end_station_name;
                let startTime = toDate(data.start_time);
                let endTime = toDate(data.end_time);
                add_to(start_station, startTime.getHours(), false);
                add_to(end_station, endTime.getHours(), true);
            }catch(err){
                console.log(err)
            }
        })
        .on('end', callback);
    },()=>{
        let result = {};
        data_container.forEach((data, k)=>{
            for(let i = 0; i < 24; i++){
                data['diff'][i] = data['pick'][i] - data['return'][i];
            }
            result[k] = data;
        });
        callback(result);
    });
}
station_usage(data=>{
    fs.writeFileSync(`${__dirname}/../data/station_usage.json`, JSON.stringify(data, null, 2));
});

