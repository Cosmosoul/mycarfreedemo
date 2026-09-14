/* ============================================================
   content/music.js —— BGM 内容目录
   ┌─────────────────────────────────────────────────────────┐
   │ 加一首新 BGM：                                          │
   │  ① 在 BGM_TRACKS 里加一首：{ bpm, melody[64], bass[16], │
   │     drums }                                             │
   │  ② 在 BGM_META 里加 { name, genre, scene }              │
   │  ③ 若要出现在鉴赏播放器里，把 key 加进                  │
   │     BGM_GALLERY_ORDER                                    │
   │  ④ 若要作为游戏内随机 BGM，把 key 加进                  │
   │     GAME_TRACK_ROTATION                                  │
   └─────────────────────────────────────────────────────────┘
   ============================================================ */

/* ============================================================
   1. 曲目数据
   melody：64 个十六分音符为一循环，null 表示休止
   bass：  16 个低音音符（每 4 步换一次）
   drums： 鼓点风格字符串
   ============================================================ */
export const BGM_TRACKS = {
  menu: {
    bpm: 100,
    melody: [
      523,null,659,null, 523,null,587,null, 523,null,659,null, 784,null,659,null,
      440,null,523,null, 440,null,494,null, 440,null,523,null, 659,null,523,null,
      349,null,440,null, 349,null,392,null, 349,null,440,null, 523,null,440,null,
      392,null,494,null, 392,null,440,null, 494,null,587,null, 659,null,587,null,
    ],
    bass: [130.81,130.81,130.81,130.81, 110,110,110,110, 87.31,87.31,87.31,87.31, 98,98,98,98],
    drums: 'soft',
  },
  levelSelect: {
    bpm: 112,
    melody: [
      440,null,523,null, 659,null,523,null, 440,null,587,null, 523,null,392,null,
      349,null,440,null, 523,null,440,null, 349,null,494,null, 440,null,329,null,
      523,null,659,null, 784,null,659,null, 523,null,698,null, 659,null,523,null,
      392,null,494,null, 587,null,494,null, 440,null,523,null, 587,null,659,null,
    ],
    bass: [110,110,110,110, 87.31,87.31,87.31,87.31, 130.81,130.81,130.81,130.81, 98,98,98,98],
    drums: 'normal',
  },
  game: {
    bpm: 140,
    melody: [
      440,null,523,null, 440,null,392,null, 523,null,440,null, 392,null,349,null,
      349,null,440,null, 349,null,329,null, 440,null,349,null, 329,null,294,null,
      523,null,659,null, 523,null,440,null, 659,null,523,null, 440,null,392,null,
      392,null,493,null, 587,null,493,null, 440,null,392,null, 349,null,392,null,
    ],
    bass: [110,110,165,165, 87.31,87.31,130.81,130.81, 130.81,130.81,196,196, 98,98,146.83,146.83],
    drums: 'intense',
  },

  /* 🎬 剧情专属 BGM —— 神秘、低沉、带一丝希望 */
  storyTheme: {
    bpm: 70,
    melody: [
      330,null,null,null, 392,null,null,null, 349,null,null,null, 294,null,null,null,
      262,null,null,null, 294,null,null,null, 330,null,349,392, 440,null,null,null,
      523,null,null,null, 466,null,null,null, 415,null,null,null, 349,null,null,null,
      330,null,294,null, 262,null,294,330, 349,null,392,349, 330,null,null,null,
    ],
    bass: [82.41,82.41,82.41,82.41, 73.42,73.42,73.42,73.42, 87.31,87.31,87.31,87.31, 98,98,98,98],
    drums: 'soft',
    sparse: true,   /* 剧情曲：特殊稀疏鼓点 */
  },
};

/* ============================================================
   2. BGM 元数据 —— 鉴赏播放器用
   ============================================================ */
export const BGM_META = {
  menu:        { name: 'Neon Idle',     genre: 'SYNTHPOP',   scene: 'MENU' },
  levelSelect: { name: 'Route Select',  genre: 'ELECTRO',    scene: 'SELECT' },
  game:        { name: 'Full Throttle', genre: 'DRIVE',      scene: 'BATTLE' },
  storyTheme:  { name: 'Last Light',    genre: 'CINEMATIC',  scene: 'STORY' },
};

/* 鉴赏页签展示顺序（与游戏内实际使用顺序一致） */
export const BGM_GALLERY_ORDER = [
  'menu', 'levelSelect', 'game', 'storyTheme',
];

/* 游戏内随机 BGM 池（不含菜单/选关/剧情） */
export const GAME_TRACK_ROTATION = [
  'game',
];

/* ============================================================
   3. 查询辅助
   ============================================================ */
export function bgmTitle(key) {
  const m = BGM_META[key];
  return m ? m.name : key;
}

/* 单次循环时长（64 个十六分音符） */
export function bgmLoopSeconds(key) {
  const t = BGM_TRACKS[key];
  if (!t) return 10;
  return (60 / t.bpm / 4) * 64;
}
