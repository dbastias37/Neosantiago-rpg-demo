# NPC de encargos: retratos integrados, sistema desactivado

Actualización: 15 de septiembre de 2026.

Los siete PNG aprobados y adjuntos por el usuario se convirtieron a WebP y se
vincularon por nombre en `npcs.json`. Están archivados en main para implementar
misiones y rutas después. No se importan desde el HTML, JavaScript ni CSS del juego.

## Archivos y perfiles

Las siete fichas completas aportadas por el usuario están conservadas en [NPCS-CONTEXTO.md](NPCS-CONTEXTO.md) y estructuradas en `npcs.json`. No faltan asignaciones de estos siete personajes. Los IDs y las rutas WebP permanecen estables.

| Personaje | Refugio | Función confirmada |
|---|---|---|
| Dr. Romero | República | Encargado del puesto médico |
| Beatriz | Los Libertadores | Encargada del sector hidropónico; Encargada de los encargos |
| Guzmán | Los Leones | Líder del refugio de talleres |
| Jimenez | Vicuña Mackenna | Jefe de operaciones; NPC central del refugio |
| Adasme | Vicuña Mackenna | Encargada de las misiones de extracción |
| H.Morales | Los Héroes | Cazador; Encargado de los encargos |
| Ana | Plaza de Armas | Líder de la comunidad de paso; Encargada de los encargos |

`profiles_complete: true` indica que se registraron todas las fichas proporcionadas; no implica que las misiones estén programadas. Adasme conserva personalidad y manera de hablar pendientes. No expandir la inicial de H.Morales. Ana no tiene especialidad medicinal: lidera la comunidad de paso y gestiona sus encargos. La procedencia de Sara de Vicuña Mackenna queda documentada en la ficha de Jimenez, sin modificar la campaña.

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
