(function () {
  'use strict';

  const form = document.getElementById('notify-form');
  const msg = document.getElementById('form-msg');
  const error = document.getElementById('form-error');
  const submitBtn = form && form.querySelector('button[type="submit"]');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const emailInput = form.querySelector('#email');
    const email = emailInput.value.trim();

    if (!email) return;

    msg.hidden = true;
    error.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      form.hidden = true;
      msg.hidden = false;
    } catch (err) {
      console.error(err);
      var message = err.message || 'Something went wrong. Please try again.';
      if (message === 'Failed to fetch') {
        message = 'Cannot reach the server. Run npm run dev and open http://localhost:3000';
      }
      error.textContent = message;
      error.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Notify Me';
    }
  });
})();
