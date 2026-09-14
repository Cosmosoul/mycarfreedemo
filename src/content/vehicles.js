/* ============================================================
   content/vehicles.js —— 车辆内容目录
   ┌─────────────────────────────────────────────────────────┐
   │ 加一辆新车，只需三步：                                  │
   │  ① 在这里 buildXxxModel() 里加建模函数                  │
   │  ② 在 VEHICLES 里加一条 register('xxx', {...数值...})   │
   │  ③ 在 VEHICLE_I18N 里加中英文名称和描述                 │
   │  ④ 在 config.js 的 CAR_UNLOCK_RULES 里加解锁条件        │
   └─────────────────────────────────────────────────────────┘
   ============================================================ */

import * as THREE from 'three';
import { getLang } from '@/i18n.js';
import { selectedCarId } from '@/core.js';

/* ============================================================
   1. 共享材质工厂
   ============================================================ */
export const MAT = {
  body:   () => new THREE.MeshStandardMaterial({ color: 0x2A6FB8, roughness: 0.28, metalness: 0.85, emissive: 0x0A2040, emissiveIntensity: 0.35 }),
  dark:   () => new THREE.MeshStandardMaterial({ color: 0x0A0A0C, roughness: 0.75, metalness: 0.3 }),
  glass:  () => new THREE.MeshStandardMaterial({ color: 0x102030, roughness: 0.08, metalness: 0.9, emissive: 0x1A3060, emissiveIntensity: 0.35, transparent: true, opacity: 0.88 }),
  chrome: () => new THREE.MeshStandardMaterial({ color: 0xC8D0D8, roughness: 0.15, metalness: 1.0 }),
  tire:   () => new THREE.MeshStandardMaterial({ color: 0x0A0A0A, roughness: 0.9, metalness: 0.1 }),
  head:   () => new THREE.MeshBasicMaterial({ color: 0xE8F4FF }),
  tail:   () => new THREE.MeshBasicMaterial({ color: 0xFF1A3A }),
};

/* ============================================================
   2. 车辆数值定义
   ============================================================ */
export const VEHICLES = {
  coupe: {
    id: 'coupe', name: '轿跑车', icon: '🚗',
    desc: '一台被诅咒的 2003 年二手轿跑。均衡、可靠、没有短板——你永远可以相信它。',
    maxSpeed: 70, accel: 20, brake: 80, friction: 1.2,
    maxSteer: 0.85, steerFalloff: 0.15, steerResponse: 10, yawRateBase: 8.0, lowSpeedSteerPoint: 6,
    hitRadius: 3.6, ramBase: 22, ramPerSpeed: 0.32,
    exhausts: [[-0.55, 0.42, -2.20], [0.55, 0.42, -2.20]],
    exhaustDir: [0, 0, -1],
    flame: [[0.70, 0.90, 1.00], [1.00, 0.82, 0.34], [1.00, 0.42, 0.10]],
    preview: { dist: 11, height: 1.4 },
  },
  motorcycle: {
    id: 'motorcycle', name: '摩托车', icon: '🏍️',
    desc: '轻量、敏捷、转得像疯了一样。极速极高但撞击力度偏弱——用灵活换生存。',
    maxSpeed: 88, accel: 31, brake: 70, friction: 0.9,
    maxSteer: 1.05, steerFalloff: 0.09, steerResponse: 14, yawRateBase: 10.6, lowSpeedSteerPoint: 4,
    hitRadius: 2.4, ramBase: 16, ramPerSpeed: 0.34,
    exhausts: [[0, 0.55, -1.15]],
    exhaustDir: [0, 0, -1],
    flame: [[0.92, 1.00, 1.00], [0.55, 0.90, 1.00], [0.20, 0.35, 1.00]],
    preview: { dist: 9.5, height: 1.0 },
  },
  siege: {
    id: 'siege', name: '攻城车', icon: '🏰',
    desc: '带推铲与冲锤的重型工程车。极速最低，但冲撞力全车库第一，一次正面撞击就能清空一条街。',
    maxSpeed: 40, accel: 11, brake: 110, friction: 1.9,
    maxSteer: 0.45, steerFalloff: 0.30, steerResponse: 5, yawRateBase: 3.8, lowSpeedSteerPoint: 11,
    hitRadius: 6.4, ramBase: 52, ramPerSpeed: 0.46,
    exhausts: [[-1.20, 4.00, -3.00], [1.20, 4.00, -3.00]],
    exhaustDir: [0, 1, 0],
    flame: [[1.00, 0.86, 0.48], [1.00, 0.44, 0.08], [0.30, 0.06, 0.02]],
    preview: { dist: 21, height: 2.8 },
  },
};

/* ============================================================
   3. 车辆名称 / 描述本地化
   ============================================================ */
export const VEHICLE_I18N = {
  coupe: {
    zh: { name: '轿跑车', desc: '一台被诅咒的 2003 年二手轿跑。均衡、可靠、没有短板——你永远可以相信它。' },
    en: { name: 'Coupe', desc: 'A cursed 2003 second-hand coupe. Balanced, reliable, no weak spots — you can always count on it.' },
  },
  motorcycle: {
    zh: { name: '摩托车', desc: '轻量、敏捷、转得像疯了一样。极速极高但撞击力度偏弱——用灵活换生存。' },
    en: { name: 'Motorcycle', desc: 'Light, agile, turns like a maniac. Huge top speed but weaker ramming — trade toughness for mobility.' },
  },
  siege: {
    zh: { name: '攻城车', desc: '带推铲与冲锤的重型工程车。极速最低，但冲撞力全车库第一，一次正面撞击就能清空一条街。' },
    en: { name: 'Siege Engine', desc: 'A heavy engineering vehicle with a dozer blade and ram hammer. Lowest top speed, but the highest ramming power in the garage — one hit can clear a street.' },
  },
};

export function vehName(id) {
  const v = VEHICLE_I18N[id];
  const l = getLang();
  if (v) return (v[l] && v[l].name) || (v.en && v.en.name) || id;
  const def = VEHICLES[id];
  return (def && def.name) || VEHICLES.coupe.name;
}
export function vehDesc(id) {
  const v = VEHICLE_I18N[id];
  const l = getLang();
  if (v) return (v[l] && v[l].desc) || (v.en && v.en.desc) || '';
  const def = VEHICLES[id];
  return (def && def.desc) || VEHICLES.coupe.desc;
}

/* 当前选定车辆（便捷访问） */
export function V() {
  return VEHICLES[selectedCarId] || VEHICLES.coupe;
}

/* ============================================================
   4. 车辆建模
   ============================================================ */

/* ---------- 🚗 轿跑车 ---------- */
function buildCoupeModel() {
  const g = new THREE.Group();
  const bodyMat = MAT.body();
  const accentMat = new THREE.MeshStandardMaterial({ color: 0x1A4A80, roughness: 0.3, metalness: 0.9, emissive: 0x0A1830, emissiveIntensity: 0.4 });
  const darkMat = MAT.dark();
  const glassMat = MAT.glass();
  const chromeMat = MAT.chrome();
  const tailMat = MAT.tail();
  const headMat = MAT.head();
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.35, 3.9), bodyMat); chassis.position.set(0, 0.55, 0); g.add(chassis);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.18, 1.5), bodyMat); hood.position.set(0, 0.80, 1.15); g.add(hood);
  const noseGeo = new THREE.BufferGeometry();
  const nv = new Float32Array([-0.86,0,0, 0.86,0,0, -0.86,0.36,0, 0.86,0.36,0, -0.55,0.05,0.7, 0.55,0.05,0.7, -0.55,0.30,0.7, 0.55,0.30,0.7]);
  noseGeo.setAttribute('position', new THREE.BufferAttribute(nv, 3));
  noseGeo.setIndex([0,1,2,1,3,2,4,6,5,5,6,7,0,2,4,4,2,6,1,5,3,3,5,7,2,3,6,3,7,6,0,4,1,1,4,5]);
  noseGeo.computeVertexNormals();
  const nose = new THREE.Mesh(noseGeo, bodyMat); nose.position.set(0, 0.62, 1.9); g.add(nose);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.45, 1.6), accentMat); cabin.position.set(0, 1.05, -0.25); g.add(cabin);
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.55, 0.06), glassMat); windshield.position.set(0, 1.05, 0.55); windshield.rotation.x = 0.55; g.add(windshield);
  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.42, 0.06), glassMat); rearGlass.position.set(0, 1.05, -1.05); rearGlass.rotation.x = -0.6; g.add(rearGlass);
  for (const sx of [-1, 1]) { const sg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 1.15), glassMat); sg.position.set(sx * 0.78, 1.08, -0.25); g.add(sg); }
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.22, 0.9), bodyMat); trunk.position.set(0, 0.88, -1.75); g.add(trunk);
  for (const sx of [-1, 1]) { const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 2.4), darkMat); skirt.position.set(sx * 0.97, 0.38, 0); g.add(skirt); }
  const tireGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.34, 18);
  const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.36, 8);
  const tireMat = MAT.tire();
  for (const [wx, wy, wz] of [[-1, 0.46, 1.35], [1, 0.46, 1.35], [-1, 0.46, -1.35], [1, 0.46, -1.35]]) {
    const tire = new THREE.Mesh(tireGeo, tireMat); tire.rotation.z = Math.PI / 2; tire.position.set(wx, wy, wz); g.add(tire);
    const rim = new THREE.Mesh(rimGeo, chromeMat); rim.rotation.z = Math.PI / 2; rim.position.set(wx, wy, wz); g.add(rim);
  }
  const wing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.4), accentMat); wing.position.set(0, 1.35, -1.95); wing.rotation.x = -0.15; g.add(wing);
  for (const sx of [-0.6, 0.6]) { const stand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.15), darkMat); stand.position.set(sx, 1.22, -1.95); g.add(stand); }
  const splitter = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.05, 0.45), darkMat); splitter.position.set(0, 0.36, 2.15); g.add(splitter);
  for (const sx of [-0.62, 0.62]) { const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.08), headMat); head.position.set(sx, 0.82, 2.28); g.add(head); }
  for (const sx of [-0.68, 0.68]) { const tail = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, 0.08), tailMat); tail.position.set(sx, 0.76, -2.18); g.add(tail); }
  for (const sx of [-0.55, 0.55]) { const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.22, 10), chromeMat); exhaust.rotation.x = Math.PI / 2; exhaust.position.set(sx, 0.42, -2.15); g.add(exhaust); }
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x40D8FF, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 4.8), glowMat); glow.rotation.x = -Math.PI / 2; glow.position.y = 0.05; g.add(glow);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ---------- 🏍️ 摩托车 ---------- */
function buildMotorcycleModel() {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xC8202A, roughness: 0.25, metalness: 0.75, emissive: 0x300408, emissiveIntensity: 0.45 });
  const darkMat = MAT.dark();
  const chromeMat = MAT.chrome();
  const tireMat = MAT.tire();
  const headMat = MAT.head();
  const tailMat = MAT.tail();

  const tireGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.22, 20);
  const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.24, 6);

  const fw = new THREE.Mesh(tireGeo, tireMat); fw.rotation.z = Math.PI / 2; fw.position.set(0, 0.44, 1.15); g.add(fw);
  const fr = new THREE.Mesh(rimGeo, chromeMat); fr.rotation.z = Math.PI / 2; fr.position.copy(fw.position); g.add(fr);
  const bw = new THREE.Mesh(tireGeo, tireMat); bw.rotation.z = Math.PI / 2; bw.position.set(0, 0.44, -1.15); g.add(bw);
  const br = new THREE.Mesh(rimGeo, chromeMat); br.rotation.z = Math.PI / 2; br.position.copy(bw.position); g.add(br);

  for (const sx of [-0.17, 0.17]) {
    const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.15, 8), chromeMat);
    fork.position.set(sx, 0.92, 1.10); fork.rotation.x = -0.20; g.add(fork);
  }
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.98, 8), darkMat);
  bar.rotation.z = Math.PI / 2; bar.position.set(0, 1.34, 0.94); g.add(bar);
  for (const sx of [-0.48, 0.48]) {
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.2, 8), darkMat);
    grip.rotation.z = Math.PI / 2; grip.position.set(sx, 1.34, 0.94); g.add(grip);
  }
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.40, 1.05), bodyMat);
  tank.position.set(0, 1.08, 0.14); g.add(tank);
  const tankTop = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.8), bodyMat);
  tankTop.position.set(0, 1.30, 0.14); g.add(tankTop);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.88), darkMat);
  seat.position.set(0, 1.02, -0.72); g.add(seat);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.5), bodyMat);
  tail.position.set(0, 1.10, -1.28); tail.rotation.x = 0.18; g.add(tail);
  const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.06), tailMat);
  tailLight.position.set(0, 1.06, -1.52); g.add(tailLight);
  for (const sx of [-0.15, 0.15]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.09, 1.05), darkMat);
    arm.position.set(sx, 0.48, -0.58); g.add(arm);
  }
  const eng = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.48, 0.58), chromeMat);
  eng.position.set(0, 0.70, -0.05); g.add(eng);
  for (const sx of [-0.24, 0.24]) {
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 1.15, 10), chromeMat);
    ex.rotation.x = Math.PI / 2; ex.position.set(sx, 0.53, -0.95); g.add(ex);
  }
  const headLight = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.1, 12), headMat);
  headLight.rotation.x = Math.PI / 2; headLight.position.set(0, 1.06, 1.42); g.add(headLight);
  const headRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 6, 14), chromeMat);
  headRing.position.set(0, 1.06, 1.44); g.add(headRing);
  const fender = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.7), bodyMat);
  fender.position.set(0, 0.86, 1.18); fender.rotation.x = -0.05; g.add(fender);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xFF3040, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 3.2), glowMat);
  glow.rotation.x = -Math.PI / 2; glow.position.y = 0.04; g.add(glow);

  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ---------- 🏰 攻城车 ---------- */
function buildSiegeModel() {
  const g = new THREE.Group();
  const armorMat = new THREE.MeshStandardMaterial({ color: 0x4A4038, roughness: 0.72, metalness: 0.6, emissive: 0x1A0C04, emissiveIntensity: 0.3 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x241E1A, roughness: 0.85, metalness: 0.55 });
  const metalMat = MAT.chrome();
  const tireMat = MAT.tire();
  const headMat = MAT.head();
  const tailMat = MAT.tail();

  const hull = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.5, 6.4), armorMat);
  hull.position.set(0, 1.55, -0.4); g.add(hull);
  const topArmor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 4.2), darkMat);
  topArmor.position.set(0, 2.5, -1.0); g.add(topArmor);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.6, 0.4), darkMat);
  blade.position.set(0, 1.0, 3.5); blade.rotation.x = -0.25; g.add(blade);
  for (let i = 0; i < 6; i++) {
    const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.6, 4), metalMat);
    tooth.rotation.x = Math.PI / 2;
    tooth.position.set(-1.5 + i * 0.6, 0.5, 3.9); g.add(tooth);
  }
  const ram = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 3.0, 10), darkMat);
  ram.rotation.x = Math.PI / 2; ram.position.set(0, 2.0, 1.5); g.add(ram);
  const ramHead = new THREE.Mesh(new THREE.SphereGeometry(0.48, 10, 8), metalMat);
  ramHead.position.set(0, 2.0, 3.05); g.add(ramHead);

  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.9, 1.4), armorMat);
  cab.position.set(0, 3.15, -2.4); g.add(cab);
  const cabWin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.08), MAT.glass());
  cabWin.position.set(0, 3.28, -1.72); g.add(cabWin);

  const tireGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.62, 20);
  const rimGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.64, 10);
  for (const az of [2.4, 0.2, -2.0]) {
    for (const sx of [-1.6, 1.6]) {
      const t = new THREE.Mesh(tireGeo, tireMat); t.rotation.z = Math.PI / 2; t.position.set(sx, 0.88, az); g.add(t);
      const r = new THREE.Mesh(rimGeo, metalMat); r.rotation.z = Math.PI / 2; r.position.set(sx, 0.88, az); g.add(r);
    }
  }
  for (const sx of [-1.2, 1.2]) {
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 2.0, 10), metalMat);
    stack.position.set(sx, 3.0, -3.0); g.add(stack);
  }

  for (const sx of [-1.0, 1.0]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.24, 0.1), headMat);
    hl.position.set(sx, 2.2, 2.78); g.add(hl);
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.2, 0.1), tailMat);
    tl.position.set(sx, 1.7, -3.62); g.add(tl);
  }

  const glow = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 9.6), new THREE.MeshBasicMaterial({ color: 0xFFA040, transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = 0.05; g.add(glow);

  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ============================================================
   5. 工厂函数 —— 唯一出口
   ============================================================ */
export function buildVehicleModel(id) {
  switch (id) {
    case 'motorcycle': return buildMotorcycleModel();
    case 'siege':      return buildSiegeModel();
    default:           return buildCoupeModel();
  }
}