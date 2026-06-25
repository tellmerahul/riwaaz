(function () {
  'use strict';

  const form = document.getElementById('notify-form');
  const msg = document.getElementById('form-msg');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.hidden = true;
    msg.hidden = false;
  });
})();
