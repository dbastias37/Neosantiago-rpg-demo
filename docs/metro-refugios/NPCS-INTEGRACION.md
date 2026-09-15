# NPC de encargos: retratos integrados, sistema desactivado

Actualización: 15 de septiembre de 2026.

Los siete PNG aprobados y adjuntos por el usuario se convirtieron a WebP y se
vincularon por nombre en `npcs.json`. Están archivados en main para implementar
misiones y rutas después. No se importan desde el HTML, JavaScript ni CSS del juego.

## Archivos y perfiles

| Original del usuario | ID | WebP en `characters/encargos/` | Perfil recuperado |
|---|---|---|---|
| Dr_romero.png | dr-romero | dr-romero.webp | Pendiente |
| Beatriz.png | beatriz | beatriz.webp | Pendiente |
| Guzman.png | guzman | guzman.webp | Pendiente |
| Jimenez.png | jimenez | jimenez.webp | Pendiente |
| Adasme.png | adasme | adasme.webp | Pendiente |
| Hmorales.png | hmorales | hmorales.webp | Pendiente; no expandir la H sin fuente |
| Ana.png | ana | ana.webp | Líder y encargada de encargos en Plaza de Armas |

El usuario identificó estos adjuntos como los personajes aprobados en el chat de
creación. La recuperación de contexto no devolvió las fichas completas de los
primeros seis. No confundir esto con personajes que aún necesiten ser creados.
El catálogo conserva sus nombres y retratos exactos; `refuge_id: null`, `roles: []`
y `profile_status: awaiting_prior_profile` indican que falta recuperar la asignación.
`roster_complete: true` se refiere a estos siete adjuntos, no a todos los NPC del juego.
`profiles_complete: false` expresa la limitación pendiente.

Ana dirige la comunidad de paso de Plaza de Armas (`plaza`) y coordina los encargos.
Tiene aproximadamente 34 años, es seria, no sonríe, tiene trenza maría y usa silla
 de ruedas. Se pidió diferenciar su rostro de Sara y Rosa. Esta ficha no confirma
por sí sola las propuestas anteriores de cultivos medicinales de Plaza de Armas.

Las observaciones visuales del catálogo describen lo que se ve en los adjuntos.
No son prueba de rangos, facciones, biografías ni asignaciones a estaciones. Para
completar esas relaciones, recuperar el texto de las fichas del chat original.
Mantener los IDs estables; no duplicar, trasladar ni reemplazar a Mara, el Armero,
Elías, Sara, Noa u otros personajes existentes por inferencia.

## Peso y fidelidad

Los PNG sumaban 22.834.089 bytes y los siete WebP suman 700.510 bytes: reducción
del 96,93 %. Cada salida mide 614×1024 píxeles, calidad 84, y pesa entre 79.424 y
125.284 bytes. Se conserva el encuadre completo y la proporción con el redondeo
normal del escalado; no se recortan rostros, fondos ni la silla de Ana.

El catálogo incluye dimensiones, tamaño y SHA-256 de cada WebP, además del nombre,
dimensiones, tamaño y SHA-256 del PNG de origen. Los originales adjuntos no se
modifican y no se añaden al repositorio. `scripts/optimize-npc-portrait.py` requiere
Python y Pillow solo para desarrollo, sin dependencias nuevas para el navegador.

```sh
python scripts/optimize-npc-portrait.py /ruta/original.png /ruta/retrato.webp
node --test tests/refuge-npcs.test.cjs
```

El conversor limita la salida a 768×1024 y 180 KiB, conserva proporciones, aplica
orientación EXIF y no amplía imágenes. Prueba calidad 84, 80, 76 y 72. Si no alcanza
el presupuesto, solicita revisión antes de degradar más. No sobrescribe destinos.

## Activación futura y carga

Conservar `runtime_enabled: false`, `enabled: false` y `mission_ids: []` hasta
desarrollar las misiones. El catálogo es JSON de preparación: no crea pantallas,
diálogos, viajes, recompensas ni cambios de partidas. Como no hay referencias de
carga en la campaña, estos retratos no generan solicitudes al iniciar el juego.

Cuando se implemente el sistema de refugios, cargar el catálogo al abrirlo y cada
retrato al consultar su contacto. Usar las dimensiones registradas y
`decoding="async"`; para contactos fuera de pantalla, `loading="lazy"`. No incrustar
imágenes en base64 ni precargar el elenco. Estar desactivados en la interfaz no
impide el acceso directo por URL si el alojamiento sirve esas carpetas.
