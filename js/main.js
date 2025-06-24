import ProduktDetail from './plugin/produkt-detail/produkt-detail.js';
import Search from './plugin/navigation/search.js';

document.addEventListener("DOMContentLoaded", () => {
    registerPlugin(ProduktDetail, 'body.product');
    registerPlugin(Search, '.nav-bar');
});

function registerPlugin(pluginClass, selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
        try {
            new pluginClass(el);
        }
        catch (error) {
            console.error(`Fehler beim Initialisieren von ${pluginClass.name}`, error);
        }

    });
}