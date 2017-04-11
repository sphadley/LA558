var map;

function showPosition(position) {
    map.setView([postion.coords.latitude, postion.coords.longitude], 12);
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
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
        layers: [osm /*, flights*/ ]
    });


    var baseMaps = {
      "OSM": osm,
    };

    var overlayMaps = {
    };


    L.control.layers(baseMaps, overlayMaps).addTo(map);
    
    getLocation();
});
