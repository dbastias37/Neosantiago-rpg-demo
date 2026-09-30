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

`cisterna-actions.js` amplía las alternativas de trabajo y sus consecuencias. Los permisos y acuerdos muestran su resultado en lugar de la etiqueta genérica «Sin consumo». Los costos de energía corresponden al esfuerzo base: la resistencia de cada aliado reduce el gasto, como en el resto de la campaña. Hablar o aceptar una negativa no consume suministros por sí solo.

| Alternativa de trabajo | Costo y resultado |
| --- | --- |
| Palanca improvisada en el corredor | Conserva la herramienta. Prueba técnica: éxito gasta 6 de energía y da 6 XP a Elías; fallo gasta 10 de energía, resta 2 de moral y hasta 4 HP a Elías. Un fallo deja disponibles las otras soluciones, sin permitir repetir la maniobra. |
| Componente para liberar el freno | Gasta 1 componente y 4 de energía; da 2 de moral y 4 XP a Elías. |
| Recorrer los cultivos o esperar en recepción | El recorrido cuesta 3 de energía. Esperar recupera 6, pero deja pasar el taller y el aprendizaje técnico de esta visita. |
| Copiar la orden o conservar el testimonio | Cotejar la copia cuesta 3 de energía y concede 1 punto de facción. El testimonio conserva lo escuchado, sin copia documental. |
| Dejar una consulta por Hernán | Preparar y revisar la descripción cuesta 2 de energía. Abre una búsqueda; no concede una respuesta inventada. |
| Donar e instalar el componente | Componente −1, energía −4, moral +3, facción +1 y Elías +4 XP. No compra un acuerdo político. |
| Intercambiar la pieza por comida | Componente −1 y energía −2 a cambio de una ración. |
| Regular el cierre por una venda | Requiere herramienta y consume una acción de ingeniería. Éxito: energía −6, venda +1 y Elías +8 XP. Fallo: energía −8 y hasta 3 HP de Elías, sin recompensa. |
| Practicar el procedimiento de Inés | Energía −4 y Elías +6 XP; conserva el procedimiento autorizado y habilita examinar el tablero exterior. |
| Copiar el plano a escondidas | Energía −4, tensión +1 y el riesgo existente del 55% de ser observado. No vuelve omniscientes a los habitantes. |
| Proteger las semillas | Una tela evita el esfuerzo adicional de llevarlas protegidas bajo la ropa; esa alternativa cuesta 4 de energía y conserva la tela. Ambas reciben el mismo lote. |

Las dos nuevas pruebas utilizan la ventana y las probabilidades del capítulo 1, incluido el aporte del estado mental del grupo. Abrir o cancelar la ventana no cobra; resolver aplica una sola vez el costo del resultado. No se añade el gasto implícito de energía de las pruebas antiguas encima del costo anunciado. Los permisos de los habitantes y su independencia no dependen de una tirada.

Los datos específicos se guardan en `campaignProgress` y `cisterna`. El cierre del capítulo 1 queda conservado como antecedente. Equipo, heridas, energía, inventario, créditos, documentos y estadísticas continúan con el grupo. Una nueva partida sí reinicia la campaña completa.

Los IDs anteriores permanecen en su posición. Los nuevos IDs son estables y el guardado sigue siendo compatible con el esquema 3. Los días internos 4–6 preservan la contabilidad anterior; la interfaz muestra los días 1–3 de esta expedición.

Una decisión se guarda al continuar desde su resultado. Hasta entonces se conserva el punto anterior, como en los encuentros existentes. Los recibos de las decisiones y las dos noches evitan duplicar gastos, descansos y recompensas al reanudar. Las visitas de preparación repetidas al mismo puesto tampoco conceden descansos adicionales.

Cada noche puede gastar una ración y una reserva de agua del grupo. Las alternativas y sus efectos se muestran antes de decidir. La vigilancia de UNO se resuelve en los encuentros exteriores escritos para este capítulo; el reloj de sincronización de La Voz queda en espera durante la lectura.

El archivo añade cuatro fuentes propias: registros de distribución, testimonio de Teresa, orden de salida y procedimiento de cultivo autorizado. El resumen conserva las decisiones de ambos capítulos.

## Verificación

`npm test` incluye las pruebas de continuidad entre los cinco finales, los límites de información, las relaciones, la exposición a UNO, los recursos, las retiradas, el combate y la restauración de cada punto estable. `npm run validate` comprueba sintaxis, referencias y la auditoría de audio.

`tests/e2e/chapter-two.spec.cjs` recorre el capítulo con los controles reales, recarga una partida durante la visita y comprueba el final, el resumen y el menú de actividades. Un segundo recorrido verifica la retirada y la reanudación sin repetir el pago del corredor. El inicio del capítulo 1 completado es un fixture; estas pruebas de navegador no sustituyen una partida completa desde el prólogo.

No se incorporan voces grabadas ni nuevas ilustraciones. Se conserva la presentación audiovisual disponible y la auditoría distingue las referencias de audio que ya faltaban antes de esta entrega.
