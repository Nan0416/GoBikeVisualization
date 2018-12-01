const fs = require('fs');
const raw_directory = `${__dirname}/../raw`;

function raw_filenames(){
    let filenames = fs.readdirSync(raw_directory);
    for(let i = 0; i < filenames.length; i++){
        filenames[i] = `${raw_directory}/${filenames[i]}`;
    }
    return filenames;
}

module.exports.raw_filenames = raw_filenames;
