import Plugin from '../../plugin-system/plugin-class.js';

export default class Search extends Plugin {
    constructor(el, options = {}) {
        super(el, {
            ...options,
        });
    }

    init() {
        this._manageNavigationClick();

    }

    _manageNavigationClick() {
        try {


        } catch (error) {
            console.log('Fehler in _manageNavigationClick()', error)
        }
    }
}