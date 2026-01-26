import '../scss/main.scss';

const productsCart = document.querySelector('.products-cart');
const productsCartIimage = document.querySelector('.products-cart__image');

import loaded from './assets/preloader.js';
loaded('.preloader');

import { smoother } from './animations/animations.jsx';
// import { initFormValidation } from './assets/validate-form.js';
import { dynamicAdaptive } from './assets/dynamic-adaptive.js';

// import { anchorsSmoothScrolling } from './assets/anchors-smooth-scrolling.js';
// import { validateChecked } from './assets/validate-checked.js';
// import { select } from './assets/itsSelect.js';

// import {
//   animateHeader,
//   smoothScrollTitle,
//   fadeInItem,
//   fadeInBlock,
//   fadeInColumn,
//   fadeInItemLeft,
//   fadeInItemRight,
// } from './animations/anime-js.jsx';
import {
  dragAndDrop,
  showButton,
  sideBarLoyuts,
  //   maskPhone,
  //   cookiesAccept,
  //   shadowScrollHeader,
  //   sidebarMenuHandle,
  // toggleModal,
  //   lineMarquee,
} from './layouts/layouts.js';

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (!isMobile) {
  smoother();
}
sideBarLoyuts();
dynamicAdaptive();
showButton();
// select();
// fadeInColumn('.its-col');
// fadeInBlock('.its-block');
// fadeInItem('.its-el');
// fadeInItemLeft('.its-el-left');
// fadeInItemRight('.its-el-right');
// smoothScrollTitle('.el-item');
// initFormValidation();
// animateHeader();
// anchorsSmoothScrolling();
// sidebarMenuHandle();
// shadowScrollHeader();

// toggleModal();

document.addEventListener('DOMContentLoaded', () => {
  dragAndDrop();
});

//* ----------------------------- Button Search --------------------------------
const headerContainer = document.querySelector('.header-container');
// const sectionTop = document.querySelector('.section-top');
const searchButton = document.querySelector('.search-button');

// if (!searchButton) return;
searchButton.addEventListener('click', () => {
  headerContainer.classList.toggle('_active');
  if (sectionTop) {
    if (headerContainer.classList.contains('_active')) {
      // sectionTop.style.paddingTop = '50px';
      sectionTop.style.transition = 'padding-top 0.3s ease-in-out';
    } else {
      // sectionTop.style.paddingTop = '0';
      sectionTop.style.transition = 'padding-top 0.3s ease-in-out';
    }
  }
});
