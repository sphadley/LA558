var map;
var natFilter ="";
//set color of marker
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

var flights = new L.FeatureGroup();
function refreshFlights()
{
    flights.clearLayers();
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
                    var m = L.marker(ltlng, {
                        icon: L.AwesomeMarkers.icon({
                            prefix: 'ion',
                            icon:'ion-plane',
                            markerColor: getColor(speed) 
                        })
                    }).bindPopup(
                        "callsign:" + flight[1] + 
                        "<br>velocity:" + speed +
                        "<br>country of origin:" + flight[2]
                    ).addTo(flights);
                } 
            }
        }
        map.fitBounds(flights.getBounds()); 
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

    var bigStripe1 = new L.StripePattern({
        weight: 2,
        spaceWeight: 5,
        angle: 90,
        opacity: 1,
        spaceOpacity: 0.5,
    });
    bigStripe1.addTo(map);


    var bigStripe2 = new L.StripePattern({
        weight: 2,
        color: 'lime',
        spaceWeight: 5,
        angle: 45,
        opacity: 1,
        spaceOpacity: 0.5,
    });
    bigStripe2.addTo(map);
    
    function shapeStyle(feature) {
        return{
            fillPattern: bigStripe2,
            weight: 1,
            opacity: 1,
            color: 'orange',
            fillOpacity: 1
        };
    }
    url = "https://sphadley.github.io/LA558/Assignment15/iowaCounties.json";

    var geojsonLayer = new L.GeoJSON.AJAX(url , {
        style: shapeStyle
    }).addTo(map);
    
    flights.addTo(map);
   
    var overlays = {
        "USA": geojsonLayer,
        "Flights": flights
    };

    baseLayers = {
        "Open Street Map": osm
    };
    L.control.layers(baseLayers, overlays).addTo(map);

});
