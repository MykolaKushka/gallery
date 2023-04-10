'use strict';

export default function photosArea() {
  const contentPhotos = document.querySelector('#content-photos');
  const contentPhotosLength = document.querySelector(
    '#content-photos-length span'
  );
  let photos = [];
  const description = `And here full text doesn't fit, and at the very end of it we should show a ere full text doesn't fit, and at the very end of it we should`;

  const shave = (target, maxHeight, opts) => {
    if (!maxHeight) throw Error('maxHeight is required');
    let els =
      typeof target === 'string' ? document.querySelectorAll(target) : target;
    if (!('length' in els)) els = [els];

    const defaults = {
      character: '…',
      classname: 'js-shave',
      spaces: true,
    };
    const character = (opts && opts.character) || defaults.character;
    const classname = (opts && opts.classname) || defaults.classname;
    const spaces = opts && opts.spaces === false ? false : defaults.spaces;
    // const charHtml = document.createElement('span');
    // charHtml.classList.add('js-shave-char');
    // charHtml.innerText = character;
    const charHtml = `<span class="js-shave-char">${character}</span>`;

    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      const span = el.querySelector(`.${classname}`);

      // If element text has already been shaved
      if (span) {
        // Remove the ellipsis to recapture the original text
        el.removeChild(el.querySelector('.js-shave-char'));
        el.textContent = el.textContent; // nuke span, recombine text
      }

      // If already short enough, we're done
      if (el.offsetHeight < maxHeight) continue;

      const fullText = el.textContent;
      const words = spaces ? fullText.split(' ') : fullText;

      // If 0 or 1 words, we're done
      if (words.length < 2) continue;

      // Binary search for number of words which can fit in allotted height
      let max = words.length - 1;
      let min = 0;
      let pivot;
      while (min < max) {
        pivot = (min + max + 1) >> 1;
        el.textContent = spaces
          ? words.slice(0, pivot).join(' ')
          : words.slice(0, pivot);
        el.insertAdjacentHTML('beforeend', charHtml);
        if (el.offsetHeight > maxHeight) max = spaces ? pivot - 1 : pivot - 2;
        else min = pivot;
      }

      el.textContent = spaces
        ? words.slice(0, max).join(' ')
        : words.slice(0, max);
      el.insertAdjacentHTML('beforeend', charHtml);
      const diff = spaces ? words.slice(max + 1).join(' ') : words.slice(max);

      el.insertAdjacentHTML(
        'beforeend',
        `<span class="${classname}" style="display:none;">${diff}</span>`
      );
    }
  };

  const createCard = (item) => {
    const col = document.createElement('div');
    col.classList.add('col-lg-6', 'col-md-12', 'col-sm-6', 'mb-4');

    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const photoCardImage = document.createElement('div');
    photoCardImage.classList.add('photo-card-image');
    photoCardImage.style.backgroundImage = `url("${item.download_url}")`;

    const photoCardContent = document.createElement('div');
    photoCardContent.classList.add('photo-card-content', 'p-4');
    const photoCardContentTitle = document.createElement('h3');
    photoCardContentTitle.classList.add('fs-24', 'text-dark', 'fw-700');
    photoCardContentTitle.innerText = item.author;
    photoCardContent.append(photoCardContentTitle);
    const photoCardText = document.createElement('div');
    photoCardText.classList.add('photo-card-text');
    photoCardText.innerText = description;
    photoCardContent.append(photoCardText);

    const photoCardFooter = document.createElement('div');
    photoCardFooter.classList.add('photo-card-footer', 'p-3', 'd-flex');
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('btn', 'btn-primary', 'me-3');
    saveBtn.innerText = 'Save to collection';
    photoCardFooter.append(saveBtn);
    const shareBtn = document.createElement('button');
    shareBtn.classList.add('btn', 'btn-secondary');
    shareBtn.innerText = 'Share';
    photoCardFooter.append(shareBtn);

    photoCard.append(photoCardImage);
    photoCard.append(photoCardContent);
    photoCard.append(photoCardFooter);
    col.append(photoCard);
    contentPhotos.append(col);
    shave(photoCardText, 50);

    if (photoCardText.querySelector('.js-shave-char')) {
      const showMoreText = document.createElement('div');
      showMoreText.classList.add(
        'photo-card-more',
        'text-dark',
        'fw-500',
        'mt-2',
        'cursor-pointer'
      );
      showMoreText.innerText = 'Show more';
      photoCardText.append(showMoreText);
    }
  };

  const showMoreText = () => {
    if (document.querySelector('.photo-card-more')) {
      const photoCardMore = document.querySelectorAll('.photo-card-more');
      photoCardMore.forEach((el) => {
        el.addEventListener('click', () => {
          if (!el.classList.contains('shown')) {
            el.classList.add('shown');
            el.innerText = 'Show less';
            const parent = el.closest('.photo-card-text');
            parent.querySelector('.js-shave-char').style.display = 'none';
            parent.querySelector('.js-shave').style.display = 'inline-block';
          } else {
            el.classList.remove('shown');
            el.innerText = 'Show more';
            const parent = el.closest('.photo-card-text');
            parent.querySelector('.js-shave-char').style.display =
              'inline-block';
            parent.querySelector('.js-shave').style.display = 'none';
          }
        });
      });
    }
  };

  fetch('https://picsum.photos/v2/list')
    .then((response) => response.json())
    .then((json) => {
      photos = json;
      if (photos.length > 0) {
        contentPhotosLength.innerText = photos.length;
        photos.map(function (el) {
          createCard(el);
        });
        showMoreText();
      }
    });
}
