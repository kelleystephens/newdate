/* global google */
/* jshint unused:false */
/* global moment */

(function() {
  'use strict';

  $(document).ready(init);

  function init() {
    $('p.signin.button > input').click(geocode);
  }

  function geocode(e){
    var zip = $('#zip').val();
    var name = $('#name').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: zip}, function(results, status){
      if(status === 'OK'){
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();
        ajax('/register', 'post', {zip:zip, name:name, email:email, password:password, coordinates:[lat, lng]}, obj=>{
          window.location= '/profile/${obj._id}/setup';
        });
      }
    });
    e.preventDefault();
  }

})();

function ajax(url, type, data={}, success=r=>console.log(r), dataType='json'){
  'use strict';
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}
