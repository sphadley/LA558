var map;
var userLayer = new L.FeatureGroup();

function showPosition(pos) {
    map.setView([pos.coords.latitude, pos.coords.longitude], 12);
    userLayer.clearLayers();
    var ltlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
    var m = L.marker(ltlng).addTo(userLayer);

    console.log(pos.coords.latitude);
    console.log(pos.coords.longitude);
};


$('document').ready(() => {
    var osm = L.tileLayer('https://api.mapbox.com/styles/v1/sphadley/cj1h8lqxi001o2smkbfg9b4ov/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BoYWRsZXkiLCJhIjoiY2oxaDZrNDJoMDA1czJxcG1jZ3M3cXRydiJ9.ysHgt2sXk0XlG0d55OoxhA', {
        attribution: 'MapBox',
    });

    map =  L.map('map', {
       center: [38.085752, -106.142457], 
        zoom: 7,
        layers: [osm, userLayer ]
    });


    var baseMaps = {
      "OSM": osm,
    };

    var overlayMaps = {
        "User Marker": userLayer
    };


    L.control.layers(baseMaps, overlayMaps).addTo(map);
});
