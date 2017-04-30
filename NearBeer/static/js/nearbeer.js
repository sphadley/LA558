console.log(window.location.href);
if (location.protocol != 'https:' && !window.location.href.startsWith('http://127.0.0.1'))
{
    location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

var Map;
var locations;
var brewerLayer = new L.featureGroup();
var pendingMarkers = [];
var totalMarkers = 0;
var bar;
var skipped = 0;
var personNumber = 2;
var beerStyles;
var userLocation;
var personMarker;

function updatePersonMarker(coord)
{
    personMarker.setLatLng(coord);
    Map.panTo(coord);
}

function showPosition(pos) 
{
    var coord = new  L.LatLng(pos.coords.latitude, pos.coords.longitude)
    userLocation = coord;
    updatePersonMarker(coord);
};

function setToLocalCoord() 
{
    if (navigator.geolocation) 
    {
        navigator.geolocation.getCurrentPosition(showPosition);
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
    var optDict = {};
    for(var i = 1; i < personNumber; i++)
    {
        var selector = '#typeSelect'+ i +' option:selected';
        var selectedOpts =  $(selector);
        var optList = [];
        for(var j =0; j < selectedOpts.length; j++)
        {
            optList.push(selectedOpts[j].value);
        }
        var key = $('#name'+i).val();
        optDict[key] = optList;
    }
    return optDict;
}

function getBeerSelection(styles, beers)
{
    var selectDict = {}
    for (var p in styles) 
    {
        selectDict[p] = [];
    }

    for (var p in styles) 
    {
        for( var b in beers)
        {
            var s =beers[b].styleId;
            if(s != null) 
            {
                var personStyle = styles[p];
                var result = $.inArray(s.toString(), personStyle);
                if(result  > -1)
                {
                    selectDict[p].push(beers[b].name);
                }
            }
        }
    }
    return selectDict;
}

function getBeerText(selections)
{
    var result = '';
    for(var p in selections)
    {
        result += '<strong>' + p + ':</strong><br>';
        for(var b in selections[p])
        {
            result +=  selections[p][b] + '<br>';
        }
        result += '<br>';
    }
    return result;
}

function getScore(selections)
{
    var score = 0;
    for (var p in selections)
    {
        if(selections[p].length > 0)
            score++;
    }
    return score;
}

function addMarkers(styles, beers, bid)
{
    var selections = getBeerSelection(styles,beers.data);
    var score = getScore(selections);
    if(score > 0)
    {
        var ltlng = L.latLng(locations[bid].lat, locations[bid].lon);
        var beerText = getBeerText(selections);
        var icon = getMarkerColors(score);
        var m = L.marker(ltlng, {
                icon: icon
                }).bindPopup("<strong>" + locations[bid].name + "<br>" + 
            getImgString(locations[bid]) +
            "Year Opened: " + locations[bid].yearOpened + "<br>" + 
            "</strong><br><br>" + beerText, {
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

function refreshBreweries() 
{
    var bounds = Map.getBounds()
    var center = Map.getCenter();
    var rad = Math.round(Math.abs(bounds._southWest.lng - bounds._northEast.lng) * 55);
    if (rad > 100)
    {
        rad = 100;
    }
    skipped = 0;
    bar.set(0);
    $('#overlay').css({'display': 'block'});
    totalMarkers =0;
    brewerLayer.clearLayers();
    pendingMarkers = [];
    $("#output").empty();
    locations = {};
    var styles = getSelectedStyles();
    getBreweries(styles, center.lat, center.lng, rad, 1);
}

function getBreweries(styles, lat, lon, rad, pageNumber) 
{
    $.get( "bdb/v2/search/geo/point", 
    {lat:lat, lng:lon, radius:rad, p:pageNumber }).done(function(data) {
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
            getBreweries(styles, lat, lon, rad, pageNumber+1);                                        //$("#output").html(brewIds);
     });

}


function initCombobox(comboName)
{
    for(var d in beerStyles.data)
    {
        if(beerStyles.data[d].name != '""')
        {
            $(comboName).append("<option value='"+ beerStyles.data[d].id + "'>" + beerStyles.data[d].name + "</option>");
        }
    }
    $(comboName).multiselect({
        buttonWidth: '300px',
        enableFiltering: true, 
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 1,
        includeSelectAllOption: true
    });
    $(comboName).multiselect('selectAll', false);
    $(comboName).multiselect('updateButtonText');
}

$("document").ready(() => 
{

    bar = new ProgressBar.Circle(progress, {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 400,
    color: '#43A9E8',
    trailColor: '#eee',
    trailWidth:1
    });
    
    var osm = L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

    Map =  L.map('map', {
       center: [51.001725, -2.924162], 
        zoom: 9,
        layers: [osm, brewerLayer ]
    });

    personMarker = L.marker([51.476913, -0.000007], 
    {
        icon: L.AwesomeMarkers.icon(
        {
            prefix: 'ion',
            icon:'ion-person',
            markerColor: 'green' 
        })
    }).bindPopup('Your Location');

    personMarker.addTo(Map);
    Map.panTo([51.476913, -0.000007]);
    baseLayers = {
        "Open Street Map": osm
    };


    $.get( "bdb/v2/styles" ).done(function(data) 
    {
        console.log("receieved data");
        beerStyles = data;
        initCombobox('#typeSelect1');
    });
    $('#searchButton').click(() =>
    {
        refreshBreweries();
    });
    $('#addButton').click(() => 
    {
        $('#personsDiv').append(
            '<div id="person' + personNumber + '">\
                <input id="name' + personNumber + '" class="personName" value="Person' + personNumber + '"></input><br>\
                <select  id="typeSelect' + personNumber + '" multiple="multiple"> \
                </select> \
            </div>'
        );
        initCombobox('#typeSelect' + personNumber);
        personNumber++;
    });
    $('#locButton').click(() =>
    {
        $('#modal').css({'display': 'block'});
    })
    $('#modalClose').click(()=>
    {
        $('#modal').css({'display': 'none'});
    })
    $('#setLocButton').click(()=>
    {
        var address = $("#adressInput").val();
        getGeocode(address, (coord) =>
        {
            updatePersonMarker(coord);
        });
        $('#modal').css({'display': 'none'});
    })
    setToLocalCoord();
});


