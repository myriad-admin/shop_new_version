import Plugin from '../../plugin-system/plugin-class.js';

import Swiper from 'swiper';
import { Navigation, Mousewheel, Pagination, EffectCards, Scrollbar } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



export default class ProduktDetail extends Plugin {
    constructor(el, options = {}) {
        super(el, {
            ...ProduktDetail.options,
            ...options,
        });
    }

    init() {
        this._initSwipers();
        this._swiperBehavior();
        this._manageColorsSection();
        this._colorLabelLoading();
        this._RingSizesLoading();
        this._syncShareButton();
        this._managePriceField();
        this._manageArticleName();
        this._manageCartLoadingSpinner();
        this._managePayPalButtonPosition();
        this._managePodestPosition();
        this._manageWishlistSync();
        this._manageSmilingShoppingBag();
        this._setMainSiteInFocus();
        this._setButtonAnimation();
        this._manageSizeCalculatorOverlay();
        this._manageSizeCalculating();
        this._manageProductInformation();
    }

    _initSwipers() {
        try {
            const productImageSwiper = new Swiper(".product-image-swiper", {
                modules: [Navigation],
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            });

            this.productBoxSwiper = new Swiper(".product-boxes", {
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

            this.sizeSelectSwiper = new Swiper(".size-select-swiper", {
                modules: [Mousewheel],
                direction: "vertical",
                nested: true,
                mousewheel: true,
                touchMoveStopPropagation: true,
                spaceBetween: 2,
                watchSlidesProgress: true,
                centeredSlides: true,
                slideToClickedSlide: true,
            });

            this.ringSizeCalculatorSwiper = new Swiper(".size-calculator-swiper", {
                modules: [Mousewheel, Pagination],
                direction: "vertical",
                slidesPerView: "auto",
                nested: true,
                // allowTouchMove: true,
                mousewheel: true,

                touchStartPreventDefault: false,
                simulateTouch: true,
                touchReleaseOnEdges: true,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                touchEventsTarget: "container"
            });

            this.descriptionSlider = new Swiper(".description-slider", {
                modules: [Mousewheel, Pagination, Scrollbar],
                direction: "vertical",
                speed: 900, // Langsames Sliden
                noSwiping: true,
                noSwipingClass: 'no-swipe-zone',
                // Standardmäßig fängt Swiper touchstart/move ab – hier auslassen:
                touchStartPreventDefault: false,
                touchMoveStopPropagation: false,
                mousewheel: {
                    sensitivity: 0.5,
                    forceToAxis: true,
                    releaseOnEdges: true,
                },
                scrollbar: {
                    el: '.swiper-scrollbar',
                    draggable: true,
                    snapOnRelease: true,
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
            });

            this.customerSlider = new Swiper(".customer-pictures", {
                modules: [Mousewheel, Pagination],
                slidesPerView: 2.6,
                spaceBetween: 30,
                nested: true,
                mousewheel: true,
                touchMoveStopPropagation: true,
                breakpoints: {
                    1200: {
                        slidesPerView: 3.6
                    }
                }
            });

            this.customerRatingImageSlider = new Swiper(".customer-rating-image-slider", {
                modules: [Navigation],
                loop: true,
                navigation: {
                    nextEl: ".customer-rating-image-slider-button-next",
                    prevEl: ".customer-rating-image-slider-button-prev",
                },
            });

            this.socialMediaImagesSwiper = new Swiper(".social-media-images-slider", {
                modules: [EffectCards],
                effect: "cards",
                cardsEffect: {
                    perSlideOffset: 40,
                    perSlideRotate: 0, // 0 Grad Rotation pro Slide
                },
                grabCursor: true,
                slidesPerView: 1,
                loop: false,
                threshold: 30,
                touchRatio: 1,
                freeMode: false,
                on: {
                    slideChange: function () {
                        const realIndex = this.activeIndex;
                        const diff = realIndex - this.previousIndex;
                        if (Math.abs(diff) > 1) {
                            this.slideTo(this.previousIndex + Math.sign(diff));
                        }
                    }
                }

            });

            // Customer-Slider verhindern dass am Ende der descriptionSlider slidet
            document.querySelector('.customer-pictures').addEventListener('wheel', function (e) {
                e.stopPropagation();
            }, { passive: false });

            document.querySelector('.rating-wrapper').addEventListener('wheel', function (e) {
                if (document.querySelector('.rating-wrapper').scrollTop !== 0) {
                    e.stopPropagation();
                }
            });

            //Den socialMediaImagesSwiper wrapper in 9:16 setzen und breite/höhe auf platz anpassen
            function setSocialMediaImagesSwiperWidth() {


                let socialMediaImagesSwiper = document.querySelector('.social-media-images-slider');
                socialMediaImagesSwiper.style.width = `100%`;
                socialMediaImagesSwiper.style.height = `100%`;

                let width = 9 * socialMediaImagesSwiper.clientHeight / 16;
                socialMediaImagesSwiper.style.width = `${width}px`;

                let socialMediaImagesSwiperWidth = socialMediaImagesSwiper.parentElement.clientWidth;
                let socialMediaImagesSwiperTotalWidth = width * 1.64;

                if (socialMediaImagesSwiperTotalWidth > socialMediaImagesSwiperWidth) {
                    console.log('vandalismus');
                    let width = socialMediaImagesSwiperWidth / 1.64;
                    let height = 16 * width / 9;

                    socialMediaImagesSwiper.style.width = `${width}px`;
                    socialMediaImagesSwiper.style.height = `${height}px`;
                }

            }

            setSocialMediaImagesSwiperWidth()

            window.addEventListener('resize', () => {
                setSocialMediaImagesSwiperWidth()
            })


        } catch (error) {
            console.log('Fehler in _initSwipers()', error)
        }
    }

    _swiperBehavior() {
        try {
            // Verhindern, dass bei zu viel scrollen im SizeSelectSwiper der ProductBoxSwiper gescrollt werden kann
            this.sizeSelectSwiper.on('touchStart', () => {
                this.productBoxSwiper.allowTouchMove = false;
            });

            this.sizeSelectSwiper.on('touchEnd', () => {
                this.productBoxSwiper.allowTouchMove = true;
            });

            this.ringSizeCalculatorSwiper.on('touchStart', () => {
                this.productBoxSwiper.allowTouchMove = false;
            });

            this.ringSizeCalculatorSwiper.on('touchEnd', () => {
                this.productBoxSwiper.allowTouchMove = true;
            });

            // Steuerung wann der SizeSelectSwiper auf/zu geht bei klick events
            let isSwiping = null;
            let eventBeforeSwiperChange = null;

            // Pointerdown weil dann das event genommen wird bevor swiper den active-slide ändert
            document.addEventListener('pointerdown', (event) => {
                isSwiping = false;
                eventBeforeSwiperChange = event;
            });

            this.sizeSelectSwiper.on('touchMove', () => {
                isSwiping = true;
            });

            document.addEventListener('pointerup', () => {
                let selectSizeWrapper = document.querySelector('.size-select-wrapper');
                const target = eventBeforeSwiperChange.target;
                const isRadioInput = target.type === 'radio';
                const isActiveSlide = target.classList.contains('swiper-slide') && target.classList.contains('swiper-slide-active');
                const isOutsideSwiper = !target.closest('#ring-size-swiper') && !target.classList.contains('size-select-wrapper');
                const isInsideSizeWrapper = target.closest('.size-select-wrapper');
                const isArrowClicked = target.closest('#arrow-backround-svg') || target.closest('#arrow-down-svg');
                const isSwiperSlide = target.classList.contains('swiper-slide');

                if (selectSizeWrapper.classList.contains('active')) {
                    if (!isRadioInput && (isActiveSlide || isOutsideSwiper)) {
                        selectSizeWrapper.classList.remove('active');
                    }
                } else {
                    if ((isSwiperSlide && isInsideSizeWrapper) || isArrowClicked) {
                        if (!isSwiping) {
                            selectSizeWrapper.classList.add('active');
                        }
                    }
                }

            })

            // Desktop Produktinfos Slider ersten Slide erkennen
            let descriptionSliderArrowDown = document.querySelector('.description-slider-arrow-down');

            descriptionSliderArrowDown.addEventListener('click', () => {
                this.descriptionSlider.slideNext();
            })

            window.addEventListener("wheel", (event) => {
                if (
                    event.deltaY > 0 &&
                    document.querySelector('.description-slider .swiper-wrapper .swiper-slide.one')?.classList.contains('swiper-slide-active')
                ) {
                    console.log("Scroll nach unten");
                    this.descriptionSlider.slideNext();
                }
            });

            this.descriptionSlider.on('slideChange', () => {
                if (this.descriptionSlider.activeIndex == 0) {
                    document.querySelector('.pds-slider.desktop').classList.remove('blur');

                    setTimeout(() => {
                        document.querySelector('.pds-slider.desktop').classList.remove('shadow');
                    }, 750);
                }
                else {
                    document.querySelector('.pds-slider.desktop').classList.add('blur', 'shadow');
                }

                if (this.descriptionSlider.activeIndex == 0) {
                    document.querySelector('.swiper-scrollbar').classList.add('inactive');
                }
                else {
                    document.querySelector('.swiper-scrollbar').classList.remove('inactive');
                }

                console.log(this.descriptionSlider.activeIndex);
            })

            this.descriptionSlider.on('transitionEnd', () => {
                // scroll bar mit bewegen
                if (this.descriptionSlider.activeIndex == 0) {
                    document.querySelector('.swiper-scrollbar').classList.remove('delay-change');
                }
                else {
                    document.querySelector('.swiper-scrollbar').classList.add('delay-change');
                }
            });



        } catch (error) {
            console.log('Fehler in _swiperBehavior()')
        }
    }

    _manageColorsSection() {
        try {
            let colorPickerIcon = document.getElementById('colorPickerIcon');
            let colorSection = document.getElementById('colorSection');

            colorPickerIcon.addEventListener('click', () => {
                colorSection.classList.toggle('closed');
            })

            let desktopOptionsWrapper = document.querySelector('#desktopOptionsWrapper .color-select');
            desktopOptionsWrapper.addEventListener('click', (e) => {
                if (!e.target.closest('.color-field')) {
                    desktopOptionsWrapper.classList.toggle('open');
                }

            })

            let desktopSizeSelectWrapper = document.querySelector('#desktopOptionsWrapper .size-select')
            desktopSizeSelectWrapper.addEventListener('click', () => {
                desktopSizeSelectWrapper.classList.toggle('open');
            })

        } catch (error) {
            console.log('Fehler in _manageColorsSection()')
        }
    }

    _colorLabelLoading() {
        try {
            function loadColorLabels() {
                let farbeFieldset = findColorFieldset();
                const farbeLabels = farbeFieldset ? farbeFieldset.querySelectorAll("input") : [];
                const colorsSection = document.querySelector("#colorSection");

                if (colorsSection && farbeLabels.length > 0) {
                    document.getElementById('colorPicker').classList.remove('d-none');
                    farbeLabels.forEach(label => createColorLabel(label, colorsSection));
                } else {
                    console.error('Farbe Fieldset oder #colorSection nicht gefunden');
                }

                activateColorSelection();
            }

            function findColorFieldset() {
                try {
                    return [...document.querySelectorAll("fieldset")].find(fieldset =>
                        fieldset.querySelector("legend")?.textContent.trim() === "Farbe"
                    ) ||
                        [...document.querySelectorAll("fieldset")].find(fieldset =>
                            fieldset.querySelector("legend")?.textContent.includes("Farbe:")
                        );
                } catch (error) {
                    console.error("Fehler beim Suchen des Farb-Fieldsets:", error);
                    return null;
                }
            }

            function createColorLabel(label, colorsSection) {
                let newColorLabel = document.createElement('label');
                newColorLabel.setAttribute('for', label.id);
                newColorLabel.classList.add('color-field', 'animation-button');

                const colorMap = {
                    "Gold": "gold",
                    "Silber": "silber",
                    "Kupfer": "kupfer"
                };

                let labelColor = colorMap[label.value];
                if (labelColor) {
                    newColorLabel.classList.add(labelColor);
                    newColorLabel.setAttribute('value', labelColor);

                    if (label.hasAttribute('checked')) {
                        newColorLabel.classList.add('color-field-active');
                        // changeProductImages(labelColor, null, null);
                        loadProductImages(labelColor);
                    }
                    colorsSection.appendChild(newColorLabel);
                }
            }

            function activateColorSelection() {
                document.querySelectorAll('.color-field').forEach(colorField => {
                    colorField.addEventListener("click", function () {
                        document.querySelectorAll('.color-field').forEach(field =>
                            field.classList.remove("color-field-active")
                        );
                        this.classList.add("color-field-active");
                        // changeProductImages(this.getAttribute('value'), null, null);
                        changeImagebyColorchange(this.getAttribute('value'));
                    });
                });
            }

            function loadProductImages(color) {
                let imagesData = productData.media;
                // let productImageSwiperWrapper = document.querySelector('.product-image-slider-wrapper .swiper-wrapper');
                let productImageSwiperWrappers = document.querySelectorAll('.product-image-slider-wrapper .swiper-wrapper');

                const productImagesData = imagesData.reduce((acc, item) => {
                    const key = item.alt;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(item);
                    return acc;
                }, {});

                let maxImages = 0;

                Object.values(productImagesData).forEach(productImageColor => {
                    productImageColor.length > maxImages ? maxImages = productImageColor.length : null;
                });


                for (let index = 0; index < maxImages; index++) {
                    console.log('test');
                    let swiperSlideDiv = document.createElement('div');
                    swiperSlideDiv.classList.add('swiper-slide');


                    Object.values(productImagesData).forEach(productImageColor => {
                        console.log(productImageColor);
                        let imgElement = document.createElement('img');
                        imgElement.setAttribute('src', productImageColor[index].src);
                        imgElement.setAttribute('alt', `Myriad ${productData.title} ${productImageColor[index].alt}`);
                        imgElement.classList.add(productImageColor[index].alt.toLowerCase());

                        if (color == productImageColor[index].alt.toLowerCase()) {
                            imgElement.classList.add('active');
                        }
                        swiperSlideDiv.appendChild(imgElement);
                    });



                    productImageSwiperWrappers.forEach((productImageSwiperWrapper) => {
                        productImageSwiperWrapper.appendChild(swiperSlideDiv.cloneNode(true));
                    })


                    console.log(index);

                }
            }

            function changeImagebyColorchange(color) {
                // let productImageSwiperWrapper = document.querySelector('.product-image-slider-wrapper .swiper-wrapper');
                let productImageSwiperWrappers = document.querySelectorAll('.product-image-slider-wrapper .swiper-wrapper');

                productImageSwiperWrappers.forEach((productImageSwiperWrapper) => {
                    let allImages = productImageSwiperWrapper.querySelectorAll('img');
                    allImages.forEach(image => {
                        image.classList.remove('active');

                        if (image.classList.contains(color)) {
                            image.classList.add('active');
                        }
                    });
                })
            }

            function changeProductImages(Ringcolor, Stonecolor, Stoneshape) {
                let imagesData = productData.media;
                let productImageSwiperWrapper = document.querySelector('.product-image-slider-wrapper .swiper-wrapper');

                productImageSwiperWrapper.innerHTML = "";

                imagesData.filter(imageData => imageData.alt.toLowerCase() === Ringcolor.toLowerCase())
                    .forEach(imageData => {
                        let swiperSlideDiv = document.createElement('div');
                        swiperSlideDiv.classList.add('swiper-slide');

                        let imgElement = document.createElement('img');
                        imgElement.setAttribute('src', imageData.src);
                        imgElement.setAttribute('alt', `Myriad ${productData.title} ${imageData.alt}`);
                        swiperSlideDiv.appendChild(imgElement);

                        productImageSwiperWrapper.appendChild(swiperSlideDiv);
                    });

                productImageSwiperWrapper.classList.add('animation');
                setTimeout(() => productImageSwiperWrapper.classList.remove('animation'), 500);
            }

            loadColorLabels();
        } catch (error) {
            console.log('Fehler in _colorLabelLoading()')
        }
    }

    _RingSizesLoading() {
        try {
            let shopifyRingSizeField = [...document.querySelectorAll("fieldset")].find(fieldset =>
                fieldset.querySelector("legend")?.textContent.trim() === "Ringgröße"
            );

            if (!shopifyRingSizeField) return;

            let shopifyInputFields = shopifyRingSizeField.querySelectorAll('input');
            let ringSizeSwiper = document.getElementById('ring-size-swiper');
            ringSizeSwiper.innerHTML = "";

            let activeSlideIndex = null;

            shopifyInputFields.forEach((inputField, index) => {
                let newSwiperSlide = document.createElement('div');
                newSwiperSlide.textContent = inputField.value;
                newSwiperSlide.setAttribute('target', inputField.id);
                newSwiperSlide.classList.add('swiper-slide');

                if (inputField.checked) {
                    activeSlideIndex = index;
                }

                ringSizeSwiper.appendChild(newSwiperSlide);
            });

            this.sizeSelectSwiper.update();

            if (activeSlideIndex !== null) {
                this.sizeSelectSwiper.slideTo(activeSlideIndex);
            }

            // Klick auf das original Label simulieren
            this.sizeSelectSwiper.on('slideChange', () => {
                let activeIndex = this.sizeSelectSwiper.activeIndex;
                let activeSlide = ringSizeSwiper.children[activeIndex];
                let newTarget = activeSlide.getAttribute('target');
                document.getElementById(newTarget).click();
            });
        } catch (error) {
            console.log('Fehler in _RingSizesLoading()')
        }
    }

    _syncShareButton() {
        try {
            let myriadShareButtons = document.querySelectorAll('#shareButton');
            // let myriadShareButton = document.getElementById('shareButton');
            let shopifyShareButton = document.querySelector('.share-button__button');

            myriadShareButtons.forEach((shareButton) => {
                shareButton.addEventListener('click', () => {
                    shopifyShareButton.click();
                })
            })


            let shopifyAddToCartButton = document.querySelector('.product-form__submit');
            // let myriadAddToCartButton = document.getElementById('addToCartButton');

            let myriadAddToCartButtons = document.querySelectorAll('#addToCartButton');

            myriadAddToCartButtons.forEach((myriadAddToCartButton) => {
                myriadAddToCartButton.addEventListener('click', () => {
                    shopifyAddToCartButton.click();
                })
            })


        } catch (error) {
            console.log('Fehler in _syncShareButton()')
        }
    }

    _managePriceField() {
        try {
            const priceTemplateDiv = document.querySelector('div[id^="price-template"][role="status"]');
            // const myriadPriceField = document.getElementById('priceField');

            let myriadPriceFields = document.querySelectorAll('.priceField');

            let latestStatusPriceField = null;

            if (priceTemplateDiv) {
                const observer = new MutationObserver(mutations => {
                    updateContext();
                });

                observer.observe(priceTemplateDiv, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true
                });
            } else {
                console.warn("Element .product__info-container nicht gefunden!");
            }

            updateContext(true)

            function updateContext(firstTime = false) {
                let shopifyPrice = document.querySelector('.price__regular .price-item.price-item--regular').textContent.replace(/[^\d,]/g, '');

                if (shopifyPrice.endsWith(",00")) {
                    shopifyPrice = shopifyPrice.slice(0, -3);
                }

                let updatedPrice = `${shopifyPrice} Euro`;

                if (updatedPrice != latestStatusPriceField) {
                    myriadPriceFields.forEach((myriadPriceField) => {
                        if (firstTime) {
                            myriadPriceField.textContent = updatedPrice;
                        } else {
                            myriadPriceField.classList.add('opacity');
                            setTimeout(() => {
                                myriadPriceField.textContent = updatedPrice;
                                myriadPriceField.classList.remove('opacity');
                            }, 100);

                        }
                    })
                    latestStatusPriceField = updatedPrice;
                }
            }
        } catch (error) {
            console.log('Fehler in _managePriceField()')
        }
    }

    _manageArticleName() {
        try {
            let shopifyName = document.querySelector('.product__info-container .product__title h1').textContent;
            let myriadNameFields = document.querySelectorAll('.nameField')

            myriadNameFields.forEach((myriadNameField) => {
                myriadNameField.innerHTML = shopifyName;
            })


        } catch (error) {
            console.log('Fehler in _manageArticleName()')
        }
    }

    _manageCartLoadingSpinner() {
        try {
            const shopifyCartLoadingSpinner = document.querySelector(".product-form__submit .loading__spinner");
            // let myriadAddToCartWrapper = document.querySelector('.action-buttons .add-to-cart-wrapper');

            let myriadAddToCartWrappers = document.querySelectorAll('.action-buttons .add-to-cart-wrapper');

            const callback = function (mutationsList) {
                for (let mutation of mutationsList) {
                    if (mutation.attributeName === "class") {
                        const hasHidden = shopifyCartLoadingSpinner.classList.contains("hidden");

                        myriadAddToCartWrappers.forEach((myriadAddToCartWrapper) => {
                            if (hasHidden) {
                                myriadAddToCartWrapper.classList.remove('loading');
                            }
                            else {
                                myriadAddToCartWrapper.classList.add('loading');
                            }
                        })
                    }
                }
            };

            const observer = new MutationObserver(callback);

            const config = {
                attributes: true,
                attributeFilter: ["class"]
            };

            observer.observe(shopifyCartLoadingSpinner, config);
        } catch (error) {
            console.log('Fehler in _manageCartLoadingSpinner()')
        }
    }

    _managePayPalButtonPosition() {
        try {
            let payPalButtonX = null;
            let payPalButtonY = null;

            this.productBoxSwiper.on('slideChangeTransitionEnd', function () {
                setPayPalButton();
            });

            startPayPalObserver();

            function setPayPalButton() {
                let payPalButton = document.querySelector('.paypal-buttons');
                let payPalSvg = document.getElementById('payPalSvg');

                if (payPalButton && payPalSvg) {
                    if (payPalButtonX == null && payPalButtonY == null) {
                        payPalButtonX = getOffset(payPalButton).x;
                        payPalButtonY = getOffset(payPalButton).y;
                    }

                    let xTranslate = payPalButtonX - getOffset(payPalSvg).x;
                    let yTranslate = payPalButtonY - getOffset(payPalSvg).y;

                    payPalButton.style.transform = `translate(${-xTranslate}px, ${-yTranslate}px)`;
                    return true;
                }
                return false;
            }

            function startPayPalObserver() {
                const observer = new MutationObserver(() => {
                    if (setPayPalButton()) {
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            function getOffset(el) {
                const rect = el.getBoundingClientRect();
                return {
                    x: rect.left + window.scrollX,
                    y: rect.top + window.scrollY
                };
            }
        } catch (error) {
            console.log('Fehler in _managePayPalButtonPosition()')
        }
    }

    _managePodestPosition() {
        try {
            window.addEventListener('resize', () => {
                setPodestPosition();
            })

            setPodestPosition();

            function setPodestPosition() {
                if (window.innerWidth < 1024) {
                    setMobilePosition();
                }
                else {
                    setDesktopPosition();
                }

                function setMobilePosition() {
                    console.log('MOBILE');
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
                }

                function setDesktopPosition() {
                    let imageElement = document.getElementById('pdsBackgroundImageDesktop');
                    let anchorX = 950;
                    let anchorY = 880;
                    let imageNaturalWidth = 2944;
                    let imageNaturalHeight = 1168;
                    let getTargetViewportX = () => window.innerWidth * 0.25;
                    let getTargetViewportY = () => window.innerHeight * 1;


                    function updatePosition() {
                        // console.log('POSITION');
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;

                        const imageAspectRatio = imageNaturalWidth / imageNaturalHeight;
                        const viewportAspectRatio = viewportWidth / viewportHeight;

                        let renderedWidth, renderedHeight;

                        if (imageAspectRatio > viewportAspectRatio) {
                            // Bild ist breiter → Höhe füllt Viewport
                            renderedHeight = viewportHeight;
                            renderedWidth = renderedHeight * imageAspectRatio;
                        } else {
                            // Bild ist höher → Breite füllt Viewport
                            renderedWidth = viewportWidth;
                            renderedHeight = renderedWidth / imageAspectRatio;
                        }

                        const scaleX = renderedWidth / imageNaturalWidth;
                        const scaleY = renderedHeight / imageNaturalHeight;

                        const anchorXOnScreen = anchorX * scaleX;
                        const anchorYOnScreen = anchorY * scaleY;

                        const targetX = getTargetViewportX();
                        const targetY = getTargetViewportY();

                        const offsetX = targetX - anchorXOnScreen;
                        const offsetY = targetY - anchorYOnScreen;

                        // Position und Größe anwenden
                        imageElement.style.position = "absolute";
                        imageElement.style.width = `${renderedWidth}px`;
                        // imageElement.style.height = `${renderedHeight}px`;
                        imageElement.style.left = `${offsetX}px`;
                        // imageElement.style.top = `${offsetY}px`;
                        imageElement.style.objectFit = "cover";
                        imageElement.style.zIndex = "-1";
                    }

                    // Initial aufrufen
                    updatePosition();

                    // Bei Resize erneut aufrufen
                    window.addEventListener("resize", updatePosition);
                }
            }
        } catch (error) {
            console.log('Fehler in _managePodestPosition()', error)
        }
    }

    _manageWishlistSync() {
        try {
            let shopifyWishlistButton = document.querySelector('.quantum-lbw-wishlist-btn');
            // let myriadWishlistButton = document.getElementById('wishlistButton');

            let myriadWishlistButtons = document.querySelectorAll('#wishlistButton');

            myriadWishlistButtons.forEach((myriadWishlistButton) => {
                myriadWishlistButton.addEventListener('click', () => {
                    shopifyWishlistButton.click();
                })
            })



            const button = document.querySelector('.quantum-lbw-wishlist-btn');

            const config2 = {
                attributes: true,
                attributeFilter: ['style'],
            };

            const callback2 = (mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        changeHeartIcon();
                    }
                }
            };

            const observer2 = new MutationObserver(callback2);

            observer2.observe(button, config2);

            function changeHeartIcon() {
                const newOpacity = button.style.opacity;

                myriadWishlistButtons.forEach((myriadWishlistButton) => {
                    if (newOpacity == 0.75) {
                        myriadWishlistButton.classList.add('selected');
                    }

                    if (newOpacity == 1) {
                        myriadWishlistButton.classList.remove('selected');
                    }
                });
            }

            changeHeartIcon();
        } catch (error) {
            console.log('Fehler in _manageWishlistSync()')
        }
    }

    _manageSmilingShoppingBag() {
        try {
            let cartItems = null;

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

                // let addToCartButton = document.getElementById('addToCartButton');

                let addToCartButtons = document.querySelectorAll('#addToCartButton');


                cartItems.forEach(product => {
                    productVariantsInCart.add(product.variant_id);
                });

                addToCartButtons.forEach((addToCartButton) => {
                    console.log(addToCartButton);
                    if (productVariantsInCart.has(activeVariant)) {
                        addToCartButton.classList.add('alreadyInCart')
                    } else {
                        addToCartButton.classList.remove('alreadyInCart')
                    }
                })

            }

            const cartNotification = document.getElementById("cart-notification");

            const observer3 = new MutationObserver((mutationsList) => {
                mutationsList.forEach((mutation) => {
                    if (mutation.attributeName === "class") {
                        const hasActiveClass = cartNotification.classList.contains("active");

                        if (hasActiveClass) {
                            safeCartItems();
                        }
                    }
                });
            });

            observer3.observe(cartNotification, { attributes: true });


            let shopifyProductInfos = document.querySelector('[id^="product-form-installment-template"]');
            let activeProductInput = shopifyProductInfos.querySelector('input[name="id"]');

            const observer4 = new MutationObserver(() => {
                checkProductInCart(); // Deine Funktion aufrufen
            });

            // Observer starten, um Änderungen am `value`-Attribut zu beobachten
            observer4.observe(activeProductInput, { attributes: true, attributeFilter: ["value"] });

            safeCartItems();
        } catch (error) {
            console.log('Fehler in _manageSmilingShoppingBag()')
        }
    }

    _setMainSiteInFocus() {
        try {
            document.querySelector('.pds-slider').focus();
        } catch (error) {
            console.log('Fehler in _setMainSiteInFocus()')
        }
    }

    _setButtonAnimation() {
        try {
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
        } catch (error) {
            console.log('Fehler in _setButtonAnimation()')
        }
    }

    _manageSizeCalculatorOverlay() {
        try {
            let infoButton = document.getElementById('info-svg');
            let sizeCalculatorOverlayWrapper = document.querySelector('.size-calculator-overlay-wrapper');

            infoButton.addEventListener('click', () => {
                infoButton.classList.toggle('size-calculator-active');
                document.querySelector('.size-calculator-swiper').classList.toggle('active');

                if (sizeCalculatorOverlayWrapper.classList.contains('active')) {
                    setTimeout(() => {
                        sizeCalculatorOverlayWrapper.classList.remove('active');
                    }, 800);
                }
                else {
                    sizeCalculatorOverlayWrapper.classList.add('active');
                }
            })
        }
        catch (error) {
            console.log('Fehler in _manageSizeCalculatorOverlay()')
        }
    }

    _manageSizeCalculating() {
        const fingerumfangInput = document.getElementById('fingerumfangInput');
        const ringdurchmesserInput = document.getElementById('ringdurchmesserInput');
        // const inputs = [fingerumfangInput, ringdurchmesserInput];
        const ringSizeField = document.getElementById('ringSize');

        // inputs.forEach(input => {
        //     input.addEventListener('input', function () {
        //         // Nur Ziffern erlauben
        //         let value = input.value.replace(/[^0-9]/g, '');

        //         // Kürzen auf max. 2 Zeichen
        //         if (value.length > 2) {
        //             value = value.slice(0, 2);
        //         }

        //         input.value = value;

        //         if (value.length === 2) {
        //             const nummerInMm = parseInt(value);

        //             if (input.id === 'fingerumfangInput') {
        //                 console.log('Ringgröße (aus Umfang):', berechneRinggroesseVonUmfang(nummerInMm));
        //             }

        //             if (input.id === 'ringdurchmesserInput') {
        //                 console.log('Ringgröße (aus Durchmesser):', berechneRinggroesseVonDurchmesser(nummerInMm));
        //             }
        //         }

        //         if (value.length != 2) {
        //             ringSizeField.classList.add('opacity');
        //             setTimeout(() => {
        //                 ringSizeField.innerHTML = null;
        //             }, 100);

        //         }
        //     });
        // });

        fingerumfangInput.addEventListener('input', function () {
            // Nur Ziffern erlauben
            let value = fingerumfangInput.value.replace(/[^0-9]/g, '');

            // Kürzen auf max. 2 Zeichen
            if (value.length > 2) {
                value = value.slice(0, 2);
            }

            fingerumfangInput.value = value;

            if (value.length === 2) {
                const nummerInMm = parseInt(value);

                console.log('Ringgröße (aus Umfang):', berechneRinggroesseVonUmfang(nummerInMm));
            }

            if (value.length != 2) {
                ringSizeField.classList.add('opacity');
                setTimeout(() => {
                    ringSizeField.innerHTML = null;
                }, 100);

            }
        })

        let previousRaw = '';
        let lastLength = 0;

        ringdurchmesserInput.addEventListener('input', function () {
            const input = ringdurchmesserInput;

            const rawCursor = input.selectionStart;
            const oldFormatted = previousRaw;
            const newUnformatted = input.value.replace(/[^0-9]/g, '');

            const oldRaw = oldFormatted.replace(/[^0-9]/g, '');
            let limitedRaw = newUnformatted.slice(0, 3);

            let formatted = '';
            if (limitedRaw.length >= 2) {
                formatted = limitedRaw.slice(0, 2) + ',' + limitedRaw.slice(2);
            } else {
                formatted = limitedRaw;
            }

            // Neue Cursorposition vorbereiten
            let newCursor = rawCursor;

            // Wenn Komma gelöscht wurde
            const removedComma = oldFormatted.includes(',') && !formatted.includes(',');
            if (
                oldRaw.length === 3 &&
                limitedRaw.length === 2 &&
                rawCursor === 3
            ) {
                newCursor--; // Komma gelöscht → Cursor eins zurück
            }

            // Wenn Komma hinzugefügt wurde durch neue Ziffer
            if (
                oldRaw.length === 2 &&
                limitedRaw.length === 3 &&
                rawCursor > 2
            ) {
                newCursor++; // Komma kam neu dazu
            }

            // ✅ Nur wenn der Benutzer 2 Ziffern NEU eingegeben hat (von 1 → 2 Zeichen), Cursor automatisch nach dem Komma
            if (limitedRaw.length === 2 && oldRaw.length === 1 && !removedComma) {
                newCursor = 3;
            }

            input.value = formatted;

            // Cursor setzen nach Update
            setTimeout(() => {
                input.setSelectionRange(
                    Math.min(newCursor, input.value.length),
                    Math.min(newCursor, input.value.length)
                );
            }, 0);

            // Ausgabe bei 3 Ziffern
            if (limitedRaw.length === 3) {
                const nummerInMm = parseFloat(formatted.replace(',', '.'));
                console.log('Ringgröße (aus Durchmesser):', berechneRinggroesseVonDurchmesser(nummerInMm));
            }

            if (limitedRaw.length < 3) {
                ringSizeField.classList.add('opacity');
                setTimeout(() => {
                    ringSizeField.innerHTML = null;
                }, 100);
            }

            previousRaw = formatted;
        });




        function berechneRinggroesseVonUmfang(umfangInMm) {
            ringSizeField.classList.add('opacity');

            setTimeout(() => {
                ringSizeField.innerHTML = Math.round(umfangInMm);
                ringSizeField.classList.remove('opacity');
            }, 100);

            return Math.round(umfangInMm);

        }

        function berechneRinggroesseVonDurchmesser(durchmesserInMm) {
            const umfangInMm = durchmesserInMm * Math.PI;


            ringSizeField.classList.add('opacity');

            setTimeout(() => {
                ringSizeField.innerHTML = Math.round(umfangInMm);
                ringSizeField.classList.remove('opacity');
            }, 100);


            return Math.round(umfangInMm);

        }

        this.ringSizeCalculatorSwiper.on('transitionStart', function () {
            ringSizeField.classList.add('opacity');

            let activeInputField = document.querySelector('.swiper-slide-active input');

            const event = new Event('input', {
                bubbles: true,
                cancelable: true
            });

            activeInputField.dispatchEvent(event);
        });

    }

    _manageProductInformation() {
        let productDescriptionField = document.getElementById('productDescription');

        productDescriptionField.innerHTML = productData.description;
    }
}
