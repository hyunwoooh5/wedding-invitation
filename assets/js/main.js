document.addEventListener('DOMContentLoaded', function () {
  const ddayCount = document.getElementById('dday-count');
  const langToggle = document.getElementById('lang-toggle');
  const defaultLang = 'ko';
  const supportedLangs = ['ko', 'tw'];
  const htmlLangByLanguage = { ko: 'ko', tw: 'zh-Hant-TW' };
  const weddingData = window.weddingData || {};
  const weddingDateString = '2026-06-06T17:00:00';
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

    console.debug(`Applied language: ${lang}`);
  }

  function updateDday() {
    const today = new Date();
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const utcWedding = Date.UTC(weddingDate.getFullYear(), weddingDate.getMonth(), weddingDate.getDate());
    const diffDays = Math.floor((utcWedding - utcToday) / (1000 * 60 * 60 * 24));
    if (ddayCount) {
      ddayCount.textContent = diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
    }
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      const currentLang = localStorage.getItem('preferredLang') || defaultLang;
      const nextLang = currentLang === 'ko' ? 'tw' : 'ko';
      applyLanguage(nextLang);
    });
  }

  const initialLang = localStorage.getItem('preferredLang') || defaultLang;
  applyLanguage(initialLang);
  updateDday();
});
