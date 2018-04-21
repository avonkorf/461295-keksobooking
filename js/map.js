'use strict';

// Данные для формирования объявлений
var INITIAL_DATA = {
  quantity: {
    low: 1,
    high: 8
  },
  abscissa: {
    low: 300,
    high: 900
  },
  ordinate: {
    low: 150,
    high: 500
  },
  price: {
    low: 1000,
    high: 1000000
  },
  roomsQuantity: {
    low: 1,
    high: 5
  },
  guestsQuantity: {
    low: 1,
    high: 100
  },
  description: '',
  titles: ['Большая уютная квартира', 'Маленькая неуютная квартира',
    'Огромный прекрасный дворец', 'Маленький ужасный дворец',
    'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  types: ['palace', 'flat', 'house', 'bungalo'],
  checkinTimes: ['12:00', '13:00', '14:00'],
  checkoutTimes: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator',
    'conditioner'],
  photosLinks: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
};

var DICTIONARY_TYPE = {
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало',
  'palace': 'Дворец'
};

var MIN_PRICE_TYPE_PRICE = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

var URL = 'https://js.dump.academy/keksobooking';

var PAGE_MODE = false;
var ENTER_KEY = 13;

var sectionMap = document.querySelector('.map');
var divMapPin = document.querySelector('.map__pins');
var formAd = document.querySelector('.ad-form');
var elementTemplate = document.querySelector('template');
var divSuccess = document.querySelector('.success');
var buttonMainPin = sectionMap.querySelector('.map__pin--main');
var fieldsetsFormAd = formAd.querySelectorAll('fieldset');
var inputAddress = formAd.querySelector('#address');
var inputPrice = formAd.querySelector('#price');
var inputTimeIn = formAd.querySelector('#timein');
var inputTimeOut = formAd.querySelector('#timeout');
var selectType = formAd.querySelector('#type');
var selectRoomNumber = formAd.querySelector('#room_number');
var selectCapacity = formAd.querySelector('#capacity');
var buttonSubmit = formAd.querySelector('.ad-form__submit');
var buttonReset = formAd.querySelector('.ad-form__reset');

var buttonMainPinInitialCoords = {
  x: '570px',
  y: '375px'
};

// Генерация случайных чисел от min до max
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Формирование массива случайной длины >= 1 из значений другого массива (возможны повторения)
var getRandomArray = function (array) {
  var length = getRandomNumber(1, array.length);
  var newArray = [];

  for (var i = 0; i < length; i++) {
    newArray.push(array[getRandomNumber(0, array.length - 1)]);
  }

  return newArray;
};

// Перемешивание массива без изменения исходного массива
var shuffleArray = function (array) {
  var assistentArray = [];
  var newArray = [];

  for (var i = 0; i < array.length; i++) {
    assistentArray.push(array[i]);
  }

  for (i = 0; i < array.length; i++) {
    var newIndex = getRandomNumber(0, assistentArray.length - 1);
    newArray[i] = assistentArray[newIndex];
    assistentArray.splice(newIndex, 1);
  }

  return newArray;
};

// Создание объекта объявления
var createAd = function (numberOfAds, dataOfAd) {
  var randomX = getRandomNumber(dataOfAd.abscissa.low, dataOfAd.abscissa.high);
  var randomY = getRandomNumber(dataOfAd.ordinate.low, dataOfAd.ordinate.high);

  return {
    author: {
      avatar: 'img/avatars/user0' + numberOfAds + '.png'
    },
    offer: {
      title: dataOfAd.titles[numberOfAds - 1],
      address: randomX + ', ' + randomY,
      price: getRandomNumber(dataOfAd.price.low, dataOfAd.price.high),
      type: dataOfAd.types[getRandomNumber(0, dataOfAd.types.length)],
      rooms: getRandomNumber(dataOfAd.roomsQuantity.low, dataOfAd.roomsQuantity.high),
      guests: getRandomNumber(dataOfAd.guestsQuantity.low, dataOfAd.guestsQuantity.high),
      checkin: dataOfAd.checkinTimes[getRandomNumber(0, dataOfAd.checkinTimes.length - 1)],
      checkout: dataOfAd.checkoutTimes[getRandomNumber(0, dataOfAd.checkoutTimes.length - 1)],
      features: getRandomArray(dataOfAd.features),
      description: dataOfAd.description,
      photos: shuffleArray(dataOfAd.photosLinks)
    },
    location: {
      x: randomX,
      y: randomY
    }
  };
};

// Формирование массива объектов объявлений
var createAds = function (data) {
  var newAds = [];

  for (var i = data.quantity.low; i <= data.quantity.high; i++) {
    newAds.push(createAd(i, data));
  }

  return newAds;
};

// Создание DOM-элемента метки с использованием шаблона на основе объекта объявления
var createPinElement = function (objectAd) {
  var pinElement = elementTemplate.content.querySelector('.map__pin').cloneNode(true);
  var picture = pinElement.querySelector('img');

  picture.src = objectAd.author.avatar;
  picture.alt = objectAd.offer.title;
  pinElement.style.left = objectAd.location.x + parseInt(picture.width / 2, 10) + 'px';
  pinElement.style.top = objectAd.location.y + parseInt(picture.height, 10) + 'px';

  return pinElement;
};

// Формирование фрагмента из DOM-элементов меток
var renderPinFragment = function (arrayPins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arrayPins.length; i++) {
    fragment.appendChild(createPinElement(arrayPins[i]));
  }

  return fragment;
};

//  Создание DOM-элемента объявления с использованием шаблона на основе объекта объявления
var renderCardFragment = function (objectOfAd, dictionaryType) {
  var fragment = document.createDocumentFragment();
  var newElement = elementTemplate.content.querySelector('.map__card').cloneNode(true);

  newElement.querySelector('.popup__title').textContent = objectOfAd
      .offer.title;
  newElement.querySelector('.popup__text--address').textContent = objectOfAd.offer.address;
  newElement.querySelector('.popup__text--price').textContent = objectOfAd.offer.price + '₽/ночь';
  newElement.querySelector('.popup__type').textContent = dictionaryType[objectOfAd.offer.type];
  newElement.querySelector('.popup__text--capacity').textContent = objectOfAd.offer.rooms +
    ' комнаты для ' + objectOfAd.offer.guests + ' гостей';
  newElement.querySelector('.popup__text--time').textContent = 'Заезд после ' +
    objectOfAd.offer.checkin + ', выезд до ' + objectOfAd.offer.checkout;

  var featuresBlock = newElement.querySelectorAll('.popup__feature');
  for (var i = 0; i < featuresBlock.length; i++) {
    featuresBlock[i].classList.add('visually-hidden');
  }

  for (i = 0; i < objectOfAd.offer.features.length; i++) {
    newElement.querySelector('.popup__feature--' + objectOfAd.offer.features[i])
        .classList.remove('visually-hidden');
  }

  newElement.querySelector('.popup__description').textContent = objectOfAd.offer.description;

  var blockPictures = newElement.querySelector('.popup__photos');
  blockPictures.querySelector('img').src = objectOfAd.offer.photos[0];

  for (i = 1; i < objectOfAd.offer.photos.length; i++) {
    var newPicture = blockPictures.querySelector('img').cloneNode(true);
    newPicture.src = objectOfAd.offer.photos[i];
    blockPictures.appendChild(newPicture);
  }

  newElement.querySelector('.popup__avatar').src = objectOfAd.author.avatar;

  fragment.appendChild(newElement);

  return fragment;
};

// Активация / Деактивация полей
var deactivateElements = function (elements, isNotActive) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = isNotActive;
  }
};

// Определение адреса
var defineFormAddress = function (element, isActive) {
  var picture = element.querySelector('img');
  var coordX = parseInt(element.style.left, 10) + Math.ceil(picture.width / 2);
  var coordY = parseInt(element.style.top, 10) + Math.ceil(picture.height / 2);

  if (isActive) {
    coordX = parseInt(buttonMainPinInitialCoords.x, 10) + parseInt(picture.width, 10);
    coordY = parseInt(buttonMainPinInitialCoords.y, 10) + parseInt(picture.height, 10);
  }

  inputAddress.value = coordX + ', ' + coordY;
};

var removeArticle = function (article) {
  if (article) {
    sectionMap.removeChild(article);
  }
};

var listenMainPin = function () {
  buttonMainPin.addEventListener('mouseup', onButtonMainPinMouseup);
};

// Активация страницы
var changePageMode = function (isActive) {
  if (isActive) {
    defineFormAddress(buttonMainPin, isActive);
    sectionMap.classList.remove('map--faded');
    formAd.classList.remove('ad-form--disabled');
    deactivateElements(fieldsetsFormAd, !isActive);
  } else {
    var articleAd = sectionMap.querySelector('.map__card');
    removeArticle(articleAd);
    var pins = divMapPin.querySelectorAll('.map__pin');
    for (var i = 1; i < pins.length; i++) {
      divMapPin.removeChild(pins[i]);
    }
    formAd.reset();
    buttonMainPin.style.left = buttonMainPinInitialCoords.x;
    buttonMainPin.style.top = buttonMainPinInitialCoords.y;
    defineFormAddress(buttonMainPin, !isActive);
    selectRoomNumber.setCustomValidity('');
    deactivateElements(fieldsetsFormAd, isActive);
    sectionMap.classList.add('map--faded');
    formAd.classList.add('ad-form--disabled');
    listenMainPin();
  }
};

var openPopupAd = function (dataOfAd) {
  var articleAd = sectionMap.querySelector('.map__card');
  removeArticle(articleAd);
  sectionMap.insertBefore(renderCardFragment(dataOfAd, DICTIONARY_TYPE), sectionMap.querySelector('.map__filters-container'));
};

var closePopupAd = function () {
  var articleAd = sectionMap.querySelector('.map__card');
  var buttonToClosePopup = articleAd.querySelector('.popup__close');
  buttonToClosePopup.addEventListener('click', function () {
    removeArticle(articleAd);
  });
};

var addClickListener = function (element, ad) {
  element.addEventListener('click', function () {
    openPopupAd(ad);
    closePopupAd();
  });
};

var showPins = function () {
  // Создание массива меток
  var ads = createAds(INITIAL_DATA);
  // Отрисовка сгенерированных DOM-элементов меток в блок .map__pins
  divMapPin.appendChild(renderPinFragment(ads));
  // Отбор созданных меток
  var pins = divMapPin.querySelectorAll('.map__pin');
  // Добавление обработчиков на созданные метки
  // На данном этапе принимаем, что объявления в массиве хранятся в порядке отрисовки меток
  for (var i = 1; i < pins.length; i++) {
    addClickListener(pins[i], ads[i - 1]);
  }
};

var onButtonMainPinMouseup = function () {
  changePageMode(true);
  buttonMainPin.removeEventListener('mouseup', onButtonMainPinMouseup);
  showPins();
};

var getSelected = function (select) {
  return select.options[select.selectedIndex].value;
};

var setMinPrice = function () {
  // Получение минимальной цены для типа жилья
  var minPrice = MIN_PRICE_TYPE_PRICE[getSelected(selectType)];
  // Установка атрибутам min и placeholder полученного значения для поля формы price
  inputPrice.min = minPrice;
  inputPrice.placeholder = minPrice;
};

var setTime = function (element, newValue) {
  element.value = newValue;
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
  var room = getSelected(selectRoomNumber);
  var guest = getSelected(selectCapacity);
  if ((room < guest) || (room !== '100' & guest === '0') || (room === '100' & guest !== '0')) {
    selectRoomNumber.setCustomValidity('Измените количество комнат: ' +
      getErrorRoom(room) + ' - или гостей: ' + getErrorGuest(guest));
  } else {
    selectRoomNumber.setCustomValidity('');
  }
};

var sendForm = function () {
  if (formAd.isValid()) {
    formAd.submit();
    PAGE_MODE = false;
    changePageMode(PAGE_MODE);
    divSuccess.classList.remove('hidden');
  }
};

var clearForm = function () {
  PAGE_MODE = false;
  changePageMode(PAGE_MODE);
};

// Определение адреса сервера для отправки формы
formAd.action = URL;
// Предварительная деактивация полей формы
deactivateElements(fieldsetsFormAd, !PAGE_MODE);
// Определение адреса по умолчанию по координатам главной метки
defineFormAddress(buttonMainPin, PAGE_MODE);
// Обработчик события mouseup главной метки
listenMainPin();
// Изменение минимальной цены в зависимости от типа жилья
setMinPrice();
selectType.addEventListener('change', function () {
  setMinPrice();
});
// Синхронизация заезда и выезда
// Если меняется значение заезда на value, то надо поменять выезд на тот же value
inputTimeIn.addEventListener('change', function () {
  setTime(inputTimeOut, getSelected(inputTimeIn));
});
// И наоборот
inputTimeOut.addEventListener('change', function () {
  setTime(inputTimeIn, getSelected(inputTimeOut));
});

// Синхронизация комнат и гостей
checkCapacity(selectRoomNumber);
selectRoomNumber.addEventListener('change', function () {
  checkCapacity();
});

selectCapacity.addEventListener('change', function () {
  checkCapacity();
});

buttonSubmit.addEventListener('click', function (evt) {
  sendForm();
  evt.preventDefault();
});

buttonSubmit.addEventListener('keyup', function (evt) {
  if (evt.keyCode === ENTER_KEY) {
    sendForm();
  }
  evt.preventDefault();
});

buttonReset.addEventListener('click', function (evt) {
  clearForm();
  evt.preventDefault();
});

buttonReset.addEventListener('keyup', function (evt) {
  if (evt.keyCode === ENTER_KEY) {
    clearForm();
  }
  evt.preventDefault();
});
