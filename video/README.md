# Mayor de Sillas Venezuela — Video corporativo

Video de presentación del sistema de gestión de Mayor de Sillas Venezuela, construido en Remotion (React) siguiendo el guion "Un negocio, un sistema, un control total".

- Salida: `out/mayor-de-sillas.mp4` — 1920×1080, 30 fps, H.264, audio AAC 320 kbps.
- Duración: ~7:55 (el guion completo, sin recortes, a ritmo de locución natural ×1,1).

## Estructura

| Escena | Contenido | Archivo |
|---|---|---|
| 1 · El problema | Tienda/almacén/oficina, caos de Excel/cuadernos/mensajes, preguntas clave, logo | `src/scenes/Scene1.tsx` |
| 2 · La vendedora (Andrea) | Montaje del problema, comprobante por chat, Registrar venta, Validador de Pagos, factura, Mis Comisiones | `src/scenes/Scene2.tsx` |
| 3 · El gerente (Carlos) | Recepción en muelle, llamada de Sucursal Sur, Registrar Recepción (con excepción), Transferencias, Inventario | `src/scenes/Scene3.tsx` |
| 4 · El dueño (José) | Lunes 8 a.m., Excel y llamadas, Dashboard, Reportes, Inventario consolidado, Comisiones, Cuentas por pagar, Asistente IA | `src/scenes/Scene4.tsx` |
| 5 · Todos conectados | Capturas reales de los módulos, flujos de operaciones, auditoría, una sola fuente de información | `src/scenes/Scene5.tsx` |
| 6 · Cierre | Producto, plataforma, logo animado, cierre y pantalla final | `src/scenes/Scene6.tsx` |

- `src/timeline.ts` — línea de tiempo maestra: cada bloque de narración/diálogo y cada pausa visual. Todas las animaciones se sincronizan con tiempos de palabra (`W("S2N2", "calcula")`).
- `src/ui/*` — reconstrucción vectorial de las pantallas del sistema a partir de las capturas (para animarlas con nitidez).
- `src/AudioLayer.tsx` — mezcla: voces, música con *ducking* automático bajo la voz, ambientes y efectos.
- `src/data/vo.json` — duración y marcas de tiempo por palabra de cada locución (Whisper).

## Audio

- Narración: ElevenLabs `eleven_v4`, voz "Adrián – Warm & Natural Spanish Narrator" (español latinoamericano), tempo ×1,10, −18 LUFS.
- Personajes: Andrea, clienta, encargado, Sucursal Sur (filtro telefónico), Carlos, José y Asistente IA — voces ElevenLabs distintas.
- Música: ElevenLabs Music v2.5 — tema de tensión (problemas), tema de solución (soluciones) y final orquestal con el golpe final sobre "Un control total".
- SFX: ElevenLabs Sound Effects v3.

## Renderizar

```bash
npm install
npx remotion studio            # vista previa interactiva
npx remotion render MayorDeSillas out/mayor-de-sillas.mp4 --codec=h264 --crf=18 --audio-bitrate=320k
```

## Sustituir material

Las fotografías de `public/photos/` son planos ilustrativos generados (sin personas, sin texto). Si se dispone de fotos o video reales de las tiendas, basta con reemplazar los archivos manteniendo el nombre.
