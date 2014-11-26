$(document).ready(function() {

    var userFeed = new Instafeed({
        get: 'user',
        userId: 1397204385,
        accessToken: '1397204385.467ede5.aed2011a7d7a4b1d9f071136916dcecc',
        limit: 12,
        useHttp: true
    });

    //populate defaults
    $('input[name=origin]').val("1499 Hampton View Court Marietta, GA");
    $('input[name=allowance]').val("60");
    $('input[name=rate]').val(".55");

    // userFeed.run();
    $('form').submit(getDistance);
    $('#expandSettings').click(toggleSettings)

});

function getDistance(event) {
        //modified code from website, originally meant to handle multiple origins and destinations
        event.preventDefault();
        
        //Re-hides the results if executing program a second time
        $('.results').addClass("hide");
        $('.rslt-exception').addClass("hide");

        console.log(event);
        var origin1 = $('input[name=origin]').val();
        console.log(origin1);
        var destination= $('input[name=destination]').val();
        console.log("dest", destination);
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
                origins: [origin1],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                // durationInTraffic: false,
                // avoidHighways: false,
                // avoidTolls: false
            },
            callback);


        function callback(response) {
            console.log("Response",response, " Status:", status);
            //status retrieved from first response object.  Per this design, only one object assumed
            var status = response.rows[0].elements[0].status;
            console.log("google status is: ",status);
            if (status == google.maps.DistanceMatrixStatus.OK) {
                var origins = response.originAddresses;
                var destinations = response.destinationAddresses;

                for (var i = 0; i < origins.length; i++) {
                    var results = response.rows[i].elements;
                    for (var j = 0; j < results.length; j++) {
                        var element = results[j];
                        var distance = element.distance.text;
                        var duration = element.duration.text;
                        var from = origins[i];
                        var to = destinations[j];
                        var allowance= $('input[name=allowance]').val();
                        allowance = parseInt(allowance);

                        distance = distance.replace(/[^\d\.\-\ ]/g, '');//removes comma from any distance greater than 1000
                        distance= parseFloat(distance);

                        $('#destadd').text(to);

                        if (distance > allowance && distance < 200){
                            var roundTrip= distance * 2;
                            var rate = $('input[name=rate]').val();

                            var adjustedRoundTrip = parseInt(roundTrip - allowance);
                            var travelCost= "$" + parseInt(adjustedRoundTrip * rate);
                            console.log(travelCost);

                            $('.results-add').removeClass("hide");
                            $('.results-calc').removeClass("hide");
                            $('.covered').addClass("hide");
                            $('.max-dist').addClass("hide");
                            $('#roundTripMileage').text(roundTrip);
                            $('#allowance').text(allowance);
                            $('#postAllowance').text(adjustedRoundTrip);
                            $('#mileageRate').text(rate);
                            $('#cost').text(travelCost);
                        }
                        else if (distance < 200){
                            console.log("less than 200, greater than allowacne")
                            $('.covered').removeClass("hide");
                            $('.results-add').removeClass("hide");
                            $('.results-calc').addClass("hide");
                            $('.max-dist').addClass("hide");
                        }
                        else{
                            $('.results-add').removeClass("hide");
                            $('.max-dist').removeClass("hide");
                        }
                    }

                }
            } else {window.alert("Oops!  Google couldn't find your destination, please review and try again");}
        }
    };

function toggleSettings(){
    $(".parameters").toggle(200);
}