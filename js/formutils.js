'use strict';

(function () {
  window.formUtils = {
    changeElementsMode: function (elements, isNotActive) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = isNotActive;
      }
    },
    getSelected: function (select) {
      return select.options[select.selectedIndex].value;
    }
  };
})();
