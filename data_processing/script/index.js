
const fs = require('fs');
/*
station_location(data=>{
    fs.writeFileSync(`${__dirname}/../data/station_location.json`, JSON.stringify(data, null, 2));
});*/


/**
 * [
 *  {
 *      name: xxxxxx,
 *      location: [],
 *      month_usage:[
 *          [,,,,,,,]
 *      ],
 *      week_usage:[
 *          [,,,,,,,]
 *      ],
 *      holiday:[
 * 
 *      ]
 *  }
 * ]
 * 
 *  */
function format_data(filename){
    const location = JSON.parse(fs.readFileSync(`${__dirname}/../data/station_location.json`));
    const monthly_usage = JSON.parse(fs.readFileSync(`${__dirname}/../data/station_monthly_usage.json`));
    const output = [];
    for (let name in location) {
        if (location.hasOwnProperty(name)) {
            if(monthly_usage[name]){
                let station_data = {
                    name: name,
                    location: location[name],
                    month_usage: monthly_usage[name]
                }
                output.push(station_data);
            }
        }
    }
    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
}

format_data(`${__dirname}/../data/station.json`);


