'use strict';
// Модуль обработки страницы
(function () {
  var mapElement = document.querySelector('.map');
  // Активация карты
  var activateMap = function () {
    mapElement.classList.remove('map--faded');
  };
  // Деактивация карты
  var deactivateMap = function () {
    mapElement.classList.add('map--faded');
  };

  window.bookingpage = {
    mapElement: mapElement,
    // Активация страницы
    activate: function () {
      window.formAd.activate();
      activateMap();
      window.formFilter.activate();
      window.formFilter.filterInitialPins();
    },
    // Деактивация страницы
    deactivate: function () {
      window.adCard.remove();
      window.adPins.remove();
      window.mainPin.setInitialPosition();
      deactivateMap();
      window.formFilter.deactivate();
      window.formAd.deactivate();
      window.mainPin.deactivateMoving();
      window.mainPin.listen();
    }
  };
})();
