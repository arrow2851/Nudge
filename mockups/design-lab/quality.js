(() => {
  const VERSION = '0.9.5';
  const initialParams = new URLSearchParams(location.search);
  const captureMode = initialParams.get('capture');

  if (captureMode === 'labelled' || captureMode === 'phone') {
    document.documentElement.dataset.capture = captureMode;
  }

  function setText(element, value) {
    if (element && element.textContent !== value) element.textContent = value;
  }

  function syncCaptureHeader(lookName, scenario) {
    if (!document.documentElement.dataset.capture) return;

    let header = document.querySelector('#capture-header');
    if (!header) {
      header = document.createElement('div');
      header.id = 'capture-header';
      header.className = 'capture-header';
      header.setAttribute('aria-label', 'Screenshot evidence label');
      const title = document.createElement('strong');
      const meta = document.createElement('span');
      header.append(title, meta);
      document.querySelector('.preview-stage')?.prepend(header);
    }

    const routeParams = new URLSearchParams(location.search);
    const lookKicker = document.querySelector('#look-kicker')?.textContent?.trim() || 'Look';
    const screen = routeParams.get('screen') || 'today';
    const area = routeParams.get('area');
    const section = routeParams.get('section');
    const chore = routeParams.get('chore');
    const routeLabel = screen === 'area' && area
      ? `Area detail · ${area}`
      : screen === 'section' && section
        ? `Section · ${section}`
        : screen === 'chore' && chore
          ? `Chore · ${chore}`
          : screen;

    setText(header.querySelector('strong'), `${lookKicker} — ${lookName || 'Unknown Look'}`);
    setText(header.querySelector('span'), `${routeLabel} · ${scenario || 'Normal day'} · v${VERSION}`);
    setText(document.querySelector('#status-time'), '9:41');
  }

  function syncSemantics() {
    const activeLook = document.querySelector('.look-button.active');
    document.querySelectorAll('button[data-look]').forEach(button => {
      button.type = 'button';
      button.setAttribute('aria-pressed', String(button === activeLook));
    });

    document.querySelectorAll('[data-view]').forEach(button => {
      button.type = 'button';
      button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    });

    document.querySelectorAll('[data-scenario]').forEach(button => {
      button.type = 'button';
      button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    });

    document.querySelectorAll('[data-nav]').forEach(button => {
      button.type = 'button';
      if (button.classList.contains('active')) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });

    document.querySelectorAll('.th-status-tag').forEach(tag => {
      const status = tag.textContent?.trim();
      if (status) tag.setAttribute('aria-label', `Status: ${status}`);
    });

    const lookName = document.querySelector('#look-name')?.textContent?.trim();
    const scenario = document.querySelector('[data-scenario].active')?.textContent?.trim();
    if (lookName && scenario) document.title = `Nudge Design Lab — ${lookName} · ${scenario}`;

    setText(document.querySelector('#build-meta'), `v${VERSION} · 2026-08-01`);
    setText(document.querySelector('#mobile-build'), `v${VERSION}`);
    syncCaptureHeader(lookName, scenario);
  }

  const observer = new MutationObserver(syncSemantics);
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class']
  });
  window.addEventListener('popstate', () => requestAnimationFrame(syncSemantics));
  document.addEventListener('click', () => requestAnimationFrame(syncSemantics));
  syncSemantics();
})();
