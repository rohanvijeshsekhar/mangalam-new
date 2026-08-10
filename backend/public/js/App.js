(function () {
    'use strict';

    /* ------------------------------------------------------------------------
     * Cart Utilities
     * --------------------------------------------------------------------- */

    function getCartData() {
        const cartData = localStorage.getItem('cartItem');
        if (!cartData) return [];
        try {
            return JSON.parse('[' + cartData + ']');
        } catch (e) {
            console.error('Error parsing cart data:', e);
            return [];
        }
    }

    function setCartData(data) {
        if (!Array.isArray(data) || data.length === 0) {
            localStorage.removeItem('cartItem');
        } else {
            const serialized = data.map(item => JSON.stringify(item)).join(',');
            localStorage.setItem('cartItem', serialized);
        }
        updateCartCount();
    }

    function updateCartCount() {
        const cartData = getCartData();
        const count = cartData.length;
        document.querySelectorAll('.cart-trigger .counter').forEach(counter => {
            counter.textContent = count;
        });
        return count;
    }

    function numberWithCommas(x) {
        if (!x) return x;
        const parts = x.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    const dateInputState = {
        applied: new WeakSet(),
        observer: null,
        enabled: null
    };

    function shouldEnableDatePlaceholder() {
        if (dateInputState.enabled !== null) return dateInputState.enabled;
        const hasTouch = 'ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0);
        const coarsePointer = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
        dateInputState.enabled = hasTouch || coarsePointer;
        return dateInputState.enabled;
    }

    function applyDatePlaceholder(input) {
        if (!input || dateInputState.applied.has(input)) return;
        dateInputState.applied.add(input);

        const placeholderText = input.dataset.datePlaceholder || input.getAttribute('placeholder') || 'DD/MM/YYYY';
        input.setAttribute('placeholder', placeholderText);

        if (!input.dataset.originalInputType) {
            input.dataset.originalInputType = input.getAttribute('type') || 'date';
        }

        const originalType = input.dataset.originalInputType || 'date';

        const setTextMode = () => {
            if (input.value) return;
            try {
                input.type = 'text';
            } catch (error) {
                input.setAttribute('type', 'text');
            }
            input.classList.add('date-placeholder-active');
        };

        const setDateMode = () => {
            const desiredType = input.dataset.originalInputType || 'date';
            if (input.type !== desiredType) {
                try {
                    input.type = desiredType;
                } catch (error) {
                    input.setAttribute('type', desiredType);
                }
            }
            input.classList.remove('date-placeholder-active');
        };

        if (!input.value) {
            setTextMode();
        }

        input.addEventListener('focus', () => {
            setDateMode();
            if (!input.value && typeof input.showPicker === 'function') {
                setTimeout(() => {
                    if (document.activeElement === input && (input.type === originalType)) {
                        try {
                            input.showPicker();
                        } catch (error) {
                            /* showPicker may not be supported; ignore */
                        }
                    }
                }, 0);
            }
        });

        const handleEmptyState = () => {
            if (!input.value) {
                setTextMode();
            } else {
                setDateMode();
            }
        };

        input.addEventListener('blur', handleEmptyState);
        input.addEventListener('change', handleEmptyState);
        input.addEventListener('input', () => {
            if (input.value) {
                setDateMode();
            }
        });
    }

    function initMobileDateInputs(context = document) {
        if (!shouldEnableDatePlaceholder()) return;

        const root = context instanceof Element ? context : document;
        root.querySelectorAll('[data-date-input]').forEach(applyDatePlaceholder);

        if (!dateInputState.observer) {
            dateInputState.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (!(node instanceof Element)) return;
                        if (node.matches('[data-date-input]')) {
                            applyDatePlaceholder(node);
                        }
                        node.querySelectorAll?.('[data-date-input]').forEach(applyDatePlaceholder);
                    });
                });
            });
            dateInputState.observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function insertIntoCart(items) {
        if (!Array.isArray(items) || items.length === 0) return getCartData();

        const cartData = getCartData();
        const newItem = { ...items[0] };
        const existingIndex = cartData.findIndex(item => item.id === newItem.id);

        const hasValidAges = Array.isArray(newItem.age) && newItem.age.some(age => age != null);

        if (!hasValidAges) {
            if (!Array.isArray(newItem.age)) {
                newItem.age = [];
            }
            if (newItem.children > 0 && newItem.age.length < newItem.children) {
                const filled = new Array(newItem.children).fill(null);
                newItem.age = filled;
            }
        }

        if (existingIndex !== -1) {
            const existingItem = cartData[existingIndex];
            const existingHasAges = Array.isArray(existingItem.age) && existingItem.age.some(age => age != null);
            const newHasValidAges = Array.isArray(newItem.age) && newItem.age.some(age => age != null);

            if (!newHasValidAges && existingHasAges && newItem.children >= existingItem.children) {
                const preserved = existingItem.age.slice(0, newItem.children);
                while (preserved.length < newItem.children) {
                    preserved.push(null);
                }
                newItem.age = preserved;
            }

            cartData[existingIndex] = newItem;
        } else {
            cartData.push(newItem);
        }

        setCartData(cartData);
        return cartData;
    }

    function addToCart(item) {
        return insertIntoCart([item]);
    }

    function removeFromCart(itemId) {
        const filtered = getCartData().filter(item => item.id !== itemId);
        setCartData(filtered);
        return filtered;
    }

    function clearCart() {
        localStorage.removeItem('cartItem');
        updateCartCount();
    }

    function removeCartItem(itemId) {
        const filtered = getCartData().filter(item => item.id !== itemId);
        setCartData(filtered);
        fetchCartItems();
    }

    function fetchCartItems() {
        const cartData = getCartData();
        const itemsContainer = document.querySelector('.items-on-cart');
        const emptyCartWrap = document.querySelector('.empty-cart-wrap');
        const subTotal = document.querySelector('.sub-total');
        const submitBtn = document.querySelector('.cart-submit-btn');

        if (!itemsContainer || !emptyCartWrap || !subTotal || !submitBtn) return;

        itemsContainer.innerHTML = '';

        if (!cartData.length) {
            emptyCartWrap.style.display = 'block';
            subTotal.style.display = 'none';
            submitBtn.style.display = 'none';
            return;
        }

        emptyCartWrap.style.display = 'none';
        subTotal.style.display = 'flex';
        submitBtn.style.display = 'block';

        let totalAmount = 0;

        cartData.forEach(item => {
            const itemTotal = (item.amount * (item.adults || 1)) + (item.childAmount * (item.children || 0));
            totalAmount += itemTotal;

            const element = document.createElement('div');
            element.className = 'item-details-wrap';
            element.innerHTML = `
                <div class="item-details">
                    <div class="left">
                        <div class="image">
                            <img src="${item.thumbnail}" alt="${item.title}" class="item-thumbnail">
                        </div>
                    </div>
                    <div class="right">
                        <div class="row">
                            <h5 class="item-type">${item.type}</h5>
                            <div class="delete" onclick="removeCartItem('${item.id}')">
                                <i class="fi fi-rr-cross-circle"></i>
                            </div>
                        </div>
                        <div class="item-title">${item.title}</div>
                        <div class="amount">
                            AED <span class="item-amount">${numberWithCommas(itemTotal)}</span>
                        </div>
                        <div class="details-wrap">
                            <i class="fi fi-rr-calendar"></i>
                            <span class="item-date">${item.date}</span>
                        </div>
                        <div class="details-wrap">
                            <div class="rows">
                                <p>Adults:</p>
                                <span class="item-adults p-count">${item.adults || 1}</span>
                                <div class="per-person-amount">AED ${item.amount} / Per Person</div>
                            </div>
                            <div class="rows">
                                <p>Children:</p>
                                <span class="item-children p-count">${item.children || 0}</span>
                                <div class="per-person-amount">AED ${item.childAmount || 0} / Per Person</div>
                            </div>
                        </div>
                    </div>
                </div>`;

            itemsContainer.appendChild(element);
        });

        const subTotalAmount = document.querySelector('.sub_total_amount');
        if (subTotalAmount) subTotalAmount.textContent = numberWithCommas(totalAmount);
    }

    function showToaster(message) {
        const toaster = document.createElement('div');
        toaster.className = 'toaster-notification';
        toaster.innerHTML = message;
        toaster.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(toaster);

        requestAnimationFrame(() => {
            toaster.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            toaster.style.transform = 'translateX(100%)';
            setTimeout(() => toaster.remove(), 300);
        }, 3000);
    }

    function addDestinationToCart(button) {
        const cartItem = {
            id: button.getAttribute('data-item-id'),
            type: button.getAttribute('data-item-type'),
            title: button.getAttribute('data-item-title'),
            thumbnail: button.getAttribute('data-item-thumbnail'),
            amount: parseInt(button.getAttribute('data-item-amount')),
            childAmount: parseInt(button.getAttribute('data-item-child-amount')),
            date: button.getAttribute('data-item-date'),
            destinationId: button.getAttribute('data-item-destination-id'),
            adults: parseInt(button.getAttribute('data-adults')),
            children: parseInt(button.getAttribute('data-children')),
            age: []
        };

        addToCart(cartItem);

        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fi fi-rr-check mr-2"></i>Added!';
        button.classList.add('bg-green-600');
        button.classList.remove('bg-red-600', 'hover:bg-red-700');

        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('bg-green-600');
            button.classList.add('bg-red-600', 'hover:bg-red-700');
        }, 2000);
    }

    function addPackageToCart(button) {
        const cartItem = {
            id: button.getAttribute('data-item-id'),
            type: button.getAttribute('data-item-type'),
            title: button.getAttribute('data-item-title'),
            thumbnail: button.getAttribute('data-item-thumbnail'),
            amount: parseInt(button.getAttribute('data-item-amount')),
            childAmount: parseInt(button.getAttribute('data-item-child-amount')),
            date: button.getAttribute('data-item-date'),
            destinationId: button.getAttribute('data-item-destination-id'),
            adults: parseInt(button.getAttribute('data-adults')),
            children: parseInt(button.getAttribute('data-children')),
            age: []
        };

        insertIntoCart([cartItem]);

        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fi fi-rr-check mr-2"></i>Added!';
        button.classList.add('bg-green-600');
        button.classList.remove('bg-red-600', 'hover:bg-red-700');

        showToaster('<i class="fi fi-rr-shopping-cart"></i> &nbsp; Item Added To Cart');

        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('bg-green-600');
            button.classList.add('bg-red-600', 'hover:bg-red-700');
        }, 2000);
    }

    function collectChildAges(childrenCount) {
        const ages = [];
        for (let i = 1; i <= childrenCount; i++) {
            const ageInput = document.getElementById(`child-age-${i}`);
            if (!ageInput || !ageInput.value) {
                throw new Error(`Please enter age for Child ${i}`);
            }
            const age = parseInt(ageInput.value);
            if (Number.isNaN(age) || age < 3 || age > 12) {
                throw new Error(`Please enter valid age (3-12 years) for Child ${i}`);
            }
            ages.push(age);
        }
        return ages;
    }

    function buildCartItemFromForm(button, options = {}) {
        const form = button.closest('form');
        if (!form) {
            throw new Error('Form not found');
        }

        const {
            dateSelector,
            adultsSelector = '#adults-quantity',
            childrenSelector = '#child-quantity'
        } = options;

        const dateInput =
            (dateSelector ? form.querySelector(dateSelector) : null) ||
            (dateSelector ? document.querySelector(dateSelector) : null) ||
            form.querySelector('[data-date-input]') ||
            form.querySelector('input[type="date"]') ||
            document.querySelector('[data-date-input]') ||
            document.querySelector('input[type="date"]');
        const adultsInput = form.querySelector(adultsSelector) || document.querySelector(adultsSelector);
        const childrenInput = form.querySelector(childrenSelector) || document.querySelector(childrenSelector);

        const selectedDate = dateInput ? dateInput.value : '';
        const adults = adultsInput ? parseInt(adultsInput.value) || 1 : 1;
        const children = childrenInput ? parseInt(childrenInput.value) || 0 : 0;

        if (!selectedDate) {
            if (dateInput) dateInput.reportValidity();
            throw new Error('Please select a date');
        }

        if (adults <= 0 && children <= 0) {
            throw new Error('Please select at least one person');
        }

        let ageArray = [];
        if (children > 0) {
            ageArray = collectChildAges(children);
        }

        return {
            id: button.getAttribute('data-item-id'),
            type: button.getAttribute('data-item-type'),
            title: button.getAttribute('data-item-title'),
            thumbnail: button.getAttribute('data-item-thumbnail'),
            amount: parseInt(button.getAttribute('data-item-amount')) || 0,
            childAmount: parseInt(button.getAttribute('data-item-child-amount')) || 0,
            date: selectedDate,
            destinationId: button.getAttribute('data-item-destination-id') || '',
            adults,
            children,
            age: ageArray
        };
    }

    function addActivityToCart(button) {
        try {
            const cartItem = buildCartItemFromForm(button, { dateSelector: '#activity-date-input' });

            insertIntoCart([cartItem]);

            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fi fi-rr-check mr-2"></i>Added to Cart!';
            button.classList.add('bg-green-600');
            button.classList.remove('bg-black', 'hover:from-pink-600', 'hover:to-orange-600');

            showToaster('<i class="fi fi-rr-shopping-cart"></i> &nbsp; Activity Added To Cart');

            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('bg-green-600');
                button.classList.add('bg-black', 'hover:from-pink-600', 'hover:to-orange-600');
            }, 2000);
        } catch (error) {
            alert(error.message || 'An error occurred while adding the item to cart. Please try again.');
        }
    }

    function addTicketToCart(button) {
        try {
            const cartItem = buildCartItemFromForm(button, { dateSelector: '#ticket-date-input' });

            insertIntoCart([cartItem]);

            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fi fi-rr-check mr-2"></i>Added to Cart!';
            button.classList.add('bg-green-600');
            button.classList.remove('bg-black', 'hover:from-pink-600', 'hover:to-orange-600');

            showToaster('<i class="fi fi-rr-shopping-cart"></i> &nbsp; Ticket Added To Cart');

            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('bg-green-600');
                button.classList.add('bg-black', 'hover:from-pink-600', 'hover:to-orange-600');
            }, 2000);
        } catch (error) {
            alert(error.message || 'An error occurred while adding the item to cart. Please try again.');
        }
    }

    /* ------------------------------------------------------------------------
     * Global UI Handlers
     * --------------------------------------------------------------------- */

    function toggleFaq(id) {
        const answer = document.getElementById(`answer-${id}`);
        const icon = document.getElementById(`icon-${id}`);
        const button = icon ? icon.closest('button').querySelector('div') : null;

        if (!answer || !icon || !button) return;

        const isHidden = answer.classList.contains('hidden');
        answer.classList.toggle('hidden', !isHidden);
        icon.classList.toggle('fi-rr-plus', !isHidden);
        icon.classList.toggle('fi-rr-minus', isHidden);
        button.classList.toggle('bg-white', !isHidden);
        button.classList.toggle('bg-red-500', isHidden);
        button.classList.toggle('border', !isHidden);
        button.classList.toggle('border-gray-800', !isHidden);
        icon.classList.toggle('text-gray-800', !isHidden);
        icon.classList.toggle('text-white', isHidden);
    }

    function toggleFAQ(faqNumber) {
        const answer = document.getElementById(`answer-${faqNumber}`);
        const button = document.getElementById(`button-${faqNumber}`);
        const icon = document.getElementById(`icon-${faqNumber}`);

        if (!answer || !button || !icon) return;

        const isHidden = answer.classList.contains('hidden');
        answer.classList.toggle('hidden', !isHidden);
        button.classList.toggle('bg-white', !isHidden);
        button.classList.toggle('bg-red-500', isHidden);
        icon.classList.toggle('fi-rr-plus', !isHidden);
        icon.classList.toggle('fi-rr-minus', isHidden);
        icon.classList.toggle('text-gray-800', !isHidden);
        icon.classList.toggle('text-white', isHidden);
    }

    function switchTab(tab) {
        const tabs = ['packages', 'tickets', 'activity'];
        tabs.forEach(t => {
            const section = document.getElementById(`section-${t}`);
            const btn = document.getElementById(`tab-${t}`);
            const indicator = document.getElementById(`indicator-${t}`);
            if (!section || !btn || !indicator) return;

            if (t === tab) {
                section.classList.remove('hidden', 'opacity-0');
                section.classList.add('visible', 'opacity-100');
                btn.classList.add('text-gray-900');
                btn.classList.remove('text-gray-400');
                indicator.classList.remove('hidden');
            } else {
                section.classList.add('opacity-0');
                setTimeout(() => section.classList.add('hidden'), 300);
                btn.classList.remove('text-gray-900');
                btn.classList.add('text-gray-400');
                indicator.classList.add('hidden');
            }
        });
    }

    function openGallery() {
        const overlay = document.getElementById('galleryOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeGallery() {
        const overlay = document.getElementById('galleryOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    function increaseQuantity(type) {
        const input = document.getElementById(`${type}-quantity`);
        if (!input) return;
        const currentValue = parseInt(input.value) || 0;
        input.value = currentValue + 1;
        if (type === 'child' && typeof window.updateChildrenAges === 'function') {
            window.updateChildrenAges();
        }
    }

    function decreaseQuantity(type) {
        const input = document.getElementById(`${type}-quantity`);
        if (!input) return;
        const currentValue = parseInt(input.value) || 0;
        if (currentValue > 0) {
            input.value = currentValue - 1;
            if (type === 'child' && typeof window.updateChildrenAges === 'function') {
                window.updateChildrenAges();
            }
        }
    }

    /* ------------------------------------------------------------------------
     * Page Initialisers
     * --------------------------------------------------------------------- */

    function initSplideCarousels() {
        if (typeof Splide === 'undefined') {
            console.warn('Splide library not found.');
            return;
        }

        const configs = [
            {
                selector: '#posterCarousel',
                options: {
                    type: 'loop',
                    perPage: 1,
                    gap: '1.5rem',
                    autoplay: true,
                    interval: 3000,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    arrows: true,
                    pagination: true,
                    breakpoints: {
                        1024: { perPage: 1, gap: '1rem' },
                        768: { perPage: 1, gap: '1rem' },
                        640: { perPage: 1, gap: '0.75rem' }
                    }
                }
            },
            {
                selector: '#emiCarousel',
                options: {
                    type: 'loop',
                    perPage: 4,
                    perMove: 1,
                    gap: '2rem',
                    autoplay: true,
                    interval: 3000,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    arrows: true,
                    pagination: false,
                    breakpoints: {
                        1280: { perPage: 3, gap: '1.5rem' },
                        1024: { perPage: 2, gap: '1rem' },
                        640: { perPage: 1, gap: '1rem' }
                    }
                }
            },
            {
                selector: '#destinationNavCarousel',
                options: {
                    type: 'slide',
                    perPage: 6,
                    perMove: 1,
                    gap: '10px',
                    padding: '0',
                    autoplay: true,
                    interval: 3000,
                    arrows: false,
                    pagination: false,
                    breakpoints: {
                        2162: { perPage: 10, gap: '10px', arrows: true },
                        1024: { perPage: 5, gap: '10px', arrows: true },
                        768: { perPage: 4, gap: '10px' },
                        640: { perPage: 3, gap: '4px', arrows: false },
                        360: { perPage: 1, gap: '10px', arrows: false }
                    }
                }
            },
            {
                selector: '#destinationCarousel',
                options: {
                    type: 'loop',
                    perPage: 4,
                    perMove: 1,
                    gap: '1.5rem',
                    padding: '0',
                    autoplay: true,
                    interval: 3000,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    arrows: true,
                    pagination: false,
                    breakpoints: {
                        1024: { perPage: 3, gap: '1rem' },
                        768: { perPage: 2, gap: '1rem' },
                        640: { perPage: 1, gap: '0.75rem' }
                    }
                }
            },
            {
                selector: '#activityCarousel',
                options: {
                    type: 'loop',
                    perPage: 1,
                    gap: '1rem',
                    padding: { left: '1rem', right: '3rem' },
                    autoplay: true,
                    interval: 4000,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    arrows: true,
                    pagination: false,
                    breakpoints: {
                        768: { padding: { left: '0.5rem', right: '2rem' } },
                        640: { padding: { left: '0.5rem', right: '1.5rem' }, gap: '0.75rem' }
                    }
                }
            },
            {
                selector: '#ticketsCarousel',
                options: {
                    type: 'loop',
                    perPage: 4,
                    perMove: 1,
                    gap: '1.5rem',
                    autoplay: true,
                    interval: 3500,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    arrows: true,
                    pagination: false,
                    breakpoints: {
                        1280: { perPage: 3, gap: '1.25rem' },
                        1024: { perPage: 3, gap: '1rem' },
                        768: { perPage: 2, gap: '1rem' },
                        640: { perPage: 1, gap: '0.75rem' }
                    }
                }
            },
            {
                selector: '#testimonialsCarousel',
                options: {
                    type: 'loop',
                    perPage: 3,
                    perMove: 1,
                    gap: '1.5rem',
                    autoplay: true,
                    interval: 4000,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    arrows: true,
                    pagination: false,
                    breakpoints: {
                        1024: { perPage: 2, gap: '1.25rem' },
                        768: { perPage: 2, gap: '1rem' },
                        640: { perPage: 1, gap: '0.75rem' }
                    }
                }
            },
            {
                selector: '#accreditationsCarousel',
                options: {
                    type: 'loop',
                    perPage: 5,
                    perMove: 1,
                    gap: '1.5rem',
                    autoplay: true,
                    interval: 1000,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    arrows: false,
                    pagination: false,
                    breakpoints: {
                        1280: { perPage: 4, gap: '1.25rem' },
                        1024: { perPage: 3, gap: '1rem' },
                        768: { perPage: 2, gap: '1rem' },
                        640: { perPage: 1, gap: '0.75rem' }
                    }
                }
            },
            {
                selector: '#blogCarousel',
                options: {
                    type: 'loop',
                    perPage: 3,
                    perMove: 1,
                    gap: '1.5rem',
                    autoplay: true,
                    interval: 4000,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    arrows: true,
                    pagination: false,
                    breakpoints: {
                        1024: { perPage: 3, gap: '1.25rem' },
                        768: { perPage: 2, gap: '1rem' },
                        640: { perPage: 1, gap: '0.75rem' }
                    }
                }
            },
            {
                selector: '#packageGalleryCarousel',
                options: {
                    type: 'loop',
                    perPage: 1,
                    perMove: 1,
                    gap: '1rem',
                    autoplay: true,
                    interval: 3000,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    arrows: true,
                    pagination: false,
                    breakpoints: {
                        768: { perPage: 1, gap: '0.75rem' },
                        640: { perPage: 1, gap: '0.5rem' }
                    }
                }
            }
        ];

        configs.forEach(({ selector, options }) => {
            const element = document.querySelector(selector);
            if (element) {
                try {
                    new Splide(selector, options).mount();
                } catch (error) {
                    console.error(`Failed to initialise Splide for ${selector}`, error);
                }
            }
        });
    }

    const mobileMenuAnchor = { parent: null, nextSibling: null };

    function positionMobileDestinationMenu(anchor, menu) {
        if (!anchor || !menu) return;
        const rect = anchor.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${Math.round(rect.bottom + 4)}px`;
        menu.style.left = `${Math.round(rect.left)}px`;
        menu.style.width = `${Math.round(rect.width)}px`;
        menu.style.zIndex = '10050';
    }

    function openMobileDestinationMenu(button, menu) {
        if (!button || !menu) return;
        const anchor = button.closest('.flex-1') || button.parentElement;
        if (!mobileMenuAnchor.parent) {
            mobileMenuAnchor.parent = menu.parentNode;
            mobileMenuAnchor.nextSibling = menu.nextSibling;
        }
        document.body.appendChild(menu);
        menu.classList.remove('hidden');
        menu.classList.add('is-floating');
        positionMobileDestinationMenu(anchor, menu);
    }

    function closeMobileDestinationMenu(menu) {
        if (!menu) return;
        menu.classList.add('hidden');
        menu.classList.remove('is-floating');
        menu.style.position = '';
        menu.style.top = '';
        menu.style.left = '';
        menu.style.width = '';
        menu.style.zIndex = '';
        if (mobileMenuAnchor.parent) {
            if (mobileMenuAnchor.nextSibling && mobileMenuAnchor.nextSibling.parentNode === mobileMenuAnchor.parent) {
                mobileMenuAnchor.parent.insertBefore(menu, mobileMenuAnchor.nextSibling);
            } else {
                mobileMenuAnchor.parent.appendChild(menu);
            }
            mobileMenuAnchor.parent = null;
            mobileMenuAnchor.nextSibling = null;
        }
    }

    function initDestinationDropdowns() {
        const dropdownButton = document.getElementById('destinationDropdown');
        const dropdownMenu = document.getElementById('destinationMenu');
        const selectedDestination = document.getElementById('selectedDestination');
        const dropdownItems = dropdownMenu ? dropdownMenu.querySelectorAll('[data-value]') : [];
        const letsGoBtn = document.getElementById('letsGoBtn');

        if (dropdownButton && dropdownMenu) {
            dropdownButton.addEventListener('click', e => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('hidden');
            });
        }

        dropdownItems.forEach(item => {
            item.addEventListener('click', function () {
                const value = this.getAttribute('data-value');
                const slug = this.getAttribute('data-slug') || '';
                if (selectedDestination) {
                    selectedDestination.textContent = value;
                    selectedDestination.dataset.slug = slug;
                }
                dropdownMenu?.classList.add('hidden');
            });
        });

        document.addEventListener('click', () => dropdownMenu?.classList.add('hidden'));
        dropdownMenu?.addEventListener('click', e => e.stopPropagation());

        if (letsGoBtn) {
            letsGoBtn.addEventListener('click', () => {
                const destinationName = selectedDestination ? selectedDestination.textContent.trim() : '';
                const slug = selectedDestination?.dataset?.slug || '';

                if (destinationName === 'Other Location' || slug === 'other-location') {
                    if (typeof window.openOtherLocationModal === 'function') {
                        window.openOtherLocationModal();
                    }
                    return;
                }

                if (destinationName && destinationName !== 'Any Destination' && slug) {
                    fetch(`./action/getDestinationId.php?slug=${encodeURIComponent(slug)}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success && data.destination_id) {
                                if (typeof window.openCustomizePopup === 'function') {
                                    window.openCustomizePopup(slug, destinationName, data.destination_id);
                                }
                            } else {
                                alert('Destination not found. Please select a destination.');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('An error occurred. Please try again.');
                        });
                } else {
                    alert('Please select a destination first.');
                }
            });
        }

        const dropdownButton2 = document.getElementById('destinationDropdown2');
        const dropdownMenu2 = document.getElementById('destinationMenu2');
        const selectedDestination2 = document.getElementById('selectedDestination2');
        const letsGoBtn2 = document.getElementById('letsGoBtn2');

        if (dropdownButton2 && dropdownMenu2 && selectedDestination2) {
            const items2 = dropdownMenu2.querySelectorAll('[data-value]');
            const mobileMenuAnchorEl = dropdownButton2.closest('.flex-1') || dropdownButton2.parentElement;

            dropdownButton2.addEventListener('click', e => {
                e.stopPropagation();
                const isOpen = !dropdownMenu2.classList.contains('hidden');
                if (isOpen) {
                    closeMobileDestinationMenu(dropdownMenu2);
                } else {
                    openMobileDestinationMenu(dropdownButton2, dropdownMenu2);
                }
            });

            items2.forEach(item => {
                item.addEventListener('click', function () {
                    const value = this.getAttribute('data-value');
                    const slug = this.getAttribute('data-slug') || '';
                    selectedDestination2.textContent = value;
                    selectedDestination2.dataset.slug = slug;
                    closeMobileDestinationMenu(dropdownMenu2);
                });
            });

            window.addEventListener('resize', () => {
                if (!dropdownMenu2.classList.contains('hidden') && dropdownMenu2.classList.contains('is-floating')) {
                    positionMobileDestinationMenu(mobileMenuAnchorEl, dropdownMenu2);
                }
            });

            window.addEventListener('scroll', () => {
                if (!dropdownMenu2.classList.contains('hidden') && dropdownMenu2.classList.contains('is-floating')) {
                    positionMobileDestinationMenu(mobileMenuAnchorEl, dropdownMenu2);
                }
            }, true);

            document.addEventListener('click', () => closeMobileDestinationMenu(dropdownMenu2));
            dropdownMenu2.addEventListener('click', e => e.stopPropagation());
        }

        if (letsGoBtn2 && selectedDestination2) {
            letsGoBtn2.addEventListener('click', () => {
                const destinationName = selectedDestination2.textContent.trim();
                const slug = selectedDestination2.dataset.slug || '';

                if (destinationName === 'Other Location' || slug === 'other-location') {
                    if (typeof window.openOtherLocationModal === 'function') {
                        window.openOtherLocationModal();
                    }
                    return;
                }

                if (destinationName && destinationName !== 'Any Destination' && slug) {
                    fetch(`./action/getDestinationId.php?slug=${encodeURIComponent(slug)}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success && data.destination_id) {
                                if (typeof window.openCustomizePopup === 'function') {
                                    window.openCustomizePopup(slug, destinationName, data.destination_id);
                                }
                            } else {
                                alert('Destination not found. Please select a destination.');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('An error occurred. Please try again.');
                        });
                } else {
                    alert('Please select a destination first.');
                }
            });
        }
    }

    function initMobileCustomizeDropdown() {
        const trigger = document.getElementById('mobileCustomizeTrigger');
        const dropdown = document.getElementById('mobileCustomizeDropdown');
        const list = document.getElementById('mobileCustomizeList');

        if (!trigger || !dropdown || !list) return;

        let destinationsLoaded = false;
        let destinationsLoading = false;

        const closeDropdown = () => {
            dropdown.classList.remove('mobile-customize-dropdown-visible');
            dropdown.setAttribute('aria-hidden', 'true');
            trigger.setAttribute('aria-expanded', 'false');
        };

        const openDropdown = () => {
            dropdown.classList.add('mobile-customize-dropdown-visible');
            dropdown.setAttribute('aria-hidden', 'false');
            trigger.setAttribute('aria-expanded', 'true');
        };

        const renderDestinations = destinations => {
            list.innerHTML = '';

            destinations.forEach(destination => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'mobile-customize-dropdown-item';
                button.textContent = destination.destination_name || 'Destination';
                button.dataset.slug = destination.slug || '';
                button.dataset.id = destination.destination_id || '';
                button.dataset.name = destination.destination_name || '';

                button.addEventListener('click', function () {
                    const slug = this.dataset.slug;
                    const id = this.dataset.id;
                    const name = this.dataset.name;

                    if (!slug || !id) {
                        alert('Destination not available. Please choose another option.');
                        return;
                    }

                    closeDropdown();

                    if (typeof window.openCustomizePopup === 'function') {
                        window.openCustomizePopup(slug, name, id);
                    }
                });

                list.appendChild(button);
            });
        };

        trigger.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            if (expanded) {
                closeDropdown();
                return;
            }

            openDropdown();

            if (!destinationsLoaded && !destinationsLoading) {
                destinationsLoading = true;
                list.innerHTML = '<div class="mobile-customize-dropdown-empty">Loading destinations...</div>';

                fetch('./action/fetchDestinationPopup.php')
                    .then(response => response.json())
                    .then(destinations => {
                        if (Array.isArray(destinations) && destinations.length > 0) {
                            renderDestinations(destinations);
                            destinationsLoaded = true;
                        } else {
                            list.innerHTML = '<div class="mobile-customize-dropdown-empty">No destinations available right now.</div>';
                        }
                    })
                    .catch(error => {
                        console.error('Error loading destinations:', error);
                        list.innerHTML = '<div class="mobile-customize-dropdown-empty">Unable to load destinations. Please try again.</div>';
                    })
                    .finally(() => {
                        destinationsLoading = false;
                    });
            }
        });

        dropdown.addEventListener('click', e => e.stopPropagation());
        document.addEventListener('click', e => {
            if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    function initMenuDropdowns() {
        const menuDropdownTrigger = document.getElementById('menuDropdownTrigger');
        const menuDropdown = document.getElementById('menuDropdown');
        if (menuDropdownTrigger && menuDropdown) {
            menuDropdownTrigger.addEventListener('click', e => {
                e.stopPropagation();
                menuDropdown.classList.toggle('hidden');
            });

            document.addEventListener('click', e => {
                if (!menuDropdownTrigger.contains(e.target) && !menuDropdown.contains(e.target)) {
                    menuDropdown.classList.add('hidden');
                }
            });

            menuDropdown.addEventListener('click', e => e.stopPropagation());
        }

        const menuDropdownTrigger2 = document.getElementById('menuDropdownTrigger2');
        const menuDropdown2 = document.getElementById('menuDropdown2');
        if (menuDropdownTrigger2 && menuDropdown2) {
            menuDropdownTrigger2.addEventListener('click', e => {
                e.stopPropagation();
                menuDropdown2.classList.toggle('hidden');
            });

            document.addEventListener('click', e => {
                if (!menuDropdownTrigger2.contains(e.target) && !menuDropdown2.contains(e.target)) {
                    menuDropdown2.classList.add('hidden');
                }
            });

            menuDropdown2.addEventListener('click', e => e.stopPropagation());
        }
    }

    function initCartFeatures() {
        updateCartCount();

        const cartMenu = document.querySelector('.cart-menu');
        const shimmer = document.querySelector('.shimmer');

        if (cartMenu && shimmer) {
            document.querySelectorAll('.cart-trigger').forEach(trigger => {
                trigger.addEventListener('click', e => {
                    e.preventDefault();
                    cartMenu.classList.add('cart-menu-active');
                    shimmer.style.display = 'block';
                    fetchCartItems();
                });
            });

            const closeBtn = cartMenu.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    shimmer.style.display = 'none';
                    cartMenu.classList.remove('cart-menu-active');
                });
            }

            shimmer.addEventListener('click', () => {
                shimmer.style.display = 'none';
                cartMenu.classList.remove('cart-menu-active');
            });

            const submitBtn = cartMenu.querySelector('.cart-submit-btn');
            if (submitBtn) {
                submitBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    const cartData = getCartData();
                    if (!cartData.length) {
                        alert('Your cart is empty');
                        return;
                    }

                    this.textContent = 'Sending...';
                    this.disabled = true;

                    fetch('./action/submitEnquiryCart.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cartData)
                    })
                        .then(response => response.json())
                        .then(() => {
                            clearCart();
                            alert('Thank you! We will contact you soon.');
                            shimmer.style.display = 'none';
                            cartMenu.classList.remove('cart-menu-active');
                            this.textContent = 'Get My Trip Quote';
                            this.disabled = false;
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Something went wrong. Please try again.');
                            this.textContent = 'Get My Trip Quote';
                            this.disabled = false;
                        });
                });
            }
        }
    }

    function initAOS() {
        if (window.AOS) {
            AOS.init({
                duration: 800,
                offset: 120,
                once: true
            });
        }
    }

    /* ------------------------------------------------------------------------
     * Namespace helpers
     * --------------------------------------------------------------------- */

    function deriveNamespaceFromPath() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const name = path.replace('.php', '').toLowerCase();
        if (name === '' || name === 'index') return 'home';
        return name;
    }

    const namespaceHandlers = {
        home() { /* placeholder for home page specific logic */ },
        destinations() { /* placeholder */ },
        activity() { /* placeholder */ },
        tickets() { /* placeholder */ },
        'package-details'() { /* placeholder */ },
        'activity-details'() { /* placeholder */ },
        'ticket-details'() { /* placeholder */ },
        blogs() { /* placeholder */ },
        cart() {
            fetchCartItems();
        }
    };

    function runNamespace() {
        const namespace =
            document.body.dataset.namespace ||
            document.body.dataset.page ||
            deriveNamespaceFromPath();

        document.body.dataset.namespace = namespace;

        const handler = namespaceHandlers[namespace];
        if (typeof handler === 'function') {
            try {
                handler();
            } catch (error) {
                console.error(`Error running namespace handler for "${namespace}":`, error);
            }
        }
    }

    /* ------------------------------------------------------------------------
     * App bootstrap
     * --------------------------------------------------------------------- */

    function exposeGlobals() {
        window.getCartData = getCartData;
        window.setCartData = setCartData;
        window.addToCart = addToCart;
        window.insertIntoCart = insertIntoCart;
        window.removeFromCart = removeFromCart;
        window.updateCartCount = updateCartCount;
        window.clearCart = clearCart;
        window.numberWithCommas = numberWithCommas;
        window.fetchCartItems = fetchCartItems;
        window.removeCartItem = removeCartItem;
        window.addPackageToCart = addPackageToCart;
        window.addActivityToCart = addActivityToCart;
        window.addTicketToCart = addTicketToCart;
        window.addDestinationToCart = addDestinationToCart;
        window.showToaster = showToaster;
        window.toggleFaq = toggleFaq;
        window.toggleFAQ = toggleFAQ;
        window.switchTab = switchTab;
        window.openGallery = openGallery;
        window.closeGallery = closeGallery;
        window.increaseQuantity = increaseQuantity;
        window.decreaseQuantity = decreaseQuantity;
    }

    function initApp() {
        try { initAOS(); } catch (e) { console.error('AOS init error:', e); }
        try { initSplideCarousels(); } catch (e) { console.error('Splide init error:', e); }
        try { initDestinationDropdowns(); } catch (e) { console.error('Destination dropdown init error:', e); }
        try { initMobileCustomizeDropdown(); } catch (e) { console.error('Mobile customize dropdown init error:', e); }
        try { initMenuDropdowns(); } catch (e) { console.error('Menu dropdown init error:', e); }
        try { initMobileDateInputs(); } catch (e) { console.error('Mobile date inputs init error:', e); }
        try { initCartFeatures(); } catch (e) { console.error('Cart features init error:', e); }
        try { runNamespace(); } catch (e) { console.error('Namespace error:', e); }
        try { exposeGlobals(); } catch (e) { console.error('Expose globals error:', e); }

        try {
            const preferredTab = (typeof window.initialActiveTab === 'string' && window.initialActiveTab) ?
                window.initialActiveTab :
                (localStorage.getItem('activeTab') || 'packages');
            switchTab(preferredTab);
            localStorage.setItem('activeTab', preferredTab);

            document.querySelectorAll('[id^="tab-"]').forEach(btn => {
                btn.addEventListener('click', e => {
                    const tab = e.target.id.replace('tab-', '');
                    localStorage.setItem('activeTab', tab);
                });
            });
        } catch (error) {
            console.log('Tab switching not available on this page:', error);
        }

        document.addEventListener('click', event => {
            const galleryOverlay = document.getElementById('galleryOverlay');
            const galleryContent = event.target.closest('.bg-white');
            if (galleryOverlay && !galleryOverlay.classList.contains('hidden') && !galleryContent) {
                closeGallery();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', initApp);
})();

