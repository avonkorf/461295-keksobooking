'use strict';
// Модуль для работы с формой заполнения объявлений
(function () {
  // Константы и словари
  var ENTER_KEY = 13;
  var minPriceToType = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  var errorToRoomNumber = {
    '1': 'в 1 комнате размещается 1 гость',
    '2': 'в 2 комнатах размещаются 2 и менее гостей',
    '3': 'в 3 комнатах размещаются 3 и менее гостей',
    '100': 'для 100 комнат выберите «не для гостей»'
  };
  var errorToGuestNumber = {
    '1': '1 гость размещается в 1, 2 или 3 комнатах',
    '2': '2 гостя размещаются в 2 или 3 комнатах',
    '3': '3 гостя размещаются в 3 комнатах',
    '0': 'для количества мест «не для гостей» выберите 100 комнат'
  };
  // Основные элементы формы заполнения объявлений
  var adFormElement = document.querySelector('.ad-form');
  var timeInElement = adFormElement.querySelector('#timein');
  var timeOutElement = adFormElement.querySelector('#timeout');
  var typeElement = adFormElement.querySelector('#type');
  var roomNumberElement = adFormElement.querySelector('#room_number');
  var capacityElement = adFormElement.querySelector('#capacity');
  var fieldsetElements = adFormElement.querySelectorAll('fieldset');
  var submitElement = adFormElement.querySelector('.ad-form__submit');
  var resetElement = adFormElement.querySelector('.ad-form__reset');
  // Проверка соответствия количеств комнат и гостей
  var checkCapacity = function () {
    var room = window.formUtils.getSelected(roomNumberElement);
    var guest = window.formUtils.getSelected(capacityElement);
    if ((room < guest) || (room !== '100' & guest === '0') || (room === '100' & guest !== '0')) {
      roomNumberElement.setCustomValidity('Измените количество комнат: ' +
        errorToRoomNumber[room] + ' - или гостей: ' + errorToGuestNumber[guest]);
    } else {
      roomNumberElement.setCustomValidity('');
    }
  };
  // Установка цены в зависимости от выбранного типа жилья
  var setMinPrice = function () {
    var priceElement = adFormElement.querySelector('#price');
    // Получение минимальной цены для типа жилья
    var minPrice = minPriceToType[window.formUtils.getSelected(typeElement)];
    // Установка атрибутам min и placeholder полученного значения для поля формы price
    priceElement.min = minPrice;
    priceElement.placeholder = minPrice;
  };
  // Всмопомогательная функция для синхронизации времен заезда и выезда
  var setTime = function (element, newValue) {
    element.value = newValue;
  };
  // Обработчик событий
  var onTypeElementChange = function () {
    setMinPrice();
  };

  var onTimeInElementChange = function () {
    setTime(timeOutElement, window.formUtils.getSelected(timeInElement));
  };

  var onTimeOutElementChange = function () {
    setTime(timeInElement, window.formUtils.getSelected(timeOutElement));
  };

  var onRoomNumberElementChange = function () {
    checkCapacity();
  };

  var onCapacityElementfunctionChange = function () {
    checkCapacity();
  };

  var onSubmitElementClick = function (evt) {
    evt.preventDefault();
    window.backend.sendForm();
  };

  var onResetElementClick = function (evt) {
    evt.preventDefault();
    window.bookingpage.deactivate();
  };

  var onResetElementKeyup = function (evt) {
    evt.preventDefault();
    if (evt.keyCode === ENTER_KEY) {
      window.bookingpage.deactivate();
    }
  };

  var onSubmitElementKeyup = function (evt) {
    evt.preventDefault();
    if (evt.keyCode === ENTER_KEY) {
      window.backend.sendForm();
    }
  };
  // Для удобства вынесем все установки событий в отдельную функцию
  var setElementsListeners = function () {
    typeElement.addEventListener('change', onTypeElementChange);
    timeInElement.addEventListener('change', onTimeInElementChange);
    timeOutElement.addEventListener('change', onTimeOutElementChange);
    roomNumberElement.addEventListener('change', onRoomNumberElementChange);
    capacityElement.addEventListener('change', onCapacityElementfunctionChange);
    submitElement.addEventListener('click', onSubmitElementClick);
    submitElement.addEventListener('keyup', onSubmitElementKeyup);
    resetElement.addEventListener('click', onResetElementClick);
    resetElement.addEventListener('keyup', onResetElementKeyup);
  };
  // Для удобства вынесем все удаления событий в отдельную функцию
  var removeElementsListeners = function () {
    typeElement.removeEventListener('change', onTypeElementChange);
    timeInElement.removeEventListener('change', onTimeInElementChange);
    timeOutElement.removeEventListener('change', onTimeOutElementChange);
    roomNumberElement.removeEventListener('change', onRoomNumberElementChange);
    capacityElement.removeEventListener('change', onCapacityElementfunctionChange);
    submitElement.removeEventListener('click', onSubmitElementClick);
    submitElement.removeEventListener('keyup', onSubmitElementKeyup);
    resetElement.removeEventListener('click', onResetElementClick);
    resetElement.removeEventListener('keyup', onResetElementKeyup);
  };

  window.formAd = {
    // Свойство элемента формы
    element: adFormElement,
    // Метод активации формы
    activate: function () {
      this.setAddress(true);
      adFormElement.classList.remove('ad-form--disabled');
      window.formUtils.changeElementsMode(fieldsetElements, false);
      setElementsListeners();
    },
    // Метод валидации формы
    checkValidity: function () {
      var result = true;
      var elements = adFormElement.elements;

      for (var i = 0; i < elements.length; i++) {
        if (!elements[i].checkValidity()) {
          elements[i].style.border = '3px solid red';
          result = false;
        } else {
          elements[i].style.border = '';
        }
      }

      return result;
    },
    // Метод деактиктивации формы
    deactivate: function () {
      adFormElement.reset();
      this.setAddress(false);
      // надо бы сбросить проверки полей
      removeElementsListeners();
      adFormElement.classList.add('ad-form--disabled');
      window.formUtils.changeElementsMode(fieldsetElements, true);
    },
    // Метод установки адерса по координатам главной метки
    setAddress: function (isPageActive) {
      var address = null;

      if (isPageActive) {
        address = window.mainPin.getSharpEndCoords();
      } else {
        address = window.mainPin.getCentreCoords();
      }

      adFormElement.querySelector('#address').value = address.abscissa + ', ' + address.ordinata;
    },
    // Метод установки начальных настроек формы
    setInitialMode: function () {
      window.formUtils.changeElementsMode(fieldsetElements, true);
      this.setAddress(false);
      setMinPrice();
      checkCapacity();
    }
  };
})();
