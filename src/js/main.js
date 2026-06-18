import '../scss/main.scss';
import { maskPhone } from './assets/mask-phone.js';
import { dynamicAdaptive } from './assets/dynamic-adaptive.js';
import { reviewsSlide, thumbSlide, influencersSlide } from './utils/slide.js';
import { initButtons } from './assets/3d-button.js';
import fancyBox from './utils/fancyapps.js';

// import dropBoxColapse from './assets/drop-box.js';
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
  influencersSlide('.influencers-slide');
  maskPhone('.phone');
  fancyBox();
});

document.addEventListener('DOMContentLoaded', initButtons);
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

//* ----------------------------------------------------------------------------
import dropBoxColapse from './assets/drop-box.js';

document.addEventListener('DOMContentLoaded', () => {
  // Вызываем всегда. Функция сама решит, когда ей работать!
  dropBoxColapse();
});

// function slideLayout() {
//   const mySwiper = document.querySelector('.mySwiper');
//   const wrapper = mySwiper.querySelector('.swiper-wrapper');
//   const slides = mySwiper.querySelectorAll('.swiper-slide');
//   const slideThumb = document.querySelector('.slide-thumb');
//   console.log(slideThumb);

//   if (slides.length > 4) {
//     // wrapper.style.width = '100%';
//     slideThumb.style.width = '100%';
//     slides.forEach((slide) => {
//       slide.style.width = '60px';
//       console.log('111');
//     });
//   } else {
//     slideThumb.style.width = 'auto';

//     slides.forEach((slide) => {
//       slide.style.width = '60px';
//       console.log('60px !important;');
//     });
//   }
// }
// document.addEventListener('DOMContentLoaded', slideLayout);
