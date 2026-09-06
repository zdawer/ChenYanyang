(function () {
  'use strict';

  var dialog = document.getElementById('figure-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var image = document.getElementById('figure-viewer-image');
  var title = document.getElementById('figure-viewer-title');
  var caption = document.getElementById('figure-viewer-caption');
  var note = document.getElementById('figure-viewer-note');
  var original = document.getElementById('figure-viewer-original');
  var loading = dialog.querySelector('.figure-viewer-loading');
  var error = dialog.querySelector('.figure-viewer-error');
  var opener = null;
  var requestId = 0;

  function loadFigure(url, alt) {
    var currentRequest = ++requestId;
    var nextImage = new Image();
    nextImage.id = image.id;
    nextImage.alt = alt;
    nextImage.decoding = 'async';
    image.hidden = true;
    loading.hidden = false;
    error.hidden = true;

    function isCurrent() {
      return currentRequest === requestId && dialog.open;
    }

    function showError() {
      if (!isCurrent()) return;
      loading.hidden = true;
      error.hidden = false;
    }

    function showImage() {
      if (!isCurrent()) return;
      image.replaceWith(nextImage);
      image = nextImage;
      loading.hidden = true;
    }

    nextImage.onload = function () {
      if (!isCurrent()) return;
      if (typeof nextImage.decode === 'function') {
        nextImage.decode().then(showImage, showError);
      } else {
        showImage();
      }
    };
    nextImage.onerror = showError;
    nextImage.src = url;
  }

  document.querySelectorAll('[data-figure-viewer]').forEach(function (link) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'figure-viewer');
    link.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      title.textContent = link.dataset.figureTitle || 'Research figure';
      caption.textContent = link.dataset.figureCaption || 'Research concept';
      note.textContent = link.dataset.figureNote || '';
      note.hidden = !note.textContent;
      original.href = link.href;
      opener = link;
      dialog.showModal();
      document.body.classList.add('figure-viewer-open');
      loadFigure(link.href, link.dataset.figureAlt || title.textContent);
      event.preventDefault();
    });
  });

  dialog.querySelector('.figure-viewer-close').addEventListener('click', function () {
    dialog.close();
  });

  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });

  dialog.addEventListener('close', function () {
    requestId += 1;
    loading.hidden = true;
    document.body.classList.remove('figure-viewer-open');
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  });
})();
