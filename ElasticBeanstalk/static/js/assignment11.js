var map;

function updateDiv(eventString)
{
    $("#output").html(eventString + "<br>" + $("#output").html())
}

function getPolyline()
{
    var latlngs = [
        new L.LatLng(41.858628, -93.921309),
        new L.LatLng(41.858628, -93.921309),
        new L.LatLng(41.859950, -93.915220),
        new L.LatLng(41.866822, -93.869044),
        new L.LatLng(41.874372, -93.832104),
        new L.LatLng(41.876512, -93.799896 ),
        new L.LatLng(41.879604, -93.777859),
        new L.LatLng(41.880171, -93.739225),
        new L.LatLng(41.884045, -93.689185),
        new L.LatLng(41.881273, -93.688316),
        new L.LatLng(41.876001, -93.690355),
        new L.LatLng(41.872055, -93.691878),
        new L.LatLng(41.860757, -93.696384),
        new L.LatLng(41.850257, -93.697876),
        new L.LatLng(41.849498, -93.697983),
        new L.LatLng(41.820880, -93.697897),
        new L.LatLng(41.801952, -93.697844),
        new L.LatLng(41.799041, -93.695934),
        new L.LatLng(41.794570, -93.687394),
        new L.LatLng(41.784778, -93.678811),
        new L.LatLng(41.767512, -93.664187),
        new L.LatLng(41.753019, -93.651602),
        new L.LatLng(41.738434, -93.616980)
    ];
    L.polyline(latlngs, {color:'green', smoothFactor: 10.0}).addTo(map);
 
}


$("document").ready(() => {
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }); 

    var hikeBike = L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var night = L.tileLayer('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
        attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
        bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
        minZoom: 1,
        maxZoom: 8,
        format: 'jpg',
        time: '',
        tilematrixset: 'GoogleMapsCompatible_Level'
    });
    
    var towns = new L.LayerGroup();

	L.marker([41.856978, -93.922291]).bindPopup('Woodward').addTo(towns),
	L.marker([41.874327, -93.820238]).bindPopup('Madrid').addTo(towns),
	L.marker([41.877378, -93.681793]).bindPopup('Slater').addTo(towns),
	L.marker([41.863445, -93.696213]).bindPopup('Sheldahl').addTo(towns),
	L.marker([41.731119, -93.603859]).bindPopup('Ankeny').addTo(towns);

    var overlays = {
        "Towns": towns
    };
    map =  L.map('map', {
       center: [41.6005, -93.6091], 
        zoom: 10,
        layers: [osm, night, hikeBike, towns ]
    });

    baseLayers = {
        "Open Street Map": osm,
        "NASA 2012 Night": night,
        "Hike Bike": hikeBike,
    };

    L.control.layers(baseLayers, overlays).addTo(map);
    getPolyline();

});


