# Auditoría de audio V0.3

Generado con `node scripts/audit-audio.cjs`. Inventario físico y referencias de producción, incluidos los adaptadores y el mapa de Los Mensajeros. No se descargaron ni generaron sonidos. La existencia de un archivo no certifica su licencia ni su adecuación artística.

37 archivos de audio existentes (6,760,005 bytes), 64 rutas faltantes: P0 50, P1 13, P2 1. 81 eventos declarados: 28 con audio original, 26 con sustitución explícita usando archivos existentes y 27 pendientes sin sustitución. Las voces se cuentan como assets separados.

## Criterio

P0: feedback de acciones, combate, daño, loot, comercio, refugio y controles. P1: presentación, introducción, cierre y voces con transcripción disponible. P2: ambientación. La victoria de combate es P0 aunque su archivo viva en ambience. Las referencias incluyen archivo y línea; son auditables, no una promesa de que cada rama se ejecute en cada sesión. El escaneo excluye laboratorios, documentos, tests y archivos generados y reconoce el constructor de rutas de audio del mapa de Encargos. Los valores construidos dinámicamente a partir de nombres de evento se resuelven contra el catálogo JSON de audioRoutes.

## Comportamiento

`audio-catalog.js` registra archivos presentes y ausencias conocidas. `audio-availability.js` conserva variantes disponibles, evita solicitar ausencias conocidas y reutiliza exclusivamente eventos compatibles de UI, inventario, daño y loot. No reemplaza disparos, melee, caída de aliados/enemigos, error, derrota, voces o ambientación por clics. Los errores de carga descubiertos en ejecución también se omiten. Una ruta nueva desconocida sigue disponible para que agregar un archivo autorizado no exija ampliar una allowlist a mano; regenerar esta auditoría actualiza el inventario.

No se introducen cambios de guardado. Música/ambiente y SFX conservan sus niveles actuales. Falta una escucha humana para aprobar balance y sustituciones; no existe todavía una mezcla con controles independientes.

## Deuda imprescindible

Los disparos de los tres tipos, melee y caídas de aliados/enemigos siguen necesitando archivos. La derrota y el colapso de la red requieren diseño sonoro autorizado: el catálogo vigente no declara un evento específico de derrota. No se inventa una ruta como si ya existiera. La transcripción permanece disponible para cada voz faltante. Las sustituciones son feedback provisional; no cierran la deuda artística ni cumplen por sí solas el estándar final del vertical slice.

## Inventario exacto

| Archivo | Estado | Prioridad | Bytes | Eventos | Referencias |
|---|---|---|---:|---|---|
| `audio/ambience/archive-static.mp3` | Falta | P2 | 0 | ambience-archive | `neosantiago-demo.html:1098` (literal) |
| `audio/ambience/battle-loop.mp3` | Existe | P2 | 1513480 | ambience-battle | `neosantiago-demo.html:1096` (literal) |
| `audio/ambience/battle-victory.mp3` | Existe | P0 | 1205026 | ambience-battle-victory | `neosantiago-demo.html:1097` (literal) |
| `audio/ambience/title-enter.mp3` | Existe | P1 | 243252 | start-title-enter | `neosantiago-demo.html:1026` (literal) |
| `audio/ambience/title-rain-tunnel.mp3` | Existe | P2 | 1992960 | ambience-title | `neosantiago-demo.html:1095` (literal) |
| `audio/archive/dossier-switch.mp3` | Falta | P0 | 0 | archive-switch | `neosantiago-demo.html:1040` (literal) |
| `audio/archive/file-close.mp3` | Existe | P0 | 4438 | archive-close | `neosantiago-demo.html:1039` (literal) |
| `audio/archive/file-open.mp3` | Existe | P0 | 13842 | archive-open | `neosantiago-demo.html:1038` (literal) |
| `audio/combat/critical-hit.mp3` | Existe | P0 | 18231 | combat-critical | `neosantiago-demo.html:1071` (literal) |
| `audio/combat/defend-cover.mp3` | Falta | P0 | 0 | combat-defend | `neosantiago-demo.html:1072` (literal) |
| `audio/combat/emp-pulse.mp3` | Existe | P0 | 40801 | combat-emp | `neosantiago-demo.html:1075` (literal) |
| `audio/combat/enemy-hit-normal-1.mp3` | Existe | P0 | 7573 | combat-enemy-hit-normal | `neosantiago-demo.html:1066` (literal) |
| `audio/combat/enemy-hit-normal-2.mp3` | Existe | P0 | 4438 | combat-enemy-hit-normal | `neosantiago-demo.html:1066` (literal) |
| `audio/combat/enemy-hit-normal-3.mp3` | Existe | P0 | 8200 | combat-enemy-hit-normal | `neosantiago-demo.html:1066` (literal) |
| `audio/combat/enemy-hit-normal-4.mp3` | Existe | P0 | 8200 | combat-enemy-hit-normal | `neosantiago-demo.html:1066` (literal) |
| `audio/combat/flee.mp3` | Falta | P0 | 0 | combat-flee | `neosantiago-demo.html:1073` (literal) |
| `audio/combat/grenade.mp3` | Existe | P0 | 65878 | combat-grenade | `neosantiago-demo.html:1074` (literal) |
| `audio/combat/hit-normal-1.mp3` | Existe | P0 | 5692 | combat-hit-normal | `neosantiago-demo.html:1065` (literal) |
| `audio/combat/hit-normal-2.mp3` | Existe | P0 | 4438 | combat-hit-normal | `neosantiago-demo.html:1065` (literal) |
| `audio/combat/hit-normal-3.mp3` | Existe | P0 | 7573 | combat-hit-normal | `neosantiago-demo.html:1065` (literal) |
| `audio/combat/hit-normal-4.mp3` | Existe | P0 | 7573 | combat-hit-normal | `neosantiago-demo.html:1065` (literal) |
| `audio/combat/hit-normal.mp3` | Falta | P0 | 0 | combat-hit-normal | `neosantiago-demo.html:1065` (literal) |
| `audio/combat/melee-hit.mp3` | Falta | P0 | 0 | combat-melee | `neosantiago-demo.html:1064` (literal) |
| `audio/combat/miss.mp3` | Existe | P0 | 7573 | combat-miss | `neosantiago-demo.html:1070` (literal) |
| `audio/combat/shot-9mm.mp3` | Falta | P0 | 0 | combat-shot-9mm | `neosantiago-demo.html:1067` (literal) |
| `audio/combat/shot-rifle.mp3` | Falta | P0 | 0 | combat-shot-rifle | `neosantiago-demo.html:1068` (literal) |
| `audio/combat/shot-shotgun.mp3` | Falta | P0 | 0 | combat-shot-shotgun | `neosantiago-demo.html:1069` (literal) |
| `audio/combat/skill-elias.mp3` | Falta | P0 | 0 | combat-skill-elias | `neosantiago-demo.html:1062` (literal) |
| `audio/combat/skill-noa.mp3` | Falta | P0 | 0 | combat-skill-noa | `neosantiago-demo.html:1063` (literal) |
| `audio/combat/target-hover.mp3` | Falta | P0 | 0 | combat-target-hover | `neosantiago-demo.html:1060` (literal) |
| `audio/combat/target-select.mp3` | Existe | P0 | 3811 | combat-target | `neosantiago-demo.html:1061` (literal) |
| `audio/crafting/craft-basic.mp3` | Falta | P0 | 0 | craft-basic | `neosantiago-demo.html:1056` (literal) |
| `audio/crafting/craft-medical.mp3` | Falta | P0 | 0 | craft-medical | `neosantiago-demo.html:1057` (literal) |
| `audio/crafting/craft-tech.mp3` | Falta | P0 | 0 | craft-tech | `neosantiago-demo.html:1058` (literal) |
| `audio/decision/choice-confirm.mp3` | Falta | P0 | 0 | decision-confirm | `neosantiago-demo.html:1034` (literal) |
| `audio/decision/choice-hover.mp3` | Falta | P0 | 0 | decision-hover | `neosantiago-demo.html:1033` (literal) |
| `audio/decision/combat-trigger.mp3` | Falta | P0 | 0 | decision-combat | `neosantiago-demo.html:1036` (literal) |
| `audio/decision/danger-choice.mp3` | Falta | P0 | 0 | decision-danger | `neosantiago-demo.html:1035` (literal) |
| `audio/decision/result-reveal.mp3` | Falta | P0 | 0 | decision-result | `neosantiago-demo.html:1037` (literal) |
| `audio/ending/bad-ending.mp3` | Falta | P1 | 0 | ending-bad | `neosantiago-demo.html:1093` (literal) |
| `audio/ending/good-ending.mp3` | Falta | P1 | 0 | ending-good | `neosantiago-demo.html:1091` (literal) |
| `audio/ending/neutral-ending.mp3` | Falta | P1 | 0 | ending-neutral | `neosantiago-demo.html:1092` (literal) |
| `audio/ending/summary-open.mp3` | Falta | P1 | 0 | ending-summary | `neosantiago-demo.html:1094` (literal) |
| `audio/hp/ally-damage.mp3` | Falta | P0 | 0 | combat-enemy-hit-normal, hp-ally-damage | `neosantiago-demo.html:1066` (literal)<br>`neosantiago-demo.html:1076` (literal) |
| `audio/hp/ally-down.mp3` | Falta | P0 | 0 | hp-ally-down | `neosantiago-demo.html:1080` (literal) |
| `audio/hp/enemy-damage.mp3` | Falta | P0 | 0 | combat-hit-normal, hp-enemy-damage | `neosantiago-demo.html:1065` (literal)<br>`neosantiago-demo.html:1077` (literal) |
| `audio/hp/enemy-down.mp3` | Falta | P0 | 0 | hp-enemy-down | `neosantiago-demo.html:1081` (literal) |
| `audio/hp/heal.mp3` | Falta | P0 | 0 | hp-heal, hp-medical-use | `neosantiago-demo.html:1078` (literal)<br>`neosantiago-demo.html:1079` (literal) |
| `audio/hp/medical-use.mp3` | Falta | P0 | 0 | hp-medical-use | `neosantiago-demo.html:1079` (literal) |
| `audio/hp/revive-pulse.mp3` | Falta | P0 | 0 | hp-revive | `neosantiago-demo.html:1082` (literal) |
| `audio/loadout/equip-item.mp3` | Falta | P0 | 0 | loadout-equip | `neosantiago-demo.html:1050` (literal) |
| `audio/loadout/item-tray-open.mp3` | Falta | P0 | 0 | loadout-tray | `neosantiago-demo.html:1054` (literal) |
| `audio/loadout/profile-open.mp3` | Existe | P0 | 11334 | loadout-open | `neosantiago-demo.html:1049` (literal) |
| `audio/loadout/repair-gear.mp3` | Existe | P0 | 16350 | loadout-repair | `neosantiago-demo.html:1053` (literal) |
| `audio/loadout/transfer-item.mp3` | Falta | P0 | 0 | loadout-transfer | `neosantiago-demo.html:1052` (literal) |
| `audio/loadout/use-food.mp3` | Falta | P0 | 0 | loadout-food | `neosantiago-demo.html:1055` (literal) |
| `audio/loadout/use-item.mp3` | Falta | P0 | 0 | loadout-use | `neosantiago-demo.html:1051` (literal) |
| `audio/loot/corpse-hover.mp3` | Falta | P0 | 0 | loot-hover | `neosantiago-demo.html:1083` (literal) |
| `audio/loot/discard-item.mp3` | Existe | P0 | 11334 | loot-discard | `neosantiago-demo.html:1088` (literal) |
| `audio/loot/loot-exit.mp3` | Existe | P0 | 11334 | loot-exit | `neosantiago-demo.html:1090` (literal) |
| `audio/loot/loot-found.mp3` | Existe | P0 | 16350 | loot-found | `neosantiago-demo.html:1086` (literal) |
| `audio/loot/search-loop-1.mp3` | Existe | P0 | 121049 | loot-loop | `neosantiago-demo.html:1085` (literal) |
| `audio/loot/search-loop-2.mp3` | Existe | P0 | 140484 | loot-loop | `neosantiago-demo.html:1085` (literal) |
| `audio/loot/search-loop-3.mp3` | Existe | P0 | 145499 | loot-loop | `neosantiago-demo.html:1085` (literal) |
| `audio/loot/search-loop.mp3` | Falta | P0 | 0 | loot-loop | `neosantiago-demo.html:1085` (literal) |
| `audio/loot/search-start.mp3` | Falta | P0 | 0 | loot-search | `neosantiago-demo.html:1084` (literal) |
| `audio/loot/take-all.mp3` | Falta | P0 | 0 | loot-take-all | `neosantiago-demo.html:1089` (literal) |
| `audio/loot/take-item-1.mp3` | Existe | P0 | 9454 | refuge-supply, loot-take | `neosantiago-demo.html:1043` (literal)<br>`neosantiago-demo.html:1087` (literal) |
| `audio/loot/take-item-2.mp3` | Existe | P0 | 7573 | loot-take | `neosantiago-demo.html:1087` (literal) |
| `audio/loot/take-item-3.mp3` | Existe | P0 | 11334 | loot-take | `neosantiago-demo.html:1087` (literal) |
| `audio/loot/take-item.mp3` | Falta | P0 | 0 | loot-take | `neosantiago-demo.html:1087` (literal) |
| `audio/lore/archive-open.mp3` | Falta | P0 | 0 | lore-open | `neosantiago-demo.html:1030` (literal) |
| `audio/lore/tab-switch.mp3` | Existe | P0 | 2557 | lore-page, lore-tab | `neosantiago-demo.html:1031` (literal)<br>`neosantiago-demo.html:1032` (literal) |
| `audio/lore/voice/council-silence.mp3` | Existe | P1 | 418845 | Voz / ruta directa | `game-v2.js:495` (literal) |
| `audio/lore/voice/final-broadcast.mp3` | Falta | P1 | 0 | Voz / ruta directa | `game-v2.js:503` (literal) |
| `audio/lore/voice/hunter-mother.mp3` | Falta | P1 | 0 | Voz / ruta directa | `game-v2.js:496` (literal) |
| `audio/lore/voice/irene-heart.mp3` | Falta | P1 | 0 | Voz / ruta directa | `game-v2.js:502` (literal) |
| `audio/lore/voice/lira-core.mp3` | Falta | P1 | 0 | Voz / ruta directa | `game-v2.js:500` (literal) |
| `audio/lore/voice/matias-fever.mp3` | Falta | P1 | 0 | Voz / ruta directa | `game-v2.js:498` (literal) |
| `audio/lore/voice/red-lights-border.mp3` | Falta | P1 | 0 | Voz / ruta directa | `game-v2.js:497` (literal) |
| `audio/lore/voice/signal-start.mp3` | Existe | P1 | 411948 | Voz / ruta directa | `game-v2.js:494` (literal) |
| `audio/lore/voice/sunken-voices.mp3` | Falta | P1 | 0 | Voz / ruta directa | `game-v2.js:501` (literal) |
| `audio/lore/voice/terminal-memory.mp3` | Falta | P1 | 0 | Voz / ruta directa | `game-v2.js:499` (literal) |
| `audio/refuge/group-ready.mp3` | Falta | P0 | 0 | refuge-ready | `neosantiago-demo.html:1045` (literal) |
| `audio/refuge/npc-switch.mp3` | Falta | P0 | 0 | refuge-npc | `neosantiago-demo.html:1042` (literal) |
| `audio/refuge/refuge-enter.mp3` | Falta | P0 | 0 | refuge-enter | `neosantiago-demo.html:1041` (literal) |
| `audio/refuge/rest-soft.mp3` | Falta | P0 | 0 | refuge-rest | `neosantiago-demo.html:1044` (literal) |
| `audio/skills/skill-unlock.mp3` | Falta | P0 | 0 | skill-unlock | `neosantiago-demo.html:1059` (literal) |
| `audio/start/expedition-start.mp3` | Falta | P1 | 0 | start-expedition | `neosantiago-demo.html:1029` (literal) |
| `audio/start/title-enter.mp3` | Existe | P1 | 243252 | start-title-enter, start-new-game | `neosantiago-demo.html:1026` (literal)<br>`neosantiago-demo.html:1027` (literal) |
| `audio/trade/item-buy.mp3` | Falta | P0 | 0 | trade-buy | `neosantiago-demo.html:1047` (literal) |
| `audio/trade/item-sell.mp3` | Falta | P0 | 0 | trade-sell | `neosantiago-demo.html:1046` (literal) |
| `audio/trade/weapon-buy.mp3` | Falta | P0 | 0 | trade-weapon | `neosantiago-demo.html:1048` (literal) |
| `audio/ui/click-metal.mp3` | Existe | P0 | 4438 | ui-click | `extensions/mensajeros/play.mjs:233` (sound-call)<br>`neosantiago-demo.html:1019` (literal) |
| `audio/ui/close-panel.mp3` | Falta | P0 | 0 | ui-close-panel, loot-exit | `neosantiago-demo.html:1022` (literal)<br>`neosantiago-demo.html:1090` (literal) |
| `audio/ui/disabled-low.mp3` | Falta | P0 | 0 | ui-disabled | `neosantiago-demo.html:1020` (literal) |
| `audio/ui/download.mp3` | Falta | P0 | 0 | ui-download | `neosantiago-demo.html:1025` (literal) |
| `audio/ui/error-low.mp3` | Falta | P0 | 0 | ui-error | `neosantiago-demo.html:1023` (literal) |
| `audio/ui/hover-soft.mp3` | Existe | P0 | 2557 | ui-hover | `neosantiago-demo.html:1018` (literal) |
| `audio/ui/open-panel.mp3` | Existe | P0 | 11334 | ui-open-panel, start-load-game | `neosantiago-demo.html:1021` (literal)<br>`neosantiago-demo.html:1028` (literal) |
| `audio/ui/tab-switch.mp3` | Falta | P0 | 0 | ui-tab | `neosantiago-demo.html:1024` (literal) |

## Cobertura por evento

| Evento | Estado | Archivos que resolverá |
|---|---|---|
| `ui-hover` | original | `audio/ui/hover-soft.mp3` |
| `ui-click` | original | `audio/ui/click-metal.mp3` |
| `ui-disabled` | pending | Pendiente; sin request conocido fallido |
| `ui-open-panel` | original | `audio/ui/open-panel.mp3` |
| `ui-close-panel` | fallback | `audio/archive/file-close.mp3` |
| `ui-error` | pending | Pendiente; sin request conocido fallido |
| `ui-tab` | fallback | `audio/lore/tab-switch.mp3` |
| `ui-download` | fallback | `audio/ui/click-metal.mp3` |
| `start-title-enter` | original | `audio/start/title-enter.mp3`<br>`audio/ambience/title-enter.mp3` |
| `start-new-game` | original | `audio/start/title-enter.mp3` |
| `start-load-game` | original | `audio/ui/open-panel.mp3` |
| `start-expedition` | pending | Pendiente; sin request conocido fallido |
| `lore-open` | fallback | `audio/archive/file-open.mp3` |
| `lore-page` | original | `audio/lore/tab-switch.mp3` |
| `lore-tab` | original | `audio/lore/tab-switch.mp3` |
| `decision-hover` | fallback | `audio/ui/hover-soft.mp3` |
| `decision-confirm` | fallback | `audio/ui/click-metal.mp3` |
| `decision-danger` | pending | Pendiente; sin request conocido fallido |
| `decision-combat` | pending | Pendiente; sin request conocido fallido |
| `decision-result` | fallback | `audio/ui/open-panel.mp3` |
| `archive-open` | original | `audio/archive/file-open.mp3` |
| `archive-close` | original | `audio/archive/file-close.mp3` |
| `archive-switch` | fallback | `audio/lore/tab-switch.mp3` |
| `refuge-enter` | fallback | `audio/ui/open-panel.mp3` |
| `refuge-npc` | fallback | `audio/lore/tab-switch.mp3` |
| `refuge-supply` | original | `audio/loot/take-item-1.mp3` |
| `refuge-rest` | pending | Pendiente; sin request conocido fallido |
| `refuge-ready` | fallback | `audio/ui/click-metal.mp3` |
| `trade-sell` | fallback | `audio/loot/discard-item.mp3` |
| `trade-buy` | fallback | `audio/loot/take-item-1.mp3`<br>`audio/loot/take-item-2.mp3`<br>`audio/loot/take-item-3.mp3` |
| `trade-weapon` | fallback | `audio/loot/take-item-1.mp3`<br>`audio/loot/take-item-2.mp3`<br>`audio/loot/take-item-3.mp3` |
| `loadout-open` | original | `audio/loadout/profile-open.mp3` |
| `loadout-equip` | fallback | `audio/ui/click-metal.mp3` |
| `loadout-use` | fallback | `audio/ui/click-metal.mp3` |
| `loadout-transfer` | fallback | `audio/loot/take-item-1.mp3`<br>`audio/loot/take-item-2.mp3`<br>`audio/loot/take-item-3.mp3` |
| `loadout-repair` | original | `audio/loadout/repair-gear.mp3` |
| `loadout-tray` | fallback | `audio/ui/open-panel.mp3` |
| `loadout-food` | fallback | `audio/ui/click-metal.mp3` |
| `craft-basic` | pending | Pendiente; sin request conocido fallido |
| `craft-medical` | pending | Pendiente; sin request conocido fallido |
| `craft-tech` | pending | Pendiente; sin request conocido fallido |
| `skill-unlock` | fallback | `audio/ui/click-metal.mp3` |
| `combat-target-hover` | fallback | `audio/ui/hover-soft.mp3` |
| `combat-target` | original | `audio/combat/target-select.mp3` |
| `combat-skill-elias` | pending | Pendiente; sin request conocido fallido |
| `combat-skill-noa` | pending | Pendiente; sin request conocido fallido |
| `combat-melee` | pending | Pendiente; sin request conocido fallido |
| `combat-hit-normal` | original | `audio/combat/hit-normal-1.mp3`<br>`audio/combat/hit-normal-2.mp3`<br>`audio/combat/hit-normal-3.mp3`<br>`audio/combat/hit-normal-4.mp3` |
| `combat-enemy-hit-normal` | original | `audio/combat/enemy-hit-normal-1.mp3`<br>`audio/combat/enemy-hit-normal-2.mp3`<br>`audio/combat/enemy-hit-normal-3.mp3`<br>`audio/combat/enemy-hit-normal-4.mp3` |
| `combat-shot-9mm` | pending | Pendiente; sin request conocido fallido |
| `combat-shot-rifle` | pending | Pendiente; sin request conocido fallido |
| `combat-shot-shotgun` | pending | Pendiente; sin request conocido fallido |
| `combat-miss` | original | `audio/combat/miss.mp3` |
| `combat-critical` | original | `audio/combat/critical-hit.mp3` |
| `combat-defend` | pending | Pendiente; sin request conocido fallido |
| `combat-flee` | pending | Pendiente; sin request conocido fallido |
| `combat-grenade` | original | `audio/combat/grenade.mp3` |
| `combat-emp` | original | `audio/combat/emp-pulse.mp3` |
| `hp-ally-damage` | fallback | `audio/combat/enemy-hit-normal-1.mp3`<br>`audio/combat/enemy-hit-normal-2.mp3`<br>`audio/combat/enemy-hit-normal-3.mp3`<br>`audio/combat/enemy-hit-normal-4.mp3` |
| `hp-enemy-damage` | fallback | `audio/combat/hit-normal-1.mp3`<br>`audio/combat/hit-normal-2.mp3`<br>`audio/combat/hit-normal-3.mp3`<br>`audio/combat/hit-normal-4.mp3` |
| `hp-heal` | pending | Pendiente; sin request conocido fallido |
| `hp-medical-use` | pending | Pendiente; sin request conocido fallido |
| `hp-ally-down` | pending | Pendiente; sin request conocido fallido |
| `hp-enemy-down` | pending | Pendiente; sin request conocido fallido |
| `hp-revive` | pending | Pendiente; sin request conocido fallido |
| `loot-hover` | fallback | `audio/ui/hover-soft.mp3` |
| `loot-search` | pending | Pendiente; sin request conocido fallido |
| `loot-loop` | original | `audio/loot/search-loop-1.mp3`<br>`audio/loot/search-loop-2.mp3`<br>`audio/loot/search-loop-3.mp3` |
| `loot-found` | original | `audio/loot/loot-found.mp3` |
| `loot-take` | original | `audio/loot/take-item-1.mp3`<br>`audio/loot/take-item-2.mp3`<br>`audio/loot/take-item-3.mp3` |
| `loot-discard` | original | `audio/loot/discard-item.mp3` |
| `loot-take-all` | fallback | `audio/loot/take-item-1.mp3`<br>`audio/loot/take-item-2.mp3`<br>`audio/loot/take-item-3.mp3` |
| `loot-exit` | original | `audio/loot/loot-exit.mp3` |
| `ending-good` | pending | Pendiente; sin request conocido fallido |
| `ending-neutral` | pending | Pendiente; sin request conocido fallido |
| `ending-bad` | pending | Pendiente; sin request conocido fallido |
| `ending-summary` | fallback | `audio/ui/open-panel.mp3` |
| `ambience-title` | original | `audio/ambience/title-rain-tunnel.mp3` |
| `ambience-battle` | original | `audio/ambience/battle-loop.mp3` |
| `ambience-battle-victory` | original | `audio/ambience/battle-victory.mp3` |
| `ambience-archive` | pending | Pendiente; sin request conocido fallido |

## Archivos que no son audio

`audio/ambience/d`, `audio/combat/.gitkeep`, `audio/hp/.gitkeep`, `audio/lore/voice/d`, `audio/start/d`. No se consideran assets reproducibles.

El JSON adjunto conserva todos los registros y fuentes escaneadas. Tras agregar o cambiar assets o referencias, regenerar los informes y el catálogo; `node scripts/audit-audio.cjs --check` comprueba los tres archivos generados e identifica cambios de bytes, referencias, cobertura y catálogo.
