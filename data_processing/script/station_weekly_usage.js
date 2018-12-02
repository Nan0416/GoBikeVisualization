/**
 * station_name: [
 *  {
 *      sum:[], // Monday (.getDay() returns 1 for Monday, returns 0 for Sunday)
 *      diff:[],
 *      pick:[],
 *      return:[]
 *  },
 *  {   // Tuesday
 * 
 *  }, 
 * 
 * ]
 * 
 */


const csv = require('csv-parser');
const fs = require('fs');
const async = require('async');
const raw_filenames = require('./helper_functions').raw_filenames();

const WEEK = 7;

const data_container = new Map();


function create_data_container(){
    let result = new Array(WEEK);
    for(let i = 0; i < result.length; i++){
        result[i] = {
            sum: new Array(24).fill(0),
            diff: new Array(24).fill(0), // diff = return - pick
            pick: new Array(24).fill(0),
            return: new Array(24).fill(0)
        }
    }
    return result;
}
/**
 * station_name : string
 * is_pick: a boolean, true indicate pick, false indicate return
 * month: a month from 0 to 9, inclusive
 * hour: a hour from 0 to 23, inclusive
 *  */
function add_to(station_name, is_pick, week, hour){
    let condition = (
        typeof station_name === 'string' && 
        typeof is_pick === 'boolean' &&
        typeof hour === 'number' && hour >= 0 && hour < 24 &&
        typeof week === 'number' && week >= 0 && week < WEEK
    );
    week = (week + WEEK - 1) % WEEK; // move Monday to be indexed as 0.
    if(!condition){
        console.log(station_name, is_pick, week, hour);
        return;
    }
    if(!data_container.has(station_name)){
        data_container.set(station_name, create_data_container());
    }
    if(is_pick){
        data_container.get(station_name)[week].sum[hour]++;
        data_container.get(station_name)[week].diff[hour]--;
        data_container.get(station_name)[week].pick[hour]++;
    }else{
        data_container.get(station_name)[week].sum[hour]++;
        data_container.get(station_name)[week].diff[hour]++;
        data_container.get(station_name)[week].return[hour]++;
    }
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

                add_to(start_station, true, startTime.getDay(), startTime.getHours());
                add_to(end_station, false, endTime.getDay(), endTime.getHours());
            }catch(err){
                console.log(err)
            }
        })
        .on('end', callback);
    },()=>{
        let result = {};
        data_container.forEach((v, k)=>{
            result[k] = v;
        });
        callback(result);
    });
}



month_usage(data=>{
    fs.writeFileSync(`${__dirname}/../data/station_weekly_usage.json`, JSON.stringify(data, null, 2));
});
