import DomAccess from '../helper/dom-access.helper.js';

/**
 * Plugin Base class
 * @package storefront
 */
export default class Plugin {
  /**
   * plugin constructor
   *
   * @param {HTMLElement} el
   * @param {Object} options
   * @param {string} pluginName
   */
  constructor(el, options = {}, pluginName = false) {
    if (!DomAccess.isNode(el)) {
      throw new Error('There is no valid element given.');
    }

    this.el = el;
    this._pluginName = pluginName;
    this.options = options;
    this._initialized = false;

    this._init();
  }

  /**
   * this function gets executed when the plugin is initialized
   */
  init() {
    throw new Error(`The "init" method for the plugin "${this._pluginName}" is not defined.`);
  }

  /**
   * this function gets executed when the plugin is being updated
   */
  update() { }

  /**
   * internal init method which checks
   * if the plugin is already initialized
   * before executing the public init
   *
   * @private
   */
  _init() {
    if (this._initialized) return;

    this.init();
    this._initialized = true;
  }

  /**
   * internal update method which checks
   * if the plugin is already initialized
   * before executing the public update
   *
   * @private
   */
  _update() {
    if (!this._initialized) return;

    this.update();
  }
}