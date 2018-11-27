const csv = require('csv-parser')
const fs = require('fs')
const async = require('async')
const raw_filenames = require('./helper_functions').raw_filenames();

//var gender = [];
var userType = new Map();


function data_handler(data) {   
	/*
	gender.push({
		gender: data.member_gender
	})
	*/
	if (data.user_type == "Customer") {

		if (data.member_gender == "Male") {

		}


		userType.set(Customer, data.member_gender);
	} else if (data.user_type == "Subscriber") {
		userType.set(Customer, data.member_gender);
	} else {
		return;
	}
}

function personal(callback) {
	async.each(raw_filenames, (filename, callback)=>{
		fs.createReadStream(filename)
			.pipe(csv())
			.on('data', function(data){
				try {
					data_handler(data);
				}	catch(err)	{
                	console.log(err)
            	}
				
			})
			.on('end', callback);
	},()=>{
		let results = [];
		/*
		var countMale = 0;
		var countFemale = 0;
		var countOther = 0;

		gender.forEach(function(d) {
			if (d.gender == "Male") {
				countMale++;
			} else if (d.gender == "Female") {
				countFemale++;
			} else if (d.gender == "Other") {
				countOther++;
			}
		}) 
		console.log(countMale);

		results.push({
			Male: countMale,
			Female: countFemale,
			Other: countOther
		})
		*/
		callback(results);
	});
}


personal(data=>{
    fs.writeFileSync(`${__dirname}/../data/personal.json`, JSON.stringify(data, null, 2));
});
module.exports = personal;