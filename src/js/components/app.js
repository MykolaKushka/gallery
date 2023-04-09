'use strict';

import searchArea from './searchArea.js';
import headerMenu from './headerMenu.js';

export class App {
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      searchArea();
      headerMenu();
    });
  }
}
