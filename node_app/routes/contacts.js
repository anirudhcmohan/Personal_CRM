var express = require('express');
var router = express.Router();
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'key6ENmDOrXqkC5Fu'}).base('appRsi6hgpkmwzLBg');


function onlyUnique(value, index, self) {
	if (typeof value === 'undefined') return false; 
    return self.indexOf(value) === index;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  
  	var contactList = [];
  	var closenessVals = [];
  	var companies = [];
  	var cityList = [];
  	var life_domains = [];


	base('Contacts').select({
	    view: "All"
	}).eachPage(function page(records, fetchNextPage) {
	    // This function (`page`) will get called for each page of records.

	    records.forEach(function(record) {
	    	// console.log(record.get('Name'));
	        contactList.push(record.get('Name'));
	        closenessVals.push(record.get('Closeness'));
	        if (typeof record.get('Companies') != 'undefined') {
		        record.get('Companies').forEach(function(company) {
		        	companies.push(company);
		        });	        	
	        }
	       	life_domains.push(record.get('Life domain'));
	    });

	    // To fetch the next page of records, call `fetchNextPage`.
	    // If there are more records, `page` will get called again.
	    // If there are no more records, `done` will get called.
	    fetchNextPage();

	}, function done(err) {
	    if (err) { 
	    	console.error(err);
	    	return; 
	    } else {

	    	// Retrieve all the cities

			base('Cities').select({
			    view: "Main View"
			}).eachPage(function page(records, fetchNextPage) {
			    // This function (`page`) will get called for each page of records.

			    records.forEach(function(record) {
			        cityList.push(record.get('Name'));
			        console.log(record.get('Name'));
			    });

			    // To fetch the next page of records, call `fetchNextPage`.
			    // If there are more records, `page` will get called again.
			    // If there are no more records, `done` will get called.
			    fetchNextPage();

			}, function done(err) {
			    if (err) { 
			    	console.error(err); 
			    	return; 
			    } else {
			    	var uniqueClosenessVals = closenessVals.filter(onlyUnique);
			    	var uniqueCompanies = companies.filter(onlyUnique);
			    	var lifeDomainVals = life_domains.filter(onlyUnique);
			    	res.render('contacts', { title: 'Contacts in AirTable', contacts: contactList, closenessVals: uniqueClosenessVals, companies: uniqueCompanies, cities: cityList, life_domains: lifeDomainVals }); 
			    }
			});

	    }
	});

});

router.post('/', function (req, res) {

	base('Contacts').select({
	    filterByFormula: "{Name}='"+req.body.name+"'"
	}).firstPage(function(err, records) {
	    if (err) { console.error(err); return; }
	    console.log(req.body.name);
	    if (records.length == 1){
	    	base('Contacts').update(records[0].id, {
			  "Date last communicated": [
			    req.body.date
			  ]
			}, function(err, record) {
			    if (err) { console.error(err); return; }
			});
	    }
	    else {
	    	
	    }


	});
	res.send('Successfully updated!');
});



module.exports = router;