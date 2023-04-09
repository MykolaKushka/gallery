'use strict';

const searchArea = () => {
  if (
    typeof document.querySelector('#headerSearch') != 'undefined' &&
    document.querySelector('#headerSearch') != null
  ) {
    const headerSearch = document.querySelector('#headerSearch');
    const headerSearchArea = document.querySelector('.header-search');

    const checkheaderSearch = () => {
      if (headerSearch.value.length > 0) {
        headerSearch.classList.add('visible');
        headerSearchArea.classList.add('is-visible');
      } else {
        headerSearch.classList.remove('visible');
        headerSearchArea.classList.remove('is-visible');
      }
    };

    headerSearch.addEventListener('input', checkheaderSearch);

    checkheaderSearch();
  }
};

export default searchArea;
