/** cart.js — Cart page using existing cart logic from App.js */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('cart-root');
  if (!root) return;

  // The existing App.js has renderCartPage() — use it if available
  if (typeof renderCartPage === 'function') {
    renderCartPage();
    return;
  }

  // Fallback: read cart from localStorage and show items
  const cart = JSON.parse(localStorage.getItem('mangalam_cart') || '[]');
  if (!cart.length) {
    root.innerHTML = `
      <div class="text-center py-20">
        <i class="fi fi-rr-shopping-cart text-gray-300 text-6xl mb-4 flex justify-center"></i>
        <h2 class="text-2xl font-bold font-[Quicksand] text-gray-700 mb-3">Your cart is empty</h2>
        <p class="text-gray-500 font-dm-sans mb-8">Explore our packages and add items to your cart</p>
        <a href="/packages" class="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors font-dm-sans">Browse Packages</a>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <div id="cart-items" class="space-y-4 mb-8">
        ${cart.map((item, i) => `
          <div class="cart-item bg-white rounded-2xl border border-gray-100 shadow p-6 flex gap-4 items-start">
            <img src="${MT.resolveImg(item.image)}" alt="${item.name || ''}" class="w-24 h-20 object-cover rounded-xl" onerror="this.src='/assets/images/logo-color.png'">
            <div class="flex-1">
              <h3 class="font-bold text-gray-800 font-dm-sans mb-1">${item.name || item.title || ''}</h3>
              <p class="text-gray-500 text-sm font-dm-sans">${item.type || 'Package'}</p>
              ${item.price ? `<p class="text-gray-800 font-semibold mt-1">${MT.fmtPrice(item.price)}</p>` : ''}
            </div>
            <button onclick="removeFromCart(${i})" class="text-red-500 hover:text-red-700 transition-colors font-dm-sans text-sm">Remove</button>
          </div>`).join('')}
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 shadow p-6">
        <h3 class="text-xl font-bold font-[Quicksand] text-gray-800 mb-4">Complete Your Enquiry</h3>
        <form id="cart-enquiry-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="customer_name" placeholder="Your Name" required class="rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            <input type="email" name="customer_email" placeholder="Email" required class="rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
          </div>
          <input type="tel" name="customer_phone" placeholder="Phone" required class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
          <textarea name="message" rows="3" placeholder="Travel dates, number of people, special requests..." class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
          <button type="submit" class="w-full bg-black text-white py-3 rounded-xl font-semibold font-dm-sans hover:bg-gray-800 transition-colors">Send Enquiry</button>
          <div id="cart-alert" class="hidden text-center py-3 rounded-xl text-sm font-dm-sans"></div>
        </form>
      </div>
    </div>`;

  document.getElementById('cart-enquiry-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...'; btn.disabled = true;
    const fd = Object.fromEntries(new FormData(e.target));
    fd.cart_items = JSON.stringify(cart);
    const result = await MT.apiPost('/api/enquiry/cart', fd);
    const al = document.getElementById('cart-alert');
    if (al) {
      al.classList.remove('hidden');
      if (result && (result.success || result === '1')) {
        al.className = 'text-center py-3 rounded-xl text-sm font-dm-sans bg-green-50 text-green-700';
        al.textContent = 'Enquiry sent! Our team will contact you shortly.';
        localStorage.removeItem('mangalam_cart');
        setTimeout(() => window.location.href = '/thankyou', 1500);
      } else {
        al.className = 'text-center py-3 rounded-xl text-sm font-dm-sans bg-red-50 text-red-700';
        al.textContent = 'Failed to send. Please try again.';
      }
    }
    btn.textContent = 'Send Enquiry'; btn.disabled = false;
  });

  window.removeFromCart = (i) => {
    cart.splice(i, 1);
    localStorage.setItem('mangalam_cart', JSON.stringify(cart));
    location.reload();
  };
});
