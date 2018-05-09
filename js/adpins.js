'use strict';
// Модуль обработки дополнительных меток
(function () {
  var mapPinBlockElement = document.querySelector('.map__pins');
  // Создание DOM-элемента метки с использованием объекта объявления
  var createPinElement = function (ad) {
    // Копирование шаблона
    var pinElement = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);

    var pinPictureElement = pinElement.querySelector('img');
    // Заполнение данными
    pinPictureElement.src = ad.author.avatar;
    pinPictureElement.alt = ad.offer.title;
    pinElement.style.left = ad.location.x - Math.ceil(pinElement.offsetLeft / 2) + 'px';
    pinElement.style.top = ad.location.y - pinElement.offsetTop + 'px';

    return pinElement;
  };

  var renderPins = function (ads) {
    // Создание фрагмента
    var fragmentElement = document.createDocumentFragment();
    // Создание меток и добавление во фрагмент
    ads.forEach(function (ad) {
      fragmentElement.appendChild(createPinElement(ad));
    });

    return fragmentElement;
  };

  var addClickListener = function (element, ad) {
    element.addEventListener('click', function () {
      window.adCard.open(ad);
    });
  };

  window.adPins = {
    // Создание меток
    create: function (ads) {
      // Отрисовка сгенерированных DOM-элементов меток в блок .map__pins
      mapPinBlockElement.appendChild(renderPins(ads));
      // Отбор созданных меток
      var pins = mapPinBlockElement.querySelectorAll('.map__pin');
      // Добавление обработчиков на созданные метки
      // Принимаем, что объявления в массиве хранятся в порядке отрисовки меток
      // pins[0] - это главная метка mainPin
      for (var i = 1; i < pins.length; i++) {
        addClickListener(pins[i], ads[i - 1]);
      }
    },
    // Удаление меток
    remove: function () {
      var pins = mapPinBlockElement.querySelectorAll('.map__pin');
      for (var i = 1; i < pins.length; i++) {
        mapPinBlockElement.removeChild(pins[i]);
      }
    }
  };
})();
