<!-- Add to Cart Button Component -->
<button onclick="addItemToCart(this)" 
        class="add-to-cart-btn bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
        data-item-id=""
        data-item-type=""
        data-item-title=""
        data-item-thumbnail=""
        data-item-amount=""
        data-item-child-amount=""
        data-item-date=""
        data-item-destination-id=""
        data-adults="1"
        data-children="0">
    <i class="fi fi-rr-shopping-cart mr-2"></i>
    Add to Cart
</button>

<script>
function addItemToCart(button) {
    const itemId = button.getAttribute('data-item-id') || 'item-' + Date.now();
    const itemType = button.getAttribute('data-item-type') || 'Package';
    const itemTitle = button.getAttribute('data-item-title') || 'Travel Package';
    const itemThumbnail = button.getAttribute('data-item-thumbnail') || '';
    const itemAmount = parseInt(button.getAttribute('data-item-amount')) || 200;
    const itemChildAmount = parseInt(button.getAttribute('data-item-child-amount')) || 150;
    const itemDate = button.getAttribute('data-item-date') || new Date().toISOString().split('T')[0];
    const destinationId = button.getAttribute('data-item-destination-id') || '';
    const adults = parseInt(button.getAttribute('data-adults')) || 1;
    const children = parseInt(button.getAttribute('data-children')) || 0;
    
    const cartItem = {
        id: itemId,
        type: itemType,
        title: itemTitle,
        thumbnail: itemThumbnail,
        amount: itemAmount,
        childAmount: itemChildAmount,
        date: itemDate,
        destinationId: destinationId,
        adults: adults,
        children: children,
        age: []
    };
    
    // Add to cart
    window.addToCart(cartItem);
    
    // Show success message
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
</script>
