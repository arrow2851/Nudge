(() => {
  const VERSION = '0.3.0';

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

    const lookName = document.querySelector('#look-name')?.textContent?.trim();
    const scenario = document.querySelector('[data-scenario].active')?.textContent?.trim();
    if (lookName && scenario) document.title = `Nudge Design Lab — ${lookName} · ${scenario}`;

    const build = document.querySelector('#build-meta');
    const mobileBuild = document.querySelector('#mobile-build');
    if (build) build.textContent = `v${VERSION} · 2026-08-01`;
    if (mobileBuild) mobileBuild.textContent = `v${VERSION}`;
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