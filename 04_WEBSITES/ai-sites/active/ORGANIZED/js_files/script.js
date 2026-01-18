// script.js — placeholder for future JavaScript (nav toggles, animations, etc.)

document.addEventListener('DOMContentLoaded', () => {
  // Example: highlight the active nav link
  const path = window.location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
});
