import '../scss/main.scss';

const productsCart = document.querySelector('.products-cart');
const productsCartIimage = document.querySelector('.products-cart__image');
console.log(productsCart);

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
  //   maskPhone,
  //   cookiesAccept,
  //   shadowScrollHeader,
  //   sidebarMenuHandle,
  // toggleModal,
  //   lineMarquee,
} from './layouts/layouts.js';

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

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
dynamicAdaptive();
showButton();
// shadowScrollHeader();

// toggleModal();
if (!isMobile) {
  smoother();
}
document.addEventListener('DOMContentLoaded', () => {
  dragAndDrop();
});
const menuList = document.querySelector('.menu-list');
const burgerButtons = document.querySelectorAll('.burger-button');
const listContent = document.querySelector('.page__menu-list');
const buttons = document.querySelectorAll('.hamburger');
const anchorLinks = menuList.querySelectorAll('.anchor-link');

anchorLinks.forEach((anchorLink) => {
  anchorLink.addEventListener('click', () => {
    document.body.classList.toggle('no-scroll');
    if (menuList.classList.contains('_open-list')) {
      menuList.classList.remove('_open-list');
      listContent.style.backgroundColor = 'transparent';
    }
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('is-active');
    }
  });
});

burgerButtons.forEach((burgerButton) => {
  burgerButton.addEventListener('click', () => {
    const backgroundColorTransparent = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--background-transparent');

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('is-active');
    }
    // burgerButton.firstChild.classList.toggle('is-active');
    menuList.classList.toggle('_open-list');
    document.body.classList.toggle('no-scroll');
    if (menuList.classList.contains('_open-list')) {
      // listContent.style.pointerEvents = 'all';
      listContent.style.backgroundColor = backgroundColorTransparent;
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      listContent.style.backgroundColor = 'transparent';
      // listContent.style.pointerEvents = 'none';
    }
  });
});
