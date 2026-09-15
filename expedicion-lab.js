/* Expedition-only presentation adapter. The campaign, actions and assets stay shared. */
(function () {
  'use strict';
  if (KEY !== 'neosantiago2130_expedicion_lab_v1') throw new Error('Laboratorio sin guardado aislado');
  document.title = 'NeoSantiago 2130 · Laboratorio de expedición';
  document.body.classList.add('expedition-lab');
  document.querySelector('.brand').innerHTML = 'NeoSantiago <span style="color:var(--amber2)">2130</span>';
  const nav = document.querySelector('.nav');
  const play = document.querySelector('.play');
  const side = document.querySelector('.side');
  const group = $('groupMini');
  const supplies = nav.querySelector('[data-panel="group"]');
  const dock = document.createElement('section');
  dock.className = 'expedition-dock';
  dock.setAttribute('aria-label', 'Personajes de la expedición');
  dock.appendChild(group);
  supplies.classList.add('supplies-action');
  supplies.textContent = 'Suministros';
  dock.appendChild(supplies);
  const hint = document.createElement('p');
  hint.className = 'team-hint';
  hint.textContent = 'Selecciona un personaje para gestionar su equipo.';
  dock.appendChild(hint);
  play.appendChild(dock);
  side.hidden = true;
  nav.insertBefore(nav.querySelector('[data-panel="missions"]'), nav.firstChild);
  const objective = document.createElement('p');
  objective.className = 'expedition-objective';
  document.querySelector('.where').appendChild(objective);
  $('chapter').textContent = 'Laboratorio de expedición';

  const originalMini = renderMini;
  renderMini = function () {
    originalMini();
    group.querySelectorAll('.member').forEach(function (button, i) {
      const p = state.party[i];
      const mind = psychState(p);
      const percent = clamp(Math.round(p.hp / p.maxHp * 100), 0, 100);
      button.classList.toggle('needs-care', p.hp <= p.maxHp * .35 || p.hunger < 35);
      button.setAttribute('aria-label', p.name + ', salud ' + p.hp + ' de ' + p.maxHp + ', ' + mind.name + '. Abrir ficha');
      button.innerHTML = '<span class="avatar">' + assetImage('portraits/' + p.id + '.webp', p.name, '', 590, 885) + '</span>' +
        '<span class="member-copy"><strong>' + esc(p.name) + '</strong><span class="member-role">' + esc(p.role) + '</span>' +
        '<span class="member-health"><span class="member-track"><span style="width:' + percent + '%"></span></span><span>' + p.hp + ' / ' + p.maxHp + '</span></span>' +
        '<span class="member-mood">' + esc(mind.name) + '</span>' +
        (hasUnspentSkill(p) ? '<span class="skill-ready-copy">Habilidad disponible</span>' : '') + '</span>';
    });
    objective.textContent = 'Objetivo: ' + missionDefs[0].title;
    $('chapter').textContent = 'Laboratorio de expedición · ' + chapters[events[state.index].day];
  };

  // Reuse the existing Group action: resources and group detail are now a centered modal.
  const originalPanel = openPanel;
  openPanel = function (type) {
    originalPanel(type);
    if (type === 'group') {
      $('drawerTitle').textContent = 'Suministros y grupo';
      const resources = document.createElement('section');
      resources.className = 'lab-resources';
      resources.setAttribute('aria-label', 'Recursos actuales');
      resources.innerHTML = $('resourceMini').innerHTML;
      $('drawerContent').insertBefore(resources, $('drawerContent').firstChild);
    }
  };
  const drawer = $('drawer');
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-labelledby', 'drawerTitle');
  $('closeDrawer').textContent = 'Volver a expedición';
  $('closeProfile').textContent = 'Volver a expedición';
  $('closeProfile').setAttribute('aria-label', 'Cerrar ficha y volver a expedición');

  // Focus returns to the invoking portrait/navigation; keep Tab inside these dialogs.
  let opener = null;
  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-profile], [data-panel]');
    if (trigger) opener = trigger;
  }, true);
  const watched = [$('profileModal'), drawer];
  new MutationObserver(function (records) {
    if (records.some(function (r) { return watched.includes(r.target) && r.target.classList.contains('hidden'); }) &&
        watched.every(function (node) { return node.classList.contains('hidden'); })) {
      if (opener && opener.isConnected) opener.focus();
    }
  }).observe(document.body, {subtree:true, attributes:true, attributeFilter:['class']});
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    // Nested inventory dialogs retain their existing keyboard handling.
    if (['transferModal','discardModal','disassemblyModal','archiveModal','worldLoreModal'].some(function (id) { return !$(id).classList.contains('hidden'); })) return;
    const active = watched.find(function (node) { return !node.classList.contains('hidden'); });
    if (!active) return;
    const buttons = Array.from(active.querySelectorAll('button:not([disabled]), a[href], input, select, [tabindex="0"]')).filter(function (node) { return node.getClientRects().length; });
    if (!buttons.length) return;
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && (document.activeElement === first || !active.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  // First visit starts at the first outside scene with the game's standard starter kit.
  // Reload resumes only this lab. ?reset=1 resets only its own independent save.
  const reset = new URLSearchParams(location.search).get('reset') === '1';
  if (reset) {
    localStorage.removeItem(KEY);
    const url = new URL(location.href); url.searchParams.delete('reset');
    history.replaceState(null, '', url);
  }
  if (!reset && load()) {
    continueGame();
  } else {
    state = fresh();
    gameSessionActive = true;
    state.introCompleted = true;
    state.logisticsSeen = true;
    state.refuge.active = true;
    acceptStarterKit();
    state.refuge.active = false;
    state.refuge.message = '';
    state.index = 2;
    state.inhibitor.active = true;
    state.inhibitor.exposed = false;
    state.inhibitor.needsSync = false;
    state.inhibitor.remainingMs = state.inhibitor.durationMs;
    state.inhibitor.tutorialSeen = true;
    ['titleScreen','start','gameIntro','refuge'].forEach(function (id) { $(id).classList.add('hidden'); });
    render();
    save();
  }
  renderMini();
}());
