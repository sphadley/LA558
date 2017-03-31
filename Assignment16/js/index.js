var map;
var layerControl;
var natFilter ="";
function getColor(d) {
  return d <= '100' ? 'blue' :
    d <= '200' ? "darkgreen" :
    d <= '300' ? "green" :
    d <= '400' ? "lightgreen" :
    d <= '500' ? "orange" :
    d <= '600' ? "lightred" :
    d <= '900' ? "red" :
    d <= '1000' ? "darkred" :
    "black"; //black
}

var heatArray = [];
var clusters = L.markerClusterGroup();
var flights = new L.FeatureGroup();
var heatMap1 = L.heatLayer(heatArray, {
    minOpacity: 0.1, 
    maxZoom: 19, 
    max: 1.0, 
    radius: 25, 
    blur: 15, 
    gradient: {
        0.2: 'yellow', 
        0.65: 'lime', 
        1: 'red'
    } 
});

function refreshFlights()
{
    flights.clearLayers();
    clusters.clearLayers();
    heatArray = [];
    $.get("https://sphadley.github.io/LA558/Assignment15/flights.json").done((data) => {
        for(var f in data.states)
        {
            var flight = data.states[f];
            if(natFilter == "" || natFilter == flight[2]) 
            {
                var lat= flight[6];
                var lon = flight[5];
                var speed = flight[9] * 2.23694;
                if(lat != null && lon != null && !flight[8])
                {
                    var ltlng = L.latLng(lat, lon);
                    var m = L.marker(ltlng).bindPopup(
                        "callsign:" + flight[1] + 
                        "<br>velocity:" + speed +
                        "<br>country of origin:" + flight[2]
                    ).addTo(flights);
                    m.addTo(clusters);
                    var arrayItem = [lat,lon, speed];
                    heatArray.push(arrayItem);
                } 
            }
        }
        
        map.removeLayer(heatMap1);
        layerControl.removeLayer(heatMap1);
        map.fitBounds(flights.getBounds()); 
        heatMap1 = L.heatLayer(heatArray, {
            minOpacity: 0.1, 
            maxZoom: 19, 
            max: 1.0, 
            radius: 25, 
            blur: 15, 
            gradient: {
                0.2: 'yellow', 
                0.65: 'lime', 
                1: 'red'
            } 
        }).addTo(map);
        layerControl.addOverlay(heatMap1, "Heatmap Layer");
    });
}

$("document").ready(() => {

    $(".natButton").click(function(){
        natFilter = $(this).text();
        refreshFlights();
    });
    
    $("#countrySelect").change(() => {
        refreshFlights();
    });

    refreshFlights();
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }); 

    map =  L.map('map', {
       center: [41.577, -93.231], 
        zoom: 3,
        layers: [osm /*, flights*/ ]
    });

    flights.addTo(map);
    heatMap1.addTo(map);
    clusters.addTo(map);

       
    var overlays = {
        "Flights": flights,
        "Clusters": clusters,
        "Heatmap Layer": heatMap1
    };

    baseLayers = {
        "Open Street Map": osm
    };
    layerControl = L.control.layers(baseLayers, overlays).addTo(map);

});
