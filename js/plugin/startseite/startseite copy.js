document.addEventListener('DOMContentLoaded', () => {
  // 100vh Scrolling
  const swiper = new Swiper('.homepage-slider', {
    direction: 'vertical',
    mousewheel: {
      forceToAxis: true,
      releaseOnEdges: true,
      thresholdDelta: 1,
      thresholdTime: 0,
      sensitivity: 1.2,
    },
    pagination: { el: '.swiper-pagination', clickable: true },

    followFinger: false,
    // wieder aktivieren, damit kurze Swipes bei Loslassen funktionieren
    shortSwipes: true,
    longSwipes: true,
    threshold: 20,

    slidesPerView: 'auto',
    spaceBetween: 0,
    speed: 700,
  });

  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const THRESHOLD = 5 * rem; // 10rem

  let startY = 0;
  let early = false; // merkt, ob Early-Trigger genutzt wurde

  swiper.on('touchStart', (s, e) => {
    startY = e.touches?.[0]?.clientY ?? e.clientY ?? 0;
    early = false;
  });

  swiper.on('touchMove', (s, e) => {
    if (early) return;

    const y = e.touches?.[0]?.clientY ?? e.clientY ?? 0;
    const delta = startY - y; // >0 = nach unten -> next (bei vertical)

    if (Math.abs(delta) >= THRESHOLD) {
      early = true;

      // laufende Geste beenden & weitere Touchbewegung blocken
      s.touchEventsData.isTouched = false;
      s.touchEventsData.isMoved = false;
      s.allowTouchMove = false;

      // (optional) Mausrad kurz deaktivieren
      if (s.mousewheel && s.mousewheel.enabled) s.mousewheel.disable();

      // sofort sliden
      if (delta > 0) s.slideNext();
      else s.slidePrev();

      // nach der Transition wieder freigeben
      s.once('transitionEnd', () => {
        s.allowTouchMove = true;
        if (s.mousewheel && !s.mousewheel.enabled) s.mousewheel.enable();
      });
    }
  });

  swiper.on('touchEnd', () => {
    // Nur wenn Early-Trigger aktiv war, selbst aufräumen.
    // Andernfalls: Swiper-internes "kurzer Swipe" Verhalten ganz normal laufen lassen.
    if (early && !swiper.animating) swiper.allowTouchMove = true;
    early = false;
  });

  // Product Slider
  var productSlider = new Swiper('.product-slider', {
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

    speed: 0, // sofortiges Stoppen
  });

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
      e.preventDefault(); // verhindert das Navigieren des umschließenden <a>
      e.stopPropagation(); // lässt den Klick nicht hochbubblen
    });
  });

  // Nav Farbe ändern beim slide
  swiper.on('slideChangeTransitionStart', () => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const navBarColor = activeSlide.getAttribute('nav-bar-color');

    if (navBarColor == 'light') {
      document.body.classList.add('nav-color-light');
    } else {
      document.body.classList.remove('nav-color-light');
    }
  });
});
