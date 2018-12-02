
const fs = require('fs');
/**
 * [
 *   {
 *      name: xxxxxx,
 *      location: [],
 *      monthly:[
 *          {
 *          sum:[],
 *          diff:[],
 *          return:[],
 *          pick:[]
 *          },
 *      ],
 *      weekly:[
 *      ]
 *      total:{
 *      
 *      }
 *      
 *   }
 * ]
 * 
 *  */
function create_data_container(){
    return {
        sum: new Array(24).fill(0),
        diff: new Array(24).fill(0),
        return: new Array(24).fill(0),
        pick: new Array(24).fill(0)
    }
}
function format_data(filename){
    const location = JSON.parse(fs.readFileSync(`${__dirname}/../data/station_location.json`));
    const weekly_usage = JSON.parse(fs.readFileSync(`${__dirname}/../data/station_weekly_usage.json`));
    const monthly_usage = JSON.parse(fs.readFileSync(`${__dirname}/../data/station_monthly_usage.json`));
    const output = {};
    for (let name in location) {
        if (location.hasOwnProperty(name)) {
            if(weekly_usage[name] && monthly_usage[name]){
                let total = create_data_container();
                for(let i = 0; i < 7; i++){
                    for(let j = 0; j < 24; j++){
                        total.sum[j] += weekly_usage[name][i].sum[j];
                        total.diff[j] += weekly_usage[name][i].diff[j];
                        total.pick[j] += weekly_usage[name][i].pick[j];
                        total.return[j] += weekly_usage[name][i].return[j];
                    }
                }
                let station_data = {
                    location: location[name],
                    monthly: monthly_usage[name],
                    weekly: weekly_usage[name],
                    total: total
                };
                output[name] = station_data;
            }else{
                console.log(`Location ${name} has not beed used!`);
            }
        }
    }
    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
}

format_data(`${__dirname}/../data/station_v6.json`);


