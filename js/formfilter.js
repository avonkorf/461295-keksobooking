'use strict';

(function () {
  var changeFiltersMode = function (isNotActive) {
    var elements = window.globalvar.mapElement.querySelector('.map__filters').elements;
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = isNotActive;
    }
  };

  window.formFilter = {
    activate: function () {
      changeFiltersMode(false);
    },
    deactivate: function () {
      changeFiltersMode(true);
    }
  };
})();
