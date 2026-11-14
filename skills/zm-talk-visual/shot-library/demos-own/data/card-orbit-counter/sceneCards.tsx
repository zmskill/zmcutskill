// 代码画的"照片缩略图"场景卡（镜头 A CardOrbitCounter 和镜头 B CardTunnelTagline 共用）
// 每张卡 = 320×180 的 SVG：渐变天空 / 墙面 + 简单几何插画 + 一行小字（像相册里的照片缩略图）。
// thermal（0–1）：热成像假彩色（高调：暗→淡紫、中→橙、亮→奶黄），用叠一层滤镜副本交叉淡化，0 时不画副本。
// 确定性：只用 hash，不用 Math.random。
import React from 'react';

const hash = (i: number, n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
const SANS = '"PingFang SC", "Noto Sans CJK SC", -apple-system, "Helvetica Neue", Arial, sans-serif';

export const SCENE_KINDS = [
  'city', 'coffee', 'sea', 'cat', 'desk', 'run', 'cake', 'snow', 'subway', 'flower',
  'sunset', 'ramen', 'rain', 'concert', 'bike', 'plane',
] as const;
export type SceneKind = (typeof SCENE_KINDS)[number];

const Lbl: React.FC<{t: string; x?: number; y?: number; c?: string; s?: number; a?: 'start' | 'end'}> = ({t, x = 14, y = 166, c = '#fff', s = 13, a = 'start'}) => (
  <text x={x} y={y} fill={c} fontSize={s} fontFamily={SANS} fontWeight={600} textAnchor={a} style={{letterSpacing: '0.02em'}}>{t}</text>
);

// 各场景的画（id 前缀 p 保证同屏多张卡的渐变 id 不撞）
const draw = (kind: SceneKind, p: string, v: number): React.ReactNode => {
  const g = (id: string) => `url(#${p}${id})`;
  switch (kind) {
    case 'city': return (<>
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141a3c" /><stop offset="0.7" stopColor="#3b2a68" /><stop offset="1" stopColor="#c0507a" /></linearGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      <circle cx="252" cy="38" r="13" fill="#fbe9c0" opacity="0.92" />
      {Array.from({length: 11}, (_, i) => { const w = 22 + hash(i, v) * 18; const h = 50 + hash(i, v + 3) * 85; const x = i * 30 - 6; return (
        <g key={i}><rect x={x} y={180 - h} width={w} height={h} fill={i % 2 ? '#0c0f24' : '#161a38'} />
          {Array.from({length: Math.floor(h / 14)}, (_, k) => [0, 1, 2].map((c) => hash(i * 31 + k * 7 + c, v) > 0.55 ? <rect key={`${k}${c}`} x={x + 4 + c * 7} y={180 - h + 6 + k * 14} width="4" height="6" fill="#ffd47a" opacity={0.6 + hash(i + k, c) * 0.4} /> : null))}</g>); })}
      <rect y="168" width="320" height="12" fill="#ff7aa8" opacity="0.25" />
      <Lbl t="23:14 · 江边" y={24} s={12} c="#ffffffcc" />
    </>);
    case 'coffee': return (<>
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4dcbc" /><stop offset="1" stopColor="#b9805a" /></linearGradient>
        <radialGradient id={`${p}c`} cx="0.5" cy="0.45" r="0.55"><stop offset="0" stopColor="#f6e2c4" /><stop offset="0.55" stopColor="#c58a5a" /><stop offset="1" stopColor="#6a3c22" /></radialGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      <polygon points="0,0 120,0 40,180 0,180" fill="#fff6e6" opacity="0.35" />
      <rect y="118" width="320" height="62" fill="#7a4a2c" />
      <ellipse cx="170" cy="128" rx="78" ry="18" fill="#efe6da" />
      <path d="M118 72 L222 72 L212 126 Q170 138 128 126 Z" fill="#fbf7f1" />
      <ellipse cx="170" cy="72" rx="52" ry="12" fill={g('c')} />
      <path d="M160 70 q10 -9 20 0 q-10 8 -20 0" fill="#fbeedd" opacity="0.9" />
      <path d="M222 84 q22 2 18 18 q-4 12 -22 10" fill="none" stroke="#fbf7f1" strokeWidth="7" />
      <path d="M150 52 q-8 -12 2 -24 M172 50 q-8 -12 2 -26" stroke="#fff" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />
      <Lbl t="周日 09:30" c="#fff" />
    </>);
    case 'sea': return (<>
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fc3ee" /><stop offset="0.55" stopColor="#ffd6b8" /></linearGradient>
        <linearGradient id={`${p}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2aa7b8" /><stop offset="1" stopColor="#7fe0d4" /></linearGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      <circle cx="96" cy="78" r="20" fill="#fff4d6" />
      <rect y="92" width="320" height="58" fill={g('w')} />
      {[104, 116, 130].map((y, i) => <path key={i} d={`M0 ${y} q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} stroke="#fff" strokeWidth="2" fill="none" opacity={0.5 - i * 0.1} />)}
      <path d="M0 146 Q160 132 320 150 L320 180 L0 180 Z" fill="#f6dfb8" />
      <Lbl t="海边 · 7月" c="#7a5a3a" />
    </>);
    case 'cat': return (<>
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd9cf" /><stop offset="1" stopColor="#f3a98f" /></linearGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      <rect x="196" y="18" width="104" height="96" rx="6" fill="#bfe3f2" /><path d="M248 18 V114 M196 66 H300" stroke="#fff" strokeWidth="6" />
      <rect y="132" width="320" height="48" fill="#e48a6c" />
      <ellipse cx="118" cy="120" rx="46" ry="30" fill="#f08a3c" />
      <circle cx="96" cy="84" r="26" fill="#f39a4a" />
      <polygon points="74,70 78,46 92,62" fill="#f39a4a" /><polygon points="104,60 118,46 118,72" fill="#f39a4a" />
      <circle cx="88" cy="84" r="3.5" fill="#2a1d14" /><circle cx="105" cy="84" r="3.5" fill="#2a1d14" />
      <path d="M160 128 q30 4 26 -30" stroke="#f08a3c" strokeWidth="10" fill="none" strokeLinecap="round" />
      <Lbl t="橘子 · 午睡前" c="#fff" />
    </>);
    case 'desk': return (<>
      <rect width="320" height="180" fill="#c9a27c" />
      {[0, 1, 2, 3].map((i) => <rect key={i} y={i * 46} width="320" height="2" fill="#b38c66" />)}
      <rect x="70" y="34" width="150" height="100" rx="6" fill="#2b2f3a" /><rect x="78" y="42" width="134" height="80" rx="2" fill="#8fb3ff" />
      <rect x="86" y="52" width="70" height="8" rx="3" fill="#fff" opacity="0.85" /><rect x="86" y="66" width="110" height="6" rx="3" fill="#fff" opacity="0.5" /><rect x="86" y="78" width="96" height="6" rx="3" fill="#fff" opacity="0.5" />
      <rect x="236" y="46" width="56" height="74" rx="3" fill="#fdfaf2" transform="rotate(8 264 83)" />
      <circle cx="40" cy="130" r="20" fill="#e8f0ff" /><circle cx="40" cy="130" r="14" fill="#5b3b25" />
      <rect x="244" y="132" width="44" height="6" rx="3" fill="#e24b4b" transform="rotate(-20 266 135)" />
      <Lbl t="周报 · 18:40" c="#fff" />
    </>);
    case 'run': return (<>
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb36b" /><stop offset="1" stopColor="#ff7a6b" /></linearGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      <circle cx="250" cy="52" r="24" fill="#fff1c9" opacity="0.9" />
      <path d="M0 90 Q160 60 320 94 L320 180 L0 180 Z" fill="#d9573f" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M0 ${104 + i * 20} Q160 ${76 + i * 24} 320 ${108 + i * 20}`} stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" />)}
      <g transform="translate(120 70)"><circle cx="0" cy="-12" r="7" fill="#2a2240" /><path d="M0 -4 L-4 18 M-4 18 L-14 34 M-4 18 L8 32 M-2 2 L-14 10 M-2 2 L12 -2" stroke="#2a2240" strokeWidth="5" strokeLinecap="round" fill="none" /></g>
      <Lbl t="5.2 km  晨跑" c="#fff" />
    </>);
    case 'cake': return (<>
      <defs><radialGradient id={`${p}s`} cx="0.5" cy="0.4" r="0.8"><stop offset="0" stopColor="#5a2a3a" /><stop offset="1" stopColor="#1e0f18" /></radialGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      {Array.from({length: 9}, (_, i) => <circle key={i} cx={hash(i, v) * 320} cy={hash(i, v + 1) * 90} r={6 + hash(i, v + 2) * 12} fill="#ffcf7a" opacity={0.18 + hash(i, 5) * 0.2} />)}
      <rect x="96" y="104" width="128" height="50" rx="8" fill="#f7b3c6" /><rect x="110" y="78" width="100" height="32" rx="6" fill="#fde2ea" />
      <path d="M96 116 q16 10 32 0 t32 0 t32 0 t32 0" stroke="#fff" strokeWidth="5" fill="none" />
      {[0, 1, 2].map((i) => <g key={i}><rect x={136 + i * 22} y="56" width="5" height="22" fill="#9fd4ff" /><ellipse cx={138.5 + i * 22} cy="50" rx="4" ry="7" fill="#ffd45a" /><circle cx={138.5 + i * 22} cy="50" r="13" fill="#ffd45a" opacity="0.25" /></g>)}
      <Lbl t="生日快乐" c="#ffe4ec" />
    </>);
    case 'snow': return (<>
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f7fd6" /><stop offset="1" stopColor="#b8dcff" /></linearGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      <polygon points="0,180 90,58 170,180" fill="#8aa6c8" /><polygon points="90,58 70,86 84,84 96,96 108,82 118,90" fill="#fff" />
      <polygon points="100,180 210,34 320,180" fill="#a9bfd9" /><polygon points="210,34 184,70 200,66 214,80 228,64 240,72" fill="#fff" />
      <polygon points="210,34 320,180 260,180" fill="#7b95b8" opacity="0.6" />
      <rect y="150" width="320" height="30" fill="#eef5ff" />
      <Lbl t="雪山 · 4,200m" c="#2c4a72" />
    </>);
    case 'subway': return (<>
      <rect width="320" height="180" fill="#2b3140" />
      <rect y="20" width="320" height="8" fill="#f7f3e8" opacity="0.8" />
      <rect x="0" y="50" width="320" height="86" fill="#c9d2de" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 78} y="62" width="56" height="38" rx="5" fill="#1d2433" />)}
      <rect y="108" width="320" height="10" fill="#3aa86b" />
      <rect y="136" width="320" height="44" fill="#4a5162" /><rect y="140" width="320" height="6" fill="#f2c94c" />
      <rect x="230" y="4" width="70" height="22" rx="4" fill="#3aa86b" /><Lbl t="2号线" x={265} y={20} s={12} a="end" />
      <Lbl t="早高峰 08:12" c="#fff" y={170} />
    </>);
    case 'flower': return (<>
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0f4" /><stop offset="1" stopColor="#ffd2e0" /></linearGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      {[[80, 80, '#ff7aa0'], [160, 60, '#ffb347'], [240, 86, '#c98bff'], [120, 128, '#ff9aa8'], [210, 136, '#ffd45a']].map(([x, y, c], i) => (
        <g key={i}><path d={`M${x} ${Number(y) + 10} L${Number(x) + (i % 2 ? 6 : -6)} 180`} stroke="#6fbf73" strokeWidth="4" />
          {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={Number(x) + Math.cos(k * 1.256) * 13} cy={Number(y) + Math.sin(k * 1.256) * 13} r="11" fill={String(c)} />)}
          <circle cx={x} cy={y} r="7" fill="#fff3b0" /></g>))}
      <Lbl t="楼下的花开了" c="#b2486a" />
    </>);
    case 'sunset': return (<>
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a4fd0" /><stop offset="0.5" stopColor="#ff8a6b" /><stop offset="1" stopColor="#ffd28a" /></linearGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      <circle cx="160" cy="118" r="34" fill="#fff0c2" opacity="0.9" />
      <path d="M0 180 V120 h30 v-30 h20 v20 h26 v-50 h18 v40 h30 v10 h24 v-36 h20 v46 h28 v-20 h22 v30 h30 v-46 h16 v56 H320 V180 Z" fill="#2a1d3a" />
      <Lbl t="下班路上" c="#fff" />
    </>);
    case 'ramen': return (<>
      <rect width="320" height="180" fill="#3a2a22" />
      <circle cx="160" cy="92" r="78" fill="#f4ede2" /><circle cx="160" cy="92" r="66" fill="#e0a45a" />
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${112 + i * 8} ${70 + (i % 3) * 6} q12 10 24 0 t24 0 t24 0`} stroke="#fbe7a8" strokeWidth="4" fill="none" />)}
      <ellipse cx="136" cy="112" rx="16" ry="12" fill="#fff" /><circle cx="136" cy="112" r="7" fill="#ffb02e" />
      <ellipse cx="186" cy="114" rx="16" ry="12" fill="#fff" /><circle cx="186" cy="114" r="7" fill="#ffb02e" />
      <rect x="188" y="58" width="34" height="22" rx="4" fill="#c4583a" /><circle cx="128" cy="64" r="5" fill="#5fae4f" /><circle cx="140" cy="60" r="4" fill="#5fae4f" />
      <Lbl t="夜宵" c="#fff" />
    </>);
    case 'rain': return (<>
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a5f7e" /><stop offset="1" stopColor="#273449" /></linearGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      {Array.from({length: 8}, (_, i) => <circle key={i} cx={hash(i, v + 9) * 320} cy={40 + hash(i, v + 4) * 120} r={10 + hash(i, 2) * 18} fill={['#ff6a6a', '#ffd36a', '#6ac8ff'][i % 3]} opacity="0.35" />)}
      {Array.from({length: 22}, (_, i) => <ellipse key={i} cx={hash(i, v + 11) * 320} cy={hash(i, v + 12) * 180} rx="2.6" ry="3.6" fill="#dbe8ff" opacity="0.6" />)}
      <Lbl t="下雨天 · 窗边" c="#e6efff" />
    </>);
    case 'concert': return (<>
      <rect width="320" height="180" fill="#120b24" />
      {[[60, '#7b5cff'], [160, '#ff4fb0'], [260, '#3fd0ff']].map(([x, c], i) => <polygon key={i} points={`${x},0 ${Number(x) - 60},150 ${Number(x) + 60},150`} fill={String(c)} opacity="0.28" />)}
      <ellipse cx="160" cy="150" rx="150" ry="10" fill="#ffd45a" opacity="0.35" />
      <path d={`M0 180 ${Array.from({length: 17}, (_, i) => `Q${i * 20 + 10} ${132 + hash(i, v) * 14} ${i * 20 + 20} 150`).join(' ')} L320 180 Z`} fill="#05030c" />
      <Lbl t="Live · 第一排" c="#ffffffdd" y={24} s={12} />
    </>);
    case 'bike': return (<>
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8ecd8" /><stop offset="1" stopColor="#8fd0b8" /></linearGradient></defs>
      <rect width="320" height="180" fill={g('s')} />
      <path d="M0 120 Q80 96 160 112 T320 104 L320 180 L0 180 Z" fill="#5fae86" /><rect y="140" width="320" height="40" fill="#6b6f7a" /><rect y="158" width="320" height="3" fill="#fff" opacity="0.6" />
      <g transform="translate(160 112)" stroke="#20304a" strokeWidth="4" fill="none"><circle cx="-36" cy="16" r="20" /><circle cx="36" cy="16" r="20" /><path d="M-36 16 L-8 -14 L24 -14 L36 16 M-8 -14 L0 16 L24 -14 M-12 -20 h10 M24 -14 l-4 -12 h10" strokeLinejoin="round" /></g>
      <Lbl t="骑车去公司" c="#20304a" />
    </>);
    case 'plane': default: return (<>
      <rect width="320" height="180" fill="#dfe3ea" />
      <rect x="92" y="14" width="136" height="152" rx="60" fill="#b7c0cf" />
      <defs><linearGradient id={`${p}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5aa8ff" /><stop offset="1" stopColor="#d6ecff" /></linearGradient></defs>
      <rect x="104" y="26" width="112" height="128" rx="50" fill={g('s')} />
      <ellipse cx="140" cy="118" rx="40" ry="14" fill="#fff" /><ellipse cx="188" cy="128" rx="34" ry="12" fill="#fff" /><ellipse cx="160" cy="108" rx="22" ry="10" fill="#fff" />
      <path d="M150 64 L200 58 L196 64 Z" fill="#8a96a8" />
      <Lbl t="靠窗 · 32A" c="#5a6578" />
    </>);
  }
};

// 热成像滤镜（gradient map：亮度 → 淡紫 / 粉 / 橙 / 奶黄，高调）
const ThermalFilter: React.FC<{id: string}> = ({id}) => (
  <filter id={id} colorInterpolationFilters="sRGB">
    <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
    <feComponentTransfer>
      <feFuncR type="table" tableValues="0.84 0.93 0.97 1.0 1.0" />
      <feFuncG type="table" tableValues="0.74 0.62 0.50 0.72 0.93" />
      <feFuncB type="table" tableValues="0.90 0.78 0.40 0.45 0.72" />
    </feComponentTransfer>
  </filter>
);

export const SceneCard: React.FC<{kind: SceneKind; uid: string; w: number; radius?: number; thermal?: number; variant?: number; style?: React.CSSProperties}> = ({kind, uid, w, radius, thermal = 0, variant = 0, style}) => {
  const h = (w * 9) / 16;
  const p = `sc${uid}`;
  return (
    <div style={{width: w, height: h, borderRadius: radius ?? w * 0.065, overflow: 'hidden', background: '#ddd', ...style}}>
      <svg width={w} height={h} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{display: 'block'}}>
        {thermal > 0.001 && <defs><ThermalFilter id={`${p}th`} /></defs>}
        <g>{draw(kind, p, variant)}</g>
        {thermal > 0.001 && <g filter={`url(#${p}th)`} opacity={Math.min(1, thermal)}>{draw(kind, `${p}t`, variant)}</g>}
      </svg>
    </div>
  );
};

// 一个静态"照片墙"预览，方便单独检查卡片画得怎么样（不进成片）
export const SceneCardSheet: React.FC = () => (
  <div style={{display: 'flex', flexWrap: 'wrap', gap: 20, padding: 40, background: '#fdfdfd', width: 1920, height: 1080}}>
    {SCENE_KINDS.map((k, i) => <SceneCard key={k} kind={k} uid={`sheet${i}`} w={420} variant={i} thermal={i % 4 === 3 ? 1 : 0} />)}
  </div>
);
