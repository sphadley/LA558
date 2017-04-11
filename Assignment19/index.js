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

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else 
    {
        alert("Geolocation is not supported by this browser.");
    }
}
$('document').ready(() => {
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    });

    map =  L.map('map', {
       center: [41.577, -93.231], 
        zoom: 3,
        layers: [osm, userLayer ]
    });


    var baseMaps = {
      "OSM": osm,
    };

    var overlayMaps = {
        "User Marker": userLayer
    };


    L.control.layers(baseMaps, overlayMaps).addTo(map);
   
    var allow = confirm("Allow the page to use your locaiton?"); 
    if(allow)
        getLocation();
});
