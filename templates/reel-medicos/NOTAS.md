# Reel médico de lujo (negro / oro / marfil)
Implementa `templates/reel-estrategia/SPEC.md` con estética de lujo para el gremio médico.
- Fuente: Montserrat (OFL), clonar `JulietaUla/montserrat` (sparse `fonts/ttf`) a `fonts/`.
- Música: piano Salamander (CC BY 3.0, Alexander Holm) vía `lemo-opuscar/tools/fetch.sh instruments salamander`. **Dar crédito si se publica con esta música.**
- Flujo: `track.py` (YuNet) → `timeline.py` (quita pausas, planos ≤2 s, encuadre distinto en cada corte) → cues → `render.mjs` → `audio.py` → `mux.sh`.
- Rutas fijas en `/home/user/work/p3/...`: ajustar para otro proyecto.
