var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -23.1858327, lng: -45.8856327}, // bilac sjc
    zoom: 17
  });
}
