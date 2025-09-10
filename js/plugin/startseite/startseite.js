import Plugin from '../../plugin-system/plugin-class.js';

import Swiper from 'swiper';
import { Mousewheel, FreeMode, Navigation, Pagination, EffectCards } from 'swiper/modules';

// import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

export default class Startseite extends Plugin {
  constructor(el, options = {}) {
    super(el, {
      ...Startseite.options,
      ...options,
    });
  }

  init() {
    this._initSwipers();
    this._swiperBehaviour();
    this._productCardsBehaviour();
    this._changeNavColor();
    this._manageVideos();
    this._manageFastProductPreview();
    // this._managePrelaunchMails();
  }

  _initSwipers() {
    this.fastProductPreviewSlider = new Swiper('.product-preview-slider', {
      modules: [Pagination],
      pagination: {
        el: '.swiper-pagination',
      },
    });

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

    this.productSliders = [];
    const sliders = document.querySelectorAll('.product-slider');

    sliders.forEach((sliderEl) => {
      const productSlider = new Swiper(sliderEl, {
        modules: [FreeMode, Navigation],
        slidesPerView: 'auto',
        spaceBetween: 18,
        grabCursor: true,
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 0.5,
          momentumBounce: false,
          sticky: true,
        },
        touchRatio: 1,
        resistanceRatio: 0.65,
        threshold: 3,
        followFinger: true,
        watchOverflow: true,
        preloadImages: false,
        lazy: true,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: sliderEl.querySelector('.swiper-button-next'),
          prevEl: sliderEl.querySelector('.swiper-button-prev'),
        },
      });

      this.productSliders.push(productSlider);
    });

    this.socialMediaImagesSwiper = new Swiper('.social-media-images-slider', {
      modules: [EffectCards],
      effect: 'cards',
      cardsEffect: {
        perSlideOffset: 40,
        perSlideRotate: 0,
      },
      grabCursor: true,
      slidesPerView: 1,
      loop: false,
      threshold: 0,
      touchRatio: 1,
      freeMode: false,
      on: {
        touchEnd(swiper) {
          // kein Springen in der Mitte
          const diff = swiper.activeIndex - swiper.previousIndex;
          if (Math.abs(diff) > 1) swiper.slideTo(swiper.previousIndex + Math.sign(diff));
        },
      },
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

    // Produkt-Slider animation
    this.verticalSlider.on('transitionStart', () => {
      const activeSlide = this.verticalSlider.slides[this.verticalSlider.activeIndex];

      const productCards = activeSlide.querySelectorAll('.product-card-translated');

      if (productCards) {
        productCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.remove('product-card-translated');
          }, 45 * index);
        });
      }
    });
  }

  _productCardsBehaviour() {
    let swiperSlides = document.querySelectorAll('.product-slider .swiper-slide');

    //Product Kacheln Logik bei klick
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

      let price = productData[color].price;
      let link = productData[color].link;
      let variantId = productData[color].variantId;

      // Change VariantId Data-Attribute for fast preview Box
      swiperSlide.setAttribute('variant-id', variantId);

      // Change Product-Box link
      swiperSlide.href = link;

      // Change Product-Box price
      priceField.innerText = String(price).slice(0, -2);

      // Change Product-Image
      let productImages = swiperSlide.querySelectorAll('.product-images img');

      productImages.forEach((image) => {
        if (image.classList.contains(color)) {
          image.classList.remove('image-hidden');
        } else {
          image.classList.add('image-hidden');
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

    // Klick irgendwohin -> Produktkarte nicht mehr aktiv

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.product-slider .swiper-slide')) {
        document.querySelectorAll('.product-slider .swiper-slide').forEach((slide) => {
          slide.classList.remove('active');
        });
      }
    });

    // Vertikal Bewegung bei <a> tag klick

    document.querySelectorAll('.product-slider .swiper-slide').forEach((slideItem) => {
      slideItem.addEventListener('click', (e) => {
        if (!(e.target.closest('.colors') || e.target.closest('.buy-button'))) {
          slideItem.classList.add('active');
        }
      });
    });

    // Vertikal Bewegung bei mobile scrollen
    let klickedSlideItem = null;

    this.productSliders.forEach((productSlider) => {
      productSlider.on('touchMove', () => {
        if (klickedSlideItem) {
          klickedSlideItem.classList.add('active');
        }
      });
    });

    swiperSlides.forEach((swiperSlide) => {
      swiperSlide.addEventListener('pointerdown', () => {
        klickedSlideItem = swiperSlide;
      });
    });

    document.addEventListener('pointerup', (e) => {
      if (e.target.closest('[data-product]')) {
        klickedSlideItem.classList.remove('active');
        klickedSlideItem = null;
      }
    });
  }

  _changeNavColor() {
    // Nav Farbe ändern beim slide
    this.verticalSlider.on('slideChangeTransitionStart', () => {
      const activeSlide = this.verticalSlider.slides[this.verticalSlider.activeIndex];
      const navBarColor = activeSlide.getAttribute('nav-bar-color');
      const navWrapper = document.querySelector('.myriad-header');

      if (navBarColor == 'light') {
        navWrapper.setAttribute('nav-color', 'light');
      } else {
        navWrapper.setAttribute('nav-color', 'dark');
      }
    });

    // Mobile bei klick in active setzen
  }

  _manageVideos() {
    // Videos pausieren wenn nicht in active Slide
    this.verticalSlider.on('slideChangeTransitionStart', () => {
      const activeSlide = this.verticalSlider.slides[this.verticalSlider.activeIndex];

      document.querySelectorAll('.collection-slide').forEach((slide) => {
        slide.querySelector('#responsiveVideo')?.pause();
      });

      activeSlide.querySelector('#responsiveVideo')?.play();
    });
  }

  _manageFastProductPreview() {
    const buyButtons = document.querySelectorAll('.buy-button');

    // Get Product Name and VariantId
    buyButtons.forEach((buyButton) => {
      buyButton.addEventListener('click', () => {
        let swiperSlide = buyButton.closest('.swiper-slide');
        let dataProductName = swiperSlide.getAttribute('data-product-name');
        let variantId = swiperSlide.getAttribute('variant-id');

        console.log(dataProductName, variantId);

        loadFastProductPreview(dataProductName, variantId);
      });
    });

    // Get Product HTML and instert it into page
    async function loadFastProductPreview(productName, variantId) {
      let startseiteSection = document.querySelector('#shopify-section-startseite');

      let productPreviewHtml = await fetch(
        `/products/${productName}?variant=${variantId}&section_id=fast-product-preview`
      ).then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      });

      let fastProductPreviewWrapper = document.createElement('div');
      fastProductPreviewWrapper.classList.add('fast-product-preview-wrapper');

      fastProductPreviewWrapper.innerHTML = productPreviewHtml;

      startseiteSection.appendChild(fastProductPreviewWrapper);
    }

    // Logic for Close Button
    document.addEventListener('click', (e) => {
      if (e.target.closest('.close-button')) {
        let startseiteSection = document.querySelector('#shopify-section-startseite');
        // let startseiteSection = document.querySelector('body');
        console.log(e.target);
        let fastProductPreviewWrapper = document.querySelector('.fast-product-preview-wrapper');
        startseiteSection.removeChild(fastProductPreviewWrapper);
      }
    });
  }

  _managePrelaunchMails() {
    console.log('drinnen');
    let myriadEmailForm = document.querySelector('.mail-form');
    let successMessage = document.querySelector('.email-signup__message--success');
    let submitEmailForm = document.querySelector('.email-signup__input');

    let myriadSuccessMessage = document.querySelector('.submit-message');

    if (successMessage) {
      myriadSuccessMessage.innerHTML = successMessage.innerHTML;
    }

    myriadEmailForm.addEventListener('submit', function (e) {
      e.preventDefault();

      console.log('TEST');

      let userEmail = document.getElementById('myriad-email-input').value;

      if (submitEmailForm) {
        submitEmailForm.focus();
        submitEmailForm.dispatchEvent(new Event('click', { bubbles: true }));
      }

      setTimeout(() => {
        document.querySelector('.email-signup__input').setAttribute('value', userEmail);
        document.querySelector('.email-signup__button').click();
      }, 500);
    });
  }
}
