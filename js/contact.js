/** contact.js */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('#contact-submit');
    btn.textContent = 'Sending...'; btn.disabled = true;
    const fd = Object.fromEntries(new FormData(e.target));
    const result = await MT.apiPost('/api/enquiry/contact', fd);
    const al = document.getElementById('contact-alert');
    if (al) {
      al.classList.remove('hidden');
      if (result && (result.success || result === '1')) {
        al.className = 'text-center py-3 rounded-xl text-sm font-dm-sans bg-green-50 text-green-700';
        al.textContent = 'Message sent! We will get back to you soon.';
        e.target.reset();
      } else {
        al.className = 'text-center py-3 rounded-xl text-sm font-dm-sans bg-red-50 text-red-700';
        al.textContent = 'Failed to send. Please try again or call us directly.';
      }
    }
    btn.textContent = 'Send Message'; btn.disabled = false;
  });
});
