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
      window.formAd.activate();
      activateMap();
      window.formFilter.activate();
      window.adPins.create();
    },
    deactivate: function () {
      window.adCard.close();
      window.adPins.remove();
      window.mainPin.setInitialCoords();
      deactivateMap();
      window.formFilter.deactivate();
      window.formAd.deactivate();
      window.mainPin.deactivateMoving();
      window.mainPin.listenMouseUp();
      window.mainPin.activateMoving();
    }
  };
})();
