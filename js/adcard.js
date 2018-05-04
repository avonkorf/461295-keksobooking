'use strict';
// Модуль для обработки карточки объявления
(function () {
  // Константы и словари
  var ESC_KEYCODE = 27;
  var translateToType = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Лачуга',
    'palace': 'Дворец'
  };
  //  Создание DOM-элемента объявления с использованием объекта объявления
  var renderCard = function (ad) {
    // Создание фрагмента
    var fragmentElement = document.createDocumentFragment();
    // Копирование шаблона
    var cardElement = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);
    // Заполнение данными
    // Заголовок
    cardElement.querySelector('.popup__title').textContent = ad.offer.title;
    // Адрес
    cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    // Цена
    cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    // Тип жилья
    cardElement.querySelector('.popup__type').textContent = translateToType[ad.offer.type];
    // Количество комнат и гостей
    cardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms +
      ' комнаты для ' + ad.offer.guests + ' гостей';
    // Время заезда и выезда
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' +
      ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    // Удобства
    var featureElements = cardElement.querySelectorAll('.popup__feature');
    // Сначала скроем все удобства
    for (var i = 0; i < featureElements.length; i++) {
      featureElements[i].classList.add('visually-hidden');
    }
    // Покажем только те, которые есть в объявлении
    for (i = 0; i < ad.offer.features.length; i++) {
      cardElement.querySelector('.popup__feature--' + ad.offer.features[i])
          .classList.remove('visually-hidden');
    }
    // Подробное описание
    cardElement.querySelector('.popup__description').textContent = ad.offer.description;
    // Фотографии
    var picturesBlockElement = cardElement.querySelector('.popup__photos');

    picturesBlockElement.querySelector('img').src = ad.offer.photos[0];

    for (i = 1; i < ad.offer.photos.length; i++) {
      var newPictureElement = picturesBlockElement.querySelector('img').cloneNode(true);
      newPictureElement.src = ad.offer.photos[i];
      picturesBlockElement.appendChild(newPictureElement);
    }
    // Аватарка автора
    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;

    fragmentElement.appendChild(cardElement);

    return fragmentElement;
  };
  // Обработчики на закрытие объявления
  var onPopupCloseElementClick = function () {
    window.adCard.remove();
  };

  var onDocumentEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.adCard.remove();
    }
  };

  window.adCard = {
    // Метод открытия объявления
    open: function (ad) {
      this.remove();
      window.bookingpage.mapElement.insertBefore(renderCard(ad),
          window.bookingpage.mapElement.querySelector('.map__filters-container'));
      var popupCloseElement = document.querySelector('.popup__close');
      popupCloseElement.addEventListener('click', onPopupCloseElementClick);
      document.addEventListener('keydown', onDocumentEscPress);
    },
    // Метод удаления объявления, если таковое открыто
    remove: function () {
      var articleAdElement = window.bookingpage.mapElement.querySelector('.map__card');
      if (articleAdElement) {
        window.bookingpage.mapElement.removeChild(articleAdElement);
        document.removeEventListener('keydown', onDocumentEscPress);
      }
    }
  };
})();
