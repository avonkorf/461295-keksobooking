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
  // Основные элементы формы заполнения объявлений
  var adFormElement = document.querySelector('.ad-form');
  var titleElement = adFormElement.querySelector('#title');
  var timeInElement = adFormElement.querySelector('#timein');
  var timeOutElement = adFormElement.querySelector('#timeout');
  var typeElement = adFormElement.querySelector('#type');
  var priceElement = adFormElement.querySelector('#price');
  var roomNumberElement = adFormElement.querySelector('#room_number');
  var capacityElement = adFormElement.querySelector('#capacity');
  var fieldsetElements = adFormElement.querySelectorAll('fieldset');
  var submitElement = adFormElement.querySelector('.ad-form__submit');
  var resetElement = adFormElement.querySelector('.ad-form__reset');
  // Изменение цвета рамки
  var setBorderColor = function (element, color) {
    element.style.border = color;
  };
  // Подсветка проблемного поля и установка пользовательского сообщения
  var setElementCheckResult = function (element, errorMessage) {
    if (errorMessage !== '') {
      element.setCustomValidity(errorMessage);
      setBorderColor(element, '3px solid red');
    } else {
      element.setCustomValidity('');
      setBorderColor(element, '');
    }
  };
  // Проверка заголовка
  var checkTitle = function () {
    if (titleElement.validity.tooShort || titleElement.validity.tooLong) {
      setElementCheckResult(titleElement, 'Длина заголовка равна ' + titleElement.value.length +
        '. Она должна содержать от ' + titleElement.minLength + ' до ' + titleElement.maxLength + ' символов');
    } else {
      setElementCheckResult(titleElement, '');
    }
  };
  // Проверка цены
  var checkPrice = function () {
    if (priceElement.validity.rangeUnderflow) {
      setElementCheckResult(priceElement, 'Для выбранного типа жилья выберите цену от ' + priceElement.min);
    } else {
      setElementCheckResult(priceElement, '');
    }
  };
  // Проверка соответствия количеств комнат и гостей
  var checkCapacity = function (room, guest) {
    return ((room < guest) || (room !== '100' & guest === '0') ||
      (room === '100' & guest !== '0')) ? false : true;
  };
  // Синхронизация количества гостей с количетством комнат
  var setCapacity = function () {
    // Определяем выбранное количество комнат
    var room = window.formUtils.getSelected(roomNumberElement);
    // Определяем выбранный на текущий момент option
    var selectedCapacityElement = capacityElement.options[capacityElement.selectedIndex];
    // Получаем список всех опций по количеству гостей
    var options = capacityElement.options;
    // Устанавливаем флаг о том, что выбранный элемент прошел проверку синхронизации
    // чтобы в дальнейшем оставить его выбранным
    var currentCapacityCheckResult = checkCapacity(room, selectedCapacityElement.value) ? true : false;
    for (var i = 0; i < options.length; i++) {
      var capacityCheckResult = checkCapacity(room, options[i].value);
      if (!currentCapacityCheckResult && capacityCheckResult) {
        // Если подходящая опция еще не выбрана, то выбираем ее
        selectedCapacityElement.selected = false;
        options[i].selected = true;
        currentCapacityCheckResult = true;
      }
      // Если опция не прошла проверку синхронизации, то деакивируем ее
      options[i].disabled = capacityCheckResult ? false : true;
    }
  };
  // Установка цены в зависимости от выбранного типа жилья
  var setMinPrice = function () {
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
  // Обработчики событий
  var onTitleElementInput = function () {
    checkTitle();
  };

  var onTypeElementChange = function () {
    setMinPrice();
  };

  var onPriceElementInput = function () {
    checkPrice();
  };

  var onTimeInElementChange = function () {
    setTime(timeOutElement, window.formUtils.getSelected(timeInElement));
  };

  var onTimeOutElementChange = function () {
    setTime(timeInElement, window.formUtils.getSelected(timeOutElement));
  };

  var onRoomNumberElementChange = function () {
    setCapacity();
  };

  var onSubmitElementClick = function (evt) {
    evt.preventDefault();
    window.backend.sendForm();
  };

  var onResetElementClick = function (evt) {
    evt.preventDefault();
    window.bookingpage.deactivate();
  };

  var onResetElementEnterPress = function (evt) {
    evt.preventDefault();
    if (evt.keyCode === ENTER_KEY) {
      window.bookingpage.deactivate();
    }
  };

  var onSubmitElementEnterPress = function (evt) {
    evt.preventDefault();
    if (evt.keyCode === ENTER_KEY) {
      window.backend.sendForm();
    }
  };
  // Для удобства вынесем все установки событий в отдельную функцию
  var setElementsListeners = function () {
    titleElement.addEventListener('input', onTitleElementInput);
    typeElement.addEventListener('change', onTypeElementChange);
    priceElement.addEventListener('input', onPriceElementInput);
    timeInElement.addEventListener('change', onTimeInElementChange);
    timeOutElement.addEventListener('change', onTimeOutElementChange);
    roomNumberElement.addEventListener('change', onRoomNumberElementChange);
    submitElement.addEventListener('click', onSubmitElementClick);
    submitElement.addEventListener('keyup', onSubmitElementEnterPress);
    resetElement.addEventListener('click', onResetElementClick);
    resetElement.addEventListener('keyup', onResetElementEnterPress);
  };
  // Для удобства вынесем все удаления событий в отдельную функцию
  var removeElementsListeners = function () {
    titleElement.removeEventListener('input', onTitleElementInput);
    typeElement.removeEventListener('change', onTypeElementChange);
    priceElement.removeEventListener('input', onPriceElementInput);
    timeInElement.removeEventListener('change', onTimeInElementChange);
    timeOutElement.removeEventListener('change', onTimeOutElementChange);
    roomNumberElement.removeEventListener('change', onRoomNumberElementChange);
    submitElement.removeEventListener('click', onSubmitElementClick);
    submitElement.removeEventListener('keyup', onSubmitElementEnterPress);
    resetElement.removeEventListener('click', onResetElementClick);
    resetElement.removeEventListener('keyup', onResetElementEnterPress);
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
    checkValidity: function (isPageActive) {
      var result = true;
      var elements = adFormElement.elements;

      for (var i = 0; i < elements.length; i++) {
        if (!elements[i].checkValidity() && isPageActive === true) {
          setBorderColor(elements[i], '3px solid red');
          result = false;
        } else {
          setBorderColor(elements[i], '');
        }
      }

      return result;
    },
    // Метод деактиктивации формы
    deactivate: function () {
      adFormElement.reset();
      this.checkValidity(false);
      removeElementsListeners();
      this.setInitialMode();
      adFormElement.classList.add('ad-form--disabled');
    },
    // Метод установки адерса по координатам главной метки
    setAddress: function (isPageActive) {
      var address = isPageActive ? window.mainPin.getSharpEndCoordinates() :
        window.mainPin.getCentreCoordinates();

      adFormElement.querySelector('#address').value = address.abscissa + ', ' + address.ordinata;
    },
    // Метод установки начальных настроек формы
    setInitialMode: function () {
      window.formUtils.changeElementsMode(fieldsetElements, true);
      this.setAddress(false);
      setMinPrice();
      setCapacity();
    }
  };
})();
