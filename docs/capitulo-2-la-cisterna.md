# Capítulo 2 · La Cisterna

La segunda expedición continúa después de cualquiera de los cinco desenlaces de La Voz. El botón **Continuar al capítulo 2 · La Cisterna** aparece tanto en el final como en su resumen. También funciona al cargar una partida terminada del capítulo anterior.

La campaña tiene cinco posiciones registradas. La Voz y La Cisterna están disponibles; los capítulos 3, 4 y 5 quedan reservados hasta tener contenido aprobado.

## Continuidad narrativa

El consejo, la visita y el regreso siguen el manuscrito aprobado de La Cisterna. Hay doce escenas principales distribuidas en tres días, con una transición inicial y nodos adicionales para las decisiones. Los nuevos papeles se recuperan en una oficina de distribución próxima a Los Héroes: no reemplazan las pruebas perdidas o entregadas a Vera en La Voz.

La apertura recuerda por separado el destino del archivo de la torre y lo ocurrido con Irene. No se concede retrospectivamente una prueba ni se resucita a un personaje. La comunidad de La Cisterna sigue siendo independiente en todos los desenlaces.

| Decisión | Consecuencia conservada |
| --- | --- |
| Aceptar la recepción o conversar desde fuera | Cambia lo que el grupo puede ver y aprender. La conversación exterior no concede acceso a cultivos ni al taller. |
| Pedir copias y respuestas autorizadas | Conserva la procedencia y los límites del testimonio, los documentos y las cartas. Hernán permanece sin un destino confirmado. |
| Ayudar, intercambiar o conservar los materiales | Los recursos se gastan una sola vez. Aprender lo que Inés desea compartir no exige pagar. |
| Proponer contacto limitado, cartas o ningún acuerdo | Las tres salidas pueden completar el reconocimiento. El contacto limitado aún requiere ratificación. |
| Presionar, entrar por un acceso prohibido o copiar un plano a la vista | Suspende la relación porque los habitantes presencian el incumplimiento. |
| Copiar en secreto o entregar datos privados al consejo | Registra el incumplimiento sin atribuir a los habitantes información que todavía no recibieron. La difusión posterior sí permite que llegue a sus manos. |
| Elegir la salida ante la vigilancia exterior | La transmisión hacia UNO se registra separada de la relación con La Cisterna. Combatir no borra un envío previo. |
| Regresar antes de completar la visita | Habilita otra preparación y reanuda el tramo pendiente. No vuelve a cobrar pasos ni a entregar hallazgos ya registrados. |

## Integración y partidas

`chapter-two-content.js` contiene las escenas, opciones y enlaces. `campaign-chapters.js` define el registro de cinco capítulos, sus transiciones, los hechos de la visita y sus desenlaces. La presentación utiliza la bitácora, los resultados, el refugio y el combate existentes.

Los datos específicos se guardan en `campaignProgress` y `cisterna`. El cierre del capítulo 1 queda conservado como antecedente. Equipo, heridas, energía, inventario, créditos, documentos y estadísticas continúan con el grupo. Una nueva partida sí reinicia la campaña completa.

Los IDs anteriores permanecen en su posición. Los nuevos IDs son estables y el guardado sigue siendo compatible con el esquema 3. Los días internos 4–6 preservan la contabilidad anterior; la interfaz muestra los días 1–3 de esta expedición.

Una decisión se guarda al continuar desde su resultado. Hasta entonces se conserva el punto anterior, como en los encuentros existentes. Los recibos de las decisiones y las dos noches evitan duplicar gastos, descansos y recompensas al reanudar. Las visitas de preparación repetidas al mismo puesto tampoco conceden descansos adicionales.

Cada noche puede gastar una ración y una reserva de agua del grupo. Las alternativas y sus efectos se muestran antes de decidir. La vigilancia de UNO se resuelve en los encuentros exteriores escritos para este capítulo; el reloj de sincronización de La Voz queda en espera durante la lectura.

El archivo añade cuatro fuentes propias: registros de distribución, testimonio de Teresa, orden de salida y procedimiento de cultivo autorizado. El resumen conserva las decisiones de ambos capítulos.

## Verificación

`npm test` incluye las pruebas de continuidad entre los cinco finales, los límites de información, las relaciones, la exposición a UNO, los recursos, las retiradas, el combate y la restauración de cada punto estable. `npm run validate` comprueba sintaxis, referencias y la auditoría de audio.

`tests/e2e/chapter-two.spec.cjs` recorre el capítulo con los controles reales, recarga una partida durante la visita y comprueba el final, el resumen y el menú de actividades. Un segundo recorrido verifica la retirada y la reanudación sin repetir el pago del corredor. El inicio del capítulo 1 completado es un fixture; estas pruebas de navegador no sustituyen una partida completa desde el prólogo.

No se incorporan voces grabadas ni nuevas ilustraciones. Se conserva la presentación audiovisual disponible y la auditoría distingue las referencias de audio que ya faltaban antes de esta entrega.
