(function () {
  'use strict';

  var dialog = document.getElementById('figure-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var image = document.getElementById('figure-viewer-image');
  var title = document.getElementById('figure-viewer-title');
  var caption = document.getElementById('figure-viewer-caption');
  var note = document.getElementById('figure-viewer-note');
  var original = document.getElementById('figure-viewer-original');
  var error = dialog.querySelector('.figure-viewer-error');
  var opener = null;

  document.querySelectorAll('[data-figure-viewer]').forEach(function (link) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'figure-viewer');
    link.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      title.textContent = link.dataset.figureTitle || 'Research figure';
      caption.textContent = link.dataset.figureCaption || 'Research concept';
      note.textContent = link.dataset.figureNote || '';
      note.hidden = !note.textContent;
      image.alt = link.dataset.figureAlt || title.textContent;
      error.hidden = true;
      image.hidden = false;
      image.src = link.href;
      original.href = link.href;
      opener = link;
      dialog.showModal();
      document.body.classList.add('figure-viewer-open');
      event.preventDefault();
    });
  });

  image.addEventListener('error', function () {
    if (!dialog.open) return;
    image.hidden = true;
    error.hidden = false;
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
    document.body.classList.remove('figure-viewer-open');
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  });
})();
