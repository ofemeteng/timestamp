var express = require('express');
var router = express.Router();
var moment = require('moment')

const months = [
   "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Timestamp API' });
});

/* GET json. */
router.get('/:dateParam', function(req, res, next) {
	var unix
	var natural = ''
	var dateString = ''
	var date = req.params.dateParam
	if (moment(date).isValid()) {
		utc = moment.utc(date)
		unix = moment(utc, "M/D/YYYY").unix()
		natural = naturalLanguageDate(utc)
		createJson(res, unix, natural)
	}	else if (date > 0) {
		unix = date
		dateString = moment.unix(date).format("M/D/YYYY")
		utc = moment.utc(dateString)
		natural = naturalLanguageDate(utc)
		createJson(res, unix, natural)		
	} else {
		createJson(res, null, null)
	}
});

function naturalLanguageDate(utc) {
	utc = utc.format()
	utcStringArray = utc.split('-')
	year = utcStringArray[0]
	month = stripLeadingZeros(utcStringArray[1])
	day = stripLeadingZeros(utcStringArray[2].slice(0, 2))
	monthIndex = parseInt(month) - 1
	month = months[monthIndex]
	return `${month} ${day}, ${year}`
}

function stripLeadingZeros(string) {
	if (string[0] != '0') {
		return string
	}
	string = string.substr(1, 1)
	return string
}

function createJson(res, unix, natural) {
	return res.format({
  	'application/json': function() {
  		res.send({
  			unix: unix,
  			natural: natural
  		})
  	}
  })
}

module.exports = router;
