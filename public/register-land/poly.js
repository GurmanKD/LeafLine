let map;
let markers = [];
let polygon;
const labelColors = {
  1: 'red',     // You can assign specific colors for each label
  2: 'blue',
  3: 'green',
  4: 'orange',
  0: 'yellow'
};

async function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 11.069778690400332,lng: 77.0906048081035 },
    zoom: 18,
    mapTypeId: 'satellite'
  });

  map.addListener('click', function (event) {
    addMarker(event.latLng);
  });
  

}
function addMarker(location) {
  const marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
  console.log(markers);
}
function addMarkerWithLabel(lat, lng, label) {
  var marker = new google.maps.Marker({
      position: {lat: lat, lng: lng},
      map: map,
      label: label.toString(),
      icon: getMarkerIcon(label)
  });
}
function getMarkerIcon(label) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: labelColors[label],
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 8
  };
}

// Read data from JSON file and add markers


function lockArea() {
  if (markers.length < 3) {
      alert("You need at least 3 markers to create an area.");
      return;
  }

  if (polygon) {
      polygon.setMap(null);
  }

  // Create a polyline connecting the markers
  const polyLine = new google.maps.Polyline({
      path: markers.map(marker => marker.getPosition()),
      strokeColor: '#0000FF', // Color of the polyline
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map: map
  });

  // Create a polygon filled with a color
  polygon = new google.maps.Polygon({
      paths: polyLine.getPath(), // Use getPath() directly
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      editable: true,
      draggable: true,
      map: map
  });
  let latitudes = markers.map(marker => marker.getPosition().lat());
  let longitudes = markers.map(marker => marker.getPosition().lng());
  let minLat = Math.min(...latitudes);
  let maxLat = Math.max(...latitudes);
  let minLng = Math.min(...longitudes);
  let maxLng = Math.max(...longitudes);

  // Display bounding box coordinates
  alert(`Bounding box: (${minLat}, ${minLng}), (${maxLat}, ${maxLng})`);

  const apiKey = 'AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc';
const url = `https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=15&size=600x900&maptype=satellite&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=${apiKey}`;

async function downloadImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], "map.png", { type: blob.type });
    return file;
}


const center = calculateCenter(markers);
console.log(`Center coordinates: (${center.lat}, ${center.lng})`);

 downloadImage(url).then((file) => {
    console.log(file);
    alert("Image downloaded successfully.");
});
  setTimeout(() => {
      map.setOptions({ draggable: true });
  }, 500);
}


function calculateCenter(markers) {
  let latSum = 0;
  let lngSum = 0;
  const numMarkers = markers.length;

  markers.forEach(marker => {
      latSum += marker.lat;
      lngSum += marker.lng;
  });

  const centerLat = latSum / numMarkers;
  const centerLng = lngSum / numMarkers;

  return { lat: centerLat, lng: centerLng };
}



function assignPoliceman() {
  const selectedPoliceman = document.getElementById('policeDropdown').value;

  if (!polygon) {
    alert("Lock an area before assigning a policeman.");
    return;
  }

  // Convert the assignment data to JSON string using json-stringify-safe
  const jsonString = JSON.stringify({
    polygon: polygon.toString(),
    assignedPoliceman: selectedPoliceman
  });

  if (!jsonString) {
    alert("Error converting assignment data to JSON.");
    return;
  }

  // Create a Blob containing the JSON data
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'duties.json';

  // Append the link to the document and trigger the click event
  document.body.appendChild(link);
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);

  alert(`Assigned ${selectedPoliceman} to the locked area. Assignment details saved to duties.json.`);
}

