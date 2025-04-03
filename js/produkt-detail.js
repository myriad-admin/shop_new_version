// Direkt Swiper und die benötigten Module importieren
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

document.addEventListener("DOMContentLoaded", function () {
    var swiper = new Swiper(".mySwiper", {
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    var productBoxSwiper = new Swiper(".product-boxes", {
        observer: true,
        observeParents: true,
        direction: "vertical",
        initialSlide: 1,
        slidesPerView: "auto",
        resistanceRatio: 0,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });


    var sizeSelectSwiper = new Swiper(".size-select-swiper", {
        direction: "vertical",
        nested: true,
        mousewheel: true, // Ermöglicht Scrollen mit dem Mausrad,
        touchMoveStopPropagation: true,
        spaceBetween: 2,
        watchSlidesProgress: true,
        centeredSlides: true,
        slideToClickedSlide: true, // Diese Option sorgt dafür, dass beim Klicken auf eine Sektion der Swiper darauf springt
    });

    sizeSelectSwiper.on('touchStart', function () {
        productBoxSwiper.allowTouchMove = false;
    });

    sizeSelectSwiper.on('touchEnd', function () {
        productBoxSwiper.allowTouchMove = true;
    });
});


document.addEventListener('DOMContentLoaded', () => {
    let selectSizeWrapper = document.querySelector('.size-select-wrapper');
    let isSwiping = null;
    let event2 = null;
    // Schließt das Element, wenn außerhalb geklickt wird
    document.addEventListener('pointerdown', (event) => {
        isSwiping = false;
        event2 = event;
    });

    sizeSelectSwiper.on('touchMove', function () {
        isSwiping = true;
    });

    document.addEventListener('pointerup', () => {
        console.log(event2.target);

        if (selectSizeWrapper.classList.contains('active')) {
            if (event2.target.type != 'radio' && (event2.target.classList.contains('swiper-slide') && event2.target.classList.contains('swiper-slide-active')
            ) || !event2.target.closest('#ring-size-swiper') && !event2.target.classList.contains('size-select-wrapper')) {
                selectSizeWrapper.classList.remove('active');
                console.log("gexchlossen");
            }
        }
        else {
            if ((event2.target.classList.contains('swiper-slide') && event2.target.closest('.size-select-wrapper') || event2.target.closest('#arrow-backround-svg') || event2.target.closest('#arrow-down-svg')) && !isSwiping) {
                console.log("ACTIVE!")
                selectSizeWrapper.classList.add('active');
            }
        }
    })
});

// Open/Close ColorSection
let colorPickerIcon = document.getElementById('colorPickerIcon');
let colorSection = document.getElementById('colorSection');

colorPickerIcon.addEventListener('click', () => {
    colorSection.classList.toggle('closed');
})

// <!-- Dynamisches Laden der Labels in die colorSection -->
let farbeFieldset = null;
document.addEventListener('DOMContentLoaded', () => {
    let imagesData = productData.media;
    let productImageSwiperWrapper = document.querySelector('.product-image-slider-wrapper .swiper-wrapper');

    function changeProductImages(Ringcolor, Stonecolor, Stoneshape) {

        productImageSwiperWrapper.innerHTML = "";

        imagesData.forEach(imageData => {
            console.log(imageData.alt.toLowerCase(), Ringcolor.toLowerCase());
            if (imageData.alt.toLowerCase() == Ringcolor.toLowerCase()) {
                let swiperSlideDiv = document.createElement('div');
                swiperSlideDiv.classList.add('swiper-slide');

                let imgElement = document.createElement('img');
                imgElement.setAttribute('src', imageData.src);
                imgElement.setAttribute('alt', `Myriad ${productData.title} ${imageData.alt}`);
                swiperSlideDiv.appendChild(imgElement);

                productImageSwiperWrapper.appendChild(swiperSlideDiv);
            }
        });

        productImageSwiperWrapper.classList.add('animation');

        setTimeout(() => {
            productImageSwiperWrapper.classList.remove('animation');
        }, 500);
    }


    try {
        console.log("Erste");
        // Erster Versuch: Exakte Übereinstimmung mit "Farbe"
        farbeFieldset = [...document.querySelectorAll("fieldset")].find(fieldset =>
            fieldset.querySelector("legend") && fieldset.querySelector("legend").textContent.trim() === "Farbe"
        );
    } catch (error) {
        console.error("Fehler in der ersten Methode:", error);
    }

    // Falls der erste Versuch fehlschlägt oder kein Element gefunden wurde, zweite Methode probieren
    if (!farbeFieldset) {
        console.log("Zweite");
        try {
            farbeFieldset = [...document.querySelectorAll("fieldset")].find(fieldset =>
                fieldset.querySelector("legend") && fieldset.querySelector("legend").textContent.includes("Farbe:")
            );
        } catch (error) {
            console.error("Fehler in der zweiten Methode:", error);
        }
    }

    console.log(farbeFieldset ? "Feldset gefunden!" : "Kein passendes Feldset gefunden.");


    // 2️⃣ Labels aus dem Farb-Fieldset holen
    const farbeLabels = farbeFieldset ? farbeFieldset.querySelectorAll("input") : [];

    // 3️⃣ Zielbereich für die kopierten Labels
    const colorsSection = document.querySelector("#colorSection");

    // 4️⃣ Labels klonen und in #colorSection einfügen
    if (colorsSection && farbeLabels.length > 0) {
        document.getElementById('colorPicker').classList.remove('d-none');
        farbeLabels.forEach(label => {
            let newColorLabel = document.createElement('label');
            newColorLabel.setAttribute('for', label.id);
            newColorLabel.classList.add('color-field', 'animation-button');



            let labelColor = label.value;


            console.log(labelColor);

            if (labelColor == "Gold") {
                newColorLabel.classList.add('gold');
                newColorLabel.setAttribute('value', 'gold');

                if (label.hasAttribute('checked')) {
                    newColorLabel.classList.add('color-field-active');
                    addColor();
                    changeProductImages('gold', null, null);
                }
                else {
                    addColor();
                }
            }
            if (labelColor == "Grau") {
                newColorLabel.classList.add('grau');
                newColorLabel.setAttribute('value', 'grau');
                if (label.hasAttribute('checked')) {
                    newColorLabel.classList.add('color-field-active');
                    addColor();
                    changeProductImages('grau', null, null);
                }
                else {
                    addColor();
                }
            }
            if (labelColor == "Bronze") {
                newColorLabel.classList.add('bronze');
                newColorLabel.setAttribute('value', 'bronze');
                if (label.hasAttribute('checked')) {
                    newColorLabel.classList.add('color-field-active');
                    addColor();
                    changeProductImages('bronze', null, null);
                }
                else {
                    addColor();
                }
            }

            function addColor() {
                colorsSection.appendChild(newColorLabel); // In #colorSection einfügen
            }

        });
    } else {
        console.error('Farbe Fieldset oder #colorSection nicht gefunden');
    }

    let colorFields = document.querySelectorAll('.color-field');

    colorFields.forEach((colorField) => {
        colorField.addEventListener("click", function () {
            colorFields.forEach(field => field.classList.remove("color-field-active"));
            this.classList.add("color-field-active");

            let activeColor = this.getAttribute('value');

            console.log(activeColor);

            changeProductImages(activeColor, null, null);
        });
    });

})

// <!-- Dynamisches laden der Ringgrößen -->
document.addEventListener('DOMContentLoaded', () => {
    // Finde das 'fieldset' mit der 'Ringgröße'-Legende
    let ringSizeField = [...document.querySelectorAll("fieldset")].find(fieldset =>
        fieldset.querySelector("legend") && fieldset.querySelector("legend").innerHTML.trim() === "Ringgröße");

    let inputFields = ringSizeField.querySelectorAll('input');
    let ringSizeSwiper = document.getElementById('ring-size-swiper');
    console.log(ringSizeSwiper);
    ringSizeSwiper.innerHTML = ""; // Clear existing content

    let activeSlideIndex = null;

    // Füge für jedes input-Feld ein Swiper-Slide hinzu
    inputFields.forEach((inputField, index) => {
        let id = inputField.id;
        let value = inputField.value;

        let newSwiperSlide = document.createElement('div');
        newSwiperSlide.innerHTML = value; // Set the value inside the new slide
        newSwiperSlide.setAttribute('target', id); // Set the target attribute
        newSwiperSlide.classList.add('swiper-slide'); // Add swiper-slide class

        // Überprüfen, ob das Eingabefeld ausgewählt ist (für Radio/Checkbox)
        if (inputField.checked) {
            activeSlideIndex = index; // Merke den Index des aktiven Slides
        }

        ringSizeSwiper.appendChild(newSwiperSlide); // Füge das neue Slide hinzu
    });

    // Aktualisiere den Swiper nach dem Hinzufügen der neuen Slides
    sizeSelectSwiper.update();

    // Gehe zu dem aktiven Slide, falls einer ausgewählt ist
    if (activeSlideIndex !== null) {
        sizeSelectSwiper.slideTo(activeSlideIndex);
    }

    // Event Listener für slideChange
    sizeSelectSwiper.on('slideChange', function () {
        let myriadPriceField = document.getElementById('priceField');

        let activeIndex = sizeSelectSwiper.activeIndex; // Richtiger Name: activeIndex
        let activeSlide = ringSizeSwiper.children[activeIndex];

        let newTarget = activeSlide.getAttribute('target'); // Hole das Target des aktiven Slides

        // Klicke auf das Input-Element, das dem Target entspricht
        document.getElementById(newTarget).click();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    let myriadShareButton = document.getElementById('shareButton');
    let shopifyShareButton = document.querySelector('.share-button__button');

    myriadShareButton.addEventListener('click', () => {
        shopifyShareButton.click();
    })

    let shopifyAddToCartButton = document.querySelector('.product-form__submit');
    let myriadAddToCartButton = document.getElementById('addToCartButton');

    myriadAddToCartButton.addEventListener('click', () => {
        shopifyAddToCartButton.click();
    })


});

document.addEventListener('DOMContentLoaded', () => {
    const priceTemplateDiv = document.querySelector('div[id^="price-template"][role="status"]');

    let myriadPriceField = document.getElementById('priceField');
    let latestStatusPriceField = null;

    if (priceTemplateDiv) {
        const observer = new MutationObserver(mutations => {

            updateContext();

            console.log("Änderung erkannt Preis!", mutations);
        });

        observer.observe(priceTemplateDiv, {
            childList: true, // Beobachtet das Hinzufügen/Entfernen von Elementen
            subtree: true, // Beobachtet auch Änderungen in untergeordneten Elementen
            characterData: true, // Beobachtet Änderungen im Text (z. B. geänderter Preis)
            attributes: true // Optional: Falls sich Attribute ändern (z. B. class, style)
        });

        console.log("MutationObserver läuft Preis...");
    } else {
        console.warn("Element .product__info-container nicht gefunden!");
    }

    updateContext(true)

    function updateContext(firstTime = false) {
        let shopifyPrice = document.querySelector('.price__regular .price-item.price-item--regular').textContent.replace(/[^\d,]/g, '');

        if (shopifyPrice.endsWith(",00")) {
            shopifyPrice = shopifyPrice.slice(0, -3); // Letzte 3 Zeichen entfernen (",00")
        }

        let updatedPrice = `${shopifyPrice} Euro`;
        if (updatedPrice != latestStatusPriceField) {
            if (firstTime) {
                myriadPriceField.textContent = updatedPrice;
            } else {
                myriadPriceField.classList.add('opacity');
                setTimeout(() => {
                    myriadPriceField.textContent = updatedPrice;
                    myriadPriceField.classList.remove('opacity');
                }, 100);

            }
            latestStatusPriceField = updatedPrice;
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
    let shopifyName = document.querySelector('.product__info-container .product__title h1').textContent;
    let myriadNameField = document.getElementById('nameField');

    myriadNameField.innerHTML = shopifyName;
})

document.addEventListener('DOMContentLoaded', () => {
    let animationButtons = document.querySelectorAll('.animation-button');

    animationButtons.forEach(actionButton => {
        actionButton.addEventListener('pointerdown', function (event) {
            if (event.button == 0) {
                actionButton.classList.add('active');
            }
        });

        actionButton.addEventListener('pointerup', function (event) {
            if (event.button == 0) {
                actionButton.classList.remove('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const targetNode = document.querySelector(".product-form__submit .loading__spinner");
    let svgWrapper = document.querySelector('.action-buttons .add-to-cart-wrapper');
    let addToCartButton = document.getElementById('addToCartButton');

    // Observer-Callback-Funktion
    const callback = function (mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.attributeName === "class") {
                const hasHidden = targetNode.classList.contains("hidden");
                console.log(hasHidden);

                if (hasHidden) {
                    svgWrapper.classList.remove('loading');
                }



                // Falls du etwas tun willst, wenn "hidden" entfernt wurde:
                if (!hasHidden) {
                    svgWrapper.classList.add('loading');
                }
            }
        }
    };

    // MutationObserver-Instanz erstellen
    const observer = new MutationObserver(callback);

    // Konfiguration des Observers
    const config = {
        attributes: true,
        attributeFilter: ["class"]
    };

    // Observer starten
    observer.observe(targetNode, config);
});


document.addEventListener('DOMContentLoaded', () => {
    startPayPalObserver();

    productBoxSwiper.on('slideChangeTransitionEnd', function () {
        setPayPalButton();
        console.log("moved");
    });
});

function startPayPalObserver() {
    const observer = new MutationObserver(() => {
        if (setPayPalButton()) {
            observer.disconnect();
            console.log('Observer gestoppt.');
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

let payPalButtonX = null;
let payPalButtonY = null;

function setPayPalButton() {
    let payPalButton = document.querySelector('.paypal-buttons');
    let payPalSvg = document.getElementById('payPalSvg');

    if (payPalButton && payPalSvg) {
        console.log(payPalButton, payPalSvg);

        if (payPalButtonX == null && payPalButtonY == null) {
            payPalButtonX = getOffset(payPalButton).x;
            payPalButtonY = getOffset(payPalButton).y;
        }

        let xTranslate = payPalButtonX - getOffset(payPalSvg).x;
        let yTranslate = payPalButtonY - getOffset(payPalSvg).y;

        console.log("PP X: " + payPalButtonX, "SVG X: " + getOffset(payPalSvg).x);
        console.log("PP Y: " + payPalButtonY, "SVG Y: " + getOffset(payPalSvg).y);
        console.log(xTranslate, yTranslate);

        payPalButton.style.transform = `translate(${-xTranslate}px, ${-yTranslate}px)`;
        return true;
    }
    return false;
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
    };
}

document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener('resize', () => {
        setPodestPosition();
    })

    setPodestPosition();

    function setPodestPosition() {
        let backgroundImage = document.getElementById('pdsBackgroundImage');
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        let pictureHeight = (windowWidth * 787 / 360);

        backgroundImage.style.height = `${pictureHeight}px`;


        let productSwiperWrapper = document.querySelector('.product-image-slider-wrapper');

        productSwiperWrapper.style.top = `${windowWidth * 360 / 360}px`;


        let podestAndRingHeight = (windowWidth * 86 / 360) + productSwiperWrapper.querySelector('img').height;

        let spaceLeft = windowHeight - 258 - 115 - podestAndRingHeight;

        let translateNumber = spaceLeft / 2 - (windowWidth * 360 / 360 - productSwiperWrapper.querySelector('img').height - 115);

        backgroundImage.style.transform = `translateY(${translateNumber}px)`;
        productSwiperWrapper.style.transform = `translateY(${translateNumber}px)`;
        console.log(translateNumber);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let shopifyWishlistButton = document.querySelector('.quantum-lbw-wishlist-btn');
    let myriadWishlistButton = document.getElementById('wishlistButton');

    myriadWishlistButton.addEventListener('click', () => {
        shopifyWishlistButton.click();
    })

    const button = document.querySelector('.quantum-lbw-wishlist-btn');

    const config = {
        attributes: true,
        attributeFilter: ['style'],
    };

    const callback = (mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                changeHeartIcon();
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(button, config);

    function changeHeartIcon() {
        const newOpacity = button.style.opacity;
        console.log('Opacity geändert:', newOpacity);

        if (newOpacity == 0.75) {
            myriadWishlistButton.classList.add('selected');
        }

        if (newOpacity == 1) {
            myriadWishlistButton.classList.remove('selected');
        }
    }

    changeHeartIcon();
});

document.addEventListener('DOMContentLoaded', () => {
    let cartItems = null;
    console.log(cartItems);

    async function getCartItems() {
        try {
            let response = await fetch('/cart.js');
            let cart = await response.json();
            return cart.items;
        } catch (error) {
            console.error('Fehler beim Abrufen des Warenkorbs:', error);
            return [];
        }
    }

    async function safeCartItems() {
        cartItems = await getCartItems();
        checkProductInCart();
    }

    function checkProductInCart() {
        let productVariantsInCart = new Set();
        let shopifyProductInfos = document.querySelector('[id^="product-form-installment-template"]');
        let activeProductInput = shopifyProductInfos.querySelector('input[name="id"]');

        let activeVariant = Number(activeProductInput.value);

        let addToCartButton = document.getElementById('addToCartButton');


        cartItems.forEach(product => {
            productVariantsInCart.add(product.variant_id);
        });

        if (productVariantsInCart.has(activeVariant)) {
            addToCartButton.classList.add('alreadyInCart')
        } else {
            addToCartButton.classList.remove('alreadyInCart')
        }

        console.log(activeVariant, productVariantsInCart);
        console.log(productVariantsInCart.has(activeVariant));
    }

    const cartNotification = document.getElementById("cart-notification");

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.attributeName === "class") {
                const hasActiveClass = cartNotification.classList.contains("active");

                if (hasActiveClass) {
                    safeCartItems();
                }
            }
        });
    });

    observer.observe(cartNotification, { attributes: true });


    let shopifyProductInfos = document.querySelector('[id^="product-form-installment-template"]');
    let activeProductInput = shopifyProductInfos.querySelector('input[name="id"]');

    const observer2 = new MutationObserver(() => {
        console.log("Variant ID hat sich geändert:", activeProductInput.value);
        checkProductInCart(); // Deine Funktion aufrufen
    });

    // Observer starten, um Änderungen am `value`-Attribut zu beobachten
    observer2.observe(activeProductInput, { attributes: true, attributeFilter: ["value"] });

    safeCartItems();
})

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.pds-slider').focus();
    console.log("FOKUS!");
});
