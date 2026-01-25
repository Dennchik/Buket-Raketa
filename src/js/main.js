import '../scss/main.scss';

// import loaded from './assets/preloader.js';
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
  //   maskPhone,
  //   cookiesAccept,
  //   shadowScrollHeader,
  //   sidebarMenuHandle,
  // toggleModal,
  //   lineMarquee,
} from './layouts/layouts.js';

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
// select();
// loaded('.preloader');
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
// shadowScrollHeader();

// toggleModal();
if (!isMobile) {
  smoother();
}
document.addEventListener('DOMContentLoaded', () => {
  dragAndDrop();
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.section-map__image-map');
  const img = container.querySelector('.draggable-img');

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let minX = 0;
  let minY = 0;

  // ❗ Ждём загрузки картинки, чтобы знать её размеры
  if (img.complete) {
    calculateBounds();
  } else {
    img.onload = calculateBounds;
  }

  // Пересчёт границ при ресайзе
  window.addEventListener('resize', calculateBounds);

  function calculateBounds() {
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    minX = containerRect.width - imgRect.width;
    minY = containerRect.height - imgRect.height;

    // если картинка меньше контейнера — центрируем и блокируем ось
    if (minX > 0) minX = 0;
    if (minY > 0) minY = 0;

    currentX = Math.max(minX, Math.min(0, currentX));
    currentY = Math.max(minY, Math.min(0, currentY));

    updatePosition();
  }

  function updatePosition() {
    img.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }

  // ===================
  // 🖱️ MOUSE
  // ===================

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    container.classList.add('grabbing');

    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    container.classList.remove('grabbing');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    currentX = e.clientX - startX;
    currentY = e.clientY - startY;

    currentX = Math.max(minX, Math.min(0, currentX));
    currentY = Math.max(minY, Math.min(0, currentY));

    updatePosition();
  });

  // ===================
  // 📱 TOUCH
  // ===================

  container.addEventListener(
    'touchstart',
    (e) => {
      const touch = e.touches[0];
      isDragging = true;

      startX = touch.clientX - currentX;
      startY = touch.clientY - currentY;
    },
    { passive: true }
  );

  container.addEventListener('touchend', () => {
    isDragging = false;
  });

  container.addEventListener(
    'touchmove',
    (e) => {
      if (!isDragging) return;

      const touch = e.touches[0];

      currentX = touch.clientX - startX;
      currentY = touch.clientY - startY;

      currentX = Math.max(minX, Math.min(0, currentX));
      currentY = Math.max(minY, Math.min(0, currentY));

      updatePosition();
    },
    { passive: true }
  );

  // 🚫 отключаем стандартный drag изображения браузером
  img.addEventListener('dragstart', (e) => e.preventDefault());
});

// document.addEventListener('DOMContentLoaded', () => {
//   validateChecked();
//   cookiesAccept('.cookies-accept', '.cookies-accept__button');
//   lineMarquee('.running-line__marquee');
//   maskPhone('.phone');
// });

// if (isMobile) {
//   const subItems = document.querySelectorAll('.header__sub-item');

//   subItems.forEach((subItem) => {
//     const trigger = subItem.closest('.header__link-key');
//     if (!trigger) return;

//     trigger.addEventListener('click', () => {
//       const hoverItem = subItem.closest('.header__menu-items');

//       if (hoverItem) {
//         const opened = hoverItem.querySelector('.hover');
//         if (opened && opened !== subItem) {
//           opened.classList.remove('hover');
//         }
//       }
//       trigger.classList.toggle('hover');
//     });
//   });
// }
//* ----------------------------------------------------------------------------
console.log(
  '%c РОССИЯ ',
  'background: blue; color: yellow; font-size: x-large; ' +
    'border-left: 5px solid black; border-top: 30px solid white; ' +
    'border-right: 2px solid black; border-bottom: 30px solid red;'
);
// //* ----------------------------------------------------------------------------
