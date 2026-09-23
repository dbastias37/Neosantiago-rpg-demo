/* Asset policy shared by Exploration and Los Mensajeros. No network or audio is
 * created here. Only files explicitly known to be missing are skipped, so adding
 * an authorized future path is not silently blocked by an outdated allowlist. */
(function (root) {
  'use strict';
  var fallbackEvents = Object.freeze({
    'ui-close-panel': 'archive-close', 'ui-tab': 'lore-tab',
    'ui-download': 'ui-click', 'lore-open': 'archive-open',
    'archive-switch': 'lore-tab', 'decision-hover': 'ui-hover',
    'decision-confirm': 'ui-click', 'decision-result': 'ui-open-panel',
    'refuge-enter': 'ui-open-panel', 'refuge-npc': 'lore-tab',
    'refuge-ready': 'ui-click', 'trade-buy': 'loot-take',
    'trade-sell': 'loot-discard', 'trade-weapon': 'loot-take',
    'loadout-tray': 'ui-open-panel', 'loadout-equip': 'ui-click',
    'loadout-use': 'ui-click', 'loadout-transfer': 'loot-take',
    'loadout-food': 'ui-click', 'skill-unlock': 'ui-click',
    'combat-target-hover': 'ui-hover', 'loot-hover': 'ui-hover',
    'loot-take-all': 'loot-take', 'ending-summary': 'ui-open-panel',
    'hp-ally-damage': 'combat-enemy-hit-normal',
    'hp-enemy-damage': 'combat-hit-normal'
  });
  function normalized(path) {
    return typeof path === 'string' ? path.replace(/[?#].*$/, '').replace(/^\.\//, '') : '';
  }
  function knownMissing(path, catalog) {
    var data = catalog || root.NeoAudioCatalog;
    return !!(data && Array.isArray(data.missing) && data.missing.indexOf(normalized(path)) >= 0);
  }
  function resolve(name, routes, rejected, catalog, seen) {
    if (!routes || typeof name !== 'string') return [];
    seen = seen || [];
    if (seen.indexOf(name) >= 0) return [];
    var value = routes[name], candidates = Array.isArray(value) ? value.slice() : typeof value === 'string' ? [value] : [];
    candidates = candidates.filter(function (path) {
      return typeof path === 'string' && path && !knownMissing(path, catalog) && !(rejected && rejected[path]);
    });
    if (candidates.length) return candidates;
    // Voices, ambience, weapon attacks, defeat and error never become UI clicks.
    var fallback = fallbackEvents[name];
    return fallback ? resolve(fallback, routes, rejected, catalog, seen.concat(name)) : [];
  }
  var api = Object.freeze({knownMissing: knownMissing, resolve: resolve, fallbackEvents: fallbackEvents});
  root.NeoAudioAvailability = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
