'use strict';

export default function headerMenu() {
  const navbarToggler = document.querySelector('#mainMenuBtn');
  const body = document.querySelector('body');

  navbarToggler.addEventListener('click', () => {
    if (navbarToggler.getAttribute('aria-expanded') === 'true') {
      body.classList.add('main-menu-opened');
    } else {
      body.classList.remove('main-menu-opened');
    }
  });
}
