<?php
// Meta tags for Cart Page
$pageTitle = 'Shopping Cart - Mangalam Travel & Tours | Review Your Cart Items';
$pageDescription = 'Review your selected tour packages, activities, and tickets in your shopping cart. Complete your booking with Mangalam Travel & Tours.';
$pageKeywords = 'shopping cart, cart, tour booking, travel booking, Mangalam Tours cart';
$pageImage = './assets/images/logo/mangalam-tours-og.jpg';
$pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

include './head.php';
require_once __DIR__ . '/components/EnquiryOtpFields.php';
include './components/header.php';
?>

<!-- Cart Page -->
<div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
        <!-- Page Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 font-[Quicksand]">Your Cart</h1>
            <p class="text-gray-600 mt-2">Review your selected items and proceed to checkout</p>
        </div>

        <!-- Cart Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Cart Items -->
            <div class="lg:col-span-2">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <!-- Cart Items Header -->
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h2 class="text-lg font-semibold text-gray-900">Cart Items</h2>
                    </div>

                    <!-- Cart Items List -->
                    <div id="cart-items-container" class="divide-y divide-gray-200">
                        <!-- Items will be dynamically loaded here -->
                    </div>

                    <!-- Empty Cart State -->
                    <div id="empty-cart-state" class="text-center py-12 px-6" style="display: none;">
                        <div class="mb-6">
                            <img src="./assets/images/cart/empty.png" alt="Empty Cart" class="mx-auto w-48 h-32 object-contain">
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                        <p class="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                        <a href="./curated-itineraries.php" class="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                            <i class="fi fi-rr-shopping-cart mr-2"></i>
                            Start Shopping
                        </a>
                    </div>
                </div>
            </div>

            <!-- Cart Summary -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
                    <!-- Summary Header -->
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h2 class="text-lg font-semibold text-gray-900">Order Summary</h2>
                    </div>

                    <!-- Summary Content -->
                    <div class="px-6 py-4">
                        <!-- Subtotal -->
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-gray-600">Subtotal</span>
                            <span id="cart-subtotal" class="font-semibold text-gray-900">AED 0</span>
                        </div>

                        <!-- Tax (if applicable) -->
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-gray-600">Tax</span>
                            <span class="font-semibold text-gray-900">AED 0</span>
                        </div>

                        <!-- Total -->
                        <div class="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                            <span class="text-lg font-semibold text-gray-900">Total</span>
                            <span id="cart-total" class="text-lg font-bold text-red-600">AED 0</span>
                        </div>

                        <!-- Checkout Button -->
                        <button id="checkout-btn" class="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed" disabled>
                          
                            Enquire Now
                        </button>

                        <!-- Continue Shopping -->
                        <a href="./curated-itineraries.php" class="block w-full text-center text-gray-600 hover:text-gray-900 mt-4 transition-colors">
                            <i class="fi fi-rr-arrow-left mr-2"></i>
                            Continue Shopping
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Enquiry Modal -->
<div id="enquiry-modal" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    <div class="relative z-10 max-w-lg mx-auto mt-24 bg-white rounded-xl shadow-xl border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Contact details</h3>
            <button id="enquiry-close" class="text-gray-500 hover:text-gray-700">
                <i class="fi fi-rr-cross-small text-xl"></i>
            </button>
        </div>
        <form id="enquiry-form" class="px-6 py-5 space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input type="text" id="enq-name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:outline-none" placeholder="John Doe" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="enq-email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:outline-none" placeholder="john@example.com" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div class="flex gap-2">
                    <input type="tel" id="enq-phone" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:outline-none" placeholder="+971501234567" required>
                    <button type="button" id="cart-sendOtpBtn" class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium whitespace-nowrap">Send OTP</button>
                </div>
                <?php renderEnquiryOtpFields('cart'); ?>
            </div>
            <div class="pt-2 flex items-center justify-end space-x-3">
                <button type="button" id="enquiry-cancel" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                <button type="submit" id="enquiry-submit" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <span class="btn-text">Send enquiry</span>
                </button>
            </div>
        </form>
    </div>

</div>

<!-- Success Modal -->
<div id="enquiry-success" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    <div class="relative z-10 max-w-md mx-auto mt-28 bg-white rounded-xl shadow-xl border border-gray-200">
        <div class="px-6 py-5 text-center">
            <div class="mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <i class="fi fi-rr-check text-green-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Enquiry sent</h3>
            <p class="text-gray-600">We've emailed your enquiry confirmation to <span id="success-email" class="font-medium text-gray-900"></span>.</p>
            <div class="mt-6 flex items-center justify-center gap-3">
                <a href="./index.php" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Go to Home</a>
                <button id="success-close" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- Remove Item Confirmation Modal -->
<div id="remove-confirm-modal" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    <div class="relative z-10 max-w-md mx-auto mt-28 bg-white rounded-xl shadow-xl border border-gray-200">
        <div class="px-6 py-5">
            <div class="mx-auto mb-4 w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <i class="fi fi-rr-trash text-red-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2 text-center">Remove Item?</h3>
            <p class="text-gray-600 text-center mb-6">Are you sure you want to remove <span id="remove-item-name" class="font-medium text-gray-900"></span> from your cart?</p>
            <div class="flex items-center justify-center gap-3">
                <button id="remove-cancel" class="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                <button id="remove-confirm" class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Remove</button>
            </div>
        </div>
    </div>
</div>

<!-- Cart Item Template (Hidden) -->
<template id="cart-item-template">
    <div class="cart-item p-6" data-item-id="">
        <div class="flex items-start space-x-4">
            <!-- Item Image -->
            <div class="flex-shrink-0">
                <img class="item-image w-20 h-20 object-cover rounded-lg" src="" alt="">
            </div>

            <!-- Item Details -->
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h3 class="item-title text-lg font-semibold text-gray-900"></h3>
                        <p class="item-type text-sm text-gray-600 mt-1"></p>
                        <p class="item-date text-sm text-gray-500 mt-1">
                            <i class="fi fi-rr-calendar mr-1"></i>
                            <span class="date-text"></span>
                        </p>
                    </div>

                    <!-- Remove Button -->
                    <button class="remove-item text-gray-400 hover:text-red-600 transition-colors">
                        <i class="fi fi-rr-cross-circle text-lg"></i>
                    </button>
                </div>

            </div>


        </div>
        <div>

            <!-- Quantity Controls -->
            <div class="mt-4 lg:flex lg:items-center justify-between">
                <div class="lg:flex lg:items-center lg:space-x-3">
                    <div class="text-sm text-gray-600">Adults:</div>
                    <div class="flex items-center space-x-2">
                        <button class="decrease-adults w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50">
                            <i class="fi fi-rr-minus text-xs"></i>
                        </button>
                        <span class="adults-count w-8 text-center font-medium">1</span>
                        <button class="increase-adults w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50">
                            <i class="fi fi-rr-plus text-xs"></i>
                        </button>
                    </div>

                    <div class="text-sm text-gray-600 lg:ml-4 mt-5 lg:mt-0">Children:</div>
                    <div class="flex items-center lg:space-x-2">
                        <button class="decrease-children w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50">
                            <i class="fi fi-rr-minus text-xs"></i>
                        </button>
                        <span class="children-count w-8 text-center font-medium">0</span>
                        <button class="increase-children w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50">
                            <i class="fi fi-rr-plus text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Item Price -->
                <div class="text-right">
                    <div class="text-lg font-semibold text-gray-900 item-price">AED 0</div>
                    <div class="text-sm text-gray-500">total</div>
                </div>
            </div>

            <!-- Children Ages Display -->
            <div class="children-ages-display mt-3 text-sm text-gray-600" style="display: none;">
                <span class="font-medium">Ages: </span>
                <span class="ages-text"></span>
            </div>
        </div>

        <!-- Edit Options -->
        <div class="edit-options mt-4 p-4 bg-gray-50 rounded-lg" style="display: none;">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
                    <input type="date" class="update-date w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:outline-none focus:outline-none" data-date-input="true" data-date-placeholder="DD/MM/YYYY" placeholder="DD/MM/YYYY">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Children Ages</label>
                    <div class="children-ages space-y-2">
                        <!-- Children age inputs will be added here -->
                    </div>
                </div>
            </div>
            <div class="mt-4 lg:flex lg:space-x-3">
                <button class="update-item w-full lg:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mb-2 lg:mb-0">
                    Update
                </button>
                <button class="cancel-edit w-full lg:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                    Cancel
                </button>
            </div>
        </div>

        <!-- Edit Button -->
        <button class="edit-item mt-4 text-red-600 hover:text-red-700 font-medium transition-colors">
            <i class="fi fi-rr-edit mr-2"></i>
            Edit Details
        </button>
    </div>
    </div>
</template>


<?php include './components/Customize.php'; ?>
<?php include './components/MobileNav.php'; ?>
<?php include './script.php'; ?>
<!-- Email helper functions (shared with package details) -->
<script src="./assets/js/emailFunctions.js"></script>

<script>
    // Cart functionality for cart page
    document.addEventListener('DOMContentLoaded', function() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const emptyCartState = document.getElementById('empty-cart-state');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        const cartItemTemplate = document.getElementById('cart-item-template');
        const enquiryModal = document.getElementById('enquiry-modal');
        const enquiryForm = document.getElementById('enquiry-form');
        const enquiryClose = document.getElementById('enquiry-close');
        const enquiryCancel = document.getElementById('enquiry-cancel');
        const enquirySubmit = document.getElementById('enquiry-submit');
        const enquirySuccess = document.getElementById('enquiry-success');
        const successEmail = document.getElementById('success-email');
        const successClose = document.getElementById('success-close');
        const removeConfirmModal = document.getElementById('remove-confirm-modal');
        const removeCancelBtn = document.getElementById('remove-cancel');
        const removeConfirmBtn = document.getElementById('remove-confirm');
        const removeItemName = document.getElementById('remove-item-name');
        const cartOtp = window.EnquiryOtp ? EnquiryOtp.getInstance('cart') : null;

        // Check if required elements exist
        if (!cartItemsContainer) {
            console.error('cart-items-container not found');
            return;
        }
        if (!emptyCartState) {
            console.error('empty-cart-state not found');
            return;
        }
        if (!cartSubtotal) {
            console.error('cart-subtotal not found');
            return;
        }
        if (!cartTotal) {
            console.error('cart-total not found');
            return;
        }
        if (!checkoutBtn) {
            console.error('checkout-btn not found');
            return;
        }
        if (!cartItemTemplate) {
            console.error('cart-item-template not found');
            return;
        }

        // Load cart items on page load
        try {
            loadCartItems();
        } catch (error) {
            console.error('Error loading cart:', error);
            showEmptyCart();
        }

        function loadCartItems() {
            try {
                const cartData = getCartData();
                console.log('Cart data loaded:', cartData);
                console.log('Cart data length:', cartData ? cartData.length : 0);

                if (!cartData || cartData.length === 0) {
                    console.log('Cart is empty, showing empty state');
                    showEmptyCart();
                    return;
                }

                console.log('Loading', cartData.length, 'items into cart');
                if (!cartItemsContainer) {
                    console.error('cartItemsContainer is null');
                    return;
                }

                cartItemsContainer.innerHTML = '';
                cartData.forEach((item, index) => {
                    try {
                        console.log('Creating cart item:', item);
                        const cartItem = createCartItem(item, index);
                        if (cartItem) {
                            cartItemsContainer.appendChild(cartItem);
                        } else {
                            console.error('Failed to create cart item:', item);
                        }
                    } catch (error) {
                        console.error('Error creating cart item:', error, item);
                    }
                });

                updateCartSummary();
                hideEmptyCart();
            } catch (error) {
                console.error('Error in loadCartItems:', error);
                showEmptyCart();
            }
        }

        function createCartItem(item, index) {
            if (!cartItemTemplate) {
                console.error('Cart item template not found');
                return null;
            }

            const template = cartItemTemplate.content.cloneNode(true);
            const cartItem = template.querySelector('.cart-item');

            if (!cartItem) {
                console.error('Cart item element not found in template');
                return null;
            }

            // Set item data
            cartItem.setAttribute('data-item-id', item.id);
            const imageEl = cartItem.querySelector('.item-image');
            const titleEl = cartItem.querySelector('.item-title');
            const typeEl = cartItem.querySelector('.item-type');
            const dateEl = cartItem.querySelector('.date-text');
            const adultsEl = cartItem.querySelector('.adults-count');
            const childrenEl = cartItem.querySelector('.children-count');

            if (imageEl) {
                imageEl.src = item.thumbnail || '';
                imageEl.alt = item.title || '';
            }
            if (titleEl) titleEl.textContent = item.title || '';
            if (typeEl) typeEl.textContent = item.type || '';
            if (dateEl) dateEl.textContent = item.date || '';
            if (adultsEl) adultsEl.textContent = item.adults || 1;
            if (childrenEl) childrenEl.textContent = item.children || 0;

            // Display children ages if available
            const agesDisplay = cartItem.querySelector('.children-ages-display');
            const agesText = cartItem.querySelector('.ages-text');
            if (agesDisplay && agesText) {
                // Check if item has valid ages (not all null)
                if (item.age && Array.isArray(item.age) && item.children > 0) {
                    const validAges = item.age.filter(age => age != null && age !== undefined);
                    if (validAges.length > 0) {
                        const ageStrings = validAges.map(age => {
                            if (typeof age === 'object' && age !== null && age.age !== undefined) {
                                return age.age;
                            }
                            return age;
                        });
                        agesText.textContent = ageStrings.join(', ');
                        agesDisplay.style.display = 'block';
                    } else {
                        agesDisplay.style.display = 'none';
                    }
                } else {
                    agesDisplay.style.display = 'none';
                }
            }

            // Calculate and display price
            const priceEl = cartItem.querySelector('.item-price');
            if (priceEl) {
                const adults = item.adults || 1;
                const children = item.children || 0;
                const adultAmount = parseFloat(item.amount) || 0;
                const childAmount = parseFloat(item.childAmount) || 0;
                const totalPrice = (adultAmount * adults) + (childAmount * children);
                priceEl.textContent = `AED ${numberWithCommas(totalPrice.toFixed(2))}`;
            }

            // Set up event listeners
            setupCartItemEvents(cartItem, item, index);

            return cartItem;
        }

        function setupCartItemEvents(cartItem, item, index) {
            // Ensure item exists
            if (!item) {
                console.error('Item is null in setupCartItemEvents');
                return;
            }

            // Quantity controls
            const decreaseAdults = cartItem.querySelector('.decrease-adults');
            const increaseAdults = cartItem.querySelector('.increase-adults');
            const decreaseChildren = cartItem.querySelector('.decrease-children');
            const increaseChildren = cartItem.querySelector('.increase-children');
            const adultsCount = cartItem.querySelector('.adults-count');
            const childrenCount = cartItem.querySelector('.children-count');

            // Ensure required elements exist
            if (!adultsCount || !childrenCount) {
                console.error('Required count elements not found');
                return;
            }

            decreaseAdults.addEventListener('click', () => {
                const current = parseInt(adultsCount.textContent);
                if (current > 1) {
                    const newValue = current - 1;
                    adultsCount.textContent = newValue;
                    // Update item in cart
                    item.adults = newValue;
                    updateCartItem(item.id, item);
                    updateItemPrice(cartItem, item);
                    updateCartSummary();
                }
            });

            increaseAdults.addEventListener('click', () => {
                const current = parseInt(adultsCount.textContent);
                const newValue = current + 1;
                adultsCount.textContent = newValue;
                // Update item in cart
                item.adults = newValue;
                updateCartItem(item.id, item);
                updateItemPrice(cartItem, item);
                updateCartSummary();
            });

            decreaseChildren.addEventListener('click', () => {
                const current = parseInt(childrenCount.textContent);
                if (current > 0) {
                    const newValue = current - 1;
                    childrenCount.textContent = newValue;

                    // Get latest item from cart to preserve ages
                    const itemId = cartItem.getAttribute('data-item-id');
                    const cartData = getCartData();
                    const currentItem = cartData.find(cartItemData => cartItemData.id === itemId) || item;

                    // Update ages array when children count changes - slice to keep only valid ages
                    if (!currentItem.age || !Array.isArray(currentItem.age)) {
                        currentItem.age = [];
                    }
                    // Slice to remove the last element (assuming it's the youngest child)
                    currentItem.age = currentItem.age.slice(0, newValue);

                    // Update age inputs in edit section if edit is open
                    const editOptions = cartItem.querySelector('.edit-options');
                    if (editOptions && editOptions.style.display !== 'none') {
                        updateChildrenAges(cartItem, newValue);
                    }

                    // Update age display (main view)
                    const agesDisplay = cartItem.querySelector('.children-ages-display');
                    const agesText = cartItem.querySelector('.ages-text');
                    const validAges = currentItem.age.filter(age => age != null && age !== undefined);
                    if (validAges.length > 0) {
                        const ageStrings = validAges.map(age => {
                            if (typeof age === 'object' && age !== null && age.age !== undefined) {
                                return age.age;
                            }
                            return age;
                        });
                        agesText.textContent = ageStrings.join(', ');
                        agesDisplay.style.display = 'block';
                    } else {
                        agesDisplay.style.display = 'none';
                    }

                    // Update item in cart
                    currentItem.children = newValue;
                    updateCartItem(currentItem.id, currentItem);
                    updateItemPrice(cartItem, currentItem);
                    updateCartSummary();
                }
            });

            increaseChildren.addEventListener('click', () => {
                const current = parseInt(childrenCount.textContent);
                const newValue = current + 1;
                childrenCount.textContent = newValue;

                // Get latest item from cart to preserve ages
                const itemId = cartItem.getAttribute('data-item-id');
                const cartData = getCartData();
                const currentItem = cartData.find(cartItemData => cartItemData.id === itemId) || item;

                // Ensure age array has enough slots - preserve existing ages, only add null if needed
                if (!currentItem.age || !Array.isArray(currentItem.age)) {
                    currentItem.age = [];
                }

                // Filter out any existing null values to get valid ages
                const existingValidAges = currentItem.age.filter(age => age != null && age !== undefined);

                // Only extend with null if we need more slots - PRESERVE existing age values
                // If we have valid ages, keep them and add null for new children
                if (existingValidAges.length > 0) {
                    // Keep existing valid ages
                    currentItem.age = existingValidAges.slice();
                    // Add null for any new children beyond what we have valid ages for
                    while (currentItem.age.length < newValue) {
                        currentItem.age.push(null);
                    }
                    console.log('Preserved valid ages:', existingValidAges, 'Extended to:', currentItem.age);
                } else {
                    // If all ages are null, just extend the array
                    while (currentItem.age.length < newValue) {
                        currentItem.age.push(null);
                    }
                    console.log('No valid ages to preserve, initialized with nulls:', currentItem.age);
                }

                // Update age inputs in edit section if edit is open
                const editOptions = cartItem.querySelector('.edit-options');
                if (editOptions && editOptions.style.display !== 'none') {
                    updateChildrenAges(cartItem, newValue);
                }

                // Update age display (main view)
                const agesDisplay = cartItem.querySelector('.children-ages-display');
                const agesText = cartItem.querySelector('.ages-text');
                const displayValidAges = currentItem.age.filter(age => age != null && age !== undefined);
                if (displayValidAges.length > 0) {
                    const ageStrings = displayValidAges.map(age => {
                        if (typeof age === 'object' && age !== null && age.age !== undefined) {
                            return age.age;
                        }
                        return age;
                    });
                    agesText.textContent = ageStrings.join(', ');
                    agesDisplay.style.display = 'block';
                } else {
                    agesDisplay.style.display = 'none';
                }

                // Update item in cart - use currentItem which has preserved ages
                currentItem.children = newValue;
                updateCartItem(currentItem.id, currentItem);
                updateItemPrice(cartItem, currentItem);
                updateCartSummary();
            });

            // Edit functionality
            const editBtn = cartItem.querySelector('.edit-item');
            const editOptions = cartItem.querySelector('.edit-options');
            const updateBtn = cartItem.querySelector('.update-item');
            const cancelBtn = cartItem.querySelector('.cancel-edit');

            editBtn.addEventListener('click', () => {
                // Get the latest item data from cart (don't rely on closure variable)
                const itemId = cartItem.getAttribute('data-item-id');
                const cartData = getCartData();
                const currentItem = cartData.find(cartItemData => cartItemData.id === itemId);

                console.log('Edit button clicked, itemId:', itemId);
                console.log('Current item from cart:', currentItem);

                if (!currentItem) {
                    console.error('Item not found in cart:', itemId);
                    return;
                }

                // Populate date input with current date
                const dateInput = cartItem.querySelector('.update-date');
                if (dateInput && currentItem.date) {
                    dateInput.value = currentItem.date;
                }

                // Populate children ages inputs
                const agesContainer = cartItem.querySelector('.children-ages');
                if (!agesContainer) {
                    console.error('Ages container not found');
                    return;
                }

                agesContainer.innerHTML = '';
                const currentChildrenCount = parseInt(childrenCount.textContent) || 0;

                console.log('Current children count:', currentChildrenCount);
                console.log('Current item age:', currentItem.age);
                console.log('Current item age type:', typeof currentItem.age);
                console.log('Current item age is array:', Array.isArray(currentItem.age));
                console.log('Full currentItem object:', JSON.stringify(currentItem, null, 2));

                if (currentChildrenCount > 0) {
                    // Use existing ages if available - ensure currentItem.age is an array
                    let existingAges = [];
                    if (currentItem.age) {
                        if (Array.isArray(currentItem.age)) {
                            existingAges = currentItem.age;
                            console.log('Age is already an array, length:', existingAges.length);
                        } else if (typeof currentItem.age === 'string') {
                            // Handle case where age might be stored as a JSON string
                            try {
                                existingAges = JSON.parse(currentItem.age);
                                console.log('Parsed age from JSON string:', existingAges);
                            } catch (e) {
                                // Handle case where age might be stored as a single value or object
                                existingAges = [currentItem.age];
                                console.log('Treated age as single value:', existingAges);
                            }
                        } else {
                            // Handle case where age might be stored as a single value or object
                            existingAges = [currentItem.age];
                            console.log('Treated age as single value:', existingAges);
                        }
                    } else {
                        console.log('⚠️ No age property found in currentItem');
                    }

                    console.log('Final existing ages array:', existingAges);
                    console.log('Existing ages array length:', existingAges.length);
                    console.log('Existing ages array details:', existingAges.map((age, idx) => `[${idx}]: ${age} (type: ${typeof age}, null: ${age === null}, undefined: ${age === undefined})`));

                    for (let i = 1; i <= currentChildrenCount; i++) {
                        const input = document.createElement('input');
                        input.type = 'number';
                        input.min = '3';
                        input.max = '12';
                        input.placeholder = `Child ${i} Age`;
                        input.className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500';
                        input.id = `child-age-${i}`;
                        input.required = true;
                        input.title = 'Please enter age between 3-12 years';

                        // Pre-fill with existing age if available (check for null/undefined/0)
                        const ageIndex = i - 1;
                        console.log(`\n--- Processing Child ${i} (index ${ageIndex}) ---`);
                        console.log(`Existing ages array length: ${existingAges.length}`);

                        if (ageIndex < existingAges.length) {
                            let ageValue = existingAges[ageIndex];
                            console.log(`Age value at index ${ageIndex}:`, ageValue);
                            console.log(`  - Type: ${typeof ageValue}`);
                            console.log(`  - Is null: ${ageValue === null}`);
                            console.log(`  - Is undefined: ${ageValue === undefined}`);
                            console.log(`  - String representation: "${String(ageValue)}"`);

                            // Skip null/undefined values but still create the input
                            if (ageValue != null && ageValue !== undefined && ageValue !== 'null' && ageValue !== '' && String(ageValue) !== 'null') {
                                // Handle object format: {age: 5}
                                if (typeof ageValue === 'object' && ageValue !== null && !Array.isArray(ageValue) && ageValue.age !== undefined) {
                                    ageValue = ageValue.age;
                                    console.log(`  ✓ Extracted age from object: ${ageValue}`);
                                }

                                // Convert to number and set value if valid
                                let numValue;
                                if (typeof ageValue === 'number') {
                                    numValue = ageValue;
                                } else if (typeof ageValue === 'string' && ageValue.trim() !== '') {
                                    numValue = parseInt(ageValue.trim());
                                } else {
                                    numValue = parseInt(ageValue);
                                }

                                console.log(`  - Converted to number: ${numValue}`);
                                console.log(`  - Is NaN: ${isNaN(numValue)}`);
                                console.log(`  - Valid range (3-12): ${numValue >= 3 && numValue <= 12}`);

                                if (!isNaN(numValue) && numValue >= 3 && numValue <= 12) {
                                    input.value = numValue;
                                    console.log(`  ✅ SUCCESS: Set age input ${i} to value: ${numValue}`);
                                } else {
                                    console.log(`  ❌ FAILED: Age value ${numValue} is not valid (must be 3-12), leaving empty`);
                                }
                            } else {
                                console.log(`  ⚠️ SKIPPED: Age at index ${ageIndex} is null/undefined/empty, leaving input empty`);
                            }
                        } else {
                            console.log(`  ⚠️ MISSING: No age data at index ${ageIndex} (array length: ${existingAges.length}), leaving input empty`);
                        }
                        console.log(`--- End Child ${i} ---\n`);
                        agesContainer.appendChild(input);
                    }
                }

                if (editOptions) {
                    editOptions.style.display = 'block';
                }
                if (editBtn) {
                    editBtn.style.display = 'none';
                }
            });

            cancelBtn.addEventListener('click', () => {
                editOptions.style.display = 'none';
                editBtn.style.display = 'block';
            });

            updateBtn.addEventListener('click', () => {
                // Get the latest item data from cart (don't rely on closure variable)
                const itemId = cartItem.getAttribute('data-item-id');
                const cartData = getCartData();
                const currentItem = cartData.find(cartItemData => cartItemData.id === itemId);

                if (!currentItem) {
                    console.error('Item not found in cart:', itemId);
                    alert('Item not found. Please refresh the page.');
                    return;
                }

                // Collect children ages from inputs
                const ageArray = [];
                const currentChildrenCount = parseInt(childrenCount.textContent) || 0;

                console.log('Update button clicked, children count:', currentChildrenCount);

                if (currentChildrenCount > 0) {
                    for (let i = 1; i <= currentChildrenCount; i++) {
                        const ageInput = cartItem.querySelector(`#child-age-${i}`);
                        if (ageInput && ageInput.value) {
                            const age = parseInt(ageInput.value);
                            if (age >= 3 && age <= 12) {
                                ageArray.push(age);
                                console.log(`Collected age for child ${i}:`, age);
                            } else {
                                alert(`Please enter valid age (3-12 years) for Child ${i}`);
                                ageInput.focus();
                                return;
                            }
                        } else if (currentChildrenCount > 0) {
                            alert(`Please enter age for Child ${i}`);
                            if (ageInput) ageInput.focus();
                            return;
                        }
                    }
                }

                console.log('Collected age array:', ageArray);

                // Get updated date
                const dateInput = cartItem.querySelector('.update-date');
                if (!dateInput || !dateInput.value) {
                    alert('Please select a travel date');
                    if (dateInput) dateInput.focus();
                    return;
                }
                const updatedDate = dateInput.value;

                // Update item in cart - preserve all existing properties
                // CRITICAL: Always use the ageArray collected from the form (user entered these)
                // If ageArray is empty, that means user didn't enter ages - but we should still save the empty array
                const updatedItem = {
                    ...currentItem, // Use current item from cart to preserve all properties
                    adults: parseInt(adultsCount.textContent) || 1,
                    children: currentChildrenCount,
                    age: ageArray, // ALWAYS use the ages collected from the form inputs (user entered these)
                    date: updatedDate
                };

                console.log('=== UPDATED ITEM BEFORE SAVE ===');
                console.log('Collected ageArray from form:', ageArray);
                console.log('Updated item:', updatedItem);
                console.log('Updated item age:', updatedItem.age);
                console.log('Updated item age length:', updatedItem.age.length);
                console.log('Updated item children:', updatedItem.children);
                console.log('Updated item age array details:', updatedItem.age.map((age, idx) => `[${idx}]: ${age} (type: ${typeof age})`).join(', '));

                console.log('=== CALLING updateCartItem ===');
                console.log('Item ID to update:', item.id);
                console.log('Updated item to save:', updatedItem);

                updateCartItem(item.id, updatedItem);

                // Verify it was saved
                setTimeout(() => {
                    const verifyCart = getCartData();
                    const verifyItem = verifyCart.find(i => i.id === item.id);
                    if (verifyItem) {
                        console.log('=== VERIFICATION AFTER UPDATE ===');
                        console.log('Saved item age:', verifyItem.age);
                        console.log('Saved item age length:', Array.isArray(verifyItem.age) ? verifyItem.age.length : 'N/A');
                        console.log('Saved item age values:', Array.isArray(verifyItem.age) ? verifyItem.age : 'N/A');
                        if (Array.isArray(verifyItem.age) && verifyItem.age.length > 0) {
                            const validAges = verifyItem.age.filter(a => a != null && a !== undefined);
                            console.log('Valid ages count:', validAges.length);
                            if (validAges.length > 0) {
                                console.log('✅ SUCCESS: Ages saved correctly!', validAges);
                            } else {
                                console.error('❌ ERROR: Ages saved but all are null!', verifyItem.age);
                            }
                        } else {
                            console.error('❌ ERROR: Age array is empty or invalid!');
                        }
                    }
                }, 100);

                editOptions.style.display = 'none';
                editBtn.style.display = 'block';
                loadCartItems(); // Reload to reflect changes
            });

            // Remove item
            const removeBtn = cartItem.querySelector('.remove-item');
            removeBtn.addEventListener('click', () => {
                showRemoveConfirmModal(item.id, item.title);
            });
        }

        function updateItemPrice(cartItem, item) {
            const adults = parseInt(cartItem.querySelector('.adults-count').textContent) || 1;
            const children = parseInt(cartItem.querySelector('.children-count').textContent) || 0;
            const adultAmount = parseFloat(item.amount) || 0;
            const childAmount = parseFloat(item.childAmount) || 0;
            const totalPrice = (adultAmount * adults) + (childAmount * children);
            cartItem.querySelector('.item-price').textContent = `AED ${numberWithCommas(totalPrice.toFixed(2))}`;
        }

        function updateChildrenAges(cartItem, count) {
            const agesContainer = cartItem.querySelector('.children-ages');
            if (!agesContainer) return; // Return early if container doesn't exist

            agesContainer.innerHTML = '';

            // Get existing ages from cart item data
            const itemId = cartItem.getAttribute('data-item-id');
            const cartData = getCartData();
            const currentItem = cartData.find(item => item.id === itemId);

            // Ensure existingAges is an array and filter out null values for pre-filling
            let existingAges = [];
            if (currentItem && currentItem.age) {
                if (Array.isArray(currentItem.age)) {
                    existingAges = currentItem.age;
                } else {
                    existingAges = [currentItem.age];
                }
            }

            for (let i = 1; i <= count; i++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '3';
                input.max = '12';
                input.placeholder = `Child ${i} Age`;
                input.className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500';
                input.id = `child-age-${i}`;
                input.required = true;
                input.title = 'Please enter age between 3-12 years';

                // Pre-fill with existing age if available (use i-1 for 0-based array index)
                const ageIndex = i - 1;
                if (ageIndex < existingAges.length && existingAges[ageIndex] != null && existingAges[ageIndex] !== undefined) {
                    let ageValue = existingAges[ageIndex];
                    // Handle object format: {age: 5}
                    if (typeof ageValue === 'object' && ageValue !== null && ageValue.age !== undefined) {
                        ageValue = ageValue.age;
                    }
                    // Convert to number and validate
                    const numValue = typeof ageValue === 'number' ? ageValue : parseInt(ageValue);
                    if (!isNaN(numValue) && numValue >= 3 && numValue <= 12) {
                        input.value = numValue;
                    }
                }

                agesContainer.appendChild(input);
            }
        }

        function updateCartSummary() {
            try {
                const cartData = getCartData();
                let subtotal = 0;

                if (cartData && cartData.length > 0) {
                    cartData.forEach(item => {
                        const adultAmount = parseFloat(item.amount) || 0;
                        const childAmount = parseFloat(item.childAmount) || 0;
                        const adults = item.adults || 1;
                        const children = item.children || 0;
                        const itemTotal = (adultAmount * adults) + (childAmount * children);
                        subtotal += itemTotal;
                    });
                }

                if (cartSubtotal) {
                    cartSubtotal.textContent = `AED ${numberWithCommas(subtotal.toFixed(2))}`;
                }
                if (cartTotal) {
                    cartTotal.textContent = `AED ${numberWithCommas(subtotal.toFixed(2))}`;
                }
                if (checkoutBtn) {
                    checkoutBtn.disabled = subtotal === 0;
                }
            } catch (error) {
                console.error('Error updating cart summary:', error);
            }
        }

        function showEmptyCart() {
            try {
                if (emptyCartState) {
                    emptyCartState.style.display = 'block';
                }
                if (cartItemsContainer) {
                    cartItemsContainer.style.display = 'none';
                }
                if (checkoutBtn) {
                    checkoutBtn.disabled = true;
                }
            } catch (error) {
                console.error('Error showing empty cart:', error);
            }
        }

        function hideEmptyCart() {
            try {
                if (emptyCartState) {
                    emptyCartState.style.display = 'none';
                }
                if (cartItemsContainer) {
                    cartItemsContainer.style.display = 'block';
                }
            } catch (error) {
                console.error('Error hiding empty cart:', error);
            }
        }

        // Checkout flow (similar to uknow-trip)
        checkoutBtn.addEventListener('click', function() {
            const cartData = getCartData();
            if (!cartData || cartData.length === 0) {
                alert('Your cart is empty');
                return;
            }
            openEnquiryModal();
        });

        enquiryClose.addEventListener('click', closeEnquiryModal);
        enquiryCancel.addEventListener('click', closeEnquiryModal);

        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const cartData = getCartData();
            if (!cartData || cartData.length === 0) {
                alert('Your cart is empty');
                closeEnquiryModal();
                return;
            }

            const name = document.getElementById('enq-name').value.trim();
            const email = document.getElementById('enq-email').value.trim();
            const phone = document.getElementById('enq-phone').value.trim();

            if (!name || !email || !phone) {
                alert('Please fill all the fields.');
                return;
            }

            if (cartOtp && !cartOtp.requireVerified()) {
                return;
            }

            // Attach contact to first item (mirrors uknow-trip)
            cartData[0].name = name;
            cartData[0].email = email;
            cartData[0].phone = phone;

            // Normalize payload for backend expectations
            const normalized = cartData.map((it) => {
                const adults = Number(it.adults || 1);
                const children = Number(it.children || 0);
                const age = Array.isArray(it.age) ? it.age : [];
                return {
                    ...it,
                    adults,
                    children,
                    age, // ensure field exists to avoid PHP notices
                    date: it.date || ''
                };
            });

            // Button loading state
            const btnText = enquirySubmit.querySelector('.btn-text');
            btnText.innerHTML = '<i class="fi fi-rr-spinner animate-spin mr-2"></i>Sending..';
            enquirySubmit.disabled = true;

            // Compute total amount for email summary
            const totalAmount = normalized.reduce((sum, it) => {
                const a = Number(it.amount || 0) * Number(it.adults || 1);
                const c = Number(it.childAmount || 0) * Number(it.children || 0);
                return sum + a + c;
            }, 0);

            // Use shared email API like package-details
            sendCartEnquiryEmail(name, email, phone, normalized, totalAmount, 'AED')
                .then((success) => {
                    if (!success) throw new Error('Enquiry submission failed');
                    enquiryForm.reset();
                    if (cartOtp) cartOtp.reset();
                    closeEnquiryModal();
                    clearCart();
                    window.location.href = './thankyou.php';
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again.');
                })
                .finally(() => {
                    btnText.textContent = 'Send enquiry';
                    enquirySubmit.disabled = false;
                });
        });

        function openEnquiryModal() {
            enquiryModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            if (cartOtp) cartOtp.reset();
        }

        function closeEnquiryModal() {
            enquiryModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            enquiryForm.reset();
            if (cartOtp) cartOtp.reset();
        }

        function openSuccessModal(email) {
            successEmail.textContent = email;
            enquirySuccess.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }
        successClose.addEventListener('click', function() {
            enquirySuccess.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            window.location.href = './index.php';
        });

        // Remove confirmation modal
        let itemToRemoveId = null;

        function showRemoveConfirmModal(itemId, itemTitle) {
            itemToRemoveId = itemId;
            removeItemName.textContent = itemTitle || 'this item';
            removeConfirmModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }

        function closeRemoveConfirmModal() {
            removeConfirmModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            itemToRemoveId = null;
        }

        if (removeCancelBtn) {
            removeCancelBtn.addEventListener('click', closeRemoveConfirmModal);
        }

        if (removeConfirmBtn) {
            removeConfirmBtn.addEventListener('click', function() {
                if (itemToRemoveId) {
                    removeCartItem(itemToRemoveId);
                    loadCartItems();
                }
                closeRemoveConfirmModal();
            });
        }

        // Close modal when clicking on backdrop
        if (removeConfirmModal) {
            removeConfirmModal.addEventListener('click', function(e) {
                if (e.target === removeConfirmModal || e.target.classList.contains('bg-opacity-40')) {
                    closeRemoveConfirmModal();
                }
            });
        }

        // Helper functions - match script.php format
        function getCartData() {
            const cartData = localStorage.getItem('cartItem');
            if (!cartData) return [];
            try {
                // Cart data is stored as comma-separated JSON objects: "{...},{...}"
                // Need to wrap in brackets to make it a valid JSON array: "[{...},{...}]"
                return JSON.parse('[' + cartData + ']');
            } catch (e) {
                console.error('Error parsing cart data:', e);
                return [];
            }
        }

        function setCartData(data) {
            if (data.length === 0) {
                localStorage.removeItem('cartItem');
            } else {
                let cookieData = '';
                data.forEach((item, i) => {
                    cookieData += JSON.stringify(item);
                    if (i < data.length - 1) cookieData += ',';
                });
                localStorage.setItem('cartItem', cookieData);
            }
            // Update cart counter if function exists
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
        }

        function updateCartItem(itemId, updatedItem) {
            const cartData = getCartData();
            const index = cartData.findIndex(item => item.id === itemId);
            if (index !== -1) {
                // Preserve existing age data if new item doesn't have valid ages
                const existingItem = cartData[index];
                console.log('=== updateCartItem ===');
                console.log('Item ID:', itemId);
                console.log('Existing item age:', existingItem.age);
                console.log('Updated item age:', updatedItem.age);

                // Check if updated item has REAL ages (not all null)
                const updatedValidAges = updatedItem.age && Array.isArray(updatedItem.age) ?
                    updatedItem.age.filter(age => age != null && age !== undefined) : [];
                const updatedHasAges = updatedValidAges.length > 0;

                console.log('Updated item age array:', updatedItem.age);
                console.log('Updated has valid ages:', updatedHasAges, 'Valid ages:', updatedValidAges);

                // CRITICAL: If updated item has valid ages, USE THEM (user entered new ages) - OVERRIDE everything
                if (updatedHasAges) {
                    console.log('✅ Using updated ages (user entered new ages):', updatedItem.age);
                    // Keep the updated ages as-is - don't change anything
                    // The age array from the update form should be used directly
                } else {
                    // If no valid ages in updated item, check if we should preserve existing
                    if (existingItem && Array.isArray(existingItem.age) && existingItem.age.length > 0) {
                        // Check if existing item has REAL ages (not all null)
                        const existingValidAges = existingItem.age.filter(age => age != null && age !== undefined);
                        const existingHasAges = existingValidAges.length > 0;

                        console.log('Existing has valid ages:', existingHasAges, 'Valid ages:', existingValidAges);

                        // If existing item has valid ages but updated doesn't, preserve existing ones
                        if (existingHasAges && updatedItem.children >= existingItem.children) {
                            // Preserve existing valid ages for children that still exist
                            const preservedAges = existingValidAges.slice(0, updatedItem.children);
                            // Fill remaining slots with null if more children were added
                            while (preservedAges.length < updatedItem.children) {
                                preservedAges.push(null);
                            }
                            updatedItem.age = preservedAges;
                            console.log('✅ Preserved existing valid ages:', preservedAges);
                        } else if (!existingHasAges && updatedItem.children > 0) {
                            // No valid ages anywhere - use the empty array from update form
                            updatedItem.age = updatedItem.age || [];
                            console.log('⚠️ No valid ages found, using empty array:', updatedItem.age);
                        }
                    } else if (updatedItem.children > 0 && (!updatedItem.age || updatedItem.age.length === 0)) {
                        // Initialize age array if it doesn't exist
                        updatedItem.age = [];
                        console.log('✅ Initialized empty age array:', updatedItem.age);
                    }
                }

                cartData[index] = updatedItem;
                setCartData(cartData);
                console.log('Final updated item age:', updatedItem.age);
                console.log('=== updateCartItem complete ===');
            }
        }

        function removeCartItem(itemId) {
            const cartData = getCartData();
            const filteredData = cartData.filter(item => item.id !== itemId);
            setCartData(filteredData);
            // Update cart counter if function exists
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
        }

        function clearCart() {
            localStorage.removeItem('cartItem');
            // Update cart counter if function exists
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
        }

        function numberWithCommas(x) {
            if (!x) return x;
            const parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }
    });
</script>

</body>

</html>
