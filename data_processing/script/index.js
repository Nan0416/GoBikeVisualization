
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
                let total = 0;
                for(let i = 0; i < 24; i++){
                    total += usage[name].sum[i];
                }
                let station_data = [
                    name,
                    location[name],
                    total,
                    usage[name]
                ];
                output.push(station_data);
            }
        }
    }
    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
}

format_data(`${__dirname}/../data/station_v3.json`);


