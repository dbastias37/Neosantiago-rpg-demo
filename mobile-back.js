/* Android/browser Back returns through game windows without leaving the game.
 * Arm after interaction: browsers may skip history entries made before a gesture.
 * One same-document guard is reused; opening windows never grows the history.
 */
(function () {
  'use strict';
  if (window.NeoBackNavigation) return;

  function visible(node) {
    return node && !node.classList.contains('hidden');
  }

  function topWindow() {
    var top = null, topZ = -Infinity;
    document.querySelectorAll('.overlay, .drawer, .title-screen').forEach(function (node) {
      if (!visible(node)) return;
      var style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return;
      var z = Number(style.zIndex) || 0;
      // For equal stacking levels the later DOM sibling is painted on top.
      if (z >= topZ) { top = node; topZ = z; }
    });
    return top;
  }

  var closers = {
    itemDetailModal: 'closeItemDetails',
    crateModal: 'crateBack',
    refugeHelpModal: 'closeRefugeHelp',
    gameHelpModal: 'closeGameHelp',
    profileModal: 'closeProfile',
    transferModal: 'closeTransferModal',
    discardModal: 'closeDiscardModal',
    disassemblyModal: 'closeDisassemblyModal',
    logisticsModal: 'closeLogisticsBriefing',
    archiveModal: 'closeArchive',
    audioClueModal: 'closeAudioClue',
    worldLoreModal: 'closeWorldLore',
    drawer: 'closePanel'
  };

  function handleBack() {
    var top = topWindow();
    if (top) {
      var close = window[closers[top.id]];
      if (typeof close === 'function') { close(); return true; }
      if (top.id === 'lootModal') { window.closeLootModal(true); return true; }
      if (top.id === 'gameIntro' && window.introStep > 0) {
        window.showGameIntro(window.introStep - 1); return true;
      }
      if (top.id === 'decisionModal' && window.decisionState && window.decisionState.phase === 'ready') {
        window.closeDecision(); return true;
      }
      if (top.id === 'signalModal' && window.signalGameState) {
        var signal = window.signalGameState;
        if (signal.screen === 'success' ||
            (signal.source === 'manual' && window.state.inhibitor.active &&
             (signal.screen === 'ready' || signal.screen === 'tutorial'))) {
          window.closeSignalHack(false); return true;
        }
      }
      // Required scenes and unresolved actions need their explicit game buttons.
      // Never confirm a purchase/rest, skip a story, abandon loot or flee a fight.
      return false;
    }
    var tray = document.getElementById('itemTray');
    if (visible(document.getElementById('battle')) && visible(tray)) {
      var button = document.getElementById('closeStageInventory');
      if (button) button.click();
      else {
        tray.classList.add('hidden');
        document.getElementById('itemsToggle').setAttribute('aria-expanded', 'false');
      }
      return true;
    }
    return false;
  }

  var history = window.history, key = '__neoGameBackV1', armed = false;
  function marker(value) { return value && value[key]; }
  function entry(kind) {
    var current = history.state;
    var value = current && typeof current === 'object' ? Object.assign({}, current) : {};
    value[key] = kind;
    return value;
  }
  function arm() {
    if (!history || typeof history.pushState !== 'function' || typeof history.replaceState !== 'function') return false;
    try {
      if (marker(history.state) !== 'guard') {
        history.replaceState(entry('base'), '');
        history.pushState(entry('guard'), '');
      }
      armed = true;
      return true;
    } catch (error) {
      // A restricted host/browser can deny the History API; keep the game usable.
      return false;
    }
  }
  function onPopState(event) {
    if (!armed || marker(event.state) === 'guard') return;
    // Restore protection synchronously before changing UI, including repeated Back.
    if (arm()) handleBack();
  }

  window.NeoBackNavigation = { arm: arm, handleBack: handleBack };
  if (!history) return;
  armed = !!marker(history.state);
  window.addEventListener('popstate', onPopState);
  window.addEventListener('pageshow', function () {
    // Reuse the guard after a reload or mobile/bfcache restoration.
    if (armed || (navigator.userActivation && navigator.userActivation.hasBeenActive)) arm();
  });
  ['pointerup', 'click', 'keydown'].forEach(function (type) {
    document.addEventListener(type, arm, true);
  });
})();
