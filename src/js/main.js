import '../scss/main.scss';
// import { buildSwiper } from './utils/build-swiper.js';
import { cardSlide } from './utils/slide.js';
import { maskPhone } from './assets/mask-phone.js';
import Swiper from 'swiper/bundle';
cookiesAccept('.cookies-accept', '.cookies-accept__button');
// buildSwiper();
// cardSlide();
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
});
//* ----------------------------------------------------------------------------
let swiper = new Swiper('.mySwiper', {
  spaceBetween: 0,
  slidesPerView: 4,
  // watchSlidesProgress: true,
  // updateOnWindowResize: true,
  navigation: {
    nextEl: '.btn-next',
    prevEl: '.btn-prev',
  },
  breakpoints: {
    0: { slidesPerView: 3 },
    325: { slidesPerView: 4 },
    490: { slidesPerView: 3 },
    786: { slidesPerView: 4 },
    1025: { slidesPerView: 5 },
  },
});
new Swiper('.mySwiper2', {
  grabCursor: true,
  spaceBetween: 15,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  thumbs: {
    swiper: swiper,
  },
});
