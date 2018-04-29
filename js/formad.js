'use strict';

(function () {
  var MIN_TYPE_PRICE = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  var ENTER_KEY = 13;

  var adFormElement = document.querySelector('.ad-form');

  var timeInElement = adFormElement.querySelector('#timein');
  var timeOutElement = adFormElement.querySelector('#timeout');
  var typeElement = adFormElement.querySelector('#type');
  var roomNumberElement = adFormElement.querySelector('#room_number');
  var capacityElement = adFormElement.querySelector('#capacity');

  var submitElement = adFormElement.querySelector('.ad-form__submit');
  var resetElement = adFormElement.querySelector('.ad-form__reset');

  var getSelected = function (select) {
    return select.options[select.selectedIndex].value;
  };

  var changeElementsMode = function (isNotActive) {
    var fieldsetElements = adFormElement.querySelectorAll('fieldset');
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = isNotActive;
    }
  };

  var getErrorRoom = function (room) {
    var errorMessage = '';
    switch (room) {
      case '1':
        errorMessage += 'в 1 комнате размещается 1 гость';
        break;
      case '2':
        errorMessage += 'в 2 комнатах размещаются 2 и менее гостей';
        break;
      case '3':
        errorMessage += 'в 3 комнатах размещаются 3 и менее гостей';
        break;
      case '100':
        errorMessage += 'для 100 комнат выберите «не для гостей»';
        break;
    }

    return errorMessage;
  };

  var getErrorGuest = function (guest) {
    var errorMessage = '';
    switch (guest) {
      case '1':
        errorMessage += '1 гость размещается в 1, 2 или 3 комнатах';
        break;
      case '2':
        errorMessage += '2 гостя размещаются в 2 или 3 комнатах';
        break;
      case '3':
        errorMessage += '3 гостя размещаются в 3 комнатах';
        break;
      case '0':
        errorMessage += 'для «не для гостей» выберите 100 комнат';
        break;
    }

    return errorMessage;
  };

  var checkCapacity = function () {
    var room = getSelected(roomNumberElement);
    var guest = getSelected(capacityElement);
    if ((room < guest) || (room !== '100' & guest === '0') || (room === '100' & guest !== '0')) {
      roomNumberElement.setCustomValidity('Измените количество комнат: ' +
        getErrorRoom(room) + ' - или гостей: ' + getErrorGuest(guest));
    } else {
      roomNumberElement.setCustomValidity('');
    }
  };

  var setMinPrice = function () {
    var priceElement = adFormElement.querySelector('#price');
    // Получение минимальной цены для типа жилья
    var minPrice = MIN_TYPE_PRICE[getSelected(typeElement)];
    // Установка атрибутам min и placeholder полученного значения для поля формы price
    priceElement.min = minPrice;
    priceElement.placeholder = minPrice;
  };

  var setTime = function (element, newValue) {
    element.value = newValue;
  };

  var onTypeElementChange = function () {
    setMinPrice();
  };

  var onTimeInElementChange = function () {
    setTime(timeOutElement, getSelected(timeInElement));
  };

  var onTimeOutElementChange = function () {
    setTime(timeInElement, getSelected(timeOutElement));
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
    element: adFormElement,
    activate: function () {
      this.setAddress(true);
      adFormElement.classList.remove('ad-form--disabled');
      changeElementsMode(false);
      setElementsListeners();
    },
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
    deactivate: function () {
      adFormElement.reset();
      this.setAddress(false);
      // надо бы сбросить проверки полей
      removeElementsListeners();
      adFormElement.classList.add('ad-form--disabled');
      changeElementsMode(true);
    },
    setAddress: function (isPageActive) {
      var address = null;

      if (isPageActive) {
        address = window.mainPin.getSharpEndCoords();
      } else {
        address = window.mainPin.getCentreCoords();
      }

      adFormElement.querySelector('#address').value = address.abscissa + ', ' + address.ordinata;
    },
    setInitialMode: function () {
      changeElementsMode(true);
      this.setAddress(false);
      setMinPrice();
      checkCapacity();
    }
  };
})();
