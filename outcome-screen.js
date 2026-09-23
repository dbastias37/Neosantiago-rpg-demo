(function (root) {
  'use strict';
  // Explicit future-content UI. No current mission automatically invokes Game Over.
  var dialog = null, previousFocus = null, locked = false;
  function close() {
    if (!dialog) return;
    var old = dialog; dialog = null;
    if (old.open && old.close) old.close(); old.remove();
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    previousFocus = null; locked = false;
  }
  function show(options) {
    var actions = root.NeoOutcomes.recoveryActions(options.ledger);
    if (!actions.length) throw new Error('No hay un colapso de la red pendiente.');
    if (typeof options.onRecover !== 'function' || typeof options.onMenu !== 'function') throw new Error('Faltan las acciones de recuperación.');
    close(); previousFocus = document.activeElement;
    dialog = document.createElement('dialog'); dialog.className = 'outcome-screen'; dialog.setAttribute('aria-labelledby', 'networkOutcomeTitle');
    var title = document.createElement('h2'); title.id = 'networkOutcomeTitle'; title.textContent = root.NeoOutcomes.labels[root.NeoOutcomes.kinds.collapse];
    var text = document.createElement('p'); text.textContent = options.summary || 'La red que sostenía a los refugios ha colapsado. Puedes regresar a un punto conservado.';
    var hint = document.createElement('p'); hint.textContent = 'La partida se conserva. Reintentar recupera también los recursos y decisiones de ese punto.';
    var controls = document.createElement('div'); controls.className = 'outcome-actions';
    var error = document.createElement('p'); error.setAttribute('role', 'alert');
    actions.forEach(function (action) {
      var button = document.createElement('button'); button.type = 'button'; button.textContent = action.label; button.dataset.outcomeAction = action.id;
      button.addEventListener('click', async function () {
        if (locked) return; locked = true;
        controls.querySelectorAll('button').forEach(function (entry) { entry.disabled = true; });
        try { await (action.id === 'menu' ? options.onMenu() : options.onRecover(action.id)); close(); }
        catch (failure) {
          error.textContent = 'No se pudo recuperar la partida. El guardado original se conserva.';
          locked = false; controls.querySelectorAll('button').forEach(function (entry) { entry.disabled = false; }); button.focus();
        }
      });
      controls.appendChild(button);
    });
    dialog.append(title, text, hint, controls, error);
    dialog.addEventListener('keydown', function (event) { event.stopPropagation(); });
    dialog.addEventListener('cancel', function (event) { event.preventDefault(); });
    document.body.appendChild(dialog); dialog.showModal(); controls.querySelector('button').focus();
  }
  root.NeoOutcomeScreen = Object.freeze({ show: show, close: close, isOpen: function () { return !!dialog; } });
})(globalThis);
