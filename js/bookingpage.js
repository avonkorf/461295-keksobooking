'use strict';

(function () {
  var activateMap = function () {
    window.globalvar.mapElement.classList.remove('map--faded');
  };

  var deactivateMap = function () {
    window.globalvar.mapElement.classList.add('map--faded');
  };

  window.bookingpage = {
    activate: function () {
      activateMap();
      window.adPins.create();
      window.formAd.activate();
    },
    deactivate: function () {
      window.adCard.remove();
      window.adPins.remove();
      window.mainPin.setInitialCoords();
      deactivateMap();
      window.formAd.deactivate();
      window.mainPin.deactivateMoving();
      window.mainPin.listenMouseUp();
      window.mainPin.activateMoving();
    }
  };
})();
