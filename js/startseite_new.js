document.addEventListener('DOMContentLoaded', () => {

    // 100vh Scrolling
    const swiper = new Swiper('.homepage-slider', {
        direction: 'vertical',
        mousewheel: {
            forceToAxis: true,
            releaseOnEdges: true,
            thresholdDelta: 1,
            thresholdTime: 0,
            sensitivity: 1.2
        },
        pagination: { el: '.swiper-pagination', clickable: true },

        followFinger: false,
        // wieder aktivieren, damit kurze Swipes bei Loslassen funktionieren
        shortSwipes: true,
        longSwipes: true,
        threshold: 20,

        slidesPerView: 'auto',
        spaceBetween: 0,
        speed: 700
    });

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const THRESHOLD = 5 * rem; // 10rem

    let startY = 0;
    let early = false;   // merkt, ob Early-Trigger genutzt wurde

    swiper.on('touchStart', (s, e) => {
        startY = (e.touches?.[0]?.clientY ?? e.clientY) || 0;
        early = false;
    });

    swiper.on('touchMove', (s, e) => {
        if (early) return;

        const y = (e.touches?.[0]?.clientY ?? e.clientY) || 0;
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
    var productSlider = new Swiper(".product-slider", {
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        slidesPerView: 'auto'
    });
});
