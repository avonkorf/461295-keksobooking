'use strict';

(function () {
  window.mainPin.setInitialCoords();
  window.formAd.setInitialMode();
  window.formFilter.deactivate();
  window.backend.load();
  window.mainPin.activateMoving();
  window.mainPin.listenMouseUp();
})();
