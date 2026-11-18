# Reel "estrategia de viralización": especificación medida

Fuente: video de referencia de 44,3 s, 480×854, 24 fps, H.265, audio AAC 44,1 kHz. Medido fotograma a fotograma (hojas de contacto a 3 y 24 fps), con detección de cortes, transcripción por palabra y análisis de audio.
**No es una copia del contenido**: solo del estilo de edición. Los textos concretos son los de la referencia; sustituir por los del cliente.

## 1. Estructura general
- Formato 9:16. Un solo hablante a cámara, cortado sin pausas: **0 silencios mayores de 0,25 s**, 3,8 palabras/s.
- 3 tipos de plano, alternados cada 1–4,5 s: A) plano general cuerpo entero, B) plano medio / primer plano, C) **tarjeta blanca** (sin la persona) con captura de pantalla.
- Duración de cada plano: A 3–5 s, B 1–3,5 s, C 3,5–4 s. La tarjeta blanca aparece 4 veces.
- Casi todos los planos de la persona cambian de encuadre al cortar (general ↔ primer plano), con empuje lento (≈4–6 %) dentro del plano general.

## 2. Línea de tiempo (s)
| t | Plano | Texto / elemento |
|---|---|---|
| 0–4,7 | A general (escultura roja de fondo) | Subtítulos por palabra: "Los **dueños** o gerentes de negocios aquí en **Caracas** nunca logran vender lo que quieren por redes sociales porque están cometiendo estos **errores**" |
| 4,75–7,6 | B primer plano, luz cálida | "no **vendían**", "no eran **reconocidos**", "y su competencia se los llevaba por delante" con **$235 → $147 → $84 → $8** en rojo brillante sobre el pecho (cuenta atrás) |
| 7,6–8,7 | B plano medio inclinado | 4 signos "?" blancos con borde negro rebotando alrededor de la cabeza |
| 8,7–13,4 | A medio | "…**no ridiculiza**. **Vende** y va a estar bastante…" |
| 13,4–15,7 | A general, otro lugar | Figura animada gris (mascota recortada) bailando a la izquierda |
| 15,7–16,8 | B primer plano | transición con desenfoque |
| 16,8–20,5 | **C tarjeta blanca 1** | Titular "pasó a vender" / "7 teléfonos" / "semanales" / "**más 150**" + 2 capturas de perfil de Instagram con **flecha roja**, luego un video vertical en marco redondeado |
| 20,5–20,96 | B | un parpadeo de la persona |
| 20,96–25,6 | **C tarjeta 2** | "pasó de estar **vacío**" (palabra enorme) → "a quedarse **sin mercancía**" + captura de perfil y foto de local lleno |
| 25,6–26,7 | B medio | — |
| 26,7–30,5 | **C tarjeta 3** | "pasó de vender unidades **50 → 263**" (contador), captura de perfil de tienda, luego video vertical |
| 30,5–33,6 | B primer plano | "aumento **426 % de ventas**" apilado y centrado sobre el torso |
| 33,6–34,5 | B primer plano | transición con desenfoque |
| 34,5–36,2 | **C tarjeta 4** | "acumuló más **300k**" + miniaturas de videos |
| 36,2–37,0 | A general | "esto no es **Magia**" (azul claro brillante) |
| 37,0–42,2 | A general otro ángulo | contador verde neón **$5K → $8K → $12K → $16K → $19,5K → $20K** y luego "**200M vistas**" blanco enorme |
| 42,2–44,3 | B primer plano | **comenta "INFO"** blanco, condensado, muy grande, sobre el torso |

## 3. Sistema de texto
- **Dos niveles de jerarquía.** Palabra clave: enorme, ultra negrita, geométrica (tipo Poppins ExtraBold / Montserrat Black), tracking cerrado. Resto de la frase: pequeña, peso medio, blanca. Se alternan en la misma línea.
- **Posición:** tercio inferior del cuadro, entre 58 % y 68 % de la altura, sobre la cintura/torso. Nunca sobre la cara. Excepción: "comenta INFO" y "426 %" van sobre el torso.
- **Colores:** amarillo `#FFE600` con resplandor (palabras clave), blanco, azul oscuro/azul claro con resplandor (nombres propios), rojo `#FF1E1E` con resplandor (dinero perdido), verde neón `#39FF14` con resplandor (dinero ganado), negro sobre tarjeta blanca.
- **Entrada:** letra por letra, escalonada (≈1–2 fotogramas entre letras), con desenfoque que se aclara y ligero crecimiento. **Salida:** desenfoque + fade rápido (≈3 fotogramas). Una sola frase visible a la vez.
- **Contadores:** los números saltan en pasos visibles (no rueda continuo), cada ≈0,3 s.
- Palabras de énfasis a veces se desplazan o se cortan ("Se m" parcial) mientras se escribe la frase.
- "INFO" y "426 %": fuente condensada, extra pesada, blanca, con sombra suave; letras se apilan en 2–3 líneas.

## 4. Transiciones
1. **Corte seco con cambio de encuadre** (general ↔ primer plano), el más usado.
2. **Desenfoque cruzado** (video → tarjeta blanca y viceversa): el plano se desenfoca en 4–5 fotogramas hasta casi 25 px, se disuelve a la tarjeta (también desenfocada) y la tarjeta se enfoca en ≈4 fotogramas. Duración total ≈0,25–0,4 s.
3. Elementos de la tarjeta blanca entran con desenfoque, crecimiento y ligera rotación; las capturas aparecen con perspectiva y sombra suave.

## 5. Tarjetas blancas
- Fondo gris muy claro `#E9E7EB`, sin sombras duras.
- Titular arriba (tercio superior), negro, ultra negrita, minúsculas, con una palabra enorme (hasta 22 % del ancho del cuadro por letra).
- Debajo, **captura real de pantalla** (perfil de Instagram, analítica, video vertical) en marco de esquinas redondeadas (≈6 % de radio) con sombra suave. Dos capturas a la vez se superponen con ligera rotación. Flecha roja dibujada a mano entre ellas.

## 6. Audio (lo que se pudo medir)
- Voz: **−10,2 LUFS** integrado, pico +0,6 dBFS, LRA 2,9 LU (muy comprimida y fuerte).
- **Música/graves:** a partir de ≈16 s la banda de 40–150 Hz sube 5–8 dB y se mantiene hasta el final (≈−17 a −21 dB frente a ≈−26 dB antes): entra una base rítmica grave. Antes de 16 s hay un colchón muy bajo (suelo ≈−28 dB).
- Tempo: **no se pudo determinar con certeza** (≈97 BPM o el doble, ≈193). Correlación débil.
- **Efectos de sonido (whoosh, pops): no se detectaron** de forma fiable bajo la voz. No afirmo que existan ni que no.

## 7. Lo que no se puede deducir
- Los videos de la persona en otros lugares, las capturas de pantalla de Instagram y la figura bailando son **material del cliente / recursos externos**: hay que proporcionarlos.
- Tipografías exactas, nombre de la música y software original (probablemente CapCut): no verificable.
- La referencia está a 480×854; el resultado final se hace a 1080×1920.
