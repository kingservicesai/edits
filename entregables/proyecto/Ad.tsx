import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import '@fontsource/archivo-black/400.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/silkscreen/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import edl from './edl.json';

export const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const CLIP_SECONDS = 3.04; // Kling clips are 3.04 s at 24 fps

const SANS = '"Archivo Black", sans-serif';
const SERIF = '"Instrument Serif", serif';
const PIXEL = '"Silkscreen", monospace';
const UI = '"Inter", sans-serif';

type Shot = {
  s: number; e: number; src: string; motion: string; grade: string;
  zoom?: number; origin?: string; slow?: boolean;
};

// ---------- colour treatments (filter + soft-light wash) ----------
const GRADES: Record<string, {filter: string; wash?: string; op?: number}> = {
  none: {filter: 'contrast(1.06) saturate(1.04)'},
  bw: {filter: 'grayscale(1) contrast(1.35) brightness(0.95)'},
  teal: {filter: 'saturate(1.18) contrast(1.12)', wash: 'linear-gradient(180deg,#0b6b73 0%,#000 55%,#ff7a1a 100%)', op: 0.32},
  warm: {filter: 'saturate(1.06) contrast(1.1) sepia(0.12)', wash: 'linear-gradient(180deg,#3a1d00,#ff9a3c)', op: 0.18},
  cool: {filter: 'saturate(1.12) contrast(1.12)', wash: 'linear-gradient(180deg,#003cff,#00121f)', op: 0.26},
  green: {filter: 'saturate(0.85) contrast(1.18)', wash: 'linear-gradient(180deg,#0f5d2a,#06150b)', op: 0.4},
  red: {filter: 'saturate(1.2) contrast(1.22)', wash: 'linear-gradient(180deg,#8a0000,#120000)', op: 0.28},
  desat: {filter: 'saturate(0.2) contrast(1.18) brightness(0.88)'},
};

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([
      document.fonts.load(`80px ${SANS}`),
      document.fonts.load(`80px ${PIXEL}`),
      document.fonts.load(`italic 80px ${SERIF}`),
      document.fonts.load(`600 40px ${UI}`),
      document.fonts.load(`400 40px ${UI}`),
    ]).then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);
  return ready;
};

// ---------- one shot (image with camera move, or AI clip) ----------
const ShotView: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const dur = f(shot.e) - f(shot.s);
  const p = interpolate(frame, [0, dur], [0, 1], {easing: Easing.out(Easing.quad), extrapolateRight: 'clamp'});
  const range = shot.slow ? 0.05 : 0.1;
  const base = shot.zoom ?? 1;
  let scale = base * 1.04;
  let tx = 0;
  let ty = 0;
  switch (shot.motion) {
    case 'in': scale = base * (1.02 + range * p); break;
    case 'out': scale = base * (1.02 + range * (1 - p)); break;
    case 'left': scale = base * 1.1; tx = interpolate(p, [0, 1], [30, -30]); break;
    case 'right': scale = base * 1.1; tx = interpolate(p, [0, 1], [-30, 30]); break;
    case 'up': scale = base * 1.1; ty = interpolate(p, [0, 1], [40, -40]); break;
    case 'down': scale = base * 1.1; ty = interpolate(p, [0, 1], [-40, 40]); break;
  }
  // short punch-in on fast cuts gives the montage its snap
  if (dur < f(1.0)) scale *= interpolate(frame, [0, 4], [1.06, 1], {extrapolateRight: 'clamp'});

  const grade = GRADES[shot.grade] ?? GRADES.none;
  const style: React.CSSProperties = {
    width: '100%', height: '100%', objectFit: 'cover', filter: grade.filter,
    transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: shot.origin ?? '50% 50%',
  };
  const isVideo = shot.src.endsWith('.mp4');
  const rate = Math.max(0.5, Math.min(1, CLIP_SECONDS / (shot.e - shot.s)));
  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      {isVideo ? (
        <OffthreadVideo src={staticFile(`a/${shot.src}`)} muted playbackRate={rate} style={style} />
      ) : (
        <Img src={staticFile(`a/${shot.src}`)} style={style} />
      )}
      {grade.wash ? (
        <AbsoluteFill style={{background: grade.wash, mixBlendMode: 'soft-light', opacity: grade.op}} />
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- typography ----------
let measureCtx: CanvasRenderingContext2D | null = null;
// Real text width with the loaded font, so long words never leave the safe zone.
const fit = (lines: string[], size: number, font: string, italic = false, spacing = -2) => {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  measureCtx!.font = `${italic ? 'italic ' : ''}100px ${font}`;
  const w = Math.max(...lines.map((l) => measureCtx!.measureText(l).width + spacing * l.length));
  return Math.min(size, (900 / w) * 100);
};

const Giant: React.FC<{t: any}> = ({t}) => {
  const frame = useCurrentFrame();
  const size = fit(t.lines, t.size ?? 170, SANS);
  const pop = interpolate(frame, [0, 5], [1.22, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const op = interpolate(frame, [0, 3], [0, 1], {extrapolateRight: 'clamp'});
  const top = t.pos === 'upper' ? 330 : t.pos === 'lower' ? 1150 : 760;
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{
        position: 'absolute', top, width: 960, textAlign: 'center', fontFamily: SANS, fontSize: size,
        lineHeight: 0.98, color: '#fff', letterSpacing: -2, opacity: op, transform: `scale(${pop})`,
        textShadow: '0 6px 40px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.5)',
      }}>
        {t.lines.map((l: string, i: number) => <div key={i}>{l}</div>)}
      </div>
    </AbsoluteFill>
  );
};

const lineStyle = (l: any): React.CSSProperties => {
  const font = l.f === 'serif' ? SERIF : l.f === 'pixel' ? PIXEL : SANS;
  const base = l.f === 'serif' ? 210 : l.small ? 74 : 112;
  return {
    fontFamily: font, fontStyle: l.f === 'serif' ? 'italic' : 'normal', color: l.c,
    fontSize: fit([l.t], base, font, l.f === 'serif', l.f === 'serif' ? 0 : -2), lineHeight: l.f === 'serif' ? 0.9 : 1.02,
    letterSpacing: l.f === 'serif' ? 0 : -2,
  };
};

const Card: React.FC<{t: any}> = ({t}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: t.bg === 'white' ? '#f7f6f2' : '#050505', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 960, textAlign: 'center', marginTop: -120}}>
        {t.lines.map((l: any, i: number) => {
          const start = t.kind === 'kinetic' ? f(l.at - t.s) : i * 3;
          const op = interpolate(frame, [start, start + 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const y = interpolate(frame, [start, start + 5], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
          return <div key={i} style={{...lineStyle(l), opacity: op, transform: `translateY(${y}px)`}}>{l.t}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Subtitle: React.FC<{sub: any}> = ({sub}) => {
  const frame = useCurrentFrame();
  const now = sub.s + frame / FPS;
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{
        position: 'absolute', top: 1300, width: 900, textAlign: 'center', fontFamily: UI, fontWeight: 600,
        fontSize: 54, lineHeight: 1.2, textShadow: '0 2px 14px rgba(0,0,0,0.85)',
      }}>
        {sub.words.map((w: any, i: number) => (
          <span key={i} style={{color: now >= w.a - 0.03 ? '#ffffff' : 'rgba(255,255,255,0.45)'}}>{w.t}{' '}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- transitions ----------
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{backgroundColor: '#fff', opacity: interpolate(frame, [0, 5], [1, 0], {extrapolateRight: 'clamp'})}} />;
};

const Glitch: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = [0, 1, 2, 3, 4, 5].map((i) => {
    const r = Math.sin((frame + 1) * 91.7 + i * 13.3) * 0.5 + 0.5;
    const r2 = Math.sin((frame + 3) * 47.1 + i * 7.9) * 0.5 + 0.5;
    return {top: Math.floor(r * 1850), h: 8 + Math.floor(r2 * 60), c: ['#ff2d55', '#00e5ff', '#ffffff', '#000'][i % 4]};
  });
  return (
    <AbsoluteFill style={{mixBlendMode: 'difference'}}>
      {bars.map((b, i) => (
        <div key={i} style={{position: 'absolute', left: 0, right: 0, top: b.top, height: b.h, backgroundColor: b.c, transform: `translateX(${(i % 2 ? -1 : 1) * 40}px)`}} />
      ))}
    </AbsoluteFill>
  );
};

// ---------- final screen (placeholders kept as the brief asks) ----------
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = (start: number) => ({
    opacity: interpolate(frame, [start, start + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    transform: `translateY(${interpolate(frame, [start, start + 12], [18, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})}px)`,
  });
  return (
    <AbsoluteFill style={{backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 46, marginTop: -100}}>
        <div style={{...fade(4), width: 300, height: 170, border: '3px dashed rgba(255,255,255,0.55)', borderRadius: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.75)',
          fontFamily: UI, fontWeight: 600, fontSize: 30, textAlign: 'center', lineHeight: 1.2}}>
          [LOGOTIPO<br />DEL CURSO]
        </div>
        <div style={{...fade(12), fontFamily: SANS, color: '#fff', fontSize: 66, lineHeight: 1.04, textAlign: 'center', letterSpacing: -1}}>
          CURSO DE CREACIÓN DE VIDEOS CON INTELIGENCIA ARTIFICIAL
        </div>
        <div style={{...fade(22), fontFamily: SERIF, fontStyle: 'italic', color: '#e9e4da', fontSize: 52, lineHeight: 1.15, textAlign: 'center'}}>
          Aprendé a crear, producir y automatizar contenido audiovisual.
        </div>
        <div style={{...fade(34), backgroundColor: '#fff', color: '#050505', fontFamily: SANS, fontSize: 40, padding: '20px 40px', borderRadius: 999}}>
          [INSCRIPCIONES ABIERTAS]
        </div>
        <div style={{...fade(42), fontFamily: UI, fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontSize: 32}}>
          [ENLACE O LLAMADO A LA ACCIÓN]
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Plate: React.FC<{shot: Shot}> = ({shot}) => {
  if (shot.src === 'BLACK') return <AbsoluteFill style={{backgroundColor: '#050505'}} />;
  if (shot.src === 'WHITE') return <AbsoluteFill style={{backgroundColor: '#f7f6f2'}} />;
  if (shot.src === 'ENDCARD') return <EndCard />;
  return <ShotView shot={shot} />;
};

const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.13}}>
        <Img src={staticFile(`a/grain${frame % 6}.png`)} style={{width: '100%', height: '100%'}} />
      </AbsoluteFill>
    </>
  );
};

export const Ad: React.FC = () => {
  const ready = useFonts();
  if (!ready) return null; // text is measured with the real fonts, so wait for them
  const shots = edl.shots as Shot[];
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {shots.map((s, i) => (
        <Sequence key={`s${i}`} from={f(s.s)} durationInFrames={f(s.e) - f(s.s)}>
          <Plate shot={s} />
        </Sequence>
      ))}
      <Finish />
      {edl.texts.map((t: any, i) => (
        <Sequence key={`t${i}`} from={f(t.s)} durationInFrames={f(t.e) - f(t.s)}>
          {t.kind === 'giant' ? <Giant t={t} /> : <Card t={t} />}
        </Sequence>
      ))}
      {edl.subs.map((s: any, i) => (
        <Sequence key={`u${i}`} from={f(s.s)} durationInFrames={Math.max(1, f(s.e) - f(s.s))}>
          <Subtitle sub={s} />
        </Sequence>
      ))}
      {edl.glitches.map((g, i) => (
        <Sequence key={`g${i}`} from={f(g)} durationInFrames={3}><Glitch /></Sequence>
      ))}
      {edl.flashes.map((g, i) => (
        <Sequence key={`fl${i}`} from={f(g)} durationInFrames={6}><Flash /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
