//* ✅ import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

//* ✅ Слайдер новостей на Главной странице
export function partnerSlide(slide) {
  if (slide) {
    new Swiper(slide, {
      effect: 'slide',
      lazy: true,
      spaceBetween: 5,
      navigation: {
        nextEl: '.btn-next',
        prevEl: '.btn-prev',
      },
      slidesPerView: 5,
      speed: 800,
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
      },
      // loop: true,
      grabCursor: true,
      centeredSlides: false,
      breakpoints: {
        0: { slidesPerView: 2 },
        425: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1140: { slidesPerView: 5 },
      },
    });
  }
}

export function thumbSlide(params) {}
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
    1024: { slidesPerView: 5 },
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
//* ✅ Слайдер карточки товара
// export function cardSlide(slide = '.card-slide') {
//   if (slide) {
//     // ⚠️ Функция для определения количества слайдов на основе количества элементов
//     function getSlidesPerView() {
//       const thumbContainer = document.querySelector('.card-thumb');
//       if (!thumbContainer) return 5;

//       const slides = thumbContainer.querySelectorAll('.swiper-slide');
//       const totalSlides = slides.length;

//       // ⚠️ Показываем все если их 3 или меньше, иначе показываем 4
//       return totalSlides <= 3 ? totalSlides : 3;
//     }

//     let swiper = new Swiper('.card-thumb', {
//       spaceBetween: 2,
//       speed: 500,
//       slidesPerView: getSlidesPerView(),
//       freeMode: true,
//       watchSlidesProgress: true,
//       updateOnWindowResize: true,

//       navigation: {
//         nextEl: '.btn-next',
//         prevEl: '.btn-prev',
//       },
//       breakpoints: {
//         0: { slidesPerView: 3 },
//         325: { slidesPerView: 4 },
//         490: { slidesPerView: 3 },
//         786: { slidesPerView: 4 },
//         1025: { slidesPerView: 5 },
//       },
//     });

//     new Swiper('.card-product__slide', {
//       spaceBetween: 15,
//       speed: 800,
//       grabCursor: true,
//       loop: true,
//       slidesPerView: 1,
//       updateOnWindowResize: true,

//       thumbs: {
//         swiper: swiper,
//       },
//     });

//     // ⚠️ Обновляем при изменении DOM (если слайды могут динамически добавляться)
//     const observer = new MutationObserver(() => {
//       swiper.params.slidesPerView = getSlidesPerView();
//       swiper.update();
//     });

//     const thumbContainer = document.querySelector('.card-thumb');
//     if (thumbContainer) {
//       observer.observe(thumbContainer, { childList: true, subtree: true });
//     }
//   }
// }
