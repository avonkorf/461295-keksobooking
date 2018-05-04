'use strict';
// Модуль дополнительных функций для работы с формами
(function () {
  window.formUtils = {
    // Метод деактивации элементов
    changeElementsMode: function (elements, isNotActive) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = isNotActive;
      }
    },
    // Метод определения выбранной опции селекта
    getSelected: function (select) {
      return select.options[select.selectedIndex].value;
    }
  };
})();
