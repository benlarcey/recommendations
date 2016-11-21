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
        if (strs === ''){ 
        
            
            matches = ['Restaurant (Full Service)']
            
            cb(matches);
        }
      
        else {      
            $.each(strs, function(i, str) {
              if (substrRegex.test(str)) {
                matches.push(str);
              }
            });

            cb(matches);
            };
        };

};

var business_types = ['Restaurant (Full Service)','Restaurant (Quick Service)','Coffee Shop / Café','Pharmacy','Salon / Barbershop','Convenience Store','Gun Shop','Clothing / Fashion','Grocery / Supermarket','Bar / Nightclub','Pub','Jewelry','Electronics','Repairs','Gym / Health Club','Gift Shop','Pet Store','Alcohol & Wine','Smoking & Vape','Sports & Outdoors','Food Truck','Stadium / Events','Takeaway Restaurant','Other / General Retail','Dry Cleaners / Laundry'];

$('#businessType').typeahead({
  hint: true,
  highlight: true,
  minLength: 0,
  limit: 8
},
{
  name: 'business_types',
  source: substringMatcher(business_types)
}).blur(validateSelection);

var validated = false;    
    
function validateSelection() {
    if ($.inArray($(this).val(), business_types) === -1) {
        $('#softwareBox').addClass('has-danger'),
        $('#softwareBoxHelper').show()
        validated = false;
        
    }
    else {
        $('#softwareBox').removeClass('has-danger'),
        $('#softwareBoxHelper').hide(),
        validated = true;    
    }
}

    
$('#softwareSubmit').on('click', function() {
//	if(animating) return false;
//	animating = true;

    
    if ( ($('input:radio').is(':checked')) && validated === true )  {
        
    
    var Airtable = require('airtable');
    var base = new Airtable({ apiKey: 'keyYyZzP8Btod4nXo' }).base('app7aizzZiAt0B0HI');
    

    var loadSoftware = function() {
        $('#resultsContainer').empty();
        
        var verticalSelection = $('#businessType').val();
        var businessSize = $('input[name=business-size]:checked').val();
        var i = 0;

        base('POS').select({
            maxRecords: 8,
            filterByFormula: "IF({" + verticalSelection + "} > 0, IF({Max Stores} >" + businessSize + ", 1, 0), 0)",
            sort: [
                {field: verticalSelection , direction: 'asc'}
            ]
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(function(record) {
                
                
                    var iOS = record.get('iOS');
                    var Android = record.get('Android');
                    var Windows = record.get('Windows');
                    var Mac = record.get('Mac');
                    i++;
                    console.log(i);
                    
                    var iOSValue = function (){
                    
                    if ( iOS === true ){
                         return '<img class="icon icons8-iOS-Logo softwareIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAEkElEQVRoQ+1aW3biRhC91c2/vYMwKxh7BWFWYLyCMCsYiMR8guDTSMFeQcgK7FlByAqMVxCygjD/qCunW49pNJKQEY8Jx3z5WOquul2v21UinMmPzgQHKgHxptOmCsMbAlpgNEF0ddADYF6AsGRgLqT84vV6y23ySoFoAByqIYDOto0O/HxGUozKABUC8Xy/zaDfAVxqJRn8hyCaIwwX3ufPi0Mq7t3dXUHKK8XcItAvsawVgT96rvuUJzsXiBcEHWZoEGDGF9EQ3SrmPQQ449ZrdU+EG70/ET56jjPLyvoOSGyJR7OI0fP6zv0hFHztnt4k6DJhavQC32YtswEkjoln7U4/EogEtAVmRVK883q9VfJsA8jA92faJ7U7jftO+7Wndoz3B5PgSbuZjtmx66ZJKAUSW+NvY7oI7daUdwzFszKK9PwGJPbBLNJTKLtNZmIV2/1TIOnDgqywbfNjPk+yqh0CKZDhxH/WFZtUeH3oOlEXtK4zLOQzmBejvnsdZbL4N/QD1n+OXKcSbamrTN31WX3fgNQ90brr3yxS9wT3vX5niyRsmBkP477jFSmmM0rYaFzo53K9/lolA26sIfqnSjHeHUhSMAvoSwxUk7pmBuSSwL08+h2lUTEFqLW5huck5a3NpbIHtzMQvZFWFlLOswJsxszAC8DzSDC1CHhv/soUWpug6sIGILnjtIjws64R1JAfisDUApLnTt50esmh0hztksEPY9ft2u9lGOt14jaDSeARYZhHiVKWkUPXi+pe5TriTSYtJvEnM0Z2jCSKMuOvcd/JuEgkdjAJ5vqUbW408P17An3Kuy5oa2G9bqLRWBbFy84WKQJShaMlrmeDtSy1ZKbuuP+rdq/Kv0MAiU9bffD6/Tg2NvVJuRGwHLnOOxNv0+mlCtU8iSEAKx1bVTsnpwESxdG/WS5nwKxVF8QdAv1kw2eCN3acUZGJTgMkiS/gZew6uT0xExdKtZRCx2StkkaDfrZ/IN+uxxtJwD7JsgyVd+Lp+yVX7r0DSZKA9vFsQyCJhSQ927UkShJ8kVf40uSQuZfboPcOxE6vADYy0GDy2w1BefrCpgul7VZJowPgJ5Kyl6RZUyjX4aO55JW0ow4CJCcDbXiMBiGkaNlVOloTLqwgT5odhuJs6+TsDuTu7kqRvBcCs7xOn3GjIOjoYAU4DmhaCOCpqMmXZi3dHCduArQCY1Umo3Zlr1ypjvTizhY5kn6VxbwBqXxUR3rx/C0y8IOFJnD/pwadXZvOr2WaXpBKaMGR3H+rmNIm9tmMFQxnipms5j8j173dejQneGHo+48AtQsHPTFTbap1uCCiix959MbMX0VDNgtHbwZMNJY2w1AGd8eu+3CCg/9O5MD3PxHIDGa3DkOT1fZ4Okuzjw0qit1QN/HMTLPyeDoF4/ttxZhpN4v/N2PwXCj1UqUNWgewblYoId5T1IE0A0/jToTOqz4YSMFE36B41tcHdfTbea356kJK/dFCOo7OblZpOhU1zFRbmXsDmlYLZ2flyhaatitjKYA5GuKpSlO7EpCDaLvnTc8GyH/o0bxg8HNlqgAAAABJRU5ErkJggg==" width="22" height="22" alt="Works on iPads">'
                    }
                    
                    else {
                        return '';
                    }
                    
                };
                
                
                var AndroidValue = function (){
                    
                    if ( Android === true ){
                         return '<img class="icon icons8-Android-OS softwareIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADm0lEQVRoQ+1Z0XHaQBB9K/k/pILYFQRXEFxBcAXBFdiMDn+C4NNIg12BSQUmHZAKIBXEqSDk32gzK3QMZiTQnRQlM5Fm+BF7u/vu7e7trQgFHj8MO8x4JPClr9TMRpUfBG0GPRXRIXbJxrheo4EAWJHrnPnd7spEnz+ZNHgdfQfQIMKV73lTk/W7soWAiKL+OJwT4QPAs6FSlyaODILgCaA2M76Oel7LZO2+bGEg/mRyGr2sl0T0hhlDgBYEboG4CdApAPnJ8wzwM5iWDJoDfE6EATP/ck7cpt/tPv9VIAkrvjhl44iAH/U832ZtuaEVBNcEEkcaopiBb2DMHERzMK/829ulvPfv7pogakREbYBaBLxPHFkx2B8p9VAEjHVobRJ1LTEex7bEucPrG+34MacEWETu/Sa/Yg1zct1L04Kh7VgDGYyDBYiacekrUHF2Kl8MZqjUxbFNSPvfCsggCB8BdOJE5aglLPTHYZwneWJ+X3bDjjOXggFgOlTelSkYYyD6AIuZ2DkIB0HI2vhQeQf1psm+0svRhd/rzU3AGAFJDrCFlFQGP4yUutHGijCy1REE9wS6llI9VN7ZnwOStCQxG67z1jYxsxyUMyk56V+xnQeQESP9IJgS6BODP4+U6uQxYCpja8MIyCAIf+rzwtRBC3mj8DIFsk1oC8eMlxwrGrlO9k28ridAfFZIvySdaRxOJgaMvQewU9W0TenTluS63ayeLJWRJOmkOsVtx/5TIZB903JdOE8DkwqkPw5nRPgYtx0nTlu0RS+RvIvbiaqApNlnxpdRz4t9OhpaOql3S2xyhkiyVwYkw35qEUhlRMfo/s5nvbfJg0NrbOzXQMpmYVdfzcj+7trsSJkM2divc6RMBsqIiJqRmpEcO1AnexnJlmOjc4uUxkh/HKxkNLPXtG3v01V1v2n2GfxjpJSeJ28352Abr6d/Ir07VawKSJp9ozZ+d8L+L12sksn9adr0JvPOvgET3cefBxgNEGYyQanyPiLTGjDaIKzkc4Rz4nSyRlBWw4eqQsvEzv8JZFvNovV53s8HuWtuIigDbXbcRVZ1ytJnxIie75o6ZyOfZ6p/dPhwyLCAAXGHQO9sHDy2RpgA09T0c5wRI0U7AJsT+xhw/X8NRHbCdIdN5fOyIXI1IzUjKSPXMiaYhULrULufdqCZyleWI3pqn7fdNpWvDEhWu5/VbpvKVwZEDL1q9+Mb2OF221Q+L5jfdQ1dYOp8BMoAAAAASUVORK5CYII=" width="22" height="22" alt="Works on Android">'
                    }
                    
                    else {
                        return '';
                    }
                    
                };
                
                var WindowsValue = function (){
                    
                    if ( Windows === true ){
                         return '<img class="icon icons8-Windows-Logo softwareIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAEo0lEQVRoQ+1aUXLbNhDdBf1f9wbqCaKewO4JLJ8gygkqjaj81aL5aVGRfIIoJyhzgionCHuCqieo/R0T21lIVECKJCATcKaZ6ieZIQngYRdv3z4Y4Tv74XeGBzoD+u3duwuUsg+I50h0qTaIMCMBD0C0FUHwMRqPH15q404GFC2X5zLPXyPAAAB3AEw/oowQVnEYfjC92vW5NSAGQnn+HgAHHSbdIsk30XS66TBG66f2gBaLIRG8d7MQSm/D8NrNWOVRrAHdJMkaAV+7WAQRfIqnE7t0PXFCa0CzZPEPAJyfOH7t60gwjqaTFT+M5vNLODvLXBGHFaDo7q5PIvjsAgyPgTL/OXr7NuP/38wXKSJcENCoC2nwGYcvX3pWgG7miwgRZi4AEdDfcRj2irFmyYK0cbcEFNlSvWLcJ7pAJCaqISK8sQI0myefAbHvCNCHOAyHKt2SZECAv9ePSykhZlzLSIht8Q7XPCTsAdBldU0YiB+NgKLlske5/MsFGJVuQNdRGKYq3ZJkhYC/uhibAP6Mw0nfDMgpXQPwLhYEMEsWvFGH9OsCjAhu4+kkMgLaH9qrLpMV3xLBx3g6UYXZeeT3RGME5I+uFyNCWLrZKHqMp6EqKa2AuEYQij9cTKomC8RP0XisDrjTyAMdiKYVkNtD+5Wud7pQcqF28mO6jiaTtTFCjun6Pg7DkZmuT8eoE01jhJwf2jJdu9OFe7o+1Kmm/YgqdE1EjwDIcmUjkLjgfW3ahOhJCT1AGCDAq7oxb8PJYfN80LUREB/aXTWGVACkRTE0JQRHVj7JIQCNEPEHfr9E1x51YesZYlliC6IO5L6zjVgJlNW1Q7qu6EIjKegL5QXmRK8K/6AEQmImzvBTXQuwbw+2Gl1vWF2bIm3znDS6NqacYqO7u74MgiuUNLASpwbvwDlda0TTCugmSThNhlYg6rfygduAOAzvK1Huyac8K86WTRTa3tHpuhGQ010kyvAsuC7STUV95xqxyn52O79n3BWL0SrgozpUpWsfu7gH1pN5HgHBwDZi7EUIAWsQIm1q2Y8A+TJD+DyyGVlnYTGjSlINZNU44VqXqboXBBsb3+EIkH91TSkGwVhPw65ZoH9fAuRZXVfpeo0yvy/MEhMoVbDz/IIdWwJ4LNr41jP0jdQ1p1VKCFuWUySEcoMKn3z3r0rHg4Wmt/GtgLypa49tfCOg/4y61tr4ujQ9nCHXdF1R115c11ZATlti3Qxxra61Nr4VkFO61lpin65rIyCfdO2LaJpoXp0ht3S9czAL3ebUDKlR17Us52sXfRJNY4Tq6Fr3D2o+7HNr3iQokeQvhV7zRTStLUWxi2x2C4I1UL6xkSN87iTiUG8DeCMKB5MndUo02iVZO6AkGUAQ8A3a4crCpKuOmza5QoSrkhni0XVtBXTK4tveVd4BtwderkrKl2QvAqg6iS+iMQXAePtgGqDpuctS0KauW9X2cxff9J0iDhB8P/ss20qxLULa1Pu0Sh/XYErEsQM2YuIwzcOXyspuPsGt1cf0lnKGqB390YXyDaTc2pSMb0IKpkj4ev7iEfIFpBj3f0C+d7jr+P8C48Tsv8TXh9YAAAAASUVORK5CYII=" width="22" height="22" alt="Works on Windows PCs">'
                    }
                    
                    else {
                        return '';
                    }
                    
                };
                
                var MacValue = function (){
                    
                    if ( Mac === true ){
                         return '<img class="icon icons8-Mac-OS softwareIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAE7UlEQVRoQ+1aXXLaSBDuHvG+7AnCniD4BItPYHKC4BMYjMgjCPYtSAs5QfAJQk5gfILIJ1jnBOu8o+mtHjSKEJJGP1bIbq2qXOXSaHr6m57u/roHhDM90+WfV4jUB6IuIHaR5KUzmeyqqoNVJ1ad5yyXPULxEQA6cRlEMF9Mxk5VuT8UyGzprQBhyMoS0TdA2AJADwFf/WuAzFyPrTA4gIC5aIm1Mxo9T5feDhF+R4KRMxmvf2qLaBBsBUGy57x752uFZ65H/D/K4CL+viygxo+W47p9AvyUBsLxvAERfOSxxcRul1U+/n3jQGau9xc7dtrRmbnuPQD26vqHsmidXTDNPbJGy+qwT+g5cWuIxJhJbtp4o0CmrrtBwLcEdLewbeXo/Djv33dJWPcA0K7r5Fpmo0BmS/eLSnZAbxzb3jqrVVtKeYMEKl8kAVaxxIsAcVarTkD0ioVZiI/xo8PvdEQiBAcltAFV+FVOrUEwuIDoNb/74/b2oSqY0hY5UAs5YCfVSsUWfwKAHRFuF5PbzxrIcQanb4j4KXzXT5HBQxstoyiwwkByqMUDIHU4OxddNAkMAFVe4cSYkPGEJK+LcLBCQE6oBeBatMTGGY3YAtHDTiyF4OPTzwNGAI+CYAMtsT2RsVp1YC/7EmkYySBYzyfjUd5GGYEcUQugDwvbVlzJ9ChQaPHR6YbHh0OvLyjYFsngKjDs5RARZuFam7k9vs5aNxfIEbVAGHDkMQF46XHORZJgg4i/sO9kgckEohOWOrs1a4W64OKnIouTpQJhs1IgmVq0EeHaGY83dZWpOv8IRA5DTgUyXXoOn00ieFhMxhxmz/JMXXeNgDcqOMhgkOdbqUBmrve3skZNal0HfRju7xVrblndZHRLyj4BEhE9gMeFPeaIc5YnYs0hvTEpcQIkMmfNGtq0cN54lc08BaJLz4I7UUfhrLmaNZcJNCdAfgb/iFhzCR9NA6Jq6Lk9Nmb9JqzBMjXZLKPD/0CasgbLnS7dZ6YkaInfTGFX65Hi7KGQM9KSqNdVIuBkR63zAjkwi0Stn3cKsoGckWNxCR1yPSh6vNKA6N0oXHs04S86lwDQdm7bb0xrnFKUQ7f8Hoj8+cS+MAloapytIveBb6pDMp09HsfREr8mOyNNKZ4m91Blip0Gg5YYZemTTuNdz0eA12UoQlMAmQVLwG0I5pmAhgvbvjOyX/7ge3VIu7ltXzalZFG5Yf2+QYQrnpPWncysEOU+eCqblIoqVuW7o6o1JTVk8qlY3/as0UuDjqrWjDopu/lwaDR/AYBntMRFUapQZbdNc4r0EHIZblY33bTwS48X6SHkAonH8nPV70dZPoc2GWsOvRvnSpC6yCJDl9MIRIW+IPBf4gq57JH77uD0VViqkxLdeBXKI8mPwhsmdvwf1nXUDYiiaxotkgx/KorJ4LJII7qsBfT3Va7mCgNRlVt4J2gCo4KElG+RqAeA/FMN/nsGIB8IfaTgLmsjwsYcXwS1a9Ujpl2MgeFPNyiDD6xU6EtXqH7doG6z8h8inxDWwrI+89kPrXAT/TqiRFGljp9pvbTxKJJlTNa/MxEAW7Asn5MpA4X9visR+c4k/yKoQnOwEhBFLPn4BMGQd5+ZMr/jprdS/nCblRlhNDGVEvoA1GNOR0Bf+f5RWJZThUVUBlLFkk3O+c8A+Qf4cxRgln6AYQAAAABJRU5ErkJggg==" width="22" height="22" alt="Works on Macs">'
                    }
                    
                    else {
                        return '';
                    }
                    
                };
                
                var topPOS = function (){
                    if ( i === 1) {
                        return 'top-selection'
                    }
                    
                    else {
                        return '';
                    }
                }

                var $softwareBox = $('<div class="col-xs-12 col-sm-10 offset-sm-1 col-xl-11 offset-xl-1 mix ' + record.get('Payments') + '">\
                    <div class="row softwareBoxContainer" >\
                        <div class="col-md-2 hidden-sm-down ' + topPOS + '">\
                                <div class="helper"></div>\
                                <div class="software-logo">\
                                    <img src="' + record.get('Logo Link') + '" class="img-fluid">\
                                </div>\
                        </div>\
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-7 softwareDescription">\
                            <div><h5>' + record.get('Name') + '</h5></div>\
                            <div class=""><p class="short-description">' + record.get("Short Description") + '</p></div>\
                        </div>\
                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 pr-0 software-properties-container">\
                            <ul class="list-group softwareProperties">\
                              <li class="list-group-item list-group-item-action">' + record.get('Price') + '</li>\
                              <li class="list-group-item list-group-item-action">' + iOSValue() + AndroidValue() + WindowsValue() + MacValue() + '</li>\
                              <a href="' + record.get('Internal Link') + '" class="list-group-item list-group-item-action visit-internal" target="_blank">Buy Hardware</a>\
                              <a href="' + record.get('External Link') + '" class="list-group-item list-group-item-action visit-external" target="_blank">Visit Website</a>\
                            </ul>\
                        </div>\
                        </div>\
                    </div>' )
                
                
//                $softwareBox.attr('data-record-id', record.getId());

                $('#resultsContainer').append($softwareBox);
            });

            fetchNextPage();
        }, function done(error) {
            if (error) {
            console.log(error)}
            
            else {
                
                
                   
                $('#spinner-box').delay(100).show().delay(2000).fadeOut(400, function() {
                $('#softwareResults').fadeIn();
                $('#nav-top').addClass('border-bottom');
                $('#resultsContainer').mixItUp({
                    animation: {
                        duration: 780,
                        effects: 'fade stagger(90ms) translateY(100%)',
                        easing: 'ease'
                    }}); 


                });
                
            };
        });
        
            $('#selected-business-type').empty().append( verticalSelection );

    };
        
         }
    
    else {
        
        $('#software-box-helper-radio').addClass('has-danger'),
        $('#software-box-helper-radio').show()
        
        
        return false;
    }
    


    loadSoftware();
    
    $('#softwareForm, .form-container, .side-image').fadeOut(100); 
    
   
    
    
    return false;
    
                        
});
    
$('input.filter').on('change', function() {
    $('input.filter').not(this).prop('checked', false);  
});
    
 
$('#goBack').on('click', function() {
    $('#softwareResults').fadeOut(),
    $('#softwareForm, .form-container, .side-image').delay(400).fadeIn()
    $('#resultsContainer').mixItUp('destroy');
    
    return false;
    
});
    
    

});