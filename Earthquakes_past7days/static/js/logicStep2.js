// add console.log to check to see if our code is working
console.log("working");

//create tile layer for the background of our map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

//create tile layer for the background of our map
let satellitestreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

//create base layer that holds both maps
let baseMap = {
  "Streets": streets,
  "Satellite": satellitestreets
}


//create map object with a center and a zoom level
let map = L.map('mapid', {
    center: [
      39.5, -98.5
    ],
    zoom: 3,
    layers: [streets]
});

// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: "#ffae42",
      color: "#000000",
      radius: getRadius(),
      stroke: true,
      weight: 0.5
    };
  }

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

//pass our map layers into our layer control and add to map
L.control.layers(baseMap).addTo(map);

//add data
let earthquakePast = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//retrieve earthquake GeoJSON data
d3.json(earthquakePast).then(function(data) {
  // Creating a geojson layer with retrieved data
  L.geoJson(data, {
//We turn each feature into a circleMarker on the map
  pointToLayer: function(feature, latlng) {
          console.log(data);
          return L.circleMarker(latlng);
      },
      //We set the style for each circleMarker using our styleInfo function
    style: styleInfo
  }).addTo(map);
});