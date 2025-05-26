import Plugin from '../../plugin-system/plugin-class.js';

export default class Search extends Plugin {
    constructor(el, options = {}) {
        super(el, {
            ...options,
        });
    }

    init() {
        this._searchBarTransformation();
        this._manageNavigationClick();
    }

    _searchBarTransformation() {
        document.addEventListener('click', (event) => {
            if (event.target.closest('#live-search-form') && !event.target.closest('.results')) {
                document.body.classList.add('nav-bar-active');
            }

            if (!event.target.closest('#live-search-form')) {
                document.body.classList.remove('nav-bar-active');
                document.getElementById('live-search-input').value = "";

                setTimeout(() => {
                    document.querySelector('#live-search-form .results').classList.add('d-none');
                }, 500);
            }

            // else {
            //     document.body.classList.remove('nav-bar-active');
            //     document.getElementById('live-search-input').value = "";
            // }
        });
    }

    _manageNavigationClick() {
        try {
            let inputForm = document.getElementById('live-search-form');
            const input = inputForm.querySelector('#live-search-input');
            const resultsContainer = inputForm.querySelector('.results');

            let debounceTimer;

            input.addEventListener('input', function () {
                const query = input.value.trim();

                clearTimeout(debounceTimer);

                if (query.length < 2) {
                    resultsContainer.innerHTML = '';
                    return;
                }

                debounceTimer = setTimeout(() => {
                    fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5&section_id=predictive-search`)
                        .then(response => response.json())
                        .then(data => {
                            const products = data.resources.results.products;
                            resultsContainer.innerHTML = '';

                            if (products.length === 0) {
                                resultsContainer.innerHTML = '<p class="no-results">Keine Treffer</p>';
                                return;
                            }

                            products.forEach(product => {
                                const item = document.createElement('div');
                                item.className = 'result-item';
                                item.innerHTML = `
              <a href="${product.url}">
                <img src="${product.image}" alt="${product.title}" width="50" />
                <span>${product.title}</span>
              </a>
            `;
                                resultsContainer.appendChild(item);

                                console.log(product);
                            });
                        });
                }, 300); // debounce in ms
            });
        } catch (error) {
            console.log('Fehler in _manageNavigationClick()', error)
        }
    }
}