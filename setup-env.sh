#!/bin/sh
# Entorno de edición de video para King Phone. Idempotente: salta lo que ya existe.
# Instala en /home/user/tools: ffmpeg 7+ estático, venv de Python (voz + visión), modelos y YuNet.
# Hosts necesarios: github.com (+ objects/media.githubusercontent.com), pypi.org, registry.npmjs.org.
set -e
T=/home/user/tools; mkdir -p $T/whisper-models/dl && cd $T

# 1. ffmpeg 7+ (el del sistema es 6.x; lemo-opuscar exige 7+)
if [ ! -x $T/ffmpeg7-dl/bin/ffmpeg ]; then
  mkdir -p ffmpeg7-dl && curl -sSL -m 600 -o ffmpeg7-dl/ff.tar.xz \
    https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz
  tar -xf ffmpeg7-dl/ff.tar.xz -C ffmpeg7-dl --strip-components=1 && rm ffmpeg7-dl/ff.tar.xz
fi

# 2. Python: transcripción por palabra (Parakeet), VAD, seguimiento de cara
[ -d whisper-venv ] || python3 -m venv whisper-venv
./whisper-venv/bin/pip install -q sherpa-onnx numpy soundfile scipy "opencv-python-headless<5"

# 3. Modelos (todos desde GitHub Releases; Hugging Face está bloqueado en la red del entorno)
R=https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models
[ -f whisper-models/silero_vad.onnx ] || curl -sSL -m 120 -o whisper-models/silero_vad.onnx $R/silero_vad.onnx
P=whisper-models/dl/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8
if [ ! -d $P ]; then
  curl -sSL -m 580 -o whisper-models/dl/pk.tar.bz2 $R/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2
  tar -xjf whisper-models/dl/pk.tar.bz2 -C whisper-models/dl && rm whisper-models/dl/pk.tar.bz2
fi
[ -f yunet.onnx ] || curl -sSL -m 60 -o yunet.onnx \
  https://media.githubusercontent.com/media/opencv/opencv_zoo/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx

# 4. lemo-opuscar (efectos de sonido y mezcla). Clon superficial + paquetes de música.
L=/home/user/lemomo-ai/lemo-opuscar
if [ ! -d $L/.git ]; then
  mkdir -p /home/user/lemomo-ai
  GIT_LFS_SKIP_SMUDGE=1 git clone -q --depth 1 https://github.com/lemomo-ai/lemo-opuscar $L
fi
(cd $L && PATH=$T/ffmpeg7-dl/bin:$PATH sh plugin/skills/lemo-opuscar/scripts/setup.sh deps music >/dev/null 2>&1 || true)

# 5. Herramientas de este repo en rutas fijas
[ -d /home/user/edits/tools ] && cp -n /home/user/edits/tools/*.py $T/ 2>/dev/null || true
echo "listo: ffmpeg=$($T/ffmpeg7-dl/bin/ffmpeg -version | head -1 | cut -d' ' -f3)"
