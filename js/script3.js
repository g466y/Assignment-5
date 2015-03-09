//data
//https://www.hurl.it/?method=GET&url=https%3A%2F%2Fopendata.socrata.com%2Fresource%2F72wm-ide8.json
//&headers=%7B%22X-App-Token%22%3A%5B%22bjp8KrRvAPtuf809u1UXnI0Z8%22%5D%7D&args=%7B%7D#top

var map = L.map('map').setView([40.65,-73.93], 12);

var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(CartoDBTiles);


$.getJSON( "https://opendata.socrata.com/resource/72wm-ide8.json?agency_code=Parks&City=Brooklyn", function( data ) {
    var dataset = data;
    plotAPIData(dataset);
    createListForClick(dataset);
});

var apiLayerGroup = L.layerGroup();

// build our dots by hand
function plotAPIData(dataset) {
    // set up D3 ordinal scle for coloring the dots just once
    var linearScale = setUpD3Scale(dataset);

    // loop through each object in the dataset and create a circle marker for each one using a jQuery for each loop
    $.each(dataset, function( index, value ) {

    //change funding amounts from type string to float
    var number = parseFloat(value._09_10funding);
        var latlng = L.latLng(value.latitude, value.longitude);

        var apiMarker = L.circleMarker(latlng, {
            stroke: false,
            fillColor: linearScale(number),
            fillOpacity: 1,
            radius: 5
            });

    	apiMarker.bindPopup("<strong>Project Name: </strong>" + value.project_title);
    	apiLayerGroup.addLayer(apiMarker);
    });

    apiLayerGroup.addTo(map);

}

function setUpD3Scale(dataset) {
	var linearScale = d3.scale.linear()
	.domain([d3.min(dataset, function(d) { return d._09_10funding; }), d3.max(dataset, function(d) { return d._09_10funding; })])
	.range(["#e0ecf4","#8856a7"]);
    //color scale mfrom colorbrewer2.org
    return linearScale;
}

//function createListForClick(dataset) {
    var ULs = d3.select("#list")
                .append("ul");

    ULs.selectAll("li")
        .data()
        .enter()
        .append("li")
        //.html(function(d) { 
        //    return value.project_title;
        //})
        .on('click', function(d, i) {
            console.log(d);
            var leafletId = 'value.zip' + i;
            console.log(leafletId);
            map._layers[leafletId].fire('click');
        })  

//}

















