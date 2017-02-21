var map;
var schools = [
    [43.0872511, -96.167386, "Sioux Center High School"],
    [42.475618, -96.3588001, "Morningside College", "M.png"],
    [43.1847793, -95.8795231, "NCC", "ncc.png"],
    [38.9085819, -77.0360788, "The Washington Center"],
    [42.0269133, -93.6519128, "Iowa State University","istate.png"]
];

var mountains = [
    [43.5117, -71.2873, "Mount Major", 1.785],
    [43.8661, -103.5323, "Harney Peak", 7.244],
    [39.5883, -105.6438, "Mount Evans", 14.265]
]
    //1,785′
    //7,244′
    //14,265′
$("document").ready(()=> {
    map = L.map('map').setView([42.0, -85.634], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map); 
    
    var icon1 = L.icon({iconUrl: schools[1][3], iconSize: [50,40]});
    L.marker([schools[1][0], schools[1][1]], {icon:icon1}).bindPopup(schools[1][2]).addTo(map);    

    var icon2 = L.icon({iconUrl: schools[2][3], iconSize: [50,40]});
    L.marker([schools[2][0], schools[2][1]], {icon:icon2, riseOnHover: true, riseOffset:300}).bindPopup(schools[2][2]).addTo(map);    
    

    var icon3 = L.icon({iconUrl: schools[4][3], iconSize: [50,40]});
    L.marker([schools[4][0], schools[4][1]], {icon:icon3, title: 'Howe Hall', opacity: .5}).bindPopup(schools[4][2]).addTo(map);    

    L.circleMarker([schools[0][0], schools[0][1]], {radius: 10, color:"orange"}).addTo(map);
    L.circleMarker([schools[3][0], schools[3][1]], {radius: 10, color:"red", fillOpacity:1.0}).addTo(map);

    //Used HSL colors using mountian height for lightness value, and a generic green for hue and full saturation
    L.circleMarker([mountains[0][0], mountains[0][1]], {radius:mountains[0][3], color: "#F8FFDB"}).bindPopup(mountains[0][1]).addTo(map);
    L.circleMarker([mountains[1][0], mountains[1][1]], {radius:mountains[1][3], color: "#E5FF80"}).bindPopup(mountains[1][1]).addTo(map);
    L.circleMarker([mountains[2][0], mountains[2][1]], {radius:mountains[2][3], color: "#CAFF00"}).bindPopup(mountains[2][1]).addTo(map);

});

