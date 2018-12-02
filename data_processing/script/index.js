
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
    const weekly_usage = JSON.parse(fs.readFileSync(`${__dirname}/../data/station_weekly_usage.json`));
    const monthly_usage = JSON.parse(fs.readFileSync(`${__dirname}/../data/station_monthly_usage.json`));
    const output = {};
    for (let name in location) {
        if (location.hasOwnProperty(name)) {
            if(weekly_usage[name] && monthly_usage[name]){
                /*let total = 0;
                for(let i = 0; i < 24; i++){
                    total += usage[name].sum[i];
                }*/
                let station_data = {
                    location: location[name],
                    monthly: monthly_usage[name],
                    weekly: weekly_usage[name]
                };
                output[name] = station_data;
            }else{
                console.log(`Location ${name} has not beed used!`);
            }
        }
    }
    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
}

format_data(`${__dirname}/../data/station_v5.json`);


