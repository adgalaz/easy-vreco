// Todos los elementos, es decir el mapa con el marcador, buscador, autocompletado, etc. deben ir dentro de la funcion initMAp, de lo contrario no funcionan 
function initMap() {
	// Monstarndo mapa
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: 5,
		center: { lat: -9.1191427, lng: -77.0349046 }, //coordenadas que apareceran al inicio del mapa, se pueden poner las que queramos
		mapTypeControl: false,
		zoomControl: false,
		streetViewControl: false
	});

	// Icono personalizado del marcador y caracteristicas de tamaño. Todas las variables que aparecen abajo deben ir para que se vea.
	var image = {
		url: 'http://icons.iconarchive.com/icons/sonya/swarm/128/Space-Shuttle-icon.png',
		size: new google.maps.Size(71, 71),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(35, 35)
	}

	//Función para que el mapa busque la ubicacion actual, en este caso se acciona a traves de un boton con el id='buscar' en el html. la primera parte activa el sistema de geolalizacion del navegador y se ingresan como parametro dos funciones en este caso exito y error
	function buscar() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(functionExito, functionError);
		}
	}

	// Se agrega el evento click al boton buscar
	document.getElementById("buscar").addEventListener("click", buscar);
	var latitud, longitud;

	// Funcion que busca la ubicacion actual y hace que el marcador se posicione
	var functionExito = function (posicion) {
		latitud = posicion.coords.latitude;
		longitud = posicion.coords.longitude;

		var miUbicacion = new google.maps.Marker({
			position: { lat: latitud, lng: longitud },
			animation: google.maps.Animation.DROP,
			//DRAGGABLE: Es para tomar el marcador y poder ponderlo donde queramos en el mapa, por el momento es solo visual porque no esta devolviendo o modificando automaticamente las coordenadas, lo dejamos para jugar y probar, pero no es necesario dejarlo. Para que funcione con coordenadas hay que hacer otra funcion.
			//draggable:true,  
			//title: "Drag me!",
			map: map,
			icon: image
		});

		// Posiciona el marcador en las coordenadas y se muestra el mapa con el zoom que le hemos ingresado
		map.setZoom(17);
		map.setCenter({ lat: latitud, lng: longitud });
	}

	// Funcion erro en caso de que falle lo de encontrar ubicacion, devuelve un alert
	var functionError = function (error) {
		alert("No encontre tu ubicacion");
	}

	// Funcion de autocompletado. Se toman los valores del input de origen y destino. REcordar que para que esto funcione se debe agregar en el link de la api &libraries=places
	var origen = document.getElementById('origen');
	var autocomplete = new google.maps.places.Autocomplete(origen);
	autocomplete.bindTo('bounds', map);

	var destino = document.getElementById('destino');
	var autocomplete = new google.maps.places.Autocomplete(destino);
	autocomplete.bindTo('bounds', map);

	// Funcion que permite trazar la ruta. Debe ir todo el contenido a continuacion para que funcione. Estar atentas al ID de los inputs porque esos se ingresan mas abajo para que la funcion tome el valor ingresado en ambos inputs y poder trazar ruta. Tambien se ingresa si por defecto calcutara la ruta para automovil u otra. En este caso esta para aut (palabra clave: driving)
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();

	directionsDisplay.setMap(map);

	var onChangeHandler = function () {
		calculateAndDisplayRoute(directionsDisplay, directionsService);
	};

	// Agregando evento de click al boton trazar ruta que tiene el id='ruta'
	document.getElementById('ruta').addEventListener('click', onChangeHandler);

	function calculateAndDisplayRoute(directionsDisplay, directionsService) {
		directionsService.route({
			origin: document.getElementById('origen').value,
			destination: document.getElementById('destino').value,
			travelMode: 'DRIVING'
		}, function (response, status) {
			if (status === 'OK') {
				directionsDisplay.setDirections(response);
			} else {
				window.alert('Directions request failed due to' + status)
			}
		});
	}
}