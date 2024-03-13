// Creating the map object
let myMap = L.map("map", {
  center: [27.96044, -82.30695],
  zoom: 7
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch earthquake data from URL
fetch(geoData)
  .then(response => response.json())
  .then(data => {
      // Loop through earthquake data and add markers
      data.features.forEach(feature => {
          let coordinates = feature.geometry.coordinates;
          let magnitude = feature.properties.mag;
          let depth = coordinates[2];
          let markerSize = getMarkerSize(magnitude);
          let markerColor = getMarkerColor(depth);

          // Customize marker
          let marker = L.circleMarker([coordinates[1], coordinates[0]], {
              radius: markerSize,
              fillColor: markerColor,
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
          }).addTo(myMap);

          // Create popup
          marker.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`);
      });

      // Create the legend
      let legend = L.control({position: 'bottomright'});
      legend.onAdd = function (map) {
          let div = L.DomUtil.create('div', 'info legend');
          div.innerHTML += '<h4>Legend</h4>';
          div.innerHTML += '<i style="background:#00FF00"></i> Shallow<br>';
          div.innerHTML += '<i style="background:#FFFF00"></i> Moderate<br>';
          div.innerHTML += '<i style="background:#FF0000"></i> Deep<br>';
          return div;
          };
      legend.addTo(myMap);
  })
  // Catch error from chatGPT
  .catch(error => console.error('Error fetching earthquake data:', error));

// Customize marker size based on magnitude
function getMarkerSize(magnitude) {
  return magnitude * 5;
}

// Customize marker color based on depth
function getMarkerColor(depth) {
  if (depth < 10) {
      return '#00FF00';
  } else if (depth < 30) {
      return '#FFFF00';
  } else {
      return '#FF0000';
  }
}