// HTML/CSS/BOOTSTRAP
// **********************************************************************************************

// Jumbotron is completed
// One form table to input data from the add train form table beneath it

// Top table named "Current Train Schedule"
// Table headers: Train Name; Destination; Frequency (minutes); Next Arrival; Minutes Away

// Bottom table named "Add Train"
// First input: Train Name
// Second input: Destination
// Third input: First Train Time (HH:MM - military time) moment.js type stuff
// Final input: Frequency (minutes)

// Submit Button

// **********************************************************************************************

// JAVASCRIPT/JQUERY/MOMENT.JS
// **********************************************************************************************

// Make a class/id for train name, destination, frequency, next arrival and minutes away so that 
// they may be stored in the top table when user inputs new trains

// make a function that creates new table rows under tabel headers


// **********************************************************************************************


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCRZ3L-Fm3y81W9A8nzs7nAax5omjUA2UI",
    authDomain: "timesheet-44329.firebaseapp.com",
    databaseURL: "https://timesheet-44329.firebaseio.com",
    projectId: "timesheet-44329",
    storageBucket: "timesheet-44329.appspot.com",
    messagingSenderId: "568777538490"
  };
  firebase.initializeApp(config);

  var app = (function() {

	var addTrainDataBase = function(event) {
		var name = $('#name').val(), destination = $('#destination').val(),
				first_time = $('#first_time').val(), frequency = $('#frequency').val()
				hours = first_time[0], minutes = first_time[1];

		// If any input values are empty, we stop and return
		if ( !name || !destination || !first_time || !frequency ) return;

		event.preventDefault();

		var dataB = firebase.database().ref('/trains'),
				train = {};

		train.name = name;
		train.destination = destination;
		train.first_time = first_time;
		train.frequency = frequency;

		dataB.push(train);	
		$('form').find('input').val('');	

	};

	var getTrains = function() {
		var dataB = firebase.database().ref('/trains');
		dataB.once('value')
		.then(function(trains) {
			console.log(trains.numChildren());
		});
		dataB.on('child_added', function(train) {
			var train = train.val(), 
					hour = moment().format('H'), minute = moment().format('mm'),
					firstValues = train.first_time.split(':'),
					firstHour = firstValues[0], firstMin = firstValues[1],
					first = (firstHour * 60) + firstMin % 10,
					current = (hour * 60) + minute % 10,
					diff = current - first, trains = Math.floor(diff / train.frequency) + 1,
					arrival = trains * train.frequency + first,
					minutes = first < current ? arrival - current : first - current, 
					arrivalTime = first < current ? moment().add(minutes, 'minutes').format('HH:mm') :
												train.first_time;

			$('table tbody').append(
				'<tr>' + 
					'<td>' + train.name + '</td>' +
					'<td>' + train.destination + '</td>' +
					'<td>' + train.frequency + '</td>' +
					'<td>' + arrivalTime + '</td>' + 
					'<td>' + minutes + '</td>' +
				'</tr>'
			);
		});

	};

	var init = function() {

		$('#submit').on('click', addTrainDataBase);
		getTrains();

	};

	return { init: init };
})();

app.init();