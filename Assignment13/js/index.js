var map;

//set color of marker
function getColor(d) {
  return d <= '5000' ? '#6CA100' :
    d <= '10000' ? "#8FD400" :
    d <= '20000' ? "#B1FF0F" :
    d <= '30000' ? "#F2F252" :
    d <= '50000' ? "#F5F589" :
    d <= '70000' ? "#D6DBCC" :
    d <= '100000' ? "#B3B3B3" :
    d <= '200000' ? "#999999" :
    d <= '500000' ? "#636363" :
    "#FFFFFF"; //white
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

url = "https://sphadley.github.io/LA558/Assignment13/iowaCounties.json";

$("document").ready(() => {
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }); 

    var geojsonLayer = new L.GeoJSON.AJAX(url , {
        style: style,
        onEachFeature: function (feature, layer) {
            htmlText = "<strong>" + feature.properties.NAME+ "</strong><br>Population: <b>"  + feature.properties.Population  + "</b>";
            layer.bindPopup(htmlText);
            layer.bindTooltip(feature.properties.NAME);
        }
    });
    
    var legend = L.control({
        position: 'bottomleft'
    });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
        pops = [5000, 10000, 20000, 30000, 50000, 70000, 100000, 200000, 500000],
        labels = ['5k', '10k', '20k','30k', '50k', '70k', '100k', '200k', '500k'];
        div.innerHTML += "<b>Population</b><br>";
        for (var i = 0; i < pops.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(pops[i] ) + ' "></i> ' +
            labels[i]+'<br>';
        }
        return div;
    }; 

    var overlays = {
        "Populations": geojsonLayer
    };
    map =  L.map('map', {
       center: [41.577, -93.231], 
        zoom: 7,
        layers: [osm, geojsonLayer ]
    });

    baseLayers = {
        "Open Street Map": osm
    };

    L.control.layers(baseLayers, overlays).addTo(map);
    legend.addTo(map);

});


