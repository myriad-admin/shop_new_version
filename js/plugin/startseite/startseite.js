import Plugin from '../../plugin-system/plugin-class.js';

import Swiper from 'swiper';
import { Mousewheel } from 'swiper/modules';

import 'swiper/css';

export default class ProduktDetail extends Plugin {
  constructor(el, options = {}) {
    super(el, {
      ...ProduktDetail.options,
      ...options,
    });
  }

  init() {
    this._initSwipers();
    this._swiperBehaviour();
    this._productCardsBehaviour();
    this._changeNavColor();
  }

  _initSwipers() {
    this.verticalSlider = new Swiper('.homepage-slider', {
      modules: [Mousewheel],
      direction: 'vertical',
      mousewheel: {
        forceToAxis: true,
        releaseOnEdges: true,
        thresholdDelta: 1,
        thresholdTime: 0,
        sensitivity: 1.2,
      },

      followFinger: false,
      shortSwipes: true,
      longSwipes: true,
      threshold: 20,

      slidesPerView: 'auto',
      spaceBetween: 0,
      speed: 700,
    });

    this.productSlider = new Swiper('.product-slider', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      slidesPerView: 'auto',
      spaceBetween: 18.4,

      freeMode: true,
      freeModeSticky: false,
      freeModeMomentum: false,
      touchRatio: 1,

      speed: 0,
    });
  }

  _swiperBehaviour() {
    // Startseitenslider 100vh Verhalten wie bei Delife

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const THRESHOLD = 5 * rem;

    let startY = 0;
    let early = false;

    this.verticalSlider.on('touchStart', (s, e) => {
      startY = e.touches?.[0]?.clientY ?? e.clientY ?? 0;
      early = false;
    });

    this.verticalSlider.on('touchMove', (s, e) => {
      if (early) return;

      const y = e.touches?.[0]?.clientY ?? e.clientY ?? 0;
      const delta = startY - y;

      if (Math.abs(delta) >= THRESHOLD) {
        early = true;

        s.touchEventsData.isTouched = false;
        s.touchEventsData.isMoved = false;
        s.allowTouchMove = false;

        if (s.mousewheel && s.mousewheel.enabled) s.mousewheel.disable();

        if (delta > 0) s.slideNext();
        else s.slidePrev();

        s.once('transitionEnd', () => {
          s.allowTouchMove = true;
          if (s.mousewheel && !s.mousewheel.enabled) s.mousewheel.enable();
        });
      }
    });

    this.verticalSlider.on('touchEnd', () => {
      if (early && !this.verticalSlider.animating) this.verticalSlider.allowTouchMove = true;
      early = false;
    });
  }

  _productCardsBehaviour() {
    //Product Kacheln Logik bei klick

    let swiperSlides = document.querySelectorAll('.product-slider .swiper-slide');

    swiperSlides.forEach((swiperSlide) => {
      let colors = swiperSlide.querySelectorAll('.colors .color-button');

      colors.forEach((color) => {
        color.addEventListener('click', (e) => {
          let detectedColor = [...color.classList].find((cls) => cls !== 'color-button');

          _changeContent(swiperSlide, detectedColor);
          _changeActiveButton(e.target);
        });
      });
    });

    function _changeContent(swiperSlide, color) {
      let productDataStr = swiperSlide.getAttribute('data-product');
      let productData = JSON.parse(productDataStr);

      let priceField = swiperSlide.querySelector('.amount');
      console.log(productData);

      let price = productData[color].price;
      let link = productData[color].link;
      console.log(price);

      // Change Product-Box link
      swiperSlide.href = link;

      // Change Product-Box price
      priceField.innerText = String(price).slice(0, -2);

      // Change Product-Image
      let productImages = swiperSlide.querySelectorAll('.product-images img');

      productImages.forEach((image) => {
        if (image.classList.contains(color)) {
          image.classList.remove('d-none');
        } else {
          image.classList.add('d-none');
        }
      });
    }

    function _changeActiveButton(button) {
      let colorsSection = button.closest('.colors');

      colorsSection.querySelectorAll('.color-button').forEach((button) => {
        button.classList.remove('active');
      });

      button.classList.add('active');
    }

    // Klick blockieren bei klick auf <a> Tag bei colors und warenkorb
    document.querySelectorAll('.colors, .buy-button').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }

  _changeNavColor() {
    // Nav Farbe ändern beim slide
    this.verticalSlider.on('slideChangeTransitionStart', () => {
      const activeSlide = this.verticalSlider.slides[this.verticalSlider.activeIndex];
      const navBarColor = activeSlide.getAttribute('nav-bar-color');

      if (navBarColor == 'light') {
        document.body.classList.add('nav-color-light');
      } else {
        document.body.classList.remove('nav-color-light');
      }
    });
  }
}
