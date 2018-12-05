/**
 * station_name: [
 *  {
 *      sus:[], // January
 *      cus:[]
 *  },
 *  {   // Feburary
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

const MONTH = 10;

const data_container = new Map();


function create_data_container(){
    let result = new Array(MONTH);
    for(let i = 0; i < result.length; i++){
        result[i] = {
            subscriber: new Array(1).fill(0),
            customer: new Array(1).fill(0) 
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
function add_to(station_name, month, hour, type){
    let condition = (
        typeof station_name === 'string' && 
        typeof hour === 'number' && hour >= 0 && hour < 24 &&
        typeof month === 'number' && month >= 0 && month < MONTH &&
        typeof type === 'string'
    );
        
    if(!condition){
        console.log(station_name, month, hour, type);
        return;
    }
    if(!data_container.has(station_name)){
        data_container.set(station_name, create_data_container());
    }

    if(type == 'Subscriber'){
        data_container.get(station_name)[month].subscriber++;
    }else{
        data_container.get(station_name)[month].customer++;
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

function month_gender(callback){
    async.each(raw_filenames, (filename, callback)=>{
        fs.createReadStream(filename)
        .pipe(csv())
        .on('data', function(data){
            try{
                let start_station = data.start_station_name;
                let end_station = data.end_station_name;
                let startTime = toDate(data.start_time);
                let endTime = toDate(data.end_time);
                let userType = data.user_type;

                add_to(start_station, startTime.getMonth(), startTime.getHours(), userType);
                add_to(end_station, endTime.getMonth(), endTime.getHours(),userType);
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



month_gender(data=>{
    fs.writeFileSync(`${__dirname}/../data/station_monthly_user.json`, JSON.stringify(data, null, 2));
});
