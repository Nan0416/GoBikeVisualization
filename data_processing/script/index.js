
const fs = require('fs');
/**
 * [
 *   {
 *      name: xxxxxx,
 *      location: [],
 *      data:{
 *          sum:[],
 *          diff:[],
 *          return:[],
 *          pick:[]
 *      }
 *   }
 * ]
 * 
 *  */
function format_data(filename){
    const location = JSON.parse(fs.readFileSync(`${__dirname}/../data/station_location.json`));
    const usage = JSON.parse(fs.readFileSync(`${__dirname}/../data/station_usage.json`));
    const output = [];
    for (let name in location) {
        if (location.hasOwnProperty(name)) {
            if(usage[name]){
                let station_data = {
                    name: name,
                    location: location[name],
                    data: usage[name]
                }
                output.push(station_data);
            }
        }
    }
    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
}

format_data(`${__dirname}/../data/station_v2.json`);


