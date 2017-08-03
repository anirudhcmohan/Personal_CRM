var express = require('express');
var router = express.Router();
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'key6ENmDOrXqkC5Fu'}).base('appRsi6hgpkmwzLBg');


/* GET home page. */
router.get('/', function(req, res, next) {
  
  	var contactList = [];


	base('Contacts').select({
	    // Selecting the first 3 records in All:
	    // maxRecords: 3,
	    view: "All"
	}).eachPage(function page(records, fetchNextPage) {
	    // This function (`page`) will get called for each page of records.

	    records.forEach(function(record) {
	    	// console.log(record.get('Name'));
	        contactList.push(record.get('Name'));
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
	    	res.render('contacts', { title: 'Contacts in AirTable', contacts: contactList }); 
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
	});
	res.send('Successfully updated!');
});



module.exports = router;