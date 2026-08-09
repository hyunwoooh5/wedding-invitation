document.addEventListener('DOMContentLoaded', function () {
  const langToggle = document.getElementById('lang-toggle');
  const defaultLang = 'ko';
  const supportedLangs = ['ko', 'tw'];
  const htmlLangByLanguage = { ko: 'ko', tw: 'zh-Hant-TW' };
  const languageClassByLanguage = { ko: 'lang-ko', tw: 'lang-tw' };
  const galleryLightbox = document.getElementById('gallery-lightbox');
  const galleryLightboxImage = galleryLightbox?.querySelector('.gallery-lightbox-image');
  const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
  let selectedGalleryIndex = 0;
  const weddingData = window.weddingData || {};
  const weddingDateString = '2026-12-05T12:00:00';
  const weddingDate = new Date(weddingDateString);

  function getValueByPath(object, path) {
    return path.split(/\.|\[|\]/).filter(Boolean).reduce((current, key) => {
      if (current && key in current) {
        return current[key];
      }
      return undefined;
    }, object);
  }

  function setTextContent(element, value) {
    if (typeof value !== 'string') {
      return;
    }
    if (element.tagName === 'IMG') {
      element.alt = value;
      return;
    }
    if (element.dataset.preserveHtml === 'true') {
      element.innerHTML = value.replace(/\n/g, '<br>');
    } else {
      element.textContent = value;
    }
  }

  function applyLanguage(lang) {
    if (!supportedLangs.includes(lang)) {
      lang = defaultLang;
    }

    document.documentElement.lang = htmlLangByLanguage[lang];
    document.documentElement.className = languageClassByLanguage[lang];
    localStorage.setItem('preferredLang', lang);

    document.querySelectorAll('[data-key]').forEach((element) => {
      const value = getValueByPath(weddingData[lang], element.dataset.key);
      if (value !== undefined) {
        setTextContent(element, value);
      } else {
        console.warn(`Missing translation for ${element.dataset.key} in ${lang}`);
      }
    });

    if (langToggle) {
      langToggle.textContent = lang === 'ko' ? 'TW' : 'KR';
    }

    updateDday();
    console.debug(`Applied language: ${lang}`);
  }

  function updateDday() {
    const today = new Date();
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const utcWedding = Date.UTC(weddingDate.getFullYear(), weddingDate.getMonth(), weddingDate.getDate());
    const diffDays = Math.floor((utcWedding - utcToday) / (1000 * 60 * 60 * 24));
    const ddayElement = document.getElementById('dday-count');
    if (ddayElement) {
      ddayElement.textContent = diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
    }
  }

  function showGalleryImage(index) {
    if (!galleryLightboxImage || galleryImages.length === 0) {
      return;
    }

    selectedGalleryIndex = (index + galleryImages.length) % galleryImages.length;
    const selectedImage = galleryImages[selectedGalleryIndex];
    galleryLightboxImage.src = selectedImage.src;
    galleryLightboxImage.alt = selectedImage.alt;
  }

  function openGallery(index) {
    if (!galleryLightbox) {
      return;
    }

    showGalleryImage(index);
    galleryLightbox.setAttribute('aria-hidden', 'false');
    galleryLightbox.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    galleryLightbox.querySelector('.gallery-lightbox-close')?.focus();
  }

  function closeGallery() {
    if (!galleryLightbox) {
      return;
    }

    galleryLightbox.setAttribute('aria-hidden', 'true');
    galleryLightbox.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      const currentLang = localStorage.getItem('preferredLang') || defaultLang;
      const nextLang = currentLang === 'ko' ? 'tw' : 'ko';
      applyLanguage(nextLang);
    });
  }

  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', () => openGallery(index));
  });

  galleryLightbox?.querySelector('.gallery-lightbox-close')?.addEventListener('click', closeGallery);
  galleryLightbox?.querySelector('.gallery-lightbox-prev')?.addEventListener('click', () => showGalleryImage(selectedGalleryIndex - 1));
  galleryLightbox?.querySelector('.gallery-lightbox-next')?.addEventListener('click', () => showGalleryImage(selectedGalleryIndex + 1));
  galleryLightbox?.addEventListener('click', (event) => {
    if (event.target === galleryLightbox) {
      closeGallery();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (!galleryLightbox?.classList.contains('is-open')) {
      return;
    }
    if (event.key === 'Escape') {
      closeGallery();
    } else if (event.key === 'ArrowLeft') {
      showGalleryImage(selectedGalleryIndex - 1);
    } else if (event.key === 'ArrowRight') {
      showGalleryImage(selectedGalleryIndex + 1);
    }
  });

  const initialLang = localStorage.getItem('preferredLang') || defaultLang;
  applyLanguage(initialLang);
  updateDday();
});
