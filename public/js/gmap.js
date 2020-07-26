let addr = $("#address");
function getAddressByCoords(g, coords, win) {
  g.geocode({ latLng: coords }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        win.setContent(results[1].formatted_address);
        $("#searchLocation").val(results[1].formatted_address);
      }
    }
  });
}

window.myMap = function () {
  setTimeout(function () {
    let lat = $('input[id="latitude"]').val();
    let lng = $('input[id="longitude"]').val();
    if (!lat || !lng) {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          function (position) {
            renderMap(position.coords.latitude, position.coords.longitude);
          },
          function () {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    } else {
      renderMap(lat, lng);
    }
  }, 1000);
};

function renderMap(lt, lg) {
  let geocoder = new google.maps.Geocoder();
  let myLatlng = new google.maps.LatLng(lt, lg);
  let myOptions = {
    zoom: 10,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("googleMap"), myOptions);

  let input = document.getElementById("searchLocation");
  let autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  let infowindow = new google.maps.InfoWindow();
  let marker = new google.maps.Marker({
    map: map,
    position: myLatlng,
    draggable: true,
    animation: google.maps.Animation.DROP,
    anchorPoint: new google.maps.Point(0, -29),
    title: "Your location"
  });

  infowindow.close();
  marker.setVisible(false);
  $("#latitude").val(lt);
  $("#longitude").val(lg);

  map.setCenter(myLatlng);
  map.setZoom(10);
  marker.setPosition(myLatlng);
  marker.setVisible(true);

  getAddressByCoords(geocoder, myLatlng, infowindow);
  infowindow.open(map, marker);

  google.maps.event.addListener(autocomplete, "place_changed", function () {
    infowindow.close();
    marker.setVisible(false);
    let place = autocomplete.getPlace();
    $("#latitude").val(place.geometry.location.lat());
    $("#longitude").val(place.geometry.location.lng());
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(10);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    let address = "";
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name) || "",
        (place.address_components[1] && place.address_components[1].short_name) || "",
        (place.address_components[2] && place.address_components[2].short_name) || ""
      ].join(" ");
    }
    infowindow.setContent(address);
    infowindow.open(map, marker);
    if (addr) {
      addr.val(address);
    }
  });

  google.maps.event.addListener(marker, "dragend", function (event) {
    let co = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
    getAddressByCoords(geocoder, co, infowindow);
    $("#latitude").val(event.latLng.lat());
    $("#longitude").val(event.latLng.lng());
  });

  google.maps.event.addListener(marker, "click", function (event) {
    console.log("Clicked");
  });
}
