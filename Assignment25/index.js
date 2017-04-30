console.clear();

require(["esri/map", 
  "esri/dijit/Scalebar",
  "dojo/parser",
  "dijit/layout/BorderContainer", 
  "dijit/layout/ContentPane", 
  "dojo/domReady!"], function(Map, Scalebar, parser) {
    parser.parse();
  var map = new Map("map", {
    center: [-1, 34.5],
    zoom: 3,
    basemap: "gray",
    isRubberBandZoom: true,
  });
  var scalebar = new Scalebar({
          map: map,
          // "dual" displays both miles and kilometers
          // "english" is the default, which displays miles
          // use "metric" for kilometers
          scalebarUnit: "dual"
        });
});