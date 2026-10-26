// 건축 계산 모음: 순수 함수. DOM에 의존하지 않는다. 길이는 별도 표기가 없으면 m, 힘은 kN, 응력은 MPa(N/mm²)로 다룬다.
export const round = (x, d = 0) => { const p = Math.pow(10, d); return Math.round((x + Number.EPSILON) * p) / p; };
export const PY = 400 / 121;                       // 1평 = 3.3058㎡
export const toPy = (m2) => m2 / PY;
export const toM2 = (py) => py * PY;

// 도면·치수
export const realLen = (drawMm, scale) => (drawMm * scale) / 1000;          // 도면상 mm → 실제 m
export const drawLen = (realM, scale) => (realM * 1000) / scale;            // 실제 m → 도면상 mm
export const supplyArea = (net, ratio) => net / ratio;                      // 전용면적 ÷ 전용률 = 공급면적
export const wallArea = (w, d, h, openings = 0) => 2 * (w + d) * h - openings;
export const ceilingHeight = (floorH, slab, finish, drop) => floorH - slab - finish - drop; // 모두 mm

// 건축 계획
export const bcr = (footprint, site) => footprint / site;                    // 건폐율
export const far = (gross, site) => gross / site;                            // 용적률
export const northSetback = (h) => (h <= 9 ? 1.5 : h / 2);                   // 정북 방향 일조 이격(주거지역 일반 사례)
export const stairCount = (H, R) => Math.ceil(H / R - 1e-9);                 // 층고 H, 목표 챌판 R (mm) → 챌판 수
export const stairRiser = (H, n) => H / n;
export const stairTread = (R) => 630 - 2 * R;                                // 2R + T = 630 mm
export const rampLength = (rise, denom) => rise * denom;                     // 기울기 1/denom
export const rampAngle = (denom) => (Math.atan(1 / denom) * 180) / Math.PI;
export const stallsPerRow = (W, sw) => Math.floor(W / sw + 1e-9);
export const parkRows = (D, sl, aisle) => (D >= 2 * sl + aisle - 1e-9 ? 2 : D >= sl + aisle - 1e-9 ? 1 : 0);

// 디자인·환경
export const heightFromRatio = (w, ratio) => w / ratio;
export const PHI = (1 + Math.sqrt(5)) / 2;
export const daylightRatio = (win, floor) => win / floor;
export const lampCount = (E, A, F, U, M) => (E * A) / (F * U * M);          // 광속법: N = E·A / (F·U·M)
export const airflow = (vol, ach) => vol * ach;                              // 환기량 m³/h
export const heatLoss = (U, A, dT) => U * A * dT;                            // W
export const modelLen = (realM, scale) => (realM * 1000) / scale;           // 모형 mm
export const clearance = (roomW, objW) => (roomW - objW) / 2;
export const triangleSum = (a, b, c) => a + b + c;
export const rollsNeeded = (area, loss, cover) => Math.ceil((area * (1 + loss)) / cover - 1e-9);
export const paintLiters = (area, coats, cover) => (area * coats) / cover;
export const tileCount = (area, twMm, thMm, loss) => Math.ceil((area * (1 + loss)) / ((twMm / 1000) * (thMm / 1000)) - 1e-9);
export const boxCount = (area, loss, perBox) => Math.ceil((area * (1 + loss)) / perBox - 1e-9);

// 구조
export const moment = (F, d) => F * d;                                       // kN·m
export const reactionPoint = (P, L, a) => ({ ra: (P * (L - a)) / L, rb: (P * a) / L });
export const beamUdl = (w, L) => ({ r: (w * L) / 2, v: (w * L) / 2, m: (w * L * L) / 8 });
export const momentPoint = (P, L, a) => (P * a * (L - a)) / L;
export const secArea = (b, h) => b * h;                                      // mm²
export const secI = (b, h) => (b * Math.pow(h, 3)) / 12;                     // mm⁴
export const secS = (b, h) => (b * h * h) / 6;                               // mm³
export const deflUdl = (w, Lm, E, I) => (5 * w * Math.pow(Lm * 1000, 4)) / (384 * E * I); // w kN/m(=N/mm), E MPa, I mm⁴ → mm
export const stress = (Pkn, Amm2) => (Pkn * 1000) / Amm2;                    // MPa
export const eulerLoad = (E, I, K, Lm) => (Math.PI * Math.PI * E * I) / Math.pow(K * Lm * 1000, 2) / 1000; // kN
export const radiusGyration = (I, A) => Math.sqrt(I / A);
export const footingArea = (N, q) => N / q;
export const factoredLoad = (D, L) => 1.2 * D + 1.6 * L;
export const slabSelfWeight = (tMm) => 24 * (tMm / 1000);                    // kN/㎡ (철근콘크리트 24 kN/m³)

// 표시 형식
export const krw = (x) => { const v = Math.round(x); const a = Math.abs(v); const s = a.toLocaleString('ko-KR'); return (v < 0 ? '-' : '') + s + '원'; };
export const krwShort = (x) => { const v = Math.abs(Math.round(x)); const sign = x < 0 ? '-' : ''; if (v >= 1e8) { const u = Math.floor(v / 1e8); const m = Math.round((v % 1e8) / 1e4); return sign + u + '억' + (m ? ' ' + m.toLocaleString('ko-KR') + '만원' : '원'); } if (v >= 1e4) return sign + Math.round(v / 1e4).toLocaleString('ko-KR') + '만원'; return sign + v.toLocaleString('ko-KR') + '원'; };
export const pct = (x, d = 2) => (x * 100).toFixed(d) + '%';
export const num = (x, d = 2) => (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toLocaleString('ko-KR', { maximumFractionDigits: d });
