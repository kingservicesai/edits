# Video editing in Edits

When the user supplies a video and an editing request, work from the supplied media and follow the requested edits. Keep original media intact. Verify the exported file and return its path to the user.

Use FFmpeg and ffprobe for inspection, cuts, audio, conversions, and exports. Use Remotion for React-based compositions and HyperFrames for HTML/CSS/JS compositions, or use the framework already present in the project. Use whisper.cpp for local transcription and subtitles. Use yt-dlp when the user's input is a supported source URL and downloading it is needed for the edit.

For Remotion or HyperFrames, check `.agents/skills` for the relevant skill. If the skill is unavailable, run `bash scripts/setup-video-skills.sh` and read its `SKILL.md` directly before using the framework. Load related references as directed by that skill. Guide rendering and framework dependency setup by the selected skill and existing project.

Check for the necessary commands before installing anything. Use the environment's package manager for FFmpeg if it is absent. Install yt-dlp with `uv tool install yt-dlp` if available, or use an isolated Python environment. For whisper.cpp, look for `whisper-cli` and an existing model first, including under `.video-tools/whisper` or its counterpart in the workspace root. If missing, build the CLI from [whisper.cpp](https://github.com/ggml-org/whisper.cpp) with CMake and fetch the official multilingual `base` model using the upstream model downloader. Store generated dependencies in `.video-tools/` and reuse them within the environment.

## Mandatory creative quality gate

Treat this gate as part of every creative video request unless the user explicitly waives it. A technically correct export is not sufficient. The result must have a specific visual idea, intentional pacing, designed typography, purposeful sound, and a finish comparable to the user's references.

Do not build or render the complete edit immediately. First:

1. Inspect all supplied media and references. Translate the references into concrete decisions about pacing, framing, typography, color, transitions, overlays, captions, and sound. Do not rely on adjectives such as “brutal,” “premium,” or “viral” without turning them into visible choices.
2. If the user supplied no references, do not require a long brief. Derive three clearly different creative directions from the material and explain each in a few lines. Ask for references only when they would materially resolve an ambiguity.
3. Produce three representative style frames: the opening, a high-impact middle moment, and the ending or call to action.
4. Produce an edited 8–12 second proof with final-quality picture, typography, motion, captions, and sound. This is a representative slice of the intended final quality, not a disposable rough draft.
5. Show the style frames and proof to the user. Do not continue to the full edit until the user approves a direction, unless the user explicitly asks for a no-stop autonomous delivery.

Before showing any proof, review it critically. Reject and redo it if any of the following is true:

- It resembles a generic CapCut, social-media, or corporate template.
- Its main devices are automatic punch-ins, boxed subtitles, stock cards, or decorative transitions.
- Effects were added without narrative purpose.
- The typography could be dropped into an unrelated video unchanged.
- The opening lacks a strong visual or editorial idea within the first two seconds.
- The pacing follows the source mechanically instead of shaping attention.
- The sound design does not reinforce specific visible actions or editorial beats.
- It is technically clean but visually ordinary.
- It falls materially below the quality, restraint, or specificity of the references.

Use these questions as the internal review checklist:

- Is there a recognizable creative idea rather than a collection of effects?
- Does every cut improve meaning, energy, tension, or clarity?
- Does the hierarchy make the intended focal point obvious in each shot?
- Were captions, graphics, and motion designed specifically for this subject?
- Does the edit preserve natural speech and continuity while removing dead time?
- Would a professional editor confidently include this proof in a portfolio?

If any answer is no, revise before presenting the proof.

## Efficiency and delivery discipline

Prove the creative direction before investing in infrastructure, automation, AI-generated assets, a full editable project, or a delivery render. Use the simplest toolchain that can achieve the approved look. Avoid installing or generating assets that the proof does not require.

Once the proof is approved, finish the edit consistently with it. Review the entire final video at normal playback speed with sound, not only isolated frames. Verify captions, cuts, audio continuity, loudness, color, safe areas, spelling, encoding, and the absence of unintended music. Deliver the final export and the editable source requested by the user.
