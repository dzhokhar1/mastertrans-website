document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.public-header-control .vz-color-mode-icon');
  const themeStorageKey = 'mastertrans-color-theme';

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    root.dataset.theme = isDark ? 'dark' : 'light';
    if (themeButton) {
      themeButton.classList.toggle('mdi-weather-night', isDark);
      themeButton.classList.toggle('mdi-white-balance-sunny', !isDark);
      themeButton.dataset.ymParam = isDark ? 'dark' : 'light';
      themeButton.setAttribute('role', 'button');
      themeButton.setAttribute('tabindex', '0');
      themeButton.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
      themeButton.setAttribute('title', isDark ? 'Светлая тема' : 'Тёмная тема');
    }
  };

  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem(themeStorageKey) || 'light';
  } catch (_) {}
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = () => {
    const nextTheme = root.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem(themeStorageKey, nextTheme); } catch (_) {}
  };

  themeButton?.addEventListener('click', toggleTheme);
  themeButton?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTheme();
    }
  });

  const cityButtons = Array.from(document.querySelectorAll('.public-header-region'));
  const masterTransCities = ['Москва', 'Грозный', 'Хасавюрт', 'Махачкала', 'Ростов-на-Дону'];
  const cityStorageKey = 'mastertrans-city';
  const cityModal = document.createElement('div');
  cityModal.className = 'mt-city-modal';
  cityModal.setAttribute('role', 'dialog');
  cityModal.setAttribute('aria-modal', 'true');
  cityModal.setAttribute('aria-labelledby', 'mt-city-modal-title');
  cityModal.innerHTML = `
    <div class="mt-city-modal-inner">
      <button class="mt-city-modal-close" type="button" aria-label="Закрыть выбор города">×</button>
      <h2 class="mt-city-modal-title" id="mt-city-modal-title">Выберите ваш город</h2>
      <div class="mt-city-current" aria-live="polite"><span>Москва</span></div>
      <div class="mt-city-country"><span class="mt-city-country-flag" aria-hidden="true">🇷🇺</span><span>Россия</span></div>
      <div class="mt-city-list">${masterTransCities.map((city) => `<button class="mt-city-option" type="button" data-city="${city}">${city}</button>`).join('')}</div>
    </div>`;
  document.body.append(cityModal);

  const cityCurrent = cityModal.querySelector('.mt-city-current span');
  const cityOptions = Array.from(cityModal.querySelectorAll('.mt-city-option'));
  const cityClose = cityModal.querySelector('.mt-city-modal-close');
  let selectedCity = 'Москва';
  try {
    const storedCity = localStorage.getItem(cityStorageKey);
    if (masterTransCities.includes(storedCity)) selectedCity = storedCity;
  } catch (_) {}

  const applyCity = (city) => {
    selectedCity = city;
    cityButtons.forEach((button) => {
      const label = button.querySelector('.vz-button-title span');
      if (label) label.textContent = city;
    });
    if (cityCurrent) cityCurrent.textContent = city;
    cityOptions.forEach((option) => option.classList.toggle('is-active', option.dataset.city === city));
  };

  const openCityModal = () => {
    cityModal.classList.add('is-open');
    document.body.classList.add('mt-city-modal-open');
    cityClose?.focus();
  };
  const closeCityModal = () => {
    cityModal.classList.remove('is-open');
    document.body.classList.remove('mt-city-modal-open');
  };

  applyCity(selectedCity);
  cityButtons.forEach((button) => {
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', openCityModal);
  });
  cityClose?.addEventListener('click', closeCityModal);
  cityOptions.forEach((option) => option.addEventListener('click', () => {
    applyCity(option.dataset.city);
    try { localStorage.setItem(cityStorageKey, option.dataset.city); } catch (_) {}
    closeCityModal();
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cityModal.classList.contains('is-open')) closeCityModal();
  });

  const slides = Array.from(document.querySelectorAll('.home-banner-slider .vueperslide'));
  const slider = document.querySelector('.home-banner-slider');
  let bullets = Array.from(document.querySelectorAll('.home-banner .vueperslides__bullet'));

  if (slider && !slider.querySelector('.vueperslides__arrows')) {
    const arrows = document.createElement('div');
    arrows.className = 'vueperslides__arrows';
    arrows.innerHTML = '<button class="vueperslides__arrow vueperslides__arrow--prev" type="button" aria-label="Предыдущий слайд"><svg viewBox="0 0 9 18"><path stroke-linecap="round" d="m8 1 l-7 8 7 8"></path></svg></button><button class="vueperslides__arrow vueperslides__arrow--next" type="button" aria-label="Следующий слайд"><svg viewBox="0 0 9 18"><path stroke-linecap="round" d="m1 1 l7 8 -7 8"></path></svg></button>';
    slider.append(arrows);
  }

  if (slider && !bullets.length && slides.length > 1) {
    const navigation = document.createElement('div');
    navigation.className = 'vueperslides__bullets vueperslides__bullets--outside';
    navigation.setAttribute('role', 'tablist');
    navigation.setAttribute('aria-label', 'Навигация слайдера');
    navigation.innerHTML = slides.map((_, index) => `<button class="vueperslides__bullet${index === 0 ? ' vueperslides__bullet--active' : ''}" type="button" role="tab" aria-label="Слайд ${index + 1}"><div class="default"><span>${index + 1}</span></div></button>`).join('');
    slider.append(navigation);
    bullets = Array.from(navigation.querySelectorAll('.vueperslides__bullet'));
  }

  const previous = document.querySelector('.home-banner .vueperslides__arrow--prev');
  const next = document.querySelector('.home-banner .vueperslides__arrow--next');
  let current = 0;
  let timer;

  const showSlide = (index) => {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      const active = position === current;
      slide.classList.toggle('vueperslide--visible', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    bullets.forEach((bullet, position) => bullet.classList.toggle('vueperslides__bullet--active', position === current));
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(current + 1), 6500);
  };

  previous?.addEventListener('click', () => { showSlide(current - 1); restart(); });
  next?.addEventListener('click', () => { showSlide(current + 1); restart(); });
  bullets.forEach((bullet, index) => bullet.addEventListener('click', () => { showSlide(index); restart(); }));
  showSlide(0);
  restart();

  const menuItems = Array.from(document.querySelectorAll('.public-header-menu-collapse-item'));
  const closeMenus = (except = null) => {
    menuItems.forEach((item) => {
      if (item === except) return;
      const panel = item.querySelector('.public-header-menu-collapse-item-content');
      if (panel) panel.style.display = 'none';
      item.classList.remove('is-open');
      item.querySelector('.public-header-menu-collapse-item-title > a')?.setAttribute('aria-expanded', 'false');
    });
  };

  menuItems.forEach((item) => {
    const panel = item.querySelector('.public-header-menu-collapse-item-content');
    const title = item.querySelector('.public-header-menu-collapse-item-title > a');
    if (!panel || !title) return;
    title.setAttribute('aria-haspopup', 'true');
    title.setAttribute('aria-expanded', 'false');
    const openMenu = () => {
      closeMenus(item);
      panel.style.display = 'flex';
      item.classList.add('is-open');
      title.setAttribute('aria-expanded', 'true');
    };
    item.addEventListener('mouseenter', openMenu);
    item.addEventListener('mouseleave', () => closeMenus());
    item.addEventListener('focusin', openMenu);
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) closeMenus();
    });
  });

  const mobileButton = document.querySelector('.public-header-button-mobile');
  const mobileMenu = document.querySelector('.public-header-menu-mobile');
  const mobileClose = document.querySelector('.public-header-menu-mobile-close');
  mobileButton?.addEventListener('click', () => { if (mobileMenu) mobileMenu.style.display = 'block'; });
  mobileClose?.addEventListener('click', () => { if (mobileMenu) mobileMenu.style.display = 'none'; });

  const mobileGroups = Array.from(document.querySelectorAll('.public-header-menu-mobile .vz-collapse-info'));
  mobileGroups.forEach((group) => {
    const header = group.querySelector('.vz-collapse-info-header');
    const content = group.querySelector('.vz-collapse-info-content');
    header?.setAttribute('role', 'button');
    header?.setAttribute('tabindex', '0');
    header?.setAttribute('aria-expanded', 'false');
    const toggle = () => {
      const willOpen = content?.style.display === 'none';
      mobileGroups.forEach((other) => {
        const otherContent = other.querySelector('.vz-collapse-info-content');
        const otherHeader = other.querySelector('.vz-collapse-info-header');
        if (otherContent) otherContent.style.display = 'none';
        otherHeader?.setAttribute('aria-expanded', 'false');
      });
      if (content) content.style.display = willOpen ? 'block' : 'none';
      header?.setAttribute('aria-expanded', String(willOpen));
    };
    header?.addEventListener('click', toggle);
    header?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  });
});
