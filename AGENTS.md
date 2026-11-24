# Video editing in Edits

When the user supplies a video and an editing request, work from the supplied media and follow the requested edits. Keep original media intact. Verify the exported file and return its path to the user.

Use FFmpeg and ffprobe for inspection, cuts, audio, conversions, and exports. Use Remotion for React-based compositions and HyperFrames for HTML/CSS/JS compositions, or use the framework already present in the project. Use whisper.cpp for local transcription and subtitles. Use yt-dlp when the user's input is a supported source URL and downloading it is needed for the edit.

For Remotion or HyperFrames, check `.agents/skills` for the relevant skill. If the skill is unavailable, run `bash scripts/setup-video-skills.sh` and read its `SKILL.md` directly before using the framework. Load related references as directed by that skill. Guide rendering and framework dependency setup by the selected skill and existing project.

Check for the necessary commands before installing anything. Use the environment's package manager for FFmpeg if it is absent. Install yt-dlp with `uv tool install yt-dlp` if available, or use an isolated Python environment. For whisper.cpp, look for `whisper-cli` and an existing model first, including under `.video-tools/whisper` or its counterpart in the workspace root. If missing, build the CLI from [whisper.cpp](https://github.com/ggml-org/whisper.cpp) with CMake and fetch the official multilingual `base` model using the upstream model downloader. Store generated dependencies in `.video-tools/` and reuse them within the environment.
