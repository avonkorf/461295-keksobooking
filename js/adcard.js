'use strict';

(function () {
  var TYPES = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Лачуга',
    'palace': 'Дворец'
  };

  //  Создание DOM-элемента объявления с использованием шаблона на основе объекта объявления
  var renderCard = function (ad) {
    var fragmentElement = document.createDocumentFragment();
    var cardElement = window.globalvar.templateElement.content.querySelector('.map__card').cloneNode(true);

    cardElement.querySelector('.popup__title').textContent = ad.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = TYPES[ad.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms +
      ' комнаты для ' + ad.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' +
      ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var featuresBlockElement = cardElement.querySelectorAll('.popup__feature');

    for (var i = 0; i < featuresBlockElement.length; i++) {
      featuresBlockElement[i].classList.add('visually-hidden');
    }

    for (i = 0; i < ad.offer.features.length; i++) {
      cardElement.querySelector('.popup__feature--' + ad.offer.features[i])
          .classList.remove('visually-hidden');
    }

    cardElement.querySelector('.popup__description').textContent = ad.offer.description;

    var picturesBlockElement = cardElement.querySelector('.popup__photos');

    picturesBlockElement.querySelector('img').src = ad.offer.photos[0];

    for (i = 1; i < ad.offer.photos.length; i++) {
      var newPictureElement = picturesBlockElement.querySelector('img').cloneNode(true);
      newPictureElement.src = ad.offer.photos[i];
      picturesBlockElement.appendChild(newPictureElement);
    }

    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;

    fragmentElement.appendChild(cardElement);

    return fragmentElement;
  };

  window.adCard = {
    remove: function () {
      var articleAd = window.globalvar.mapElement.querySelector('.map__card');
      if (articleAd) {
        window.globalvar.mapElement.removeChild(articleAd);
      }
    },
    close: function () {
      var popupCloseElement = document.querySelector('.popup__close');
      popupCloseElement.addEventListener('click', function () {
        window.adCard.remove();
      });
    },
    open: function (ad) {
      this.remove();
      window.globalvar.mapElement.insertBefore(renderCard(ad), window.globalvar.mapElement.querySelector('.map__filters-container'));
    }
  };
})();
