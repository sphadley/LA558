var userID = 'hadleyst';
//get the existing data from the server by adding the following in the <head>
//or you can use the URL below and the leaflet ajax plugin
var responseURL = "https://indicator.extension.iastate.edu/z_cjs/teachingGIS/webGIS_17/studentFeaturesDB.php?userID=" + userID + "&theFunction=response";
//https://indicator.extension.iastate.edu/z_cjs/teachingGIS/webGIS_17/studentFeaturesDB.php?userID=hadleyst&theFunction=response
console.log(responseURL);

var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});


var map;
//Add the marker to the map and DB
function addMarker(e) {
  if ($("#addMarkReady").is(':checked')) {

    field1 = $("#field1").val();
    field2 = $("#field2").val();
    field3 = $("#field3").val();
    // Add marker to map at click location; add popup window
    var newMarker = new L.marker(e.latlng)
      .bindPopup("<strong>" + field2 + "</strong><br>" + field3)
      .bindTooltip(field1)
      .addTo(map);

    latitude = e.latlng.lat;
    longitude = e.latlng.lng;

    var myData = "field1=" + field1 + "&field2=" + field2 + "&field3=" + field3 + "&latitude=" + latitude + "&longitude=" + longitude;

    jQuery.ajax({
      type: "POST", // HTTP method POST or GET
      url: "https://indicator.extension.iastate.edu/z_cjs/teachingGIS/webGIS_17/studentFeaturesDB.php?userID=" + userID +"&theFunction=insert", //Where to make Ajax calls
      dataType: "text", // Data type, HTML, json etc.
      data: myData, //Form variables
      success: function(response) {
        //console.log(response);

      },
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
      }
    }); //end ajax post
  }
}


var geojsonLayer2 = new L.GeoJSON.AJAX(responseURL, {
  pointToLayer: function(feature, latlng) {
    return new L.CircleMarker(latlng, {
      stroke: true,
      weight: 2, //stroke weight
      color: '#000000', //stroke color
      opacity: 1.0, //stoke opacity
      fillColor: 'blue',
      fillOpacity: 0.5,
      radius: 12
    }).bindPopup(feature.properties.field2).openPopup();
  }
});

//*******OR as icons**************

var golfIcon = L.AwesomeMarkers.icon({
  prefix: 'glyphicon', //bootstrap
  markerColor: 'white', // see colors above
  iconColor: 'green',
  icon: 'flag'
});

var soccerIcon = L.AwesomeMarkers.icon({
  prefix: 'glyphicons',
  markerColor: 'red',
  icon: 'camp-fire'
});

var forestIcon = L.AwesomeMarkers.icon({
  prefix: 'glyphicon',
  icon: 'leaf',
  markerColor: 'darkgreen'
});

var parkIcon = L.AwesomeMarkers.icon({
  prefix: 'ion',
  icon: 'compass',
  markerColor: 'green'
});

var campsiteIcon = L.AwesomeMarkers.icon({
  prefix: 'ion',
  icon: 'bonfire',
  markerColor: 'red'
});

// var version loading in specified icons

function getIcon(d) {
  return d == 'park' ? parkIcon :
    d == 'forest' ? forestIcon :
    d == 'campsite' ? campsiteIcon :
    greenIcon;
}

$('document').ready(() => {
    map = L.map('map').setView([42.0, -93.634], 6);
    osm.addTo(map);
    map.on('click', addMarker);

    //Load existing points as circles from var locations. This is initially loaded in a <head><script>

    var geojsonLayer2b = new L.GeoJSON.AJAX(responseURL, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
            icon: getIcon(feature.properties.field1)
          })
          .on('mouseover', function() {
            this.bindPopup("<strong>" + feature.properties.field2 + "</strong><br>" + feature.properties.field3).openPopup();
          });
      }
    }).addTo(map);

    url = "https://sphadley.github.io/LA558/Assignment18/aq.geojson";
    var geojsonLayer = new L.GeoJSON.AJAX(url).addTo(map);
        


    //******************

    //layer Control

    var baseMaps = {
      "OSM": osm,
    };

    var overlayMaps = {
      "Loaded with plugin & icons": geojsonLayer2b,
      "Cambrian Ordivician Aquifers": geojsonLayer
    };


    L.control.layers(baseMaps, overlayMaps).addTo(map);
});
