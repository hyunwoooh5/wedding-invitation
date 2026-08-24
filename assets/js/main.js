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
  const weddingCalendar = document.getElementById('wedding-calendar');
  const queryParams = new URLSearchParams(window.location.search);
  const guestName = queryParams.get('to')?.trim().slice(0, 80) || '';
  const requestedLanguage = queryParams.get('language')?.trim().toLowerCase();
  const letterIntro = document.getElementById('letter-intro');
  const rsvpForm = document.getElementById('rsvp-form');

  function getWeddingDate(lang) {
    const start = weddingData[lang]?.extra?.calendar?.start || weddingData[defaultLang]?.extra?.calendar?.start;
    if (!start) {
      return new Date('2026-12-05T12:00:00');
    }
    const date = new Date(start.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z'));
    return Number.isNaN(date.getTime()) ? new Date('2026-12-05T12:00:00') : date;
  }

  function renderCalendar(lang) {
    if (!weddingCalendar) {
      return;
    }

    const languageData = weddingData[lang] || weddingData[defaultLang];
    const weddingDate = getWeddingDate(lang);
    const year = weddingDate.getUTCFullYear();
    const month = weddingDate.getUTCMonth();
    const day = weddingDate.getUTCDate();
    const monthLabels = lang === 'tw' ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const weekdayLabels = lang === 'tw' ? ['日', '一', '二', '三', '四', '五', '六'] : ['일', '월', '화', '수', '목', '금', '토'];
    const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

    weddingCalendar.querySelector('.calendar-month').textContent = `${year} · ${monthLabels[month]}`;
    weddingCalendar.querySelector('.calendar-event-mark').textContent = `${month + 1} / ${day}`;
    weddingCalendar.setAttribute('aria-label', `${year} ${monthLabels[month]}, ${day}`);
    weddingCalendar.querySelector('caption').textContent = `${year} ${monthLabels[month]} ${day}`;
    weddingCalendar.querySelector('.calendar-weekdays').innerHTML = weekdayLabels.map((label) => `<th scope="col">${label}</th>`).join('');

    const cells = [];
    for (let index = 0; index < firstWeekday; index += 1) {
      cells.push('<td aria-hidden="true"></td>');
    }
    for (let date = 1; date <= daysInMonth; date += 1) {
      const isWeddingDay = date === day;
      cells.push(`<td${isWeddingDay ? ' class="is-wedding-day"' : ''}${isWeddingDay ? ` aria-label="${languageData.couple.date}"` : ''}>${date}</td>`);
    }
    while (cells.length % 7 !== 0) {
      cells.push('<td aria-hidden="true"></td>');
    }
    const rows = [];
    for (let index = 0; index < cells.length; index += 7) {
      rows.push(`<tr>${cells.slice(index, index + 7).join('')}</tr>`);
    }
    weddingCalendar.querySelector('.calendar-days').innerHTML = rows.join('');
  }

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

  function updatePageDescription(lang) {
    const description = weddingData[lang]?.description;
    if (typeof description !== 'string') {
      return;
    }
    document.getElementById('page-description')?.setAttribute('content', description);
    document.getElementById('og-page-description')?.setAttribute('content', description);
  }

  function applyLanguage(lang) {
    if (!supportedLangs.includes(lang)) {
      lang = defaultLang;
    }

    document.documentElement.lang = htmlLangByLanguage[lang];
    document.documentElement.className = languageClassByLanguage[lang];
    localStorage.setItem('preferredLang', lang);
    updatePageDescription(lang);

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

    const recipient = document.querySelector('.letter-recipient');
    /*
    if (recipient) {
      const fallback = recipient.dataset.defaultRecipient || '친애하는 소중한 분께';
      recipient.textContent = guestName
        ? `${lang === 'ko' ? '친애하는' : '親愛的'} ${guestName}${lang === 'ko' ? '님께' : '，'}`
        : (lang === 'ko' ? fallback : '親愛的朋友，');
    }
    */

    document.querySelectorAll('[data-guest-name]').forEach((element) => {
      if (guestName && !element.value) {
        element.value = guestName;
      }
    });

    const letterMessage = document.querySelector('.letter-message');
    const guestLabel = guestName || (lang === 'ko' ? '소중한 분' : '親愛的朋友');
    const guestNote = getValueByPath(weddingData[lang], 'extra.guest_note');
    if (letterMessage && typeof guestNote === 'string') {
      letterMessage.textContent = guestNote.replaceAll('{guest}', guestLabel);
    }

    updateDday();
    renderCalendar(lang);
    updateCalendarLink(lang);
    updateAppleCalendarLink(lang);
    console.debug(`Applied language: ${lang}`);
  }

  function updateDday() {
    const weddingDate = getWeddingDate(localStorage.getItem('preferredLang') || defaultLang);
    const today = new Date();
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const utcWedding = Date.UTC(weddingDate.getFullYear(), weddingDate.getMonth(), weddingDate.getDate());
    const diffDays = Math.floor((utcWedding - utcToday) / (1000 * 60 * 60 * 24));
    const ddayElement = document.getElementById('dday-count');
    if (ddayElement) {
      const diffMs = weddingDate.getTime() - Date.now();
      const absoluteSeconds = Math.floor(Math.abs(diffMs) / 1000);
      const days = Math.floor(absoluteSeconds / 86400);
      const hours = Math.floor((absoluteSeconds % 86400) / 3600);
      const minutes = Math.floor((absoluteSeconds % 3600) / 60);
      const seconds = absoluteSeconds % 60;
      const prefix = diffMs >= 0 ? 'D-' : 'D+';
      ddayElement.textContent = `${prefix}${days} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }

  function updateCalendarLink(lang) {
    const calendarLink = document.getElementById('calendar-link');
    const languageData = weddingData[lang] || weddingData[defaultLang];
    const calendar = languageData?.extra?.calendar;
    if (!calendarLink || !calendar) {
      return;
    }
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${languageData.couple.groom} & ${languageData.couple.bride}`,
      dates: `${calendar.start}/${calendar.end}`,
      details: calendar.details,
      location: languageData.venue.address
    });
    calendarLink.href = `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function updateAppleCalendarLink(lang) {
    const appleCalendarLink = document.getElementById('apple-calendar-link');
    const languageData = weddingData[lang] || weddingData[defaultLang];
    const calendar = languageData?.extra?.calendar;
    if (!appleCalendarLink || !calendar) {
      return;
    }
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `DTSTART:${calendar.start}`,
      `DTEND:${calendar.end}`,
      `SUMMARY:${languageData.couple.groom} & ${languageData.couple.bride}`,
      `DESCRIPTION:${calendar.details}`,
      `LOCATION:${languageData.venue.address}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    if (appleCalendarLink.dataset.objectUrl) {
      URL.revokeObjectURL(appleCalendarLink.dataset.objectUrl);
    }
    const objectUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    appleCalendarLink.href = objectUrl;
    appleCalendarLink.dataset.objectUrl = objectUrl;
  }

  function closeLetter() {
    if (!letterIntro) {
      return;
    }
    if (letterIntro.classList.contains('is-open') || letterIntro.classList.contains('is-closing')) {
      return;
    }
    letterIntro.classList.add('is-closing');
    window.setTimeout(() => {
      letterIntro.classList.add('is-open');
      letterIntro.classList.remove('is-closing');
      document.body.classList.remove('letter-locked');
      sessionStorage.setItem('letterOpened', 'true');
    }, 2200);
  }

  function initReveals() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    revealElements.forEach((element) => revealObserver.observe(element));
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

  document.getElementById('letter-open')?.addEventListener('click', closeLetter);
  document.getElementById('letter-skip')?.addEventListener('click', closeLetter);
  letterIntro?.addEventListener('click', closeLetter);
  letterIntro?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closeLetter();
    }
  });
  if (letterIntro && sessionStorage.getItem('letterOpened') === 'true') {
    letterIntro.classList.add('is-open');
    document.body.classList.remove('letter-locked');
  } else if (letterIntro) {
    document.body.classList.add('letter-locked');
  }

  initReveals();

  rsvpForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('rsvp-status');
    const endpoint = rsvpForm.dataset.endpoint?.trim();
    if (!endpoint) {
      status.textContent = 'RSVP endpoint is not configured yet.';
      return;
    }
    const submitButton = rsvpForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    try {
      const response = await fetch(endpoint, { method: 'POST', body: new FormData(rsvpForm) });
      if (!response.ok) {
        throw new Error('RSVP request failed');
      }
      status.textContent = weddingData[localStorage.getItem('preferredLang') || defaultLang].rsvp.success;
      rsvpForm.reset();
    } catch (error) {
      status.textContent = 'Unable to send RSVP. Please contact the couple directly.';
    } finally {
      submitButton.disabled = false;
    }
  });

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

  const pageLanguage = document.documentElement.dataset.initialLanguage;
  const initialLang = supportedLangs.includes(requestedLanguage)
    ? requestedLanguage
    : supportedLangs.includes(pageLanguage)
      ? pageLanguage
      : localStorage.getItem('preferredLang') || defaultLang;
  applyLanguage(initialLang);
  updateDday();
  window.setInterval(updateDday, 1000);
});
