import '../scss/main.scss';

import loaded from './assets/preloader.js';
// import { smoother } from './animations/animations.jsx';
// import { initFormValidation } from './assets/validate-form.js';
import { dynamicAdaptive } from './assets/dynamic-adaptive.js';

// import { anchorsSmoothScrolling } from './assets/anchors-smooth-scrolling.js';
// import { validateChecked } from './assets/validate-checked.js';
// import { select } from './assets/itsSelect.js';

import {
  //todo Временно отключен - dragAndDrop,

  //todo Временно отключен - showButton,
  sideBarLoyuts,
  buttonSearch,
  // toggleModal,
} from './layouts/layouts.js';

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (!isMobile) {
  // smoother();
}
loaded('.preloader');
buttonSearch();
sideBarLoyuts();
dynamicAdaptive();
// document.addEventListener('DOMContentLoaded', () => {
//   const element = document.querySelector('.className');
//   if (condition) {
//   }
// });
//todo Временно отключен - showButton();

// toggleModal();

document.addEventListener('DOMContentLoaded', () => {
  //todo Временно отключен -  dragAndDrop();

  const element = document.querySelector('.map-widget-layout-view__maps-links');
  console.log(element);
});
