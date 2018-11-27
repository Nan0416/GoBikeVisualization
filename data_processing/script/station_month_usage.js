/**
 * station_name: {
 * start: [
 *  [0, 0, 12, 21, 23, 40, 2 ... ] // January in 24 hours
 *  [] // February
 *  ... 
 * ],
 * end:[
 * 
 * ],
 * overall:[
 * 
 * ],
 * 
 * }
 * 
 */


const csv = require('csv-parser');
const fs = require('fs');
const async = require('async');
const raw_filenames = require('./helper_functions').raw_filenames();

const MONTH = 10;

const start_counter = new Map();
const end_counter = new Map();

// counter: Map
function add_to(counter, station, month, hour){
    let condition = (
        typeof station === 'string' && 
        typeof hour === 'number' && hour >= 0 && hour < 24 &&
        typeof month === 'number' && month >= 0 && month < MONTH
    );
        
    if(!condition){
        //console.log(station, month, hour);
        return;
    }
    if(!counter.has(station)){
        let arr = new Array(MONTH);
        for(let i = 0; i < MONTH; i++){
            arr[i] = new Array(24).fill(0);
        }
        counter.set(station, arr);    
    }
    counter.get(station)[month][hour]++;
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

function month_usage(callback){
    async.each(raw_filenames, (filename, callback)=>{
        fs.createReadStream(filename)
        .pipe(csv())
        .on('data', function(data){
            try{
                let start_station = data.start_station_name;
                let end_station = data.end_station_name;
                let startTime = toDate(data.start_time);
                let endTime = toDate(data.end_time);
                add_to(start_counter, start_station, startTime.getMonth(), startTime.getHours());
                add_to(end_counter, end_station, endTime.getMonth(), endTime.getHours());
            }catch(err){
                console.log(err)
            }
        })
        .on('end', callback);
    },()=>{
        let result = {};
        start_counter.forEach((s_v, k)=>{
            result[k] = {};
            result[k]['start'] = s_v;
            let e_v;
            if(end_counter.has(k)){
                e_v = end_counter.get(k);
            }else{
                e_v = new Array(MONTH);
                for(let i = 0; i < MONTH; i++){
                    e_v[i] = new Array(24).fill(0);
                }
            }
            result[k]['end'] = e_v;
            let overall_v = new Array(MONTH);
            for(let i = 0; i < MONTH; i++){
                overall_v[i] = new Array(24).fill(0);
            }
            for(let i = 0; i < MONTH; i++){
                for(let j = 0; j < 24; j++){
                    try{
                        overall_v[i][j] = s_v[i][j] + e_v[i][j];
                    }catch(err){
                        console.log(err.message);
                    }
                }
            }
            result[k]['overall'] = overall_v;
        });

        end_counter.forEach((e_v, k)=>{
            if(!result[k]){
                console.log(`Attention on ${k}`);
            }
        });
        callback(result);
    });
}



month_usage(data=>{
    fs.writeFileSync(`${__dirname}/../data/station_monthly_usage.json`, JSON.stringify(data, null, 2));
});
module.exports = month_usage;
