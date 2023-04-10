'use strict';

export default function themeSwitcher() {
  const modeBtn = document.querySelector('#modeBtn');
  const body = document.querySelector('body');

  modeBtn.addEventListener('click', (el) => {
    el.preventDefault();
    if (!body.classList.contains('dark-mode')) {
      body.classList.add('dark-mode');
      modeBtn.innerText = 'Light';
    } else {
      body.classList.remove('dark-mode');
      modeBtn.innerText = 'Dark';
    }
  });
}
