(() => {
  const VERSION = '0.7.0';
  const params = new URLSearchParams(location.search);
  const captureMode = params.get('capture');

  if (captureMode === 'labelled' || captureMode === 'phone') {
    document.documentElement.dataset.capture = captureMode;
  }

  function syncCaptureHeader(lookName, scenario) {
    if (!document.documentElement.dataset.capture) return;

    let header = document.querySelector('#capture-header');
    if (!header) {
      header = document.createElement('div');
      header.id = 'capture-header';
      header.className = 'capture-header';
      header.setAttribute('aria-label', 'Screenshot evidence label');
      document.querySelector('.preview-stage')?.prepend(header);
    }

    const lookKicker = document.querySelector('#look-kicker')?.textContent?.trim() || 'Look';
    const screen = params.get('screen') || 'areas';
    const area = params.get('area');
    const routeLabel = screen === 'area' && area ? `Area detail · ${area}` : screen;

    header.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = `${lookKicker} — ${lookName || 'Unknown Look'}`;
    const meta = document.createElement('span');
    meta.textContent = `${routeLabel} · ${scenario || 'Normal day'} · v${VERSION}`;
    header.append(title, meta);

    const statusTime = document.querySelector('#status-time');
    if (statusTime) statusTime.textContent = '9:41';
  }

  function syncSemantics() {
    const activeLook = document.querySelector('.look-button.active');
    document.querySelectorAll('[data-look]').forEach(button => {
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

    const build = document.querySelector('#build-meta');
    const mobileBuild = document.querySelector('#mobile-build');
    if (build) build.textContent = `v${VERSION} · 2026-08-01`;
    if (mobileBuild) mobileBuild.textContent = `v${VERSION}`;

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