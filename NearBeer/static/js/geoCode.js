function getGeocode(address, callback)
{
    var geocodingAPI_URL = 
            "https://maps.googleapis.com/maps/api/geocode/json?address=" 
            + address 
            + "&key=AIzaSyCq9BzYJbmdgg4lweRQiSqdKG2LqX6q_TI"
            + "&sensor=true";
        $.getJSON(geocodingAPI_URL, (json) =>
        {
            var lat = json.results[0].geometry.location.lat;
            var long = json.results[0].geometry.location.lng;
            callback([lat,long]);
        });
}