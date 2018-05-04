'use strict';
// Главный модуль запуска
(function () {
  window.mainPin.setInitialPosition();
  window.formAd.setInitialMode();
  window.formFilter.deactivate();
  window.backend.load();
  window.mainPin.listen();
})();
