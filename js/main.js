import ProduktDetail from './plugin/produkt-detail/produkt-detail.js';
import Search from './plugin/navigation/search.js';

document.addEventListener("DOMContentLoaded", () => {
    registerPlugin(ProduktDetail, 'body.product');
    registerPlugin(Search, '.header-wrapper');
    console.log('LOADED');
});

function registerPlugin(pluginClass, selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
        new pluginClass(el);
    });
}