var map;

//set color of marker
function getColor(d) {
  return d <= '100' ? '#d73027' :
    d <= '200' ? "#f46d43" :
    d <= '300' ? "#fdae61" :
    d <= '400' ? "#fee08b" :
    d <= '500' ? "#d9ef8b" :
    d <= '600' ? "#a6d96a" :
    d <= '900' ? "#66bd63" :
    d <= '1000' ? "#1a9850" :
    "#000000"; //black
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.Population),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.7
    };
}

var flights = new L.LayerGroup();
function refreshFlights()
{
    flights.clearLayers();
    $.get( "https://opensky-network.org/api/states/all").done((data) => {
        for(var f in data.states)
        {
            var flight = data.states[f];
            var natFilter = $("#countrySelect").val();
            if(natFilter == "" || natFilter == flight[2]) 
            {
                var lat= flight[6];
                var lon = flight[5];
                var speed = flight[9] * 2.23694;
                if(lat != null && lon != null && !flight[8])
                {
                    var ltlng = L.latLng(lat, lon);
                    var m = L.circleMarker(ltlng,  {
                        radius: 5, //data[f].states[5]/1000, 
                        color: getColor(speed),
                        fillColor:getColor(speed),
                        fillOpacity: 0.9}).bindPopup(
                        "callsign:" + flight[1] + 
                        "<br>velocity:" + speed +
                        "<br>country of origin:" + flight[2]
                        ).addTo(flights);
                } 
            }
        }
    });
}

$("document").ready(() => {
    refreshFlights();

    $("#countrySelect").change(() => {
        refreshFlights();
    });
    setInterval(() => { 
        refreshFlights();    
    }, 30000);

    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }); 

    var legend = L.control({
        position: 'bottomleft'
    });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
        speeds = [100, 200, 300, 400, 500, 600, 700, 800, 900],
        labels = ['100mph', '', '','', '500mph', '', '', '', '900mph'];
        div.innerHTML += "<b>Velocity</b><br>";
        for (var i = 0; i < speeds.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(speeds[i] ) + ' "></i> ' +
            labels[i]+'<br>';
        }
        return div;
    }; 

    var overlays = {
        "Flights": flights
    };

    map =  L.map('map', {
       center: [41.577, -93.231], 
        zoom: 3,
        layers: [osm, flights ]
    });

    baseLayers = {
        "Open Street Map": osm
    };
    L.control.layers(baseLayers, overlays).addTo(map);
    legend.addTo(map);

});


