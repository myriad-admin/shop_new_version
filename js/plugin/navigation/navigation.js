import Plugin from '../../plugin-system/plugin-class.js';

export default class Navigation extends Plugin {
  constructor(el, options = {}) {
    super(el, {
      ...Navigation.options,
      ...options,
    });
  }

  init() {
    this._addEventlistenerBurgerMenu();
    this._addEventlistenerNavigationPoints();
  }

  _addEventlistenerBurgerMenu() {
    let burgerMenu = document.getElementById('open-menu');
    let mobileNav = document.getElementById('nav-content');

    burgerMenu.addEventListener('click', () => {
      mobileNav.classList.add('open');
    });
  }

  _addEventlistenerNavigationPoints() {
    let navPointDamen = document.getElementById('damen');
    let subNavDamenWrapper = document.querySelector('.subnav-damen-wrapper');
    let subNavHerrenWrapper = document.querySelector('.subnav-herren-wrapper');
    let navDesktopWrapper = document.querySelector('.myriad-header .desktop');
    let subNavDamen = document.querySelector('.subnav-damen');

    navPointDamen.addEventListener('mouseover', () => {
      navDesktopWrapper.classList.add('damen-nav-open');
      subNavDamenWrapper.classList.add('index');
      subNavHerrenWrapper.classList.remove('index');
    });

    navPointDamen.addEventListener('mouseleave', () => {
      navDesktopWrapper.classList.remove('damen-nav-open');
    });

    subNavDamen.addEventListener('mouseover', () => {
      navDesktopWrapper.classList.add('damen-nav-open');
    });

    subNavDamen.addEventListener('mouseleave', () => {
      navDesktopWrapper.classList.remove('damen-nav-open');
    });

    let navPointHerren = document.getElementById('herren');
    let subNavHerren = document.querySelector('.subnav-herren');

    navPointHerren.addEventListener('mouseover', () => {
      navDesktopWrapper.classList.add('herren-nav-open');
      subNavDamenWrapper.classList.remove('index');
      subNavHerrenWrapper.classList.add('index');
    });

    navPointHerren.addEventListener('mouseleave', () => {
      navDesktopWrapper.classList.remove('herren-nav-open');
    });

    subNavHerren.addEventListener('mouseover', () => {
      navDesktopWrapper.classList.add('herren-nav-open');
    });

    subNavHerren.addEventListener('mouseleave', () => {
      navDesktopWrapper.classList.remove('herren-nav-open');
    });
  }
}
