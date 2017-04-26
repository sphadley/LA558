var map;

$("document").ready(() => {
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }); 

    var canyon = L.tileLayer('http://mapwarper.net/maps/tile/20263/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    });

    var pisgah = L.tileLayer('http://mapwarper.net/maps/tile/20264/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    });

    var sioux = L.tileLayer('http://mapwarper.net/maps/tile/20267/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    });

    var mondamin = L.tileLayer('http://mapwarper.net/maps/tile/20269/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    });
    
    var overlays = {
        "Preparation Canyon Unit": canyon,
        "Pisgah Unit": pisgah,
        "Little Sioux Unit": sioux,
        "Mondamin Unit": mondamin
    };
    map =  L.map('map', {
       center: [41.817094, -95.947023], 
        zoom: 12,
        layers: [osm, canyon, pisgah, sioux, mondamin]
    });

    baseLayers = {
        "Open Street Map": osm
    };

    L.control.layers(baseLayers, overlays).addTo(map);

});


