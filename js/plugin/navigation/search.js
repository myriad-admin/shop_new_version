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
        this._manageNavigationExtensionHover();
        this._manageMobileNavigationArea();
    }

    _searchBarTransformation() {
        document.addEventListener('click', (event) => {
            console.log('objectSEARCH');
            if (event.target.closest('#live-search-form') && !event.target.closest('.results')) {
                document.body.classList.add('search-bar-active');
            }

            if (!event.target.closest('#live-search-form')) {
                document.body.classList.remove('search-bar-active');
                document.getElementById('live-search-input').value = "";

                setTimeout(() => {
                    document.querySelector('#live-search-form .results').classList.add('d-none');
                }, 500);
            }

            // else {
            //     document.body.classList.remove('search-bar-active');
            //     document.getElementById('live-search-input').value = "";
            // }
        });
    }

    _manageNavigationClick() {
        try {
            //Desktop
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

            //Mobile
            let searchIcon = document.querySelector('.nav-bar .mobile .right .action-buttons .search-svg');
            let inputFormMobile = document.getElementById('live-search-form-mobile');
            const inputMobile = inputFormMobile.querySelector('#live-search-input');
            const resultsContainerMobile = inputFormMobile.querySelector('.results');

            document.addEventListener('click', (e) => {
                if (e.target.closest('.nav-bar .mobile .right .action-buttons .search-svg')) {
                    document.querySelector('body').classList.toggle('mobile-search-bar-active');
                    inputMobile.focus();
                }
                else if (e.target.closest('.search-bar-mobile')) {
                    return;
                }
                else {
                    e.stopImmediatePropagation();
                    document.querySelector('body').classList.remove('mobile-search-bar-active');
                }
            });
        } catch (error) {
            console.log('Fehler in _manageNavigationClick()', error)
        }
    }

    _manageNavigationExtensionHover() {
        try {
            let triggerAreas = [document.querySelector('.nav-bar .desktop .navigation-points .nav-show-more'), document.querySelector('.nav-bar .desktop .navigation-points .nav-extension')];

            triggerAreas.forEach(area => {
                area.addEventListener('mouseenter', () => {
                    document.querySelector('.nav-bar .desktop .navigation-points').classList.add('extension-open');
                });

                area.addEventListener('mouseleave', () => {
                    document.querySelector('.nav-bar .desktop .navigation-points').classList.remove('extension-open');
                });
            })
        }
        catch (error) {
            console.log('Fehler in _manageNavigationExtensionHover()', error)
        }
    }

    _manageMobileNavigationArea() {
        let burgerMenu = document.querySelector('.burger-svg');
        let body = document.querySelector('body');

        document.addEventListener('pointerdown', (e) => {
            if (body.classList.contains('mobile-nav-active') && !e.target.closest('.navigation-area-mobile') && !e.target.closest('.nav-bar')) {
                console.log(body.classList.contains('mobile-nav-active'), !e.target.closest('.navigation-area-mobile'), !e.target.closest('.nav-bar'));
                body.classList.remove('mobile-nav-active');
            }
        });

        burgerMenu.addEventListener('click', () => {
            if (!body.classList.contains('mobile-search-bar-active')) {
                body.classList.toggle('mobile-nav-active');
            }
        });
    }

    _manageWishlistItemCount() {
        let triggerButtons = ['.love-button', '#wishlistButton'];

        triggerButtons.forEach(triggerButton => {
            document.querySelectorAll(triggerButton).forEach(button => {
                button.addEventListener('click', () => {
                    (async () => {
                        const customerEmail = "jan.langguth02@gmail.com";
                        const shopifyDomain = "rgc1ap-hw.myshopify.com";
                        const baseUrl = "wishlist.gropulse.com";

                        async function getLoginWishlistItems() {
                            const url = `https://${baseUrl}/quantum_lbw_login_based_wishlist_data?shop_url=${shopifyDomain}&customer_email=${encodeURIComponent(customerEmail)}`;
                            try {
                                const res = await fetch(url);
                                const json = await res.json();
                                const items = json?.wishlistItems ?? [];
                                console.log("✅ Produkt-IDs:", items);
                                console.log("🧮 Anzahl:", items.length);
                                return items;
                            } catch (err) {
                                console.error("❌ Fehler beim Abrufen der Login-Wishlist:", err);
                                return [];
                            }
                        }

                        await getLoginWishlistItems();
                    })();
                });
            });
        });

        // Ursprüngliche Fetch-Funktion sichern  BESSERE VARIANTE
        const originalFetch = window.fetch;

        // Fetch überschreiben
        window.fetch = async (...args) => {
            const [url, options] = args;

            // 👇 Auf bestimmte URL reagieren
            if (url.includes('quantum_lbw_login_based_wishlist_data')) {
                console.log("🎯 Wunschlisten-Request erkannt:", url);

                // Warte auf die Antwort
                const response = await originalFetch(...args);

                // Optional: Antwort klonen, um später lesbar zu sein
                const clone = response.clone();
                clone.json().then(data => {
                    console.log("📦 Wunschlisten-Daten:", data);
                    // 👉 Hier kannst du auf die Daten reagieren (z. B. Zähler aktualisieren)
                });

                return response;
            }

            // Standardfetch
            return originalFetch(...args);
        };


    }

    _manageCartItemCount() {
        (function () {
            const originalFetch = window.fetch;

            window.fetch = async (...args) => {
                const [url] = args;

                const response = await originalFetch(...args);

                // Nur bei Cart-Änderungen (GraphQL) reagieren
                if (typeof url === "string" && url.includes("change")) {
                    const clone = response.clone();
                    try {
                        const json = await clone.json();
                        console.log("🛒 Shopify-Warenkorb-Änderung erkannt:", json);

                        // Du kannst hier auch eigene Events dispatchen:
                        document.dispatchEvent(new CustomEvent("shopify:cartChanged", { detail: json }));

                        // Oder UI aktualisieren
                        updateCartCountFromChange(json);
                    } catch (err) {
                        console.warn("❌ Fehler beim Parsen der Cart-Änderung:", err);
                    }
                }

                return response;
            };

            function updateCartCountFromChange(data) {
                try {
                    const count = data?.item_count ?? data?.cart?.item_count ?? 0;
                    const el = document.querySelector("#cart-counter");
                    if (el) el.textContent = count;
                    console.log("🔄 Aktualisierter Warenkorb-Zähler:", count);
                } catch (err) {
                    console.warn("⚠️ Fehler beim Aktualisieren des Zählers:", err);
                }
            }

            // Optional: Reagiere irgendwo anders darauf
            document.addEventListener("shopify:cartChanged", (e) => {
                console.log("📦 Custom Event: shopify:cartChanged", e.detail);
            });
        })();
    }
}