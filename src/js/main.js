import '../scss/main.scss';
import { maskPhone } from './assets/mask-phone.js';
import { dynamicAdaptive } from './assets/dynamic-adaptive.js';
import { reviewsSlide, thumbSlide } from './utils/slide.js';
import {
  dragAndDrop,
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

cookiesAccept('.cookies-accept', '.cookies-accept__button');
buttonSearch();
sideBarLoyuts();
dynamicAdaptive();
fadeInHeader();

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
  thumbSlide();
  reviewsSlide('.reviews-slide');
  maskPhone('.phone');
});
//* ----------------- [ Блок часто задаваемые вопросы ] ------------------------
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.questions-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.questions-item__trigger');

    trigger.addEventListener('click', () => {
      // 1. Если хотим, чтобы открывался только один за раз - раскомментируй код ниже:

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-active');
        }
      });

      // 2. Переключаем класс на текущем элементе
      item.classList.toggle('is-active');
    });
  });
});
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
Fancybox.bind('[data-fancybox]', {
  // Опции анимации (по умолчанию анимация увеличения из источника уже включена)
  animated: true,
  showClass: 'f-zoomIn',
  hideClass: 'f-zoomOut',
});
