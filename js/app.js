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

var business_types = ['Restaurant (Full Service)','Restaurant (Quick Service)','Coffee Shop / Café','Pharmacy','Salon / Barbershop','Convenience Store','Gun Shop','Clothing / Fashion','Grocery / Supermarket','Bar / Nightclub','Pub','Jewelry','Electronics','Repairs','Gym / Health Club','Gift Shop','Pet Store','Alcohol & Wine','Smoking & Vape','Sports & Outdoors','Food Truck','Stadium / Events','Takeaway Restaurant','Other / General Retail'
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
        
        var verticalSelection = $('#businessType').val();
        var businessSize = $('input[name=business-size]:checked').val();

        base('POS').select({
            maxRecords: 6,
            filterByFormula: "IF({" + verticalSelection + "} > 0, IF({Max Stores} >" + businessSize + ", 1, 0), 0)",
            sort: [
                {field: verticalSelection , direction: 'asc'}
            ]
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(function(record) {
                console.log('Retrieved ', record.get('Name'));
                
                
                

                var $artistInfo = $('<div class="col-sm-6 col-md-4 ">').append($('<div class="card softwareBox">').append($('<img class="card-img-top pos-logo img-fluid d-block mx-auto">').attr('src',(record.get('Logo Link')))).append($('<div class="card-block text-xs-center">').append($('<h4 class="card-title text-xs-center posTitle">').text(record.get('Name'))).append($('<p class="card-text text-xs-center">').text(record.get('Short Description'))).append($('<a class="btn btn-primary buyHardwareButton">').text('Buy Hardware').attr('href',record.get('Internal Link')).attr('target','_blank'))).append($('<ul class="list-group list-group-flush">').append($('<li class="list-group-item posPrice">').append(record.get('Price')).append($('<a class="card-link float-xs-right">').text('Visit Website').attr('href',record.get('External Link')).attr('target','_blank')) )).append($('<div class="card-footer text-muted">').text(record.get('Platforms')) )) ;

                
                
                
                                   
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
