
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const result = document.getElementById('form-result');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    result.textContent = '';

    const name = form.name;
    const email = form.email;
    const address = form.address;
    const subject = form.subject;
    const phone = form.phone;
    const message = form.message;

    // Reset previous validation state
    [name, email, message,address,subject,phone ].forEach(field => field.classList.remove('is-invalid'));

    let valid = true;
    if(!name.value.trim()) { name.classList.add('is-invalid'); valid = false; }
    if(!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) { email.classList.add('is-invalid'); valid = false; }
    if(!message.value.trim() || message.value.trim().length < 10) { message.classList.add('is-invalid'); valid = false; }
    if (!address.value.trim() || address.value.trim().length < 5) {address.classList.add('is-invalid');valid = false;}
    if (!subject.value.trim()) {subject.classList.add('is-invalid'); valid = false;}
    if (!phone.value.trim() ||!/^[\d\+\-\s]{10,20}$/.test(phone.value.trim())) {phone.classList.add('is-invalid');valid = false;}
    if(!valid) {
      result.innerHTML = '<div class="text-danger">Please fix the errors above.</div>';
      const firstInvalid = form.querySelector('.is-invalid');
      if(firstInvalid) firstInvalid.focus();
      return;
    }

    // Disable submit and show sending state
    const origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const formData = new FormData(form);
      const response = await fetch('contact.php', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        form.reset();
        window.location.href = 'thank-you.html';
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.error(err);
      result.innerHTML = '<div class="text-danger">An error occurred. Please try again later.</div>';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
      setTimeout(() => { result.textContent = ''; }, 6000);
    }
  });
}

function setupApplicationForm() {
  const form = document.getElementById('application-form');
  if (!form) return;

  // Pre-fill position from URL
  const urlParams = new URLSearchParams(window.location.search);
  const jobTitle = urlParams.get('job');
  if (jobTitle) {
    document.getElementById('position').value = jobTitle;
  }

  const result = document.getElementById('form-result');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    result.textContent = '';

    const name = form.name;
    const email = form.email;
    const phone = form.phone;
    const cv = form.cv;

    // Basic Validation
    let valid = true;
    [name, email, phone, cv].forEach(field => field.classList.remove('is-invalid'));

    if(!name.value.trim()) { name.classList.add('is-invalid'); valid = false; }
    if(!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) { email.classList.add('is-invalid'); valid = false; }
    if (!phone.value.trim() ||!/^[\d\+\-\s]{10,20}$/.test(phone.value.trim())) {phone.classList.add('is-invalid');valid = false;}
    if(cv.files.length === 0) { cv.classList.add('is-invalid'); valid = false; }

    if(!valid) {
      result.innerHTML = '<div class="text-danger">Please fix the errors above.</div>';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const formData = new FormData(form);
      const response = await fetch('apply.php', { method: 'POST', body: formData });
      
      if (response.ok) {
        form.reset();
        window.location.href = 'thank-you.html';
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      result.innerHTML = '<div class="text-danger">Failed to submit application. Please try again.</div>';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });
}

function setupOrderForm() {
  const form = document.getElementById('order-form');
  if (!form) return;
  const result = document.getElementById('form-result');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    result.textContent = '';

    const name = form.name;
    const email = form.email;
    const phone = form.phone;
    const product = form.product;
    const details = form.details;

    [name, email, phone, product, details].forEach(field => field.classList.remove('is-invalid'));

    let valid = true;
    if(!name.value.trim()) { name.classList.add('is-invalid'); valid = false; }
    if(!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) { email.classList.add('is-invalid'); valid = false; }
    if (!phone.value.trim() ||!/^[\d\+\-\s]{10,20}$/.test(phone.value.trim())) {phone.classList.add('is-invalid');valid = false;}
    if(!product.value) { product.classList.add('is-invalid'); valid = false; }
    if(!details.value.trim()) { details.classList.add('is-invalid'); valid = false; }

    if(!valid) {
      result.innerHTML = '<div class="text-danger">Please fix the errors above.</div>';
      return;
    }

    const origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      // Simulate submission or send to backend
      form.reset();
      window.location.href = 'thank-you.html';
    } catch (err) {
      result.innerHTML = '<div class="text-danger">An error occurred. Please try again.</div>';
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
    }
  });
}

function init() {
  setupContactForm();
  setupApplicationForm();
  setupOrderForm();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// init when DOM ready
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();