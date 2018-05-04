'use strict';
// Модуль для обработки главной метки
(function () {
  // Начальные координаты и границы карты
  var InitialCoordinate = {
    ABSCISSA: 570,
    ORDINATA: 375
  };

  var Border = {
    MIN_ABSCISSA: 0,
    MIN_ORDINATA: 150,
    MAX_ORDINATA: 500
  };

  var mainPinElement = document.querySelector('.map__pin--main');
  // Конструктор для создания координат
  var Coordinate = function (abscissa, ordinata) {
    this.abscissa = abscissa;
    this.ordinata = ordinata;
  };
  // Вычисление размеров
  var getSize = function () {
    return {
      width: mainPinElement.offsetWidth,
      height: mainPinElement.offsetHeight,
      widthHalf: Math.ceil(mainPinElement.offsetWidth / 2),
      heightHalf: Math.ceil(mainPinElement.offsetHeight / 2)
    };
  };
  // Определение границ передвижения
  var getMovingZone = function () {
    return {
      minAbscissa: Border.MIN_ABSCISSA,
      maxAbscissa: Border.MIN_ABSCISSA + window.bookingpage.mapElement.offsetWidth,
      minOrdinata: Border.MIN_ORDINATA,
      maxOrdinata: Border.MAX_ORDINATA
    };
  };
  // Вычисление координат острого конца
  var calculateSharpEndCoordinates = function (abscissaLeft, ordinataTop) {
    var size = getSize();
    return new Coordinate(abscissaLeft + size.widthHalf, ordinataTop + size.height);
  };
  // Проверка выхода за границы
  var checkOutOfMovingZone = function (abscissa, ordinata) {
    var movingZone = getMovingZone();
    var sharpEnd = calculateSharpEndCoordinates(abscissa, ordinata);

    return (
      movingZone.minAbscissa <= sharpEnd.abscissa &&
      sharpEnd.abscissa <= movingZone.maxAbscissa &&
      movingZone.minOrdinata <= sharpEnd.ordinata &&
      sharpEnd.ordinata <= movingZone.maxOrdinata
    ) ? true : false;
  };
  // Установка положения главной метки
  var setPosition = function (abscissa, ordinata) {
    mainPinElement.style.left = abscissa + 'px';
    mainPinElement.style.top = ordinata + 'px';
  };
  // Обработчики событий
  var onMainPinElementMouseup = function () {
    window.bookingpage.activate();
    mainPinElement.removeEventListener('mouseup', onMainPinElementMouseup);
  };

  var onMainPinElementMouseDown = function (evt) {
    evt.preventDefault();

    var startCoordinates = new Coordinate(evt.clientX, evt.clientY);

    var onDocumentMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = new Coordinate(startCoordinates.abscissa - moveEvt.clientX,
          startCoordinates.ordinata - moveEvt.clientY);

      var newOffsetLeft = mainPinElement.offsetLeft - shift.abscissa;
      var newOffsetTop = mainPinElement.offsetTop - shift.ordinata;

      if (checkOutOfMovingZone(newOffsetLeft, newOffsetTop)) {
        startCoordinates = new Coordinate(moveEvt.clientX, moveEvt.clientY);

        setPosition(newOffsetLeft, newOffsetTop);

        window.formAd.setAddress(true);
      }
    };

    var onDocumentMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  };

  window.mainPin = {
    // Метод деактивации drag'n'drop
    deactivateMoving: function () {
      mainPinElement.removeEventListener('mousedown', onMainPinElementMouseDown);
    },
    // Метод определения координат центра метки
    getCentreCoordinates: function () {
      var size = getSize();
      return new Coordinate(mainPinElement.offsetLeft + size.widthHalf,
          mainPinElement.offsetTop + size.heightHalf);
    },
    // Метод определения текущих координат острого конца метки
    getSharpEndCoordinates: function () {
      var sharpEnd = calculateSharpEndCoordinates(mainPinElement.offsetLeft, mainPinElement.offsetTop);
      return new Coordinate(sharpEnd.abscissa, sharpEnd.ordinata);
    },
    // Метод для добавления события на первое действие главной метки
    // и активации drag'n'drop
    listen: function () {
      mainPinElement.addEventListener('mouseup', onMainPinElementMouseup);
      mainPinElement.addEventListener('mousedown', onMainPinElementMouseDown);
    },
    // Метод установки начальных координат главной метки
    setInitialPosition: function () {
      setPosition(InitialCoordinate.ABSCISSA, InitialCoordinate.ORDINATA);
    }
  };
})();
