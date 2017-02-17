//Replace mapdiv content with a combintation of pngs
//layers is an variadic on strings corresponding 
//to the filenames of the layers

var isVisible = true;

$(document).ready(() => {
    $( "#slider1" ).slider({min:50, max:500}).on("slidechange", (event, ui) => {
        $("#areaCode").css({width: ui.value+"px"});
    });
  
    $( "#slider2" ).slider({min:50, max:500}).on("slidechange", (event, ui) => { 
        $(".firstTwo").css({width: ui.value+"px"});
    });

    $( "#slider3" ).slider({min:50, max:500}).on("slidechange", (event, ui) => {
        $("img").css({width: ui.value+"px"});
    });
    $("#toggle").click(function() {
        if(isVisible)
        {
            isVisible = false;
            $("#topoMap").hide();
        }
        else
        {
            isVisible = true;
            $("#topoMap").show();
        }

    });
    


});
