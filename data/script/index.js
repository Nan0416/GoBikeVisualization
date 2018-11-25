month_usage(data=>{
    fs.writeFileSync(`${__dirname}/../data/station_month_usage.json`, JSON.stringify(data, null, 2));
});
station_location(data=>{
    fs.writeFileSync(`${__dirname}/../data/station_location.json`, JSON.stringify(data, null, 2));
})