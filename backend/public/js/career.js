/** career.js */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('career-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Submitting...'; btn.disabled = true;
    const formData = new FormData(e.target);
    const result = await MT.apiPost('/api/enquiry/career', formData, true);
    const al = document.getElementById('career-alert');
    if (al) {
      al.classList.remove('hidden');
      if (result && (result.success || result === '1')) {
        al.className = 'text-center py-3 rounded-xl text-sm font-dm-sans bg-green-50 text-green-700';
        al.textContent = 'Application submitted! We will review and contact you.';
        e.target.reset();
      } else {
        al.className = 'text-center py-3 rounded-xl text-sm font-dm-sans bg-red-50 text-red-700';
        al.textContent = 'Submission failed. Please try again.';
      }
    }
    btn.textContent = 'Submit Application'; btn.disabled = false;
  });
});
