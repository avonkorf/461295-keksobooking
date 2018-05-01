'use strict';

(function () {
  // Создание объекта объявления
  var createAd = function (numberOfAds, dataOfAd) {
    var randomX = window.utils.getRandomNumber(dataOfAd.abscissa.low, dataOfAd.abscissa.high);
    var randomY = window.utils.getRandomNumber(dataOfAd.ordinate.low, dataOfAd.ordinate.high);

    return {
      author: {
        avatar: 'img/avatars/user0' + numberOfAds + '.png'
      },
      offer: {
        title: dataOfAd.titles[numberOfAds - 1],
        address: randomX + ', ' + randomY,
        price: window.utils.getRandomNumber(dataOfAd.price.low, dataOfAd.price.high),
        type: dataOfAd.types[window.utils.getRandomNumber(0, dataOfAd.types.length)],
        rooms: window.utils.getRandomNumber(dataOfAd.roomsQuantity.low, dataOfAd.roomsQuantity.high),
        guests: window.utils.getRandomNumber(dataOfAd.guestsQuantity.low, dataOfAd.guestsQuantity.high),
        checkin: dataOfAd.checkinTimes[window.utils.getRandomNumber(0, dataOfAd.checkinTimes.length - 1)],
        checkout: dataOfAd.checkoutTimes[window.utils.getRandomNumber(0, dataOfAd.checkoutTimes.length - 1)],
        features: window.utils.getRandomArray(dataOfAd.features),
        description: dataOfAd.description,
        photos: window.utils.shuffleArray(dataOfAd.photosLinks)
      },
      location: {
        x: randomX,
        y: randomY
      }
    };
  };

  // Формирование массива объектов объявлений
  var createAds = function (data) {
    var ads = [];

    for (var i = data.quantity.low; i <= data.quantity.high; i++) {
      ads.push(createAd(i, data));
    }

    return ads;
  };

  // Создание массива меток
  // window.ads = createAds(window.data);
  window.ads = window.data;
})();
