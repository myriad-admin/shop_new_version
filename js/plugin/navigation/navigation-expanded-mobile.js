import Plugin from '../../plugin-system/plugin-class.js';

export default class NavigationExpandedMobile extends Plugin {
  constructor(el, options = {}) {
    super(el, {
      ...NavigationExpandedMobile.options,
      ...options,
    });
  }

  init() {
    this._addAccordionClass();
    this._closeMobileNavigation();
  }

  // Für Animation von den mobilen Nav Punkten
  _addAccordionClass() {
    let accordionItems = this.el.querySelectorAll('.accordion-item');

    accordionItems.forEach((accordionItem) => {
      accordionItem.addEventListener('shown.bs.collapse', () => {
        accordionItem.querySelector('.accordion-collapse').setAttribute('aria-expanded', 'true');
      });

      accordionItem.addEventListener('hidden.bs.collapse', () => {
        accordionItem.querySelector('.accordion-collapse').setAttribute('aria-expanded', 'false');
      });

      accordionItem.addEventListener('show.bs.collapse', () => {
        accordionItem.setAttribute('aria-expanded', 'true');
      });

      accordionItem.addEventListener('hide.bs.collapse', () => {
        accordionItem.setAttribute('aria-expanded', 'false');
      });
    });
  }

  _closeMobileNavigation() {
    let closeIcon = this.el.querySelector('.close-button-mobile-nav');

    closeIcon.addEventListener('click', () => {
      this.el.classList.remove('open');
      console.log('klick');
    });

    document.addEventListener('click', (e) => {
      if (
        this.el.classList.contains('open') &&
        !e.target.closest('.nav-area-mobile') &&
        !e.target.closest('#open-menu')
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.el.classList.remove('open');
        console.log('close');
      }
    });
  }
}
