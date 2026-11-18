# edits: edición de video con Claude Code

Plantillas y herramientas para editar videos de King Phone en una sesión de Claude Code (nube).
**Aquí no se suben videos** (están en `.gitignore`): se entregan por el chat o Drive.

## Empezar una sesión nueva
1. `sh setup-env.sh`: instala ffmpeg 7+, voz (Parakeet), seguimiento de cara (YuNet) y lemo-opuscar en `/home/user/tools`. Son unos 1,5 GB de descargas; tarda varios minutos.
2. Pasa a Claude los clips (Drive o adjuntos) y dile qué plantilla seguir.

Red necesaria: `github.com` (y `objects/media.githubusercontent.com`), `pypi.org`, `registry.npmjs.org`. Hugging Face está bloqueado: no usar modelos de ahí.

## Plantillas
| Carpeta | Para qué |
|---|---|
| `templates/ups-explainer` | Un solo plano hablando, con subtítulos palabra por palabra, ~30 gráficos, zooms, efectos y música. |
| `templates/trade-in` | Varios clips: quita silencios, cortes en L/J, seguimiento de cara, rótulos de cristal con precios animados, círculo que sigue un objeto, corrección de color HDR→SDR. |

Los scripts tienen rutas fijas (`/home/user/work/...`): ver el encabezado de cada uno.

## Reglas aprendidas (importan)
- **Los iPhone graban HDR (HLG/BT.2020).** Siempre convertir con `templates/trade-in/cc_filter.txt` o los colores salen pálidos.
- Contenido vertical 1080×1920: nada de texto en los primeros 168 px ni bajo 1330 px.
- Mezcla a −14 LUFS con `lemo-opuscar/core/render/mux.sh`.
- Los tiempos por palabra salen de Parakeet (`tools/words.py`), no de Whisper.
- Fuente: Inter (no hay Clarify MD). Pasar el `.ttf` y cambiarla en `comp.html`.
- Revoca los tokens de Drive al terminar (`myaccount.google.com/permissions`).
