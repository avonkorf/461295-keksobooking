'use strict';

(function () {
  window.utils = {
    // Генерация случайных чисел от min до max
    getRandomNumber: function (minNumber, maxNumber) {
      return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    },
    // Формирование массива случайной длины >= 1 из значений другого массива (возможны повторения)
    getRandomArray: function (data) {
      var length = this.getRandomNumber(1, data.length);
      var results = [];

      for (var i = 0; i < length; i++) {
        results.push(data[this.getRandomNumber(0, data.length - 1)]);
      }

      return results;
    },
    // Перемешивание массива без изменения исходного массива
    shuffleArray: function (data) {
      var values = [];
      var results = [];

      for (var i = 0; i < data.length; i++) {
        values.push(data[i]);
      }

      for (i = 0; i < data.length; i++) {
        var newIndex = this.getRandomNumber(0, values.length - 1);
        results[i] = values[newIndex];
        values.splice(newIndex, 1);
      }

      return results;
    }
  };
})();
