'use strict';
// Модуль для обработки загрузки данных объявлений и отправки данных формы
(function () {
  // Константы
  var URL_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL_FORM = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var SUCCESS_MESSAGE = 200;
  // Отрисовка ошибок при работе с сервером
  var getError = function (errorMessage) {
    window.bookingpage.deactivate();

    var errorElement = document.createElement('div');
    var errorMessageElement = document.createElement('p');

    errorElement.classList.add('error');
    errorMessageElement.classList.add('error__message');

    errorMessageElement.textContent = errorMessage;

    errorElement.appendChild(errorMessageElement);
    document.body.insertAdjacentElement('beforeend', errorElement);

    errorElement.addEventListener('click', function () {
      document.querySelector('body').removeChild(errorElement);
    });
  };
  // Отображение сообщения об успешной отправке данных на сервер
  var showSuccessMessage = function () {
    var successElement = document.querySelector('.success');

    var onSuccessElementClick = function () {
      successElement.classList.add('hidden');
      successElement.removeEventListener('click', onSuccessElementClick);
    };

    window.bookingpage.deactivate();
    successElement.classList.remove('hidden');

    successElement.addEventListener('click', onSuccessElementClick);
  };

  // Определение глобального массива с объектами объявлений
  var setData = function (data) {
    window.backend.data = data;
  };

  window.backend = {
    // Метод загрузки данных с сервера
    load: function () {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_MESSAGE) {
          setData(xhr.response);
        } else {
          getError('Ошибка при выгрузке данных с сервера: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        getError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        getError('Данные объявлений не загружены с сервера за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = TIMEOUT;

      xhr.open('GET', URL_DATA);
      xhr.send();
    },
    // Метод отправки данных на сервер
    sendForm: function () {
      if (window.formAd.checkValidity()) {
        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', function () {
          if (xhr.status === SUCCESS_MESSAGE) {
            showSuccessMessage();
          } else {
            getError('Ошибка при передаче данных на сервер: ' + xhr.status + ' ' + xhr.statusText);
          }
        });

        xhr.addEventListener('error', function () {
          getError('Произошла ошибка соединения');
        });

        xhr.addEventListener('timeout', function () {
          getError('Данные не отправлены за ' + xhr.timeout + 'мс');
        });

        xhr.timeout = TIMEOUT;

        xhr.open('POST', URL_FORM);
        xhr.send(new FormData(window.formAd.element));
      }
    }
  };
})();
