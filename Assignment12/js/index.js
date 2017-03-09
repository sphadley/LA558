var map;
var redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


function getBuidlingsLayer()
{
    var buildings = new L.LayerGroup();
    for(var b in collegeBuildings)
    {
        L.marker(collegeBuildings[b].coord, {
            icon: redIcon
        }).bindPopup(
            "<div class='popupHeader'>" +
            collegeBuildings[b].name +
            "</div><img class='popupImg' src='" +
            collegeBuildings[b].image +
            "'> </image>", {
                maxWidth: 250, 
                autoPan: true, 
                keepInView: true,
                closeButton: true, 
                autoPanPadding: [25, 5]
            }
        ).addTo(buildings);
    }
    return buildings;
}

function getFieldsLayer()
{
    var fieldsLayer = new L.LayerGroup();
    for(var f in fields)
    {
        L.marker(fields[f].coord, {
            icon: orangeIcon 
        }).bindPopup(
            "<div class='popupHeader'>" +
            fields[f].name +
            "</div><img class='popupImg' src='" +
            fields[f].image +
            "'> </image>", {
                maxWidth: 250, 
                autoPan: true, 
                keepInView: true,
                closeButton: true, 
                autoPanPadding: [25, 5]
            }
        ).addTo(fieldsLayer);
    }
    return fieldsLayer;
}


function getCollegeLayer()
{
    var collegeLayer = new L.LayerGroup();
    var colleges = new L.geoJSON(collegeShapes, 
    {
        style: () => {
            return { 
                color:"#73c61f",
                fillOpacity: 0.7
            }
        },    
        onEachFeature: (feature, layer) => {
            layer.bindPopup(
                "<div class='popupHeader'>" +
                feature.properties.name +
                "</div><img class='popupImg' src='" +
                 feature.properties.image +
                 "'> </image>", {
                      maxWidth: 250, 
                      autoPan: true, 
                      keepInView: true,
                      closeButton: true, 
                      autoPanPadding: [25, 5]
                } 
            );
        }
    }).addTo(collegeLayer);
    
    return collegeLayer;
}

$("document").ready(() => {
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }); 

    var esri = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    var collegeLayer = getCollegeLayer();          
    var buildings = getBuidlingsLayer();
    var fields = getFieldsLayer();

    var overlays = {
        "Institutions": collegeLayer,
        "Buildings": buildings,
        "Athletic Facilities":fields
    };
    map =  L.map('map', {
       center: [42.496816, -96.400303], 
        zoom: 13,
        layers: [osm, collegeLayer, buildings, fields ]
    });

    baseLayers = {
        "ESRI Satalite": esri,
        "Open Street Map": osm
    };

    L.control.layers(baseLayers, overlays).addTo(map);

});


