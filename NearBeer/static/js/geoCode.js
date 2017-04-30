function getGeocode(address, callback)
{
    var geocodingAPI_URL = 
            'https://maps.googleapis.com/maps/api/geocode/json?address='
            + address 
            + '&key=AIzaSyCq9BzYJbmdgg4lweRQiSqdKG2LqX6q_TI'
            + '&sensor=true';
        $.getJSON(geocodingAPI_URL, (json) =>
        {
            var lat = json.results[0].geometry.location.lat;
            var long = json.results[0].geometry.location.lng;
            callback([lat,long]);
        });
}

function getDistance(coord1, coord2)
{
    var from = 
    {
        'type': 'Feature',
        'properties': {},
        'geometry': 
        {
            'type': 'Point',
            'coordinates': coord1
        }
    };
    var to = 
    {
        'type': 'Feature',
        'properties': {},
        'geometry':
        {
            'type': 'Point',
            'coordinates': coord2
        }
    };
    var units = 'miles';

    var points = 
    {
        'type': 'FeatureCollection',
        'features': [from, to]
    };

    var distance = turf.distance(from, to, units);
    return distance.toFixed(2)
}

function getNavLink(start, dest)
{
    var d = dest.replace(/\s/g, '+');
    return 'https://maps.google.com?saddr=' + start[0] + ',' + start[1] +'&daddr=' + d;

}