# Comercial para clínicas y consultorios: notas de producción

Formato: vertical 9:16, 1080 × 1920, 30 fps, H.264. Duración: **2:02**.
Archivo final: `out/comercial-clinicas.mp4`.

## Por qué dura 2:02 y no 75–85 s

La locución exacta del guion tiene unas 330 palabras. A un ritmo publicitario
enérgico (unas 2,9 palabras por segundo), eso son unos 115–120 segundos. Para que
quepa en 85 s habría que leer a más de 4 palabras por segundo, que suena
atropellado. No he modificado el texto, así que el vídeo se ha alargado.
Si necesitas 85 s, hay que recortar la locución, sobre todo la escena 8 (86
palabras) y la 10 (43 palabras).

## Concepto visual

- **Personas a contraluz.** Médicos, pacientes y equipo creativo aparecen como
  siluetas recortadas por luz de borde. No hay rostros sintéticos. Es una decisión
  de dirección de arte: evita la estética de "IA genérica" y mantiene la sobriedad.
- **Arquitectura con cámara real.** El pasillo de la clínica, la recepción de
  mármol y la sala de espera se construyen con un motor de perspectiva propio
  (`src/components/space.tsx`), así los travellings y dollies son movimientos de
  cámara reales, no zooms digitales.
- **Paleta:** negro carbón, blanco, gris titanio, azul frío sutil y acabados
  metálicos en las cifras y palabras clave. El único color chillón está dentro
  de los teléfonos de la escena 3, como sátira del contenido mal hecho.
- **Tipografía:** Inter Display / Inter. Las entradas se hacen con máscara,
  desplazamiento y desenfoque, sin rebotes.
- **Casos:** cada marca tiene una identidad tipográfica provisional (no son sus
  logos) y la leyenda "Recreación ilustrativa". Las cifras son exactamente las del
  guion. En la gráfica de GSM solo están rotulados los datos reales (50, 263,
  días 1 y 17); la forma de la curva es ilustrativa.

## Locución con tiempos para grabar

| Escena | Entrada | Duración | Locución |
|---|---|---|---|
| 1 | 0:00.0 | 9,0 s | Los dueños de clínicas y consultorios aquí en Caracas están perdiendo miles de dólares al mes en pacientes potenciales por un error crítico: |
| 2 | 0:09.0 | 8,5 s | Tienen o son los mejores especialistas, tecnología de punta y años de experiencia real, pero CERO PRESENCIA DE AUTORIDAD EN REDES. |
| 3 | 0:17.5 | 10,0 s | La mayoría comete el error de contratar creadores que los ponen a hacer bailes, trends absurdos o a mostrar fotos estáticas de consultorio que a nadie le importan. |
| 4 | 0:27.5 | 7,0 s | Eso no solo devalúa la investidura médica, sino que aleja al paciente que busca seguridad y rigor. |
| 5 | 0:34.5 | 10,0 s | ¿Qué hicimos para cambiar esto? Nosotros no hacemos circo ni ridiculizamos a los profesionales. Aplicamos una estrategia de viralización basada en la sustancia y el neuromarketing. |
| 6 | 0:44.5 | 14,5 s | Respetamos al 100% tu reputación y la de tu equipo médico. Utilizamos la sabiduría, el criterio y la reputación del especialista como un núcleo magnético del contenido, logrando que el paciente confíe en su autoridad antes de pisar el consultorio. |
| 7 | 0:59.0 | 7,5 s | Logramos que el público entienda por qué tu clínica es la opción definitiva, destruyendo objeciones de precio y miedo. |
| 8 | 1:06.5 | 30,0 s | Esto no es teoría; es el mismo sistema… *(intro 3,5 s)* · Kingphone *(1:10.0)* · Bogo *(1:16.6)* · GSM *(1:23.2)* · Rodacentro *(1:29.9)* |
| 9 | 1:36.5 | 10,5 s | Y muchos casos más. En total, hemos generado más de 200 millones de vistas y decenas de miles de dólares facturados para nuestros clientes aplicando este mismo rigor estratégico. |
| 10 | 1:47.0 | 15,0 s | Si crees estar listo como profesional… comenta '2026' y evaluaremos tu caso por privado para diseñar el plan a tu medida. *(el "2026" aparece en 1:57.9)* |

Cuando exista la locución grabada, los tiempos se ajustan en `src/timing.ts` y
las animaciones se resincronizan solas. Las marcas internas de cada escena
(cifras, palabras) están en los archivos de `src/scenes/`.

## Sonido

`public/banda-sonora.wav` se genera por síntesis con `scripts/audio.py`. Incluye
dron grave, latidos, pulsos digitales, glitches, pads, ostinato de bajo, percusión,
whooshes, risers e impactos sincronizados con cada cifra y palabra clave.
Está normalizada a −19,5 LUFS para dejar espacio a la voz por encima.

**No incluye voz en off.** No hay ningún servicio de texto a voz disponible en
este entorno. Opciones: grabar con un locutor sobre este vídeo usando la tabla de
arriba, o conectar ElevenLabs (Remotion ya trae el paquete `@remotion/elevenlabs`)
con una clave de API.

## Cómo volver a renderizar

```bash
npm install
python3 scripts/audio.py public/banda-raw.wav
ffmpeg -i public/banda-raw.wav -af "loudnorm=I=-20:TP=-2:LRA=14" public/banda-sonora.wav
npx remotion render src/index.ts Comercial out/comercial-clinicas.mp4
npx remotion studio   # vista previa interactiva
```
