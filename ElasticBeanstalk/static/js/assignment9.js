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
        { region: "Iowa", locationType: "micro, macro" }).done(function(data) {
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
    Map =  L.map('map').setView([41.6005, -93.6091], 7);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(Map); 
    getBreweries();
    var icon1 = L.icon({iconUrl: "static/istate.png", iconSize: [50,40]});
    L.marker([42.0269133, -93.6519128], {icon:icon1}).bindPopup("<h3>Iowa State University</h3> <br>Iowa State University of Science and Technology is a public flagship[4] land-grant and space-grant"
        + "research university located in Ames, Iowa, United States. Iowa State is classified as a Research University with very high research activity (RU/VH) by the Carnegie Foundation for"
        + "the Advancement of Teaching.[5] Iowa State is also a member of the Association of American Universities (AAU), which consists of 62 leading research universities in North America."
        + "[6] Iowa State has also been designated an \"Innovation and Economic Prosperity University,\" a designation awarded to only 54 public universities in the U.S.[7]"
        + "Founded in 1858 and coeducational from its start, Iowa State became the nation’s first designated land-grant institution when the Iowa Legislature accepted the"
         + "provisions of the 1862 Morrill Act on September 11, 1862, making Iowa the first state in the nation to do so.[8]"
        + " Iowa States academic offerings are administered today through eight colleges, including the graduate college, that offer over 100 bachelor's degree programs,"
        + " 112 master's degree programs, and 83 at the Ph.D. level, plus a professional degree program in Veterinary Medicine.[9]  --Wikipedia authors: https://en.wikipedia.org/wiki/Iowa_State_University", { maxHeight: 200, offset:[1,1] }).addTo(Map);    
    L.marker([41.6710, -93.7130]).bindPopup(
        "Johnston, IA <br> <img src='static/johnston2.jpg'> </img>", {
            maxWidth: 400,
            closeButton: true 
        }).addTo(Map);
    var divCon = L.divIcon({html: "Iowa <br> <img src='static/iowa2.png'> </img>", iconSize: [50,50]});
    L.marker([41.8780, -93.0977], {icon: divCon}).bindPopup("Iowa").addTo(Map);
});


