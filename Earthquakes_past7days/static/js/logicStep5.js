// add console.log to see if our code is working
console.log("working");

// Having the tileLayer before accessing large datasets ensures that the map gets loaded before the data is added to it
// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps
let baseMaps = {
    "Streets": streets,
    "Satellite": satelliteStreets
}; 

// Create the earthquake layer for our map
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays
// This overlay will be visible all the time
let overlays = {
    Earthquakes: earthquakes
};

// Create the map object with a center (US) and zoom level
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});

// Control layers 
// Pass our map layers into our layers control and add the layers control to the map
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing earthquakes GeoJSON url
let earthquakesPast = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "black",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
}

// Function to color code the magnitude of earthquakes (circles in the map)
function getColor(magnitude) {
    if (magnitude > 5) {
        return "#ea2c2c";
    }
    if (magnitude > 4) {
        return "#ea822c";
    }
    if (magnitude > 3) {
        return "#ee9c00";
    }
    if (magnitude > 2) {
        return "#eecc00";
    }
    if (magnitude > 1) {
        return "#d4ee00";
    }
    return "#98ee00";
}


// This fct determines the raius of the earthquake marked based on its magnitude
// Earthquakes with a mag of 0 will be plotted with a radius of 1
function getRadius(magnitude){
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}

d3.json(earthquakesPast).then(data => {
    L.geoJSON(data, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<b>Magnitude: </b>" + feature.properties.mag + "<br><b>Location: </b>" + feature.properties.place)
        },
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
        style: styleInfo
    }).addTo(earthquakes);
    earthquakes.addTo(map);
});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    const magnitudes = [0,1,2,3,4,5];
    const colors = [
        "#98EE00",
        "#D4EE00",
        "#EECC00",
        "#EE9C00",
        "#EA822C",
        "#EA2C2C"
    ];
    
    // Looping through our intervals to generate a label with colores scales
    for (let i = 0; i < magnitudes.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " + magnitudes[i] + (magnitudes[i+1] ? "&ndash;" + magnitudes[i+1] + "<br>" : "+");
    }
    return div;
};

legend.addTo(map);