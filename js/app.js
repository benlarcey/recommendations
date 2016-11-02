jQuery(document).ready(function($){

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

var business_types = ['Restaurant (Full Service)','Restaurant (Quick Service)','Coffee Shop / Café','Pharmacy','Salon / Barbershop','Convenience Store','Gun Shop','Clothing / Fashion','Grocery / Supermarket','Bar / Nightclub','Pub','Jewelry','Electronics','Repairs','Gym / Health Club','Gift Shop','Pet Store','Alcohol & Wine','Smoking & Vape','Sports & Outdoors','Food Truck','Stadium / Events','Takeaway Restaurant'
];

$('#businessType').typeahead({
  hint: true,
  highlight: true,
  minLength: 1,
  limit: 8
},
{
  name: 'business_types',
  source: substringMatcher(business_types)
}).blur(validateSelection);

function validateSelection() {
    if ($.inArray($(this).val(), business_types) === -1) {
        $('#softwareBox').addClass('has-danger'),
        $('#softwareBoxHelper').show()
        
    }
    else {
        $('#softwareBox').removeClass('has-danger'),
        $('#softwareBoxHelper').hide()
    }
}

var animating;    
    
$('#softwareSubmit').on('click', function() {
//	if(animating) return false;
//	animating = true;
//    
    
	$('#softwareForm').fadeOut(100);
    $('#spinner-box').delay(100).show().delay(2000).fadeOut(400, function() {

    $('#softwareResults').fadeIn();

    });
    
    return false;
    
    
    
                        
});
    
 
$('#goBack').on('click', function() {
    $('#softwareResults').fadeOut(),
    $('#softwareForm').delay(400).fadeIn()
    
    return false;
    
});
    
    
var Airtable = require('airtable');
// Get a base ID for an instance of art gallery example
var base = new Airtable({ apiKey: 'keyYyZzP8Btod4nXo' }).base('app7aizzZiAt0B0HI');


var loadArtists = function() {
    $('#resultsContainer').empty();

    base('POS').select({
        sort: [
            {field: 'Name', direction: 'asc'}
        ]
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            console.log('Retrieved ', record.get('Name'));

            var $artistInfo = $('<div>');
            $artistInfo.append($('<h3>').text(record.get('Name')));
            $artistInfo.append($('<div>').text(record.get('min_price')));
            $artistInfo.append($('<a>').text(record.get('Name')));
            
            
      
            $artistInfo.attr('data-record-id', record.getId());

            $('#resultsContainer').append($artistInfo);
        });

        fetchNextPage();
    }, function done(error) {
        console.log(error);
    });
};


loadArtists();

    
});


