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

    
    
    
    var Airtable = require('airtable');
    var base = new Airtable({ apiKey: 'keyYyZzP8Btod4nXo' }).base('app7aizzZiAt0B0HI');

    var loadSoftware = function() {
        $('#resultsContainer').empty();
        
        var verticalSelection = $('#businessType').val()

        base('POS').select({
            maxRecords: 3,
            filterByFormula: "({Vertical} = '" + verticalSelection + "')",
            sort: [
                {field: 'Weighting', direction: 'asc'}
            ]
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(function(record) {
                console.log('Retrieved ', record.get('Name'));

                var $artistInfo = $('<div class="col-sm-6 col-md-4 ">').append($('<div class="card softwareBox">').append($('<img class="card-img-top pos-logo img-fluid d-block mx-auto">').attr('src',(record.get('Logo Link')))).append($('<div class="card-block">').append($('<h4 class="card-title">').text(record.get('Name'))).append($('<p class="card-text">').text(record.get('Short Description'))).append($('<a class="card-link">').text('Learn More').attr('href',record.get('External Link'))).append($('<a class="card-link float-xs-right">').text('Visit Website').attr('href',record.get('External Link')).attr('target','_blank'))).append($('<ul class="list-group list-group-flush">').append($('<li class="list-group-item">').append(record.get('Reviews Count')) )).append($('<div class="card-footer text-muted">').text(record.get('Platforms')) )) ;

                                   
                $artistInfo.attr('data-record-id', record.getId());

                $('#resultsContainer').append($artistInfo);
            });

            fetchNextPage();
        }, function done(error) {
            console.log(error);
        });
    };


    loadSoftware();
    
    
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
    
    
});
