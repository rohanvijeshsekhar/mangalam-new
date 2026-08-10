/** about.js — About page: loads testimonials and partners */
document.addEventListener('DOMContentLoaded', async () => {
  const [testimonials, partners] = await Promise.all([
    MT.apiGet('/api/testimonials'),
    MT.apiGet('/api/partners')
  ]);

  const tGrid = document.getElementById('testimonials-grid');
  if (tGrid) {
    if (testimonials && testimonials.length) {
      tGrid.innerHTML = testimonials.slice(0, 6).map(t => R.testimonialCard(t)).join('');
    } else {
      tGrid.innerHTML = '<p class="col-span-full text-center text-gray-400 py-8">No reviews yet.</p>';
    }
  }

  const pGrid = document.getElementById('partners-grid');
  if (pGrid) {
    if (partners && partners.length) {
      pGrid.innerHTML = partners.map(p => R.partnerLogo(p)).join('');
    } else {
      pGrid.innerHTML = '';
    }
  }
});
