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
