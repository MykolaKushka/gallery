'use strict';

import searchArea from './searchArea.js';
import headerMenu from './headerMenu.js';
import photosArea from './photosArea.js';
import themeSwitcher from './themeSwitcher.js';

export class App {
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      searchArea();
      headerMenu();
      photosArea();
      themeSwitcher();
    });
  }
}
