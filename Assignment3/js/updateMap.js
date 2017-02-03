//Replace mapdiv content with a combintation of pngs
//layers is an variadic on strings corresponding 
//to the filenames of the layers
function updateMap( ...layers) {
    $("#mapdiv").empty();
    for(layer in layers) {
       $("#mapdiv").append( 
        $("<img />", {
            "class":"mapImg", 
            "src": "images/" + layers[layer] +".png",
            "alt": layers[layer]
        }));
    }
}

$(document).ready(function() {
    $("#fruit").click(function() {
        updateMap("basemapLandcover", "vineyards", "orchards");
    });

    $("#loess").click(function() {
        updateMap("iowaBorder","loessHills");
    });

    $("#zip").click(function() {
        updateMap("Zipcode");
    });

    $("#highway").click(function() {
        updateMap("usHouse2013", "Interstate", "scenicByways");
    });

    $("#waterway").click(function() {
        updateMap("basemapTopo", "canoeRoutes", "troutStreams", "impairedLakes");
    });

});
