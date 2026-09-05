# Decisiones narrativas visibles

La ruleta sustituye únicamente las 13 pruebas narrativas de la campaña y la variante de investigación habilitada por la copia de Vega. Las decisiones directas, los desvíos ya resueltos por aliados, los dados del combate y el minijuego del inhibidor mantienen sus flujos.

## Probabilidad y ánimo

La probabilidad neutral conserva la del chequeo original: `(21 - dificultad + bono original) × 5`, limitada a 0–100. Se sustituye el antiguo modificador psicológico por aportes explícitos de los personajes vivos: −5, 0 o +5 puntos porcentuales según su estado y la clase de acción. No se suman ambos sistemas. El total favorable se limita a 5–95%; las pruebas actuales quedan dentro de esos límites sin recorte.

El estado de grupo muestra la mayoría de los participantes o «Mixto». Cada personaje conserva su estado visible y su contribución individual; un personaje agotado aporta cero. Los pesos por acción están definidos en `decisionMoodWeights`. La interfaz explica la suma y muestra todos los porcentajes antes de confirmar.

Solo seis escenas tienen una tercera salida de combate. En ellas, un tercio de la probabilidad desfavorable, redondeado al entero más próximo, corresponde a ese contacto; el resto conserva el fallo narrativo original. Ninguna escena recibe un combate por inferencia de palabras o por su posición en la campaña.

## Instancias

| ID estable | Acción | Salidas | Conexión existente |
|---|---|---|---|
| council | Exigir acceso a los archivos | Archivo / rechazo | Varela y registro de exiliados |
| border | Dejar el arma y mostrar las manos | Tregua / aviso / ataque | Conversación de Lira o combate territorial |
| rails | Cruzar asegurados con una cuerda | Paso / golpe | Medicina; golpe no letal de hasta 5 HP a Elías |
| lure | Reactivar el señuelo térmico | Señuelo / fuga / cerco | Bomba asegurada o perdida; victoria puede recuperarla |
| blackout | Cortar la energía del túnel | Corte / arco | Núcleo del dron y alerta de la red |
| pulse | Controlar el pulso | Silencio / marca / bloqueo | Contacto con S-7 o dron hostil |
| memory | Injertar el núcleo del dron | Memoria / copia | Protocolo, nombres y señal |
| credential | Presentar la credencial | Acceso / retirada / alarma | Conversación de Vega o identidades registradas |
| controller | Sobrecargar el controlador | Ventana / rastro | Escape del cruce; consumo de batería |
| coordinates | Entregar coordenadas falsas | Desvío / deuda | Vera y módulo de radio o Cosechadores hostiles |
| relay | Infectar el relé | Mapa / rechazo / nido | Desvío de drones o alerta de torre |
| traces | Reconstruir el combate | Tregua / duda | Mapa y evidencia de tregua |
| floors | Cerrar pisos con la credencial | Cierre / brecha / asalto | Antena asegurada o transmisión comprometida |
| recoveredNames | Comparar cuerpos con la copia rescatada | Nombres / fragmento | Variante condicionada a las decisiones previas de Vega |

Los textos introductorios, la espera, las palabras de la rueda y las salidas son propios de cada instancia. Los éxitos y fallos originales conservan sus efectos; las nuevas alarmas heredan el costo y las consecuencias del fallo, con un combate real. Recuperar la bomba o asegurar la antena mediante victoria corrige explícitamente sus banderas opuestas.

## Estado y dependencias

- `campaign-v2.js` asigna los IDs; la sustitución condicional de Vega los asigna en `eventDisplay`.
- `decision-v2.js` contiene catálogo, probabilidad, ciclo del modal y animación. Se carga antes de `game-v2.js` y no ejecuta una partida por sí solo.
- `game-v2.js` abre el modal, pausa el inhibidor, protege atajos y conecta las consecuencias con `completeChoice`, `advance` y el combate existente.
- `decision-v2.css` usa las variables y botones del juego. Los estilos están acotados al modal; únicamente las etiquetas de probabilidad nuevas añaden ajuste de línea en las decisiones principales.
- Abrir o cancelar no consume recursos. Confirmar guarda el punto previo y consume energía de expedición una vez. La selección usa una sola llamada al generador persistente; la animación no consume azar.
- Los efectos se aplican una vez al revelar. Un combate recibe esos cambios como registro, sin volver a descontarlos en la victoria. Retirarse guarda el costo real y mantiene la situación pendiente, igual que otros combates de campaña.
- Las escrituras intermedias siguen bloqueadas hasta cerrar el encuentro. Recargar restaura el punto previo y la semilla. Reiniciar limpia los temporizadores e invalida callbacks antiguos.
- El resultado de la ruleta se confirma mediante pulso neón breve, borde del desenlace y texto. Con movimiento reducido se omiten las vueltas y el pulso. Los atajos no atraviesan el modal; Tab permanece dentro y Escape solo cancela antes de resolver.

## Verificación

`node --test tests/*.test.cjs`: 33 pruebas aprobadas, incluidas las 20 de estabilidad previas. La cobertura nueva comprueba las 34 salidas, las 729 combinaciones de ánimo para el engaño, costos, banderas, continuaciones, retirada, restauración, selección y posición final, movimiento reducido y callbacks antiguos. El resultado aparece en una ventana independiente sobre la ruleta en ambas orientaciones, con encabezado y botón fuera del scroll. Se comprueban su apertura, foco exclusivo, pausa del inhibidor, cierre y continuación única hacia conversación, expedición o combate.

La revisión estática conserva apilado en portrait, dos columnas en horizontal, límites de altura, scroll único del modal y controles de al menos 49 px. **No se completó una verificación visual en navegador:** la política del navegador remoto bloqueó la página local de prueba. Sigue pendiente confirmar visualmente 360×800, 390×844, 412×915, tablet y desktop en el despliegue real. Las pruebas de DOM simulado no verifican geometría ni renderizado.
