var Markers = new Array();
var Map;
var locations;

function getColor(year){
    var numYear = parseInt(year);
    var currentYear = new Date().getFullYear();
    var yearsOld = currentYear - numYear;
    if(yearsOld < 5)
    {
        return '#0868ac';
    }
    else if (yearsOld <10)
    {
        return '#43a2ca';
    }
    else if (yearsOld < 15)
    {
        return '#7bccc4';
    }
    else if(yearsOld < 20)
    {
        return '#bae4bc';
    }
    else
    {
        return '#f0f9e8';
    }
}

function getBreweries() {
    locations = {};
    for(var m in Markers)
    {
        Map.removeLayer(Markers[m]);
    }
    Markers = [];
    $("#output").empty();
    $.get( "bdb/v2/locations", 
        { region: $("#state").val(), locationType: "micro, macro" }).done(function(data) {
            for(var loc in data.data)
            {
                locations[data.data[loc].breweryId] = { 
                    lat: data.data[loc].latitude, 
                    lon: data.data[loc].longitude,
                    name: data.data[loc].brewery.name,
                    type: data.data[loc].locationType,
                    yearOpened: data.data[loc].yearOpened,
                    openToPublic: data.data[loc].openToPublic  };

                $.get("bdb/v2/brewery/" + data.data[loc].breweryId +"/beers",
                { withBreweries:'Y'}).done(function(beers) {
                        var bid = beers.data[0].breweries[0].id;
                        locations[bid].beers = beers.data;
                        //$("#output").append('<div class="logoBox" > <img class="brewerLogo" src="' + brewer.data.images.large + '"/>'+ brewer.data.name+ '<br>' + brewer.data.locations[0].locationType + '<br>' + brewer.data.locations[0].openToPublic + '</div>');
                        $("#output").append(beers.data.length + "<br>");
                        var ltlng = L.latLng(locations[bid].lat, locations[bid].lon);
                        var m = L.circleMarker(ltlng,  {
                            radius: locations[bid].beers.length, 
                            color: 'black',
                            fillColor:getColor(locations[bid].yearOpened),
                            fillOpacity: 0.9});
                        m.bindPopup(locations[bid].name);
                        Markers.push(m);
                        Map.addLayer(m);
                        
                });
            }
                                                    //$("#output").html(brewIds);
         });

}
$("document").ready(() => {
    Map =  L.map('map').setView([42.0, -85.634], 2);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(Map); 
    
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


