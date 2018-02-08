function initMap() {
  var laboratoriaSCL = {lat: -33.4188557, lng: -70.6422274};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: laboratoriaSCL
  });
  var marker = new google.maps.Marker({
    position: laboratoriaSCL,
    map: map
  });
}

function findMe(){
  //Verificar que el navegador soporte la geolocalización
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(localizacion, error);
  } 
//creando funcion de localizacion para obtener longitud y latitud
  var latitud, longitud
  function localizacion(posicion){
    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;
    var miUbicacion = new google.maps.Marker({
    position: {lat: latitud, lng: longitud},
    map: map
    })
    map.setZoom(18),
    map.setCenter({lat: latitud, lng: longitud})
  }

//creando funcion por si se genera un error
  function error(){
    alert('No se pudo obtener tu ubicación');  
  }
  document.getElementById('encuentrame').addEventListener('click',findMe);
}


window.onload = function(){
  var inputPartida = document.getElementById('punto-partida');
  var inputDestino = document.getElementById('punto-destino');

  new google.maps.places.Autocomplete(inputPartida);
  new google.maps.places.Autocomplete(inputDestino);
}

var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;

var calculateAndDisplayRoute = function(directionsService, directionsDisplay){
  directionsService.route({
    origin: inputPartida.value,
    destination: inputDestino.value,
    travelMode: 'DRIVING'
  }, function(response, status){
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('No encontramos una ruta.')
    }
  });
}

directionsDisplay.setMap(map);

var trazarRuta = function(){
  calculateAndDisplayRoute(directionsService, directionsDisplay);

document.getElementById('trazar-ruta').addEventListener('click', trazarRuta);  
}






