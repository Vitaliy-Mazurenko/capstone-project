document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('.main-nav');
  const body = document.body;
  const submenuParents = document.querySelectorAll('.main-nav-item');
  
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
    body.classList.toggle('menu-open');
  });
  
  // Обработка подменю на мобильных устройствах
  submenuParents.forEach(item => {
    const link = item.querySelector('.main-nav-link');
    const submenu = item.querySelector('.nav-submenu');
    
    if (link && submenu) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 767) {
          e.preventDefault();
          submenu.classList.toggle('show');
        }
      });
    }
  });
  
  // Закрытие меню при клике на пункт меню
  const menuLinks = nav.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 767 && !this.nextElementSibling) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        body.classList.remove('menu-open');
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
    }
  });
}); 