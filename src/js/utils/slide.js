//* ✅ import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

//* ✅ Слайдер новостей на Главной странице
export function reviewsSlide(slide) {
  if (slide) {
    new Swiper(slide, {
      effect: 'slide',
      lazy: true,
      spaceBetween: 10,
      navigation: {
        prevEl: '.btn-prev',
        nextEl: '.btn-next',
        disabledClass: 'disabled',
      },
      slidesPerView: 4,
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
      },
    });
  }
}

export function thumbSlide(params) {
  let swiper = new Swiper('.mySwiper', {
    spaceBetween: 0,
    centeredSlides: false,
    breakpoints: {
      0: { slidesPerView: 3 },
      325: { slidesPerView: 4 },
      490: { slidesPerView: 3 },
      640: { slidesPerView: 4 },
      // 880: { slidesPerView: 4 },
      1080: { slidesPerView: 5 },
      // 1024: { slidesPerView: 5 },
    },
  });
  new Swiper('.mySwiper2', {
    grabCursor: true,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: swiper,
    },
  });
}

//* ✅ Слайдер карточки товара
export function influencersSlide(slide) {
  if (slide) {
    new Swiper(slide, {
      effect: 'slide',
      lazy: true,
      spaceBetween: 10,
      navigation: {
        prevEl: '.btn-prev',
        nextEl: '.btn-next',
        disabledClass: 'disabled',
      },
      slidesPerView: 3,
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
        690: { slidesPerView: 3 },
      },
    });
  }
}
