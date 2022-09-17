// Add console.log to check to see if our code is loading.
console.log("logic.js loading ...");

//
// Map Setup
//

// Create the tile layers that will be the backgrounds of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});
let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create layer groups for each crop
let potatoes = new L.LayerGroup();
let maize = new L.LayerGroup();
let wheat = new L.LayerGroup();
let rice = new L.LayerGroup();
let sorghum = new L.LayerGroup();
let soybeans = new L.LayerGroup();
let sweet = new L.LayerGroup();
let cassava = new L.LayerGroup();
let plantains = new L.LayerGroup();
let yams = new L.LayerGroup();

// Create a dictionary that connects the crop name string to the corresponding layer group
var lgDict = {
  "Potatoes": potatoes,
  "Maize": maize,
  "Wheat": wheat,
  "Rice, paddy": rice,
  "Sorghum": sorghum,
  "Soybeans": soybeans,
  "Sweet potatoes": sweet,
  "Cassava": cassava,
  "Plantains and others": plantains,
  "Yams": yams
}

// Function to create an icon given a relative path to the icon file and a size for the icon.
// The anchor will be shifted to be centered with the lat/long point, and the popup will show up above the icon
function makeIcon(x, y, path) {
  let newIcon = L.Icon.extend({
    options: {
        iconSize:     [x, y],
        iconAnchor:   [x * 0.5, y * 0.5],
        popupAnchor:  [0, y * -0.5],
        iconUrl: path
    }
  });
  retIcon = new newIcon();
  return(retIcon);
};

// Icons are created individually so that the makeIcon function would
// not be called with every call to the iconDict{}
potatoIcon = makeIcon(40,40,"icons/potato.png");
maizeIcon = makeIcon(40,40,"icons/corn2.png");
wheatIcon = makeIcon(60,60,"icons/wheat.png");
riceIcon = makeIcon(50,50,"icons/rice2.png");
sorghumIcon = makeIcon(78,80,"icons/sorghum2.png");
soybeanIcon = makeIcon(50,50,"icons/soybean.png");
swpotatoIcon = makeIcon(60,60,"icons/sweetpotato.png");
cassavaIcon = makeIcon(60,60,"icons/cassava.png");
plantainIcon = makeIcon(50,50,"icons/plantain2.png");
yamIcon = makeIcon(50,50,"icons/yam.png");

// Create a dictionary that connects the crop name string to the corresponding icon
var iconDict = {
  "Potatoes": potatoIcon,
  "Maize": maizeIcon,
  "Wheat": wheatIcon,
  "Rice, paddy": riceIcon,
  "Sorghum": sorghumIcon,
  "Soybeans": soybeanIcon,
  "Sweet potatoes": swpotatoIcon,
  "Cassava": cassavaIcon,
  "Plantains and others": plantainIcon,
  "Yams": yamIcon
}

// Create a base layer that holds all three maps.
let baseMaps = {
  "Satellite": satelliteStreets,
  "Light": light,
  "Streets": streets
};

// 2. Create a dictionary of the different layer groups - this will be in a base control, rather than an overlay control
let cropMaps = {
  "Potatoes": potatoes,
  "Maize (Corn)": maize,
  "Wheat": wheat,
  "Rice": rice,
  "Sorghum": sorghum,
  "Soybeans": soybeans,
  "Sweet Potatoes": sweet,
  "Cassava": cassava,
  "Plantains": plantains,
  "Yams": yams
};

// Empty overlays dictionary
let overlays = {
}

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40, 4.0],
	zoom: 3,
	layers: [satelliteStreets, potatoes]
});

// Create a control to adjust the street layers with radio buttons
mapControl = L.control.layers(baseMaps, overlays, {
  collapsed: false
}).addTo(map);

// Then we add a control to the map that will allow the user to change which
// layers are visible.  This is a baseMaps layer, rather than an overlay, so
// It will be a radio button rather than a checkbox.
cropControl = L.control.layers(cropMaps, overlays, {
  collapsed: false
}).addTo(map);

//
// Styles and Styling Functions
//

//
// Adding Marker
//

allCountriesLink = "predictions.geojson";

// Retrieve the crops data.
d3.json(allCountriesLink).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data.
  var cData = L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
     		return L.marker(latlng);
    },
    // We create a popup for each circleMarker to display the magnitude and location of the earthquake
    //  after the marker has been created and styled.
    onEachFeature: function(feature, layer) {
      // Ensure that each individual marker is put on the markerPane instead of the basePane,
      // despite being controlled by a radio button in the baseMaps of a control
      layer.options.pane = "markerPane";
      // Create the pop-up with HTML table formatting
      layer.bindPopup("<table><tr><td><b>Country</b>:</td><td>" + feature.properties.area + "</td></tr>" + 
                      "<tr><td><b>Crop</b>:</td><td>" + feature.properties.crop + "</td></tr>" +
                      "<tr><td><b>Yield 2013 (Predicted)</b>:</td><td>" + feature.properties.yield_2013_pred + " hg/ha</td></tr>" +
                      "<tr><td><b>Yield 2013 (Actual)</b>:</td><td>" + feature.properties.yield_2013 + " hg/ha</td></tr>" +
                      "<tr><td><b>Percent Error</b>:</td><td>" + feature.properties.perc_err + "%</td></tr></table>");
      // Set the icon for the point based on the crop
      layer.setIcon(iconDict[feature.properties.crop]);
      // Add the point to the matching Layer Group linked by the lgDict
      layer.addTo(lgDict[feature.properties.crop]);
    }
  });
});

console.log("logic.js loaded successfully ...");