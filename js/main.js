document.addEventListener('DOMContentLoaded', () => {

  // Debug: ตรวจสอบว่า JS ถูกโหลด
  console.log('JS Loaded');

  // Fade-in sections
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  sections.forEach(sec => observer.observe(sec));

  // Light/Dark Mode Toggle
  const toggle = document.querySelector('.mode-toggle');
  toggle.addEventListener('click', () => {
    const body = document.body;
    if(body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      toggle.textContent = '🌙';
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      toggle.textContent = '☀️';
    }
    console.log('Theme toggled:', body.className);
  });

  // Modal
  const modalBtns = document.querySelectorAll('.modal-btn');
  const modals = document.querySelectorAll('.modal');
  const closeBtns = document.querySelectorAll('.close');

  modalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modal);
      if(modal) modal.style.display = 'block';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.parentElement.style.display = 'none';
    });
  });

  window.onclick = (event) => {
    modals.forEach(modal => {
      if(event.target == modal) modal.style.display = 'none';
    });
  };

});