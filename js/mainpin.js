'use strict';

(function () {
  var INITIAL_COORDINATES = {
    abscissa: 570,
    ordinata: 375
  };

  var MOVING_VERTICAL_BORDERS = {
    minOrdinata: 150,
    maxOrdinata: 500
  };

  var mainPinElement = window.globalvar.mapElement.querySelector('.map__pin--main');

  var getSize = function () {
    return {
      width: mainPinElement.offsetWidth,
      height: mainPinElement.offsetHeight,
      widthHalf: Math.ceil(mainPinElement.offsetWidth / 2),
      heightHalf: Math.ceil(mainPinElement.offsetHeight / 2)
    };
  };
  /*
  var getInitialAbscissa = function () {
    var mapLeftBorder = window.globalvar.mapElement.offsetLeft;
    return mapLeftBorder + window.globalvar.mapElement.offsetWidth + getSize().widthHalf;
  };
 */
  var getMovingZone = function () {
    var mapLeftBorder = window.globalvar.mapElement.offsetLeft;
    var mapTopBorder = window.globalvar.mapElement.offsetTop;

    return {
      minAbscissa: mapLeftBorder,
      maxAbscissa: mapLeftBorder + window.globalvar.mapElement.offsetWidth,
      minOrdinata: mapTopBorder + MOVING_VERTICAL_BORDERS.minOrdinata,
      maxOrdinata: mapTopBorder + MOVING_VERTICAL_BORDERS.maxOrdinata
    };
  };

  var calculateSharpEndCoords = function (abscissaLeft, ordinataTop) {
    var size = getSize();
    return {
      abscissa: abscissaLeft + size.widthHalf,
      ordinata: ordinataTop + size.height
    };
  };

  var isOutOfMovingZone = function (abscissa, ordinata) {
    var movingZone = getMovingZone();
    var sharpEndAbscissa = calculateSharpEndCoords(abscissa, ordinata).abscissa;
    var sharpEndOrdinata = calculateSharpEndCoords(abscissa, ordinata).ordinata;
    var result = false;

    if (movingZone.minAbscissa <= sharpEndAbscissa && sharpEndAbscissa <= movingZone.maxAbscissa &&
      movingZone.minOrdinata <= sharpEndOrdinata && sharpEndOrdinata <= movingZone.maxOrdinata) {
      result = true;
    }

    return result;
  };

  var onMainPinElementMouseup = function () {
    window.bookingpage.activate();
    mainPinElement.removeEventListener('mouseup', onMainPinElementMouseup);
  };

  var onMainPinElementMouseDown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onDocumentMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var newOffsetLeft = mainPinElement.offsetLeft - shift.x;
      var newOffsetTop = mainPinElement.offsetTop - shift.y;

      if (isOutOfMovingZone(newOffsetLeft, newOffsetTop)) {
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        mainPinElement.style.top = newOffsetTop + 'px';
        mainPinElement.style.left = newOffsetLeft + 'px';

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
    activateMoving: function () {
      mainPinElement.addEventListener('mousedown', onMainPinElementMouseDown);
    },
    deactivateMoving: function () {
      mainPinElement.removeEventListener('mousedown', onMainPinElementMouseDown);
    },
    getCentreCoords: function () {
      var size = getSize();
      return {
        abscissa: mainPinElement.offsetLeft + size.widthHalf,
        ordinata: mainPinElement.offsetTop + size.heightHalf
      };
    },
    getSharpEndCoords: function () {
      return {
        abscissa: calculateSharpEndCoords(mainPinElement.offsetLeft, mainPinElement.offsetTop).abscissa,
        ordinata: calculateSharpEndCoords(mainPinElement.offsetLeft, mainPinElement.offsetTop).ordinata
      };
    },
    listenMouseUp: function () {
      mainPinElement.addEventListener('mouseup', onMainPinElementMouseup);
    },
    setInitialCoords: function () {
      mainPinElement.style.left = INITIAL_COORDINATES.abscissa + 'px';
      mainPinElement.style.top = INITIAL_COORDINATES.ordinata + 'px';
    }
  };
})();
