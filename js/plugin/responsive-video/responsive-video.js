import Plugin from '../../plugin-system/plugin-class.js';

export default class ResponsiveVideo extends Plugin {
  constructor(el, options = {}) {
    super(el, {
      ...ResponsiveVideo.options,
      ...options,
    });
  }

  init() {
    this._initVideo();
  }

  _initVideo() {
    const videoEl = this.el;

    const videoDesktop = videoEl.dataset.srcDesktop;
    const videoMobile = videoEl.dataset.srcMobile;

    const posterDesktop = videoEl.dataset.posterDesktop;
    const posterMobile = videoEl.dataset.posterMobile;

    let chosenSrc = null;

    const isMobile = () => window.innerWidth < 768;
    const chooseSrc = () => (isMobile() ? videoMobile : videoDesktop);
    const choosePoster = () => (isMobile() ? posterMobile : posterDesktop);

    // Poster sofort setzen (immer, unabhängig von Sichtbarkeit)
    const setPosterOnly = () => {
      const poster = choosePoster();
      if (poster && videoEl.getAttribute('poster') !== poster) {
        videoEl.setAttribute('poster', poster);
      }
    };

    // Optional: beide Poster "vorwärmen", damit nix blinkt
    const warmPosters = () => {
      if (posterDesktop) {
        const img = new Image();
        img.src = posterDesktop;
      }
      if (posterMobile) {
        const img = new Image();
        img.src = posterMobile;
      }
    };

    const setVideoSourceAndPoster = (autoplayAfter = false) => {
      const newSrc = chooseSrc();
      const wantedPoster = choosePoster();

      // Poster für aktuelle Viewport-Variante sicherstellen
      if (wantedPoster && videoEl.getAttribute('poster') !== wantedPoster) {
        videoEl.setAttribute('poster', wantedPoster);
      }

      // Nur wechseln, wenn sich die Quelle geändert hat
      if (newSrc !== chosenSrc) {
        chosenSrc = newSrc;
        const wasPlaying = autoplayAfter || (!videoEl.paused && !videoEl.ended);

        // Alte Quellen raus
        videoEl.innerHTML = '';

        // Neue Quelle rein
        const source = document.createElement('source');
        source.src = chosenSrc;
        source.type = 'video/mp4';
        videoEl.appendChild(source);

        // Laden & (falls gewünscht) abspielen
        videoEl.addEventListener(
          'loadeddata',
          () => {
            if (videoEl.readyState >= 2 && wasPlaying) {
              videoEl.play().catch((err) => console.warn('Autoplay blockiert:', err));
            }
          },
          { once: true }
        );

        videoEl.load();
      }
    };

    // ▶︎ Sofort: Poster setzen + vorwärmen (keine weiße Fläche)
    setPosterOnly();
    warmPosters();

    // Lazy Load via IntersectionObserver (Quelle erst, wenn sichtbar)
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVideoSourceAndPoster(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(videoEl);

    // Live-Switch bei Resize: Poster direkt umschalten, Quelle auch wechseln
    window.addEventListener('resize', () => {
      setPosterOnly(); // sofort sichtbares Poster updaten
      setVideoSourceAndPoster(); // Quelle (neu) laden/wechseln
    });
  }
}
