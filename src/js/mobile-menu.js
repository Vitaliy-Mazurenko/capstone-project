document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('.main-nav');
  const body = document.body;
  const submenuParents = document.querySelectorAll('.main-nav-item.has-submenu');
  
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
    body.classList.toggle('menu-open');
  });
  
  // Обработка подменю на мобильных устройствах
  submenuParents.forEach(item => {
    const wrapper = item.querySelector('.nav-link-wrapper');
    const toggle = item.querySelector('.submenu-toggle');
    const submenu = item.querySelector('.nav-submenu');
    
    if (wrapper && submenu) {
      wrapper.addEventListener('click', function(e) {
        if (window.innerWidth <= 767) {
          e.preventDefault();
          e.stopPropagation();
          
          // Закрываем все другие открытые подменю
          submenuParents.forEach(otherItem => {
            if (otherItem !== item) {
              const otherSubmenu = otherItem.querySelector('.nav-submenu');
              const otherToggle = otherItem.querySelector('.submenu-toggle');
              if (otherSubmenu && otherToggle) {
                otherSubmenu.classList.remove('show');
                otherToggle.classList.remove('active');
              }
            }
          });
          
          // Переключаем текущее подменю
          submenu.classList.toggle('show');
          toggle.classList.toggle('active');
        }
      });
    }
  });
  
  // Закрытие меню при клике на пункт меню
  const menuLinks = nav.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 767) {
        if (!this.closest('.has-submenu')) {
          hamburger.classList.remove('active');
          nav.classList.remove('active');
          body.classList.remove('menu-open');
        } else if (!this.closest('.nav-link-wrapper')) {
          // Если это ссылка из подменю, закрываем меню
          hamburger.classList.remove('active');
          nav.classList.remove('active');
          body.classList.remove('menu-open');
        }
      }
    });
  });
  
  // Закрытие меню при изменении размера окна
  window.addEventListener('resize', function() {
    if (window.innerWidth > 767) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      body.classList.remove('menu-open');
      document.querySelectorAll('.nav-submenu').forEach(submenu => {
        submenu.classList.remove('show');
      });
      document.querySelectorAll('.submenu-toggle').forEach(toggle => {
        toggle.classList.remove('active');
      });
    }
  });
}); 