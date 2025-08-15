import Startseite from './plugin/startseite/startseite.js';

document.addEventListener('DOMContentLoaded', () => {
  registerPlugin(Startseite, 'body.index');
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
