var Location = {
  calculateDistance: function (fromLat, fromLng, toLat, toLng) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(toLat - fromLat);
    var dLon = this.deg2rad(toLng - fromLng);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(fromLat)) * Math.cos(this.deg2rad(toLat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.asin(Math.sqrt(a));
    var d = R * c; // Distance in km
    return d * 1000;
  },
  deg2rad: function (deg) {
    return deg * (Math.PI / 180);
  },
  getLocations: function (fromLat, fromLng, config) {
    var i = 0;
    var resultLocations = $.map(config.locations, function (location) {
      i++;
      var distance = Location.calculateDistance(fromLat, fromLng, location.latitude, location.longitude);
      if (distance < parseFloat(config.maximumSearchLength)) {
        return location;
      }
    });

    return resultLocations;
  },
  getCurrentLocation: function () {
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      $("#lat").val(lat);
      $("#lng").val(lng);
      $("#mark_lat").val(lat);
      $("#mark_lng").val(lng);
      FieldController.renderLocationField("#lat", "#lng", "");
    }, function () {
      alert("Location cannot be found.");
    }, {
      enableHighAccuracy: true
    });
  }
};