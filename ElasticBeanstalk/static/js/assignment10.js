var Map;

function updateDiv(eventString)
{
    $("#output").html(eventString + "<br>" + $("#output").html())
}

$("document").ready(() => {
    Map =  L.map('map').setView([41.6005, -93.6091], 7);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(Map); 

    Map.on('click', function(e) {
        updateDiv("click");
    });

    Map.on('zoomstart', function(e) {
        updateDiv("zoomstart");
    });

    Map.on('move', function(e) {
        updateDiv("move");
    });

    Map.on('moveend', function(e) {
        updateDiv("movend");
    });

    Map.on('zoomend', function(e) {
        updateDiv("zoomend");
    });
});


