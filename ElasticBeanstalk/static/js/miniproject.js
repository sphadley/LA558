var Map;
var locations;
var brewerLayer = new L.featureGroup();
var pendingMarkers = [];
var totalMarkers = 0;
var bar;
var personMarker;

function getYearColor(year){
    var numYear = parseInt(year);
    var currentYear = new Date().getFullYear();
    var yearsOld = currentYear - numYear;
    if(isNaN(year))
    {
        return 'black';
    }
    else if(yearsOld < 5)
    {
        return 'lightblue';
    }
    else if (yearsOld <10)
    {
        return 'blue';
    }
    else if (yearsOld < 20)
    {
        return 'green';
    }
    else if(yearsOld < 50)
    {
        return 'orange';
    }
    else
    {
        return 'red';
    }
}

function getBeerColor(beers){
    if(beers < 10)
    {
        return 'lightblue';
    }
    else if (beers < 20)
    {
        return 'blue';
    }
    else if (beers < 50)
    {
        return 'green';
    }
    else if(beers < 100)
    {
        return 'orange';
    }
    else
    {
        return 'red';
    }
}

function getMarkerColors(loc) 
{
    if($( "select#stat" ).val() == 'beers')
    {
        return getBeerColor(loc.beers.length);
    }
    else
    {
        return getYearColor(loc.yearOpened); 
    }
}

function addMarkers(beers, bid)
{
    if(beers.data == null)
    {
        locations[bid].beers = [];
    }
    else
    {
        locations[bid].beers = beers.data;
    }
    //$("#output").append('<div class="logoBox" > <img class="brewerLogo" src="' + brewer.data.images.large + '"/>'+ brewer.data.name+ '<br>' + brewer.data.locations[0].locationType + '<br>' + brewer.data.locations[0].openToPublic + '</div>');
    var ltlng = L.latLng(locations[bid].lat, locations[bid].lon);
    var col = getMarkerColors(locations[bid]);
    var m = L.marker(ltlng, {
            icon: L.AwesomeMarkers.icon({
                prefix: 'ion',
                icon:'ion-beer',
                markerColor: col 
            })
        }).bindPopup("<strong>" + locations[bid].name + "</strong><br>" + 
        "Year Opened: " + locations[bid].yearOpened + "<br>" + 
        "Beers: " +  locations[bid].beers.length);
    pendingMarkers.push(m);
    var numLayers = pendingMarkers.length;
    bar.animate(numLayers/totalMarkers);
    if(numLayers == totalMarkers)
    {
        for(var m in pendingMarkers)
        {
            $('#overlay').css({'display': 'none'});
            pendingMarkers[m].addTo(brewerLayer);
        }
        Map.fitBounds(brewerLayer.getBounds()); 
    }
}

function getBeers(breweryId)
{
    $.get("bdb/v2/brewery/" + breweryId +"/beers", { withBreweries:'N'}).done((beers) => 
    {
        addMarkers(beers, breweryId); 
    });

}

function refreshBreweries(lat, lon) {
    bar.set(0);
    $('#overlay').css({'display': 'block'});
    totalMarkers =0;
    brewerLayer.clearLayers();
    pendingMarkers = [];
    $("#output").empty();
    locations = {};
    getBreweries(lat, lon, 1);
}

function getBreweries(lat, lon, pageNumber) {
    $.get( "bdb/v2/search/geo/point", 
    {lat:lat, lng:lon, radius: 100, p: pageNumber }).done(function(data) {
        if(data.data == null)
        {
            $('#overlay').css({'display': 'none'});
        }
        totalMarkers = data.totalResults;
        console.log("page" + data.currentPage + " totalResults: " + data.totalResults + " length: " +data.data.length);
        for(var loc in data.data)
        {
            locations[data.data[loc].breweryId] = { 
            lat: data.data[loc].latitude, 
            lon: data.data[loc].longitude,
            name: data.data[loc].brewery.name,
            type: data.data[loc].locationType,
            yearOpened: data.data[loc].yearOpened == null ? 'uknown' : data.data[loc].yearOpened ,
            openToPublic: data.data[loc].openToPublic  
            };
            getBeers(data.data[loc].breweryId);
        }
        if(pageNumber < data.numberOfPages)
            getBreweries(pageNumber+1);                                        //$("#output").html(brewIds);
     });

}

function setLegend(firstRun)
{
    if(!firstRun)
    {
        Map.removeControl(legend);
    }
    legend = new L.control({
        position: 'bottomleft'
    }); 
    legend.onAdd = function(map) {
        if($( "select#stat" ).val() == 'beers')
        {
            var div = L.DomUtil.create('div', 'info legend'),
            vals = [0, 10, 20, 50, 100],
            labels = ['0','10 varieties','20','50','100' ];
            div.innerHTML += "<b>Varieties Produced</b><br>";
            for (var i = 0; i < vals.length; i++) {
                div.innerHTML +=
                '<i style="background:' + getBeerColor(vals[i] ) + ' "></i> ' +
                labels[i]+'<br>';
            }
        }
        else
        {
            var today = new Date();
            var year = today.getFullYear();
            var div = L.DomUtil.create('div', 'info legend'),
            vals = [year, year -5, year -10, year-20, year -50],
            labels = ['new','5 years old', '10', '20', '50'];
            div.innerHTML += "<b>Age of Brewery</b><br>";
            for (var i = 0; i < vals.length; i++) {
                div.innerHTML +=
                '<i style="background:' + getYearColor(vals[i] ) + ' "></i> ' +
                labels[i]+'<br>';
            }
        }
        return div;
    }; 
    legend.addTo(Map);
 
}

$("document").ready(() => {

    bar = new ProgressBar.Circle(progress, {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 400,
    color: '#43A9E8',
    trailColor: '#eee',
    trailWidth:1
    });
    
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }); 
    
    var overlays = {
        "Breweries": brewerLayer
    };

    var personIcon = L.AwesomeMarkers.icon({
        prefix: 'ion',
        icon:'ion-person',
        markerColor: 'purple'
      });

    var ltlng = L.latLng(42.4975, -94.1680);
    personMarker = new L.marker(ltlng, {id:"myLoc", spin:'true', icon: personIcon, draggable:'true'});
    personMarker.on('dragend', function(event){
            var marker = event.target;
            var position = marker.getLatLng();
            console.log(position);
            marker.setLatLng(position,{id:"myLoc",draggable:'true'}).bindPopup(position).update();
            refreshBreweries(position.lat, position.lng);
    });

    Map =  L.map('map', {
       center: [41.577, -93.231], 
        zoom: 5,
        layers: [osm, brewerLayer, personMarker ]
    });

    baseLayers = {
        "Open Street Map": osm
    };
    L.control.layers(baseLayers, overlays).addTo(Map);
    $('#stat').change(() => {
        setLegend(false);
        var pos = personMarker.getLatLng();
        refreshBreweries(pos.lat, pos.lng);    
    });
    setLegend(true);

});


