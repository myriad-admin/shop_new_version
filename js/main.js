import ProduktDetail from './plugin/produkt-detail/produkt-detail.js';

document.addEventListener("DOMContentLoaded", () => {
    registerPlugin(ProduktDetail, '.content-for-layout');
});

function registerPlugin(pluginClass, selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
        new pluginClass(el);
    });
}