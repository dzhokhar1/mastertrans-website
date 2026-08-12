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
  const ground = document.querySelector('.public-header-menu-collapse-ground');
  const closeMenus = (except = null) => {
    menuItems.forEach((item) => {
      if (item === except) return;
      const panel = item.querySelector('.public-header-menu-collapse-item-content');
      if (panel) panel.style.display = 'none';
    });
    if (!except && ground) ground.style.display = 'none';
  };

  menuItems.forEach((item) => {
    const panel = item.querySelector('.public-header-menu-collapse-item-content');
    item.addEventListener('mouseenter', () => {
      closeMenus(item);
      if (panel) panel.style.display = 'flex';
      if (ground) ground.style.display = 'block';
    });
    item.addEventListener('mouseleave', () => closeMenus());
  });

  const mobileButton = document.querySelector('.public-header-button-mobile');
  const mobileMenu = document.querySelector('.public-header-menu-mobile');
  const mobileClose = document.querySelector('.public-header-menu-mobile-close');
  mobileButton?.addEventListener('click', () => { if (mobileMenu) mobileMenu.style.display = 'block'; });
  mobileClose?.addEventListener('click', () => { if (mobileMenu) mobileMenu.style.display = 'none'; });
});
