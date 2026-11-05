(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let chosenTheme = null;
  try {
    const saved = localStorage.getItem('yuehao-theme');
    if (saved === 'light' || saved === 'dark') chosenTheme = saved;
  } catch { /* Use the system preference when storage is unavailable. */ }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#20201e' : '#f8f6f1';
    const button = document.querySelector('.theme-toggle');
    if (button) {
      const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-label', label);
      button.title = label;
    }
  }

  applyTheme(chosenTheme || (preference.matches ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    if (!button) return;
    applyTheme(root.dataset.theme);
    button.hidden = false;
    button.addEventListener('click', () => {
      chosenTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(chosenTheme);
      try { localStorage.setItem('yuehao-theme', chosenTheme); } catch { /* Switching still works without storage. */ }
    });
  });

  preference.addEventListener('change', (event) => {
    if (!chosenTheme) applyTheme(event.matches ? 'dark' : 'light');
  });
})();
