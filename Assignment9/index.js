var Markers = new Array();
var Map;

function fitToBounds() {
    var bounds = new google.maps.LatLngBounds();
    for (var m in Markers) 
    {
        bounds.extend(Markers[m].getPosition());
    }
    Map.fitBounds(bounds);
}

function getBreweries()
{
    for(var m in Markers)
    {
        Markers[m].setMap(null);
    }
    Markers = [];
    $("#output").empty();
    var en = '{"iv":"DKfFCHFekKcCMjTpay+tIg==","v":1,"iter":1000,"ks":128,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"kK+ungiKfDA=","ct":"Xo8m2QLfqhjeM6qQG4gAT/khTtEZDRm2Juxbp6qPtIGO4U+aQ9l/0Q=="}';
    $.get( "http://la558.xprtnk47cj.us-east-1.elasticbeanstalk.com/bdb/v2/locations", 
        { region: $("#state").val(), locationType: "micro, macro" }).done(function(data) {
            for(var loc in data.data)
            {
                $.get("http://la558.xprtnk47cj.us-east-1.elasticbeanstalk.com/bdb/v2/brewery/" + data.data[loc].breweryId,
                { withLocations:'Y'}).done(function(brewer) {
                    if(brewer.data.images != null)
                    {
                        $("#output").append('<div class="logoBox" > <img class="brewerLogo" src="' + brewer.data.images.large + '"/>'+ brewer.data.name+ '</div>');
                        Markers.push(new google.maps.Marker({
                            position: {lat: brewer.data.locations[0].latitude, 
                                        lng: brewer.data.locations[0].longitude},
                            map:Map,
                            title:brewer.data.name 
                        }));
                        fitToBounds();
                    }
                });
            }
                                                    //$("#output").html(brewIds);
         });

}
$("document").ready(() => {
    $("#begin").click(function() {
        getBreweries()});
    $("input:radio[name=font]").click(function() {
        var value = $(this).val();
        $(".logoBox").css({fontFamily: value});
    });

    $("input:radio[name=fontsize]").click(function() {
        var value = $(this).val();
        $(".logoBox").css({fontSize: value});
    });

    $(function() {
        $( "#slider" ).slider({min:50, max:500}).on( "slidechange", function( event, ui ) 
        {
            $(".brewerLogo").css({width: ui.value+"px"});
        });
    });
});

function initMap() {
    var uluru = {lat: 43.444055, lng: -93.220486};
    Map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    
}

