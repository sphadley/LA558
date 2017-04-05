$("document").ready(() => {
    console.clear();

    var map = L.map('map').setView([43, -93], 12);

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);


    $('#myAddress').val('1307 Florida Ave., Ames, IA, 50014');
    var geoCodes = new L.FeatureGroup().addTo(map);

    $('#geocode').click(function () {
        myAddress = encodeURI($('#myAddress').val());
        var geocodingAPI_URL = 
            "http://maps.googleapis.com/maps/api/geocode/json?address=" 
            + myAddress 
            + "&sensor=true";
        $.getJSON(geocodingAPI_URL, function (json) {
            var address = json.results[0].formatted_address;
            var lat = json.results[0].geometry.location.lat;
            var long = json.results[0].geometry.location.lng;
            console.log(geocodingAPI_URL);
            console.log(address);
            console.log(lat);
            console.log(long);
            var county = '';
            var township = '';
            $.each(json.results[0].address_components, function (i, jsonData) {
                level = jsonData.types[0];
                if ('administrative_area_level_2' === level.toLowerCase()) {
                    county = (jsonData.short_name);
                }
                if ('administrative_area_level_3' === level.toLowerCase()) {
                    township = (jsonData.short_name);
                }
            });
            console.log("I am in " + county + "!");
            var marker = L.marker([lat, long], {
                draggable: false,
                title: address,
                opacity: 0.75
            }).addTo(geoCodes);
            marker.bindPopup(
                "<strong>Lattitude: </strong>" 
                + lat + "<br>" 
                + "<strong>Longitude: </strong>" 
                + long + "<br>" 
                + "<strong>County:</strong> " + county + "<br>" 
                + "<strong>Township:</strong> " + township
                );
            map.fitBounds(geoCodes.getBounds()); 
        });
    }); 
});
