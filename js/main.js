import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Startseite from './plugin/startseite/startseite.js';
import ResponsiveVideo from './plugin/responsive-video/responsive-video.js';
import Navigation from './plugin/navigation/navigation.js';
import NavigationExpandedMobile from './plugin/navigation/navigation-expanded-mobile.js';

document.addEventListener('DOMContentLoaded', () => {
  registerPlugin(Startseite, 'body.index');
  registerPlugin(ResponsiveVideo, '#responsiveVideo');
  registerPlugin(Navigation, '.myriad-header');
  registerPlugin(NavigationExpandedMobile, '.nav-area-mobile');
});

function registerPlugin(pluginClass, selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    try {
      new pluginClass(el);
    } catch (error) {
      console.error(`Fehler beim Initialisieren von ${pluginClass.name}`, error);
    }
  });
}
