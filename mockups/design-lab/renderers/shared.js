import { esc } from '../utils.js';

export function renderFutureLook(look) {
  return `
    <header class="editorial-header">
      <div class="kicker">Look #${look.id} · Design Lab</div>
      <h1>${esc(look.name)}</h1>
      <p>${esc(look.description)}</p>
    </header>
    <div class="header-line"></div>
    <section class="coming-soon">
      <div class="poster">
        <div class="section-label">Queued audition</div>
        <h1>The same data. A different philosophy.</h1>
        <p>This visual direction will use the exact Areas, Area detail, and intervention scenarios established in the shared fixture.</p>
        <ul>
          <li>Current screen and scenario remain selected when switching Looks</li>
          <li>Counts and product meaning remain equivalent</li>
          <li>Placement may change only to support the aesthetic</li>
          <li>Look #1 remains unchanged on main</li>
        </ul>
      </div>
    </section>`;
}

export function renderUnsupported(message) {
  return `
    <header class="editorial-header">
      <div class="kicker">Design Lab route</div>
      <h1>This preview could not be opened.</h1>
      <p>${esc(message)}</p>
    </header>
    <div class="header-line"></div>
    <section class="coming-soon">
      <div class="poster">
        <div class="section-label">Safe fallback</div>
        <h1>Return to Areas</h1>
        <p>The review state was not changed outside the Design Lab.</p>
        <button class="primary-action" data-action="reset-route">Open the default audition</button>
      </div>
    </section>`;
}
