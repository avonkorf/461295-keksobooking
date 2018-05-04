'use strict';
// Модуль для работы с фильтрами дополнительных меток
(function () {
  // Константы и словари
  var MAX_ADS_QUANTITY = 5;
  var RENDER_FREQUENCY = 500;
  var INITIAL_SELECT_VALUE = 'any';
  var priceRangeToPriceElementValue = {
    'low': {
      minValue: 0,
      maxValue: 10000
    },
    'middle': {
      minValue: 10000,
      maxValue: 50000
    },
    'high': {
      minValue: 50000,
      maxValue: Infinity
    }
  };
  // Основные элементы формы фильтров
  var filterFormElement = document.querySelector('.map__filters');
  var typeElement = filterFormElement.querySelector('#housing-type');
  var priceElement = filterFormElement.querySelector('#housing-price');
  var roomsElement = filterFormElement.querySelector('#housing-rooms');
  var guestsElement = filterFormElement.querySelector('#housing-guests');
  var featuresElement = filterFormElement.querySelector('#housing-features');
  // Вспомогательная функция для выбора первых пяти элементов массива
  var getAds = function (data) {
    var ads = [];
    var adsQuantity = data.length >= MAX_ADS_QUANTITY ? MAX_ADS_QUANTITY : data.length;

    for (var i = 0; i < adsQuantity; i++) {
      ads.push(data[i]);
    }

    return ads;
  };
  // Основная функция для фильтрации объявлений
  var filterHandler = function () {
    // Закрытие открытого объявления
    window.adCard.remove();
    // Удаление текущих меток
    window.adPins.remove();
    // Фильтрация
    // Вспомогательная функция для фильтра по удобствам
    var filterFeature = function (advert, featureElement) {
      var filteredFeatures = advert.offer.features.filter(function (feature) {
        return feature === featureElement.value;
      });
      return featureElement.checked ? filteredFeatures.length > 0 : true;
    };
    // Формирование нового массива объявлений с учетом фильтров
    // По нему организовано построение новых меток
    var newAds = window.backend.data.
        // Фильтр по типу жилья
        filter(function (ad) {
          var newType = window.formUtils.getSelected(typeElement);
          return newType === INITIAL_SELECT_VALUE ? true : ad.offer.type === newType;
        }).
        // Фильтр по цене
        filter(function (ad) {
          var newPrice = window.formUtils.getSelected(priceElement);
          return newPrice === INITIAL_SELECT_VALUE ? true :
            priceRangeToPriceElementValue[newPrice].minValue <= ad.offer.price &&
            ad.offer.price <= priceRangeToPriceElementValue[newPrice].maxValue;
        }).
        // Фильтр по количеству комнат
        filter(function (ad) {
          var newRoomsQuantity = window.formUtils.getSelected(roomsElement);
          return newRoomsQuantity === INITIAL_SELECT_VALUE ? true :
            ad.offer.rooms === parseInt(newRoomsQuantity, 10);
        }).
        // Фильтр по количеству гостей
        filter(function (ad) {
          var newGuestsQuantity = window.formUtils.getSelected(guestsElement);
          return newGuestsQuantity === INITIAL_SELECT_VALUE ? true :
            ad.offer.guests === parseInt(newGuestsQuantity, 10);
        }).
        // Фильтры по удобствам
        filter(function (ad) {
          var featureWifiElement = featuresElement.querySelector('#filter-wifi');
          return filterFeature(ad, featureWifiElement);
        }).
        filter(function (ad) {
          var featureDishwasherElement = featuresElement.querySelector('#filter-dishwasher');
          return filterFeature(ad, featureDishwasherElement);
        }).
        filter(function (ad) {
          var featureParkingElement = featuresElement.querySelector('#filter-parking');
          return filterFeature(ad, featureParkingElement);
        }).
        filter(function (ad) {
          var featureWasherElement = featuresElement.querySelector('#filter-washer');
          return filterFeature(ad, featureWasherElement);
        }).
        filter(function (ad) {
          var featureElevatorElement = featuresElement.querySelector('#filter-elevator');
          return filterFeature(ad, featureElevatorElement);
        }).
        filter(function (ad) {
          var featureConditionerElement = featuresElement.querySelector('#filter-conditioner');
          return filterFeature(ad, featureConditionerElement);
        });
    // Отрисовка меток c новыми данными
    window.adPins.create(getAds(newAds));
  };
  // Удаление "дребезга"
  var lastTimeout;
  var debounce = function (filterFunction) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(filterFunction, RENDER_FREQUENCY);
  };
  // Обработчики событий:
  var onTypeElementChange = function () {
    debounce(filterHandler);
  };

  var onPriceElementChange = function () {
    debounce(filterHandler);
  };

  var onRoomsElementChange = function () {
    debounce(filterHandler);
  };

  var onGuestsElementChange = function () {
    debounce(filterHandler);
  };

  var onFeatureElementClick = function () {
    debounce(filterHandler);
  };

  // Для удобства вынесем все установки событий в отдельную функцию
  var setElementsListeners = function () {
    typeElement.addEventListener('change', onTypeElementChange);
    priceElement.addEventListener('change', onPriceElementChange);
    roomsElement.addEventListener('change', onRoomsElementChange);
    guestsElement.addEventListener('change', onGuestsElementChange);
    featuresElement.addEventListener('click', onFeatureElementClick);
  };
  // Для удобства вынесем все удаления событий в отдельную функцию
  var removeElementsListeners = function () {
    typeElement.removeEventListener('change', onTypeElementChange);
    priceElement.removeEventListener('change', onPriceElementChange);
    roomsElement.removeEventListener('change', onRoomsElementChange);
    guestsElement.removeEventListener('change', onGuestsElementChange);
    featuresElement.removeEventListener('click', onFeatureElementClick);
  };

  window.formFilter = {
    // Метод активации формы фильтров
    activate: function () {
      window.formUtils.changeElementsMode(filterFormElement.elements, false);
      setElementsListeners();
    },
    // Метод деактиктивации формы фильтров
    deactivate: function () {
      filterFormElement.reset();
      removeElementsListeners();
      window.formUtils.changeElementsMode(filterFormElement.elements, true);
    },
    // Метод создания дополнительных меток с учетом неустановленных фильтров и ограничения по количеству меток
    filterInitialPins: function () {
      window.adPins.create(getAds(window.backend.data));
    }
  };
})();
