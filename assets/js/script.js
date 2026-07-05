(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-navigation');
  const years = document.querySelectorAll('#current-year, [data-current-year]');

  years.forEach(function (year) {
    year.textContent = new Date().getFullYear().toString();
  });

  if (toggle && nav) {
    const toggleLabel = toggle.querySelector('.sr-only');

    function setMenuState(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      if (toggleLabel) {
        toggleLabel.textContent = open ? 'Close navigation menu' : 'Open navigation menu';
      }
    }

    function closeMenu() {
      setMenuState(false);
    }

    toggle.addEventListener('click', function () {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!expanded);
    });

    nav.addEventListener('click', function (event) {
      if (event.target instanceof HTMLAnchorElement) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (toggle.getAttribute('aria-expanded') === 'true' &&
          !nav.contains(event.target) &&
          !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 992) {
        closeMenu();
      }
    });
  }


  document.querySelectorAll('.linkedin-share-button, .share-linkedin').forEach(function (link) {
    link.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href);
  });

  const searchInput = document.querySelector('[data-resource-search]');
  const filterButtons = document.querySelectorAll('[data-theme-filter]');
  const cards = document.querySelectorAll('[data-resource-card]');
  const count = document.querySelector('[data-resource-count]');
  const noResults = document.querySelector('[data-empty-state]');

  if (!searchInput || !filterButtons.length || !cards.length) return;

  const selectedThemes = new Set();

  function normalise(value) {
    return String(value || '').toLowerCase().trim();
  }

  function syncFilterButtons() {
    const hasThemeSelection = selectedThemes.size > 0;

    filterButtons.forEach(function (button) {
      const theme = button.dataset.themeFilter || 'all';
      const isActive = theme === 'all' ? !hasThemeSelection : selectedThemes.has(theme);
      button.setAttribute('aria-pressed', String(isActive));
      button.classList.toggle('is-active', isActive);
    });
  }

  function updateResources() {
    const term = normalise(searchInput.value);
    let visibleCount = 0;

    cards.forEach(function (card) {
      const theme = card.dataset.theme || '';
      const searchableText = normalise([
        card.dataset.title,
        card.dataset.theme,
        card.dataset.type,
        card.dataset.keywords,
        card.textContent
      ].join(' '));

      const themeMatch = selectedThemes.size === 0 || selectedThemes.has(theme);
      const textMatch = !term || searchableText.includes(term);
      const show = themeMatch && textMatch;

      card.hidden = !show;
      card.classList.toggle('is-hidden', !show);
      if (show) visibleCount += 1;
    });

    if (count) {
      count.textContent = 'Showing ' + visibleCount + (visibleCount === 1 ? ' resource' : ' resources');
    }

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }

    syncFilterButtons();
  }

  searchInput.addEventListener('input', updateResources);

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const theme = button.dataset.themeFilter || 'all';

      if (theme === 'all') {
        selectedThemes.clear();
      } else if (selectedThemes.has(theme)) {
        selectedThemes.delete(theme);
      } else {
        selectedThemes.add(theme);
      }

      updateResources();
    });
  });

  updateResources();
}());
