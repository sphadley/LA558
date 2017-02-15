//Replace mapdiv content with a combintation of pngs
//layers is an variadic on strings corresponding 
//to the filenames of the layers
function updateMap(layers) {
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

function updateFromInputs() {
    var layers = new Array();
    layers.push($("input:radio[name=basemap]:checked").val());
    $('.mapLayer:checkbox:checked').each(function() {
        layers.push($(this).val());
    });
    updateMap(layers);
}

$(document).ready(function() {
    updateFromInputs();
    $('input:radio[name=basemap]').click(function() {
        updateFromInputs();
    });
    $(".mapLayer").change(function() {
        updateFromInputs();
    });
});
