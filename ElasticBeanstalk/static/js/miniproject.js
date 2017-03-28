var Map;
var locations;
var brewerLayer = new L.featureGroup();
var pendingMarkers = [];
var totalMarkers = 0;
var bar;
var personMarker;
var minBeers = 0;
var skipped = 0;

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
    if(beers < 2)
    {
        return 'lightblue';
    }
    else if (beers < 5)
    {
        return 'blue';
    }
    else if (beers < 10)
    {
        return 'green';
    }
    else if(beers < 20)
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

function getImgString(loc)
{
    if( loc.images != null && loc.images.icon != "" )
    {
        return "<img class='smallImg' src='" + loc.images.icon + "'></img> <br>" ;
    }
    else
    {
        return "";
    }
}
function getSelectedStyles()
{
    var selectedOpts =  $('#typeSelect option:selected');
    var optList = [];
    for(var i =0; i < selectedOpts.length; i++)
    {
        optList.push(selectedOpts[i].value);
    }
    return optList;
}
function inBeerList(styles, id)
{
    var result = $.inArray(id.toString(), styles);
    return result  > -1;
}

function addMarkers(styles, beers, bid)
{
    var filteredBeers = [];
    if(beers.data != null)
    {
        for( var b in beers.data)
        {
            if(beers.data[b].styleId != null && inBeerList(styles, beers.data[b].styleId))
            {
                filteredBeers.push(beers.data[b]);
            }
        }
    }
    locations[bid].beers = filteredBeers;
    if(locations[bid].beers.length > minBeers)
    {
        var ltlng = L.latLng(locations[bid].lat, locations[bid].lon);
        var beerText = "";
        for(var b in locations[bid].beers)
        {
            beerText = beerText + locations[bid].beers[b].name + "<br>"
        }
        var col = getMarkerColors(locations[bid]);
        var m = L.marker(ltlng, {
                icon: L.AwesomeMarkers.icon({
                    prefix: 'ion',
                    icon:'ion-beer',
                    markerColor: col 
                })
            }).bindPopup("<strong>" + locations[bid].name + "<br>" + 
            getImgString(locations[bid]) +
            "Year Opened: " + locations[bid].yearOpened + "<br>" + 
            "Beers: " +  locations[bid].beers.length + "</strong><br><br>" + beerText, {
                maxWidth: 250, 
                minWidth: 150,
                maxHeight:250,
                autoPan: true, 
                keepInView: true,
                closeButton: true, 
                autoPanPadding: [25, 5]
            });
        pendingMarkers.push(m);
    }
    else
    {
        skipped++;
    }
    var numLayers = pendingMarkers.length + skipped;
    bar.animate(numLayers/totalMarkers);
    if(numLayers == totalMarkers)
    {
        for(var m in pendingMarkers)
        {
            pendingMarkers[m].addTo(brewerLayer);
        }
        if(pendingMarkers.length > 0)
        {
            Map.fitBounds(brewerLayer.getBounds()); 
        }
        $('#overlay').css({'display': 'none'});
    }
}

function getBeers(styles, breweryId)
{
    $.get("bdb/v2/brewery/" + breweryId +"/beers", { withBreweries:'N'}).done((beers) => 
    {
        addMarkers(styles, beers, breweryId); 
    });

}

function refreshBreweries(lat, lon) {
    skipped = 0;
    bar.set(0);
    $('#overlay').css({'display': 'block'});
    totalMarkers =0;
    brewerLayer.clearLayers();
    pendingMarkers = [];
    $("#output").empty();
    locations = {};
    var styles = getSelectedStyles();
    getBreweries(styles,lat, lon, 1);
}

function getBreweries(styles, lat, lon, pageNumber) {
    
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
                openToPublic: data.data[loc].openToPublic,
                images: data.data[loc].brewery.images
            };
            getBeers(styles, data.data[loc].breweryId);
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
            vals = [0, 2, 5, 10, 20],
            labels = ['0','2 varieties','5','10','20' ];
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

    $("#slider").slider({min:0, max:20, step:1}).on( "slidechange", ( event, ui ) =>
    {
        $('#sliderVal').text( ui.value);
        minBeers = ui.value;
        var pos = personMarker.getLatLng();
        refreshBreweries(pos.lat, pos.lng);    
    });
    $.get( "bdb/v2/styles" ).done(function(data) {
        console.log("receieved data");
        for(var d in data.data)
        {
            if(data.data[d].name != '""')
            {
                $('#typeSelect').append("<option value='"+ data.data[d].id + "'>" + data.data[d].name + "</option>");
            }
        }
        $('#typeSelect').multiselect({
            buttonWidth: '250px',
            enableFiltering: true, 
            enableCaseInsensitiveFiltering: true,
            numberDisplayed: 1,
            includeSelectAllOption: true,
            onDropdownHide: function(event) {
                setLegend(false);
                var pos = personMarker.getLatLng();
                refreshBreweries(pos.lat, pos.lng);    
            }
        });
        $('#typeSelect').multiselect('selectAll', false);
        $('#typeSelect').multiselect('updateButtonText');
    
    });


});


