'use strict';

(function () {
  var mapPinBlockElement = document.querySelector('.map__pins');
  // Создание DOM-элемента метки с использованием шаблона на основе объекта объявления
  var createPinElement = function (ad) {
    var pinElement = window.globalvar.templateElement.content.querySelector('.map__pin').cloneNode(true);
    var pinPictureElement = pinElement.querySelector('img');

    pinPictureElement.src = ad.author.avatar;
    pinPictureElement.alt = ad.offer.title;
    pinElement.style.left = ad.location.x - Math.ceil(pinElement.offsetLeft / 2) + 'px';
    pinElement.style.top = ad.location.y - pinElement.offsetTop + 'px';

    return pinElement;
  };

  var renderPins = function (ads) {
    var fragmentElement = document.createDocumentFragment();

    for (var i = 0; i < ads.length; i++) {
      fragmentElement.appendChild(createPinElement(ads[i]));
    }

    return fragmentElement;
  };

  var addClickListener = function (element, ad) {
    element.addEventListener('click', function () {
      window.adCard.open(ad);
      window.adCard.close();
    });
  };

  // Формирование фрагмента из DOM-элементов меток
  window.adPins = {
    create: function () {
      // Отрисовка сгенерированных DOM-элементов меток в блок .map__pins
      mapPinBlockElement.appendChild(renderPins(window.ads));
      // Отбор созданных меток
      var pins = mapPinBlockElement.querySelectorAll('.map__pin');
      // Добавление обработчиков на созданные метки
      // Принимаем, что объявления в массиве хранятся в порядке отрисовки меток
      // pins[0] - это главная метка mainPin
      for (var i = 1; i < pins.length; i++) {
        addClickListener(pins[i], window.ads[i - 1]);
      }
    },
    remove: function () {
      var pins = mapPinBlockElement.querySelectorAll('.map__pin');
      for (var i = 1; i < pins.length; i++) {
        mapPinBlockElement.removeChild(pins[i]);
      }
    }
  };
})();
