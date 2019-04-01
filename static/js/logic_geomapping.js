//Global variables used throughout the script
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var minMagnitude = 999.99;
var maxMagnitude = -999.99;
var scaleMagnitude = 16000;
/*
* Functions to help me automating visualization and personalization
* */
function getMinMax(featuresArray){
    featuresArray.forEach( data =>{
        if(data.properties.mag > maxMagnitude) maxMagnitude = data.properties.mag;

        if(data.properties.mag < minMagnitude && data.properties.mag > 0) minMagnitude = data.properties.mag;
    });
}

function getColor(magnitude){
    return magnitude > 5 ? '#C0392B' :
        magnitude > 4 ? '#E74C3C' :
            magnitude > 3 ? '#F39C12' :
                magnitude > 2 ? '#F4D03F' :
                    magnitude > 1 ? '#2ECC71' :
                        '#1E8449';
}

function createMarker(singleFeature){
    return L.circle([singleFeature.geometry.coordinates[1],singleFeature.geometry.coordinates[0]],{
        color: getColor(singleFeature.properties.mag),
        fillColor: getColor(singleFeature.properties.mag),
        fillOpacity: "0.80",
        radius: singleFeature.properties.mag * scaleMagnitude
    }).bindPopup("<h3>"+ singleFeature.properties.place+"</h3><hr/><p class='popup-feature'>Magnitude:<span class='popup-value'>"+ singleFeature.properties.mag+"</span><br />Time: <span>"+singleFeature.properties.time+"</span></p>");
}

/*Creating the map and legends being used in this challenge*/
var myMap = L.map("map", {
    center: [39.7837304, -100.4458825],
    zoom: 5
});

var legend = L.control({ position: "bottomright"});
legend.onAdd = function(){
    var div = L.DomUtil.create("div", "info legend");
    var magnitudeRanges = [0,1,2,3,4,5];
    var labels = [];

    for(var i =0; i < magnitudeRanges.length; i++){
        div.innerHTML +=
            '<i style="background: ' + getColor(magnitudeRanges[i] + 1) + '"></i> ' +
            magnitudeRanges[i] + (magnitudeRanges[i+1] ? '&ndash;' + magnitudeRanges[i + 1] + '<br />' : '+');
    }

    return div;
};

legend.addTo(myMap);

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
}).addTo(myMap);




d3.json(url).then(response =>{
    console.log(response);

    getMinMax(response.features);

    response.features.forEach( feature => {
        let myMarker = createMarker(feature);
        myMarker.addTo(myMap);
    });




});