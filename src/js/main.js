import '../scss/main.scss';
import { buildSwiper } from './utils/build-swiper.js';
import { cardSlide } from './utils/slide.js';
import { maskPhone } from './assets/mask-phone.js';

cookiesAccept('.cookies-accept', '.cookies-accept__button');
buildSwiper();
cardSlide();
import loaded from './assets/preloader.js';
import { dynamicAdaptive } from './assets/dynamic-adaptive.js';

import {
  //todo Временно отключен -
  dragAndDrop,

  //todo Временно отключен - showButton,
  sideBarLoyuts,
  buttonSearch,
  toggleModalOpen,
  cookiesAccept,
  fadeInHeader,
  selectCity,
} from './layouts/layouts.js';

const requestForm = document.getElementById('requestForm');
if (requestForm) {
  toggleModalOpen();
}

loaded('.preloader');
buttonSearch();
sideBarLoyuts();
dynamicAdaptive();
fadeInHeader();

//todo Временно отключен - showButton();

//* Выбор города
document.addEventListener('DOMContentLoaded', () => {
  const bouquetForm = document.getElementById('bouquet-form');
  const citySelect = document.querySelector('.delivery-products__select-city');
  if (citySelect) {
    selectCity();
  }
  if (bouquetForm) {
    dragAndDrop();
  }
  //todo Временно отключен -
  maskPhone('.phone');
  // const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  // if (!isMobile) {
  // }
});
//* Функция показа отправки формы
// function showDebugCode() {
//   const modal = document.getElementById('verificationModal');

//   // Добавляем класс, чтобы сделать модальное окно видимым
//   modal.classList.add('modal-dialog--is-visible');
//   modal.setAttribute('aria-hidden', 'false'); // Для доступности
//   document.body.style.overflow = 'hidden'; // Запретить прокрутку фона
// }
function showDebugCode() {
  const modal = document.getElementById('bonusCodeModal'); // Модальное окно
  const closeBtn = modal.querySelector('.bonus-code-modal__close-btn'); // Кнопка закрытия
  const overlay = modal.querySelector('.bonus-code-modal__overlay'); // Оверлей

  // Функция для закрытия модального окна
  function closeBonusModal() {
    modal.classList.remove('bonus-code-modal--is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Опционально: очистить код и скрыть блок с ним при закрытии
    const codePlaceholder = document.getElementById('codePlaceholder');
    const bonusCodeDisplay = document.getElementById('bonusCodeDisplay');
    if (bonusCodeDisplay)
      bonusCodeDisplay.classList.remove('bonus-code-display--is-visible');
    if (codePlaceholder) codePlaceholder.textContent = '(здесь будет код)';
  }

  if (closeBtn) {
    closeBtn.onclick = closeBonusModal; // Используем onclick для простоты
  }
  if (overlay) {
    overlay.onclick = closeBonusModal;
  }

  // Делаем модальное окно видимым
  modal.classList.add('bonus-code-modal--is-visible');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

// showDebugCode();
// Бэкендер мог бы вызвать это через WebSocket-сообщение
// или обычный AJAX-ответ, передав code: '1234'
