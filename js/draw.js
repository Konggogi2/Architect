// 도면 시뮬레이터용 SVG 그리기 도구. 모든 함수는 SVG 문자열을 돌려준다. 색은 테마(밝음/어두움)에서 모두 보이게 반투명·currentColor를 쓴다.
const r1 = (x) => Math.round(x * 10) / 10;
const BLUE = '#2f5bd7', RED = '#ef6a5b', GREEN = '#3f9d5f', SUN = '#e8a410', LAV = '#7a62d6';
const bl = (a) => `rgba(47,91,215,${a})`, rd = (a) => `rgba(239,106,91,${a})`, gr = (a) => `rgba(76,175,107,${a})`, gy = (a) => `rgba(130,140,170,${a})`, sn = (a) => `rgba(255,185,56,${a})`;
export const wrap = (w, h, inner) => `<svg class="dr" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
const rc = (x, y, w, h, fill = 'none', stroke = 'currentColor', sw = 1.4, extra = '') => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(Math.max(0, w))}" height="${r1(Math.max(0, h))}" style="fill:${fill};stroke:${stroke};stroke-width:${sw}" ${extra}/>`;
const ln = (x1, y1, x2, y2, stroke = 'currentColor', sw = 1.2, dash = '') => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" style="stroke:${stroke};stroke-width:${sw}" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
const tx = (x, y, s, anchor = 'middle', size = 11, fill = 'currentColor', bold = false) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}" font-size="${size}" ${bold ? 'font-weight="700"' : ''} style="fill:${fill}">${s}</text>`;
const poly = (pts, fill = 'none', stroke = 'currentColor', sw = 1.4) => `<polygon points="${pts.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ')}" style="fill:${fill};stroke:${stroke};stroke-width:${sw}"/>`;
const path = (d, fill = 'none', stroke = 'currentColor', sw = 1.4) => `<path d="${d}" style="fill:${fill};stroke:${stroke};stroke-width:${sw}"/>`;
const circ = (x, y, r, fill = 'none', stroke = 'currentColor', sw = 1.2) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" style="fill:${fill};stroke:${stroke};stroke-width:${sw}"/>`;
const arrow = (x1, y1, x2, y2, c = RED, sw = 2) => { const a = Math.atan2(y2 - y1, x2 - x1), s = 6; return ln(x1, y1, x2, y2, c, sw) + poly([[x2, y2], [x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)], [x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)]], c, c, 0.5); };
const dimH = (x1, x2, y, label) => ln(x1, y, x2, y, BLUE, 1) + ln(x1, y - 4, x1, y + 4, BLUE, 1) + ln(x2, y - 4, x2, y + 4, BLUE, 1) + tx((x1 + x2) / 2, y - 4, label, 'middle', 10.5, BLUE, true);
const dimV = (x, y1, y2, label) => ln(x, y1, x, y2, BLUE, 1) + ln(x - 4, y1, x + 4, y1, BLUE, 1) + ln(x - 4, y2, x + 4, y2, BLUE, 1) + tx(x - 6, (y1 + y2) / 2 + 4, label, 'end', 10.5, BLUE, true);
const fit = (wm, dm, W, H) => Math.min(W / Math.max(wm, 0.01), H / Math.max(dm, 0.01));
const N = (x, d = 1) => (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toLocaleString('ko-KR', { maximumFractionDigits: d });
const grid = (x0, y0, w, h, s, step) => { let o = ''; for (let i = 1; i * step < w / s - 1e-9; i++) o += ln(x0 + i * step * s, y0, x0 + i * step * s, y0 + h, gy(0.25), 0.6); for (let j = 1; j * step < h / s - 1e-9; j++) o += ln(x0, y0 + j * step * s, x0 + w, y0 + j * step * s, gy(0.25), 0.6); return o; };
const person = (x, yb, hPx) => { const u = hPx / 170; return circ(x, yb - hPx + 11 * u, 9 * u, gy(0.5), 'currentColor', 1) + ln(x, yb - hPx + 20 * u, x, yb - 70 * u, 'currentColor', 2.4) + ln(x, yb - 70 * u, x - 10 * u, yb, 'currentColor', 2.2) + ln(x, yb - 70 * u, x + 10 * u, yb, 'currentColor', 2.2) + ln(x - 14 * u, yb - 105 * u, x + 14 * u, yb - 105 * u, 'currentColor', 2.2); };

// ---------- 도면 읽기 ----------
export function drawPlan(v) {
  const W = 360, H = 220, bw = 290, bh = 150, s = fit(v.w, v.d, bw, bh), rw = v.w * s, rh = v.d * s, x0 = (W - rw) / 2 + 8, y0 = 34;
  return wrap(W, H, rc(x0, y0, rw, rh, bl(0.1), 'currentColor', 2.4) + grid(x0, y0, rw, rh, s, 1) + dimH(x0, x0 + rw, y0 - 8, N(v.w) + ' m') + dimV(x0 - 8, y0, y0 + rh, N(v.d) + ' m') + tx(x0 + rw / 2, y0 + rh / 2, N(v.w * v.d) + ' ㎡', 'middle', 15, 'currentColor', true) + tx(x0 + rw / 2, y0 + rh / 2 + 17, '≈ ' + N((v.w * v.d) / (400 / 121)) + ' 평', 'middle', 12, BLUE, true) + tx(W / 2, H - 6, '격자 한 칸 = 1 m', 'middle', 10, 'currentColor'));
}
export function drawScale(v) {
  const n = Number(v.sc), px = 2.6, W = 360, H = 120; let o = ''; const x0 = 24, y0 = 52, L = 120;
  o += rc(x0, y0, L * px, 14, 'none', 'currentColor', 1.4);
  for (let i = 0; i <= 12; i++) { o += ln(x0 + i * 10 * px, y0, x0 + i * 10 * px, y0 + (i % 5 === 0 ? 20 : 14), 'currentColor', 1); if (i % 2 === 0) o += tx(x0 + i * 10 * px, y0 + 32, N((i * 10 * n) / 1000, 1) + 'm', 'middle', 9.5); }
  o += tx(x0, y0 - 24, '자(종이 위 mm) 눈금 1칸 = 10 mm = 실제 ' + N((10 * n) / 1000, 2) + ' m', 'start', 11, 'currentColor', true);
  const dl = Math.min(v.L, L); o += rc(x0, y0 + 40, dl * px, 8, rd(0.5), RED, 1.2) + tx(x0 + dl * px + 6, y0 + 48, '도면 ' + N(v.L, 0) + ' mm' + (v.L > L ? ' (일부)' : ''), 'start', 10.5, RED, true);
  return wrap(W, H, o);
}
export function drawHeight(v) {
  const W = 360, H = 250, top = 20, bot = 220, total = v.fh, s = (bot - top) / Math.max(total, 1), x0 = 40; let y = bot; let o = '';
  const slab = v.slab * s, fin = v.fin * s, drop = v.drop * s, head = Math.max(0, total - v.slab - v.fin - v.drop) * s;
  o += rc(x0, bot - fin, 150, fin, sn(0.5), 'currentColor', 1) + rc(x0, bot - fin - slab, 150, slab, gy(0.4), 'currentColor', 1) + rc(x0, top, 150, slab, gy(0.4), 'currentColor', 1);
  o += rc(x0, top + slab, 150, drop, bl(0.2), 'currentColor', 1) + rc(x0, top + slab + drop, 150, head, 'none', 'none');
  const hy1 = top + slab + drop, hy2 = bot - fin - slab;
  o += person(x0 + 100, hy2, 1.7 * 1000 * s * 0.95);
  o += ln(x0 + 170, hy1, x0 + 170, hy2, BLUE, 1.2) + ln(x0 + 164, hy1, x0 + 176, hy1, BLUE, 1.2) + ln(x0 + 164, hy2, x0 + 176, hy2, BLUE, 1.2) + tx(x0 + 180, (hy1 + hy2) / 2 + 4, '천장고 ' + N((v.fh - v.slab - v.fin - v.drop) / 1000, 2) + ' m', 'start', 11, BLUE, true);
  const ly = hy2 - 2100 * s; o += ln(x0, ly, x0 + 160, ly, RED, 1, '4 3') + tx(x0 + 4, ly - 3, '법정 최소 2.1 m', 'start', 9.5, RED);
  o += tx(x0 + 75, top - 6, '위층 슬래브', 'middle', 9.5) + tx(x0 + 75, bot + 12, '바닥 마감 + 슬래브', 'middle', 9.5);
  return wrap(W, H, o);
}
export function drawSupply(v) {
  const W = 360, H = 120, x0 = 24, w = 312; const sup = v.net / v.ratio; const nw = w * v.ratio;
  return wrap(W, H, rc(x0, 40, nw, 36, bl(0.3), BLUE, 1.6) + rc(x0 + nw, 40, w - nw, 36, sn(0.4), SUN, 1.6) + tx(x0 + nw / 2, 63, '전용 ' + N(v.net, 1) + '㎡', 'middle', 12, 'currentColor', true) + tx(x0 + nw + (w - nw) / 2, 63, '공용 ' + N(sup - v.net, 1), 'middle', 11, 'currentColor', true) + dimH(x0, x0 + w, 34, '공급면적 ' + N(sup, 1) + ' ㎡') + tx(W / 2, 100, '전용률 ' + N(v.ratio * 100, 0) + '%  =  전용 ÷ 공급', 'middle', 11));
}

// ---------- 배치·계획 ----------
export function drawSite(v) {
  const W = 360, H = 250, s = fit(v.sw, v.sd, 280, 170), sw = v.sw * s, sd = v.sd * s, x0 = (W - sw) / 2, y0 = 40;
  const bw = Math.min(v.bw, v.sw - 0.1), bd = Math.min(v.bd, v.sd - 0.1); const bx = x0 + (sw - bw * s) / 2, by = y0 + sd - bd * s - (sd - bd * s) / 3;
  const c = (bw * bd) / (v.sw * v.sd);
  return wrap(W, H, rc(x0, y0, sw, sd, gy(0.12), 'currentColor', 2, 'stroke-dasharray="6 3"') + rc(bx, by, bw * s, bd * s, c > v.cap ? rd(0.35) : bl(0.3), c > v.cap ? RED : BLUE, 2) + tx(bx + (bw * s) / 2, by + (bd * s) / 2 + 4, '건축면적 ' + N(bw * bd, 0) + '㎡', 'middle', 11, 'currentColor', true) + tx(x0 + sw / 2, y0 - 8, '대지 ' + N(v.sw * v.sd, 0) + '㎡ (' + N(v.sw, 0) + '×' + N(v.sd, 0) + ' m)', 'middle', 11, 'currentColor', true) + tx(W - 24, 24, 'N↑', 'middle', 14, 'currentColor', true) + tx(W / 2, H - 22, '건폐율 ' + N(c * 100, 1) + '% (상한 ' + N(v.cap * 100, 0) + '%)', 'middle', 13, c > v.cap ? RED : GREEN, true) + tx(W / 2, H - 6, '파선 = 대지경계', 'middle', 9.5));
}
export function drawSun(v) {
  const W = 360, H = 250, gx = 30, gy0 = 210, s = 12; let o = ''; const need = v.h <= 9 ? 1.5 : v.h / 2;
  o += ln(10, gy0, 350, gy0, 'currentColor', 2) + ln(gx, gy0, gx, 20, 'currentColor', 1.2, '5 3') + tx(gx + 2, 14, '북쪽 인접 대지경계', 'start', 9.5);
  const pts = [[gx + 1.5 * s, gy0], [gx + 1.5 * s, gy0 - 9 * s], [gx + 4.5 * s, gy0 - 9 * s], [gx + 15 * s, gy0 - 30 * s > 20 ? 20 : gy0 - 30 * s], [350, 20], [350, gy0]];
  pts[3] = [gx + ((gy0 - 20) / s / 2) * s, 20];
  o += poly([pts[0], pts[1], pts[2], pts[3], [350, 20], [350, gy0]], gy(0.1), 'none') + path(`M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]} L${pts[3][0]},${pts[3][1]}`, 'none', GREEN, 2);
  const bx = gx + v.s * s, bh = Math.min(v.h * s, gy0 - 20), ok = v.s >= need - 1e-9;
  o += rc(bx, gy0 - bh, 70, bh, ok ? bl(0.3) : rd(0.35), ok ? BLUE : RED, 2) + tx(bx + 35, gy0 - bh / 2, '높이 ' + N(v.h, 0) + 'm', 'middle', 11, 'currentColor', true);
  o += dimH(gx, bx, gy0 + 16, '이격 ' + N(v.s, 1) + ' m') + tx(260, 40, '초록선 = 허용 범위 경계', 'middle', 10, GREEN, true) + tx(260, 54, ok ? '✔ 기준 충족' : '✘ 더 띄워야 해요 (필요 ' + N(need, 1) + ' m)', 'middle', 11, ok ? GREEN : RED, true);
  return wrap(W, H + 12, o);
}
export function drawStair(v) {
  const n = v.n, R = v.R, T = v.T, W = 360, H = 230, s = Math.min(250 / Math.max((n - 1) * T, 1), 190 / (n * R)), x0 = 84, yb = 215; let d = `M${x0},${yb}`; let x = x0, y = yb;
  for (let i = 0; i < n; i++) { y -= R * s; d += ` L${r1(x)},${r1(y)}`; if (i < n - 1) { x += T * s; d += ` L${r1(x)},${r1(y)}`; } }
  d += ` L${r1(x)},${yb} Z`;
  return wrap(W, H + 12, path(d, bl(0.15), BLUE, 2) + ln(x0, yb, x, yb, 'currentColor', 1.5) + dimV(x0 - 8, yb - n * R * s, yb, N(n * R, 0) + ' mm') + dimH(x0, x, yb + 14, N((n - 1) * T, 0) + ' mm (단너비 ' + N(T, 0) + ')') + tx(x + 4, yb - n * R * s - 6, '챌판 ' + N(R, 0) + ' mm × ' + n + '단', 'end', 11, BLUE, true));
}
export function drawRamp(v) {
  const W = 360, H = 190, L = v.H * v.d, s = Math.min(290 / L, 110 / v.H), x0 = 30, yb = 160;
  return wrap(W, H, poly([[x0, yb], [x0 + L * s, yb], [x0 + L * s, yb - v.H * s]], bl(0.2), BLUE, 2) + dimH(x0, x0 + L * s, yb + 16, '경사로 길이 ' + N(L, 2) + ' m') + dimV(x0 + L * s + 14, yb - v.H * s, yb, N(v.H, 2) + ' m') + tx(x0 + 36, yb - 6, N((Math.atan(1 / v.d) * 180) / Math.PI, 1) + '°', 'start', 11, RED, true) + tx(W / 2, 22, '기울기 1/' + N(v.d, 0) + '  (' + N(100 / v.d, 1) + '%)', 'middle', 12, 'currentColor', true));
}
export function drawParking(v) {
  const W = 360, H = 230, s = fit(v.W, v.D, 300, 170), x0 = (W - v.W * s) / 2, y0 = 34, sw = 2.5, sl = 5, aisle = 6; let o = rc(x0, y0, v.W * s, v.D * s, gy(0.12), 'currentColor', 1.6);
  const per = Math.floor(v.W / sw + 1e-9), rows = v.D >= 2 * sl + aisle - 1e-9 ? 2 : v.D >= sl + aisle - 1e-9 ? 1 : 0;
  for (let r = 0; r < rows; r++) for (let i = 0; i < per; i++) { const yy = r === 0 ? y0 : y0 + v.D * s - sl * s; o += rc(x0 + i * sw * s, yy, sw * s, sl * s, bl(0.25), BLUE, 1); }
  o += tx(x0 + (v.W * s) / 2, y0 + (v.D * s) / 2 + 4, rows ? '통로 6.0 m' : '주차 불가', 'middle', 10.5, 'currentColor');
  return wrap(W, H, o + tx(W / 2, 20, '주차장 ' + N(v.W, 0) + ' × ' + N(v.D, 0) + ' m  →  ' + per * rows + '대', 'middle', 12, 'currentColor', true) + tx(W / 2, H - 8, '한 칸 2.5 × 5.0 m, 직각주차 기준(가정)', 'middle', 10));
}

// ---------- 디자인·환경 ----------
export function drawGolden(v) {
  const W = 360, H = 230, rw0 = v.w, rh0 = v.w / v.r, s = fit(rw0, rh0, 300, 170), rw = rw0 * s, rh = rh0 * s, x0 = (W - rw) / 2, y0 = 30; let o = rc(x0, y0, rw, rh, bl(0.1), BLUE, 2);
  let x = x0, y = y0, w = rw, h = rh, dir = 0;
  for (let i = 0; i < 5; i++) {
    if (w >= h) { o += rc(dir ? x + w - h : x, y, h, h, 'none', gy(0.8), 1); if (dir) { w -= h; } else { x += h; w -= h; } }
    else { o += rc(x, dir ? y + h - w : y, w, w, 'none', gy(0.8), 1); if (dir) { h -= w; } else { y += w; h -= w; } }
    dir = 1 - dir; if (w < 4 || h < 4) break;
  }
  return wrap(W, H, o + tx(W / 2, 20, '가로 : 세로 = ' + N(v.r, 3) + ' : 1', 'middle', 12, 'currentColor', true) + tx(W / 2, y0 + rh + 22, N(rw0, 0) + ' × ' + N(rh0, 0) + ' mm', 'middle', 12, BLUE, true));
}
export const hsl = (h, s, l) => `hsl(${((h % 360) + 360) % 360},${s}%,${l}%)`;
export function drawColor(v) {
  const W = 360, H = 190, x0 = 30, w = 300, y0 = 30, h = 100; const main = hsl(v.hue, v.sat, v.lit), sub = hsl(v.hue + 30, Math.round(v.sat * 0.6), Math.min(v.lit + 20, 95)), acc = hsl(v.hue + 180, Math.min(v.sat + 20, 100), 50);
  return wrap(W, H, `<rect x="${x0}" y="${y0}" width="${w * 0.6}" height="${h}" style="fill:${main}"/><rect x="${x0 + w * 0.6}" y="${y0}" width="${w * 0.3}" height="${h}" style="fill:${sub}"/><rect x="${x0 + w * 0.9}" y="${y0}" width="${w * 0.1}" height="${h}" style="fill:${acc}"/>` + rc(x0, y0, w, h, 'none', 'currentColor', 1.4) + tx(x0 + w * 0.3, y0 + h + 18, '주조 60%', 'middle', 11, 'currentColor', true) + tx(x0 + w * 0.75, y0 + h + 18, '보조 30%', 'middle', 11, 'currentColor', true) + tx(x0 + w * 0.95, y0 + h + 32, '강조 10%', 'middle', 11, 'currentColor', true) + tx(W / 2, 20, '색상 ' + N(v.hue, 0) + '° · 채도 ' + N(v.sat, 0) + '% · 명도 ' + N(v.lit, 0) + '%', 'middle', 11.5, 'currentColor', true));
}
export function drawDaylight(v) {
  const W = 360, H = 230, s = fit(v.w, v.d, 280, 150), rw = v.w * s, rd0 = v.d * s, x0 = (W - rw) / 2, y0 = 36; const ww = Math.min(v.ww, v.w) * s;
  return wrap(W, H, rc(x0, y0, rw, rd0, gy(0.1), 'currentColor', 3) + rc(x0 + (rw - ww) / 2, y0 + rd0 - 3, ww, 6, sn(0.9), SUN, 1) + poly([[x0 + (rw - ww) / 2, y0 + rd0], [x0 + (rw + ww) / 2, y0 + rd0], [x0 + rw * 0.85, y0 + rd0 * 0.25], [x0 + rw * 0.15, y0 + rd0 * 0.25]], sn(0.25), 'none') + tx(x0 + rw / 2, y0 + rd0 / 2, N(v.w * v.d, 1) + ' ㎡', 'middle', 13, 'currentColor', true) + tx(x0 + rw / 2, y0 + rd0 + 22, '창 ' + N(v.ww, 1) + ' m × ' + N(v.wh, 1) + ' m = ' + N(v.ww * v.wh, 2) + ' ㎡', 'middle', 11.5, SUN, true) + tx(W / 2, 20, '창 면적 ÷ 바닥 면적 = ' + N((v.ww * v.wh) / (v.w * v.d) * 100, 1) + '%  (기준 10% 이상)', 'middle', 11.5, 'currentColor', true));
}
export function drawLight(v, o) {
  const W = 360, H = 210, rw = 280, rh = 140, x0 = 40, y0 = 34, n = Math.max(0, Math.min(40, Math.ceil(o.n - 1e-9))); let g = rc(x0, y0, rw, rh, gy(0.1), 'currentColor', 2);
  if (n) { const cols = Math.max(1, Math.ceil(Math.sqrt((n * rw) / rh))), rows = Math.ceil(n / cols); let k = 0; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { if (k++ >= n) break; const cx = x0 + ((c + 0.5) * rw) / cols, cy = y0 + ((r + 0.5) * rh) / rows; g += circ(cx, cy, 14, sn(0.15), 'none') + circ(cx, cy, 4.5, SUN, SUN, 1); } }
  return wrap(W, H, g + tx(W / 2, 22, '필요 등기구 약 ' + N(o.n, 1) + '개 → ' + n + '개 배치', 'middle', 12, 'currentColor', true) + tx(W / 2, H - 14, '목표 조도 ' + N(v.E, 0) + ' lx · 바닥 ' + N(v.A, 0) + ' ㎡', 'middle', 11));
}
export function drawVent(v) {
  const W = 360, H = 190, x0 = 60, y0 = 40, rw = 240, rh = 90; let o = rc(x0, y0, rw, rh, gy(0.1), 'currentColor', 3) + rc(x0 - 3, y0 + 25, 6, 40, bl(0.6), BLUE, 1) + rc(x0 + rw - 3, y0 + 25, 6, 40, bl(0.6), BLUE, 1);
  o += arrow(10, y0 + 45, x0 + 80, y0 + 45, BLUE, 2.5) + arrow(x0 + rw - 80, y0 + 45, W - 10, y0 + 45, GREEN, 2.5);
  return wrap(W, H, o + tx(W / 2, 22, '실 부피 ' + N(v.vol, 0) + ' ㎥ × 시간당 ' + N(v.ach, 1) + '회 = ' + N(v.vol * v.ach, 0) + ' ㎥/h', 'middle', 12, 'currentColor', true) + tx(W / 2, H - 22, '맞바람 통로가 있으면 환기가 잘 돼요', 'middle', 11));
}
export function drawHeat(v) {
  const W = 360, H = 190, x0 = 140, w = 80, y0 = 30, h = 120; const q = v.U * v.A * v.dT;
  return wrap(W, H, rc(x0, y0, w, h, gy(0.35), 'currentColor', 2) + arrow(x0 - 6, y0 + 30, x0 - 70, y0 + 30, RED, Math.min(8, 1 + q / 400)) + arrow(x0 - 6, y0 + 70, x0 - 70, y0 + 70, RED, Math.min(8, 1 + q / 400)) + tx(x0 - 40, y0 + 112, '실내 ' + N(20, 0) + '℃', 'middle', 11) + tx(x0 + w + 50, y0 + 112, '실외 ' + N(20 - v.dT, 0) + '℃', 'middle', 11) + tx(x0 + w / 2, y0 + h / 2 + 4, 'U=' + N(v.U, 2), 'middle', 12, 'currentColor', true) + tx(W / 2, 20, '열손실 Q = U × A × ΔT = ' + N(q, 0) + ' W', 'middle', 12, 'currentColor', true));
}

// ---------- 인테리어 ----------
export function drawFurn(v) {
  const W = 360, H = 240, s = fit(v.w, v.d, 280, 160), rw = v.w * s, rh = v.d * s, x0 = (W - rw) / 2, y0 = 34; const bw = Math.min(v.bw, v.w) * s, bl0 = Math.min(v.bl, v.d) * s, bx = x0 + (rw - bw) / 2;
  const side = (v.w - v.bw) / 2, foot = v.d - v.bl;
  return wrap(W, H, rc(x0, y0, rw, rh, gy(0.1), 'currentColor', 3) + rc(bx, y0, bw, bl0, bl(0.3), BLUE, 1.6) + tx(bx + bw / 2, y0 + bl0 / 2 + 4, '침대', 'middle', 11, 'currentColor', true) + dimH(x0, bx, y0 + bl0 + 14, N(side, 2) + ' m') + dimV(x0 + rw + 14, y0 + bl0, y0 + rh, N(foot, 2) + ' m') + tx(W / 2, 20, '방 ' + N(v.w, 1) + ' × ' + N(v.d, 1) + ' m · 침대 ' + N(v.bw, 1) + ' × ' + N(v.bl, 1) + ' m', 'middle', 11.5, 'currentColor', true) + tx(W / 2, H - 10, side >= 0.6 ? '✔ 양옆 통로 0.6 m 이상' : '✘ 양옆이 0.6 m보다 좁아요', 'middle', 11.5, side >= 0.6 ? GREEN : RED, true));
}
export function drawKitchen(v) {
  const W = 360, H = 220, a = v.a, b = v.b, c = v.c; const x = (a * a + c * c - b * b) / (2 * a); const y2 = c * c - x * x; const y = y2 > 0 ? Math.sqrt(y2) : 0;
  const xs = [0, a, x], minx = Math.min(...xs), maxx = Math.max(...xs), s = Math.min(280 / Math.max(maxx - minx, 0.5), 120 / Math.max(y, 0.5)), ox = (W - (maxx - minx) * s) / 2 - minx * s, by = 180;
  const P = [[ox, by], [ox + a * s, by], [ox + x * s, by - y * s]];
  return wrap(W, H, poly(P, bl(0.12), BLUE, 2) + circ(P[0][0], P[0][1], 9, sn(0.9), SUN, 1.2) + tx(P[0][0], P[0][1] + 24, '싱크', 'middle', 11, 'currentColor', true) + circ(P[1][0], P[1][1], 9, rd(0.8), RED, 1.2) + tx(P[1][0], P[1][1] + 24, '레인지', 'middle', 11, 'currentColor', true) + circ(P[2][0], P[2][1], 9, gr(0.8), GREEN, 1.2) + tx(P[2][0], P[2][1] - 14, '냉장고', 'middle', 11, 'currentColor', true) + tx((P[0][0] + P[1][0]) / 2, by - 6, N(a, 1) + ' m', 'middle', 10.5, BLUE, true) + tx(W / 2, 20, '작업 삼각형 세 변의 합 = ' + N(a + b + c, 1) + ' m', 'middle', 12, 'currentColor', true));
}
export function drawWalls(v, o) {
  const W = 360, H = 170, total = 2 * (v.w + v.d), s = 300 / total, hh = Math.min(100, 100), sh = (v.h / 3) * hh * 0.9; const x0 = 30, y0 = 36;
  return wrap(W, H, rc(x0, y0, total * s, sh, bl(0.12), 'currentColor', 1.6) + rc(x0 + 20, y0 + sh * 0.15, 30, sh * 0.5, sn(0.6), SUN, 1) + rc(x0 + total * s * 0.55, y0 + sh * 0.25, 40, sh * 0.4, bl(0.4), BLUE, 1) + tx(W / 2, 20, '벽 전체(펼친 모양) ' + N(total, 1) + ' m × ' + N(v.h, 1) + ' m', 'middle', 11.5, 'currentColor', true) + tx(W / 2, y0 + sh + 22, '벽면적 ' + N(o.wall, 1) + ' ㎡ (문·창 ' + N(v.open, 1) + ' ㎡ 제외)', 'middle', 12, BLUE, true));
}
export function drawTiles(v) {
  const W = 360, H = 230, s = fit(v.w, v.d, 290, 160), rw = v.w * s, rh = v.d * s, x0 = (W - rw) / 2, y0 = 34, tw = v.tw / 1000, th = v.th / 1000; let o = rc(x0, y0, rw, rh, gy(0.1), 'currentColor', 2);
  const cols = Math.ceil(v.w / tw), rows = Math.ceil(v.d / th);
  if (cols * rows <= 600) { for (let i = 1; i < cols; i++) o += ln(x0 + i * tw * s, y0, x0 + i * tw * s, y0 + rh, gy(0.5), 0.6); for (let j = 1; j < rows; j++) o += ln(x0, y0 + j * th * s, x0 + rw, y0 + j * th * s, gy(0.5), 0.6); }
  return wrap(W, H, o + tx(W / 2, 20, '바닥 ' + N(v.w * v.d, 1) + ' ㎡ · 타일 ' + N(v.tw, 0) + '×' + N(v.th, 0) + ' mm', 'middle', 11.5, 'currentColor', true) + tx(W / 2, y0 + rh + 22, '가로 ' + cols + '장 × 세로 ' + rows + '장 = ' + cols * rows + '장(자투리 포함 어림)', 'middle', 11, BLUE, true));
}
export function drawPlanks(v) {
  const W = 360, H = 200, s = fit(v.w, v.d, 290, 140), rw = v.w * s, rh = v.d * s, x0 = (W - rw) / 2, y0 = 34; let o = rc(x0, y0, rw, rh, sn(0.2), 'currentColor', 2);
  for (let j = 1; j * 0.19 < v.d; j++) o += ln(x0, y0 + j * 0.19 * s, x0 + rw, y0 + j * 0.19 * s, 'rgba(150,110,40,.5)', 0.6);
  return wrap(W, H, o + tx(W / 2, 20, '마루 깔기 ' + N(v.w * v.d, 1) + ' ㎡', 'middle', 12, 'currentColor', true) + tx(W / 2, H - 10, '폭 약 19 cm 판재를 길게 이어 깔아요(그림은 예시)', 'middle', 10));
}
export function drawBudget(parts) {
  const W = 360, H = 130, x0 = 20, w = 320, tot = parts.reduce((a, p) => a + p.v, 0) || 1; let x = x0, o = '';
  const cols = [bl(0.55), sn(0.7), rd(0.55), gr(0.55), 'rgba(122,98,214,.55)'];
  parts.forEach((p, i) => { const pw = (p.v / tot) * w; o += rc(x, 40, pw, 32, cols[i % cols.length], 'currentColor', 1); if (pw > 40) o += tx(x + pw / 2, 60, N((p.v / tot) * 100, 0) + '%', 'middle', 11, 'currentColor', true); x += pw; });
  let lx = x0; parts.forEach((p, i) => { o += rc(lx, 92, 10, 10, cols[i % cols.length], 'none', 0) + tx(lx + 14, 101, p.l, 'start', 10); lx += 14 + p.l.length * 11 + 10; });
  return wrap(W, H, o + tx(W / 2, 24, '예산 구성(합계 100%)', 'middle', 11.5, 'currentColor', true));
}

// ---------- 구조 ----------
export function drawLoad(v) {
  const W = 360, H = 210, x0 = 40, w = 280, y = 120; let o = rc(x0, y, w, 14, gy(0.5), 'currentColor', 1.5) + rc(x0 + 16, y + 14, 14, 46, gy(0.25), 'currentColor', 1.2) + rc(x0 + w - 30, y + 14, 14, 46, gy(0.25), 'currentColor', 1.2);
  const dh = Math.min(60, v.D * 6), lh = Math.min(60, v.L * 6);
  for (let i = 0; i <= 8; i++) { o += arrow(x0 + 10 + i * 32, y - lh - dh * 0.0 - 4, x0 + 10 + i * 32, y - 2, RED, 1.6); }
  o += ln(x0, y - lh - 4, x0 + w, y - lh - 4, RED, 1.4) + tx(x0 + w / 2, y - lh - 12, '활하중 ' + N(v.L, 1) + ' kN/㎡ (사람·가구) + 고정하중 ' + N(v.D, 1) + ' kN/㎡ (자중·마감)', 'middle', 10.5, RED, true);
  return wrap(W, H, o + tx(W / 2, 195, '바닥판 1㎡당 하중이 합쳐져 보와 기둥으로 전해져요', 'middle', 10.5));
}
export function drawLever(v) {
  const W = 360, H = 200, cx = 180, cy = 130, s = 30; const m1 = v.F1 * v.d1, m2 = v.F2 * v.d2; const ang = Math.max(-12, Math.min(12, (m2 - m1) * 0.6)) * Math.PI / 180;
  const ex = (d) => [cx + d * s * Math.cos(ang), cy + d * s * Math.sin(ang)]; const L = ex(-v.d1), Rr = ex(v.d2);
  return wrap(W, H, ln(L[0], L[1], Rr[0], Rr[1], 'currentColor', 5) + poly([[cx, cy + 4], [cx - 14, cy + 40], [cx + 14, cy + 40]], gy(0.4), 'currentColor', 1.4) + arrow(L[0], L[1] - 50, L[0], L[1] - 4, RED, 2.5) + arrow(Rr[0], Rr[1] - 50, Rr[0], Rr[1] - 4, BLUE, 2.5) + tx(L[0], L[1] - 56, v.F1 + ' kN', 'middle', 11, RED, true) + tx(Rr[0], Rr[1] - 56, v.F2 + ' kN', 'middle', 11, BLUE, true) + tx(W / 2, 20, '왼쪽 모멘트 ' + N(m1, 1) + ' vs 오른쪽 ' + N(m2, 1) + ' kN·m', 'middle', 12, 'currentColor', true) + tx(W / 2, 185, Math.abs(m1 - m2) < 1e-6 ? '✔ 균형' : m1 > m2 ? '왼쪽으로 기울어요' : '오른쪽으로 기울어요', 'middle', 12, Math.abs(m1 - m2) < 1e-6 ? GREEN : RED, true));
}
const supports = (x1, x2, y) => poly([[x1, y], [x1 - 9, y + 16], [x1 + 9, y + 16]], gy(0.4), 'currentColor', 1.3) + poly([[x2, y], [x2 - 9, y + 16], [x2 + 9, y + 16]], gy(0.4), 'currentColor', 1.3) + circ(x2, y + 20, 3.5, 'none', 'currentColor', 1.2);
export function drawReaction(v, o) {
  const W = 360, H = 235, x0 = 40, L = 280, y = 90, px = x0 + (v.a / v.L) * L; let g = ln(x0, y, x0 + L, y, 'currentColor', 5) + supports(x0, x0 + L, y + 3) + arrow(px, y - 50, px, y - 3, RED, 3) + tx(px, y - 56, 'P = ' + N(v.P, 0) + ' kN', 'middle', 11, RED, true);
  g += arrow(x0, y + 62, x0, y + 24, GREEN, 2.5) + arrow(x0 + L, y + 62, x0 + L, y + 24, GREEN, 2.5) + tx(x0, y + 76, 'RA=' + N(o.ra, 1), 'middle', 11, GREEN, true) + tx(x0 + L, y + 76, 'RB=' + N(o.rb, 1), 'middle', 11, GREEN, true);
  return wrap(W, H, g + dimH(x0, px, y + 100, 'a = ' + N(v.a, 1) + ' m') + dimH(x0, x0 + L, y + 122, 'L = ' + N(v.L, 1) + ' m') + tx(W / 2, 18, '집중하중이 한쪽으로 가까울수록 가까운 받침이 더 많이 받아요', 'middle', 10.5));
}
export function drawBeam(v, o) {
  const W = 360, H = 270, x0 = 40, L = 280, y = 56; let g = '';
  for (let i = 0; i <= 10; i++) g += arrow(x0 + (i * L) / 10, y - 34, x0 + (i * L) / 10, y - 4, RED, 1.4);
  g += ln(x0, y - 34, x0 + L, y - 34, RED, 1.4) + tx(x0 + L / 2, y - 40, 'w = ' + N(v.w, 1) + ' kN/m', 'middle', 11, RED, true) + ln(x0, y, x0 + L, y, 'currentColor', 5) + supports(x0, x0 + L, y + 3);
  const my = 240, mh = 72; let d = `M${x0},${my}`; for (let i = 0; i <= 20; i++) { const t = i / 20; d += ` L${r1(x0 + t * L)},${r1(my - 4 * t * (1 - t) * mh)}`; } d += ` L${x0 + L},${my} Z`;
  g += path(d, bl(0.2), BLUE, 2) + ln(x0, my, x0 + L, my, 'currentColor', 1) + tx(x0 + L / 2, my - mh - 6, 'M최대 = wL²/8 = ' + N(o.m, 1) + ' kN·m', 'middle', 11, BLUE, true) + tx(x0 + L / 2, my + 16, '휨모멘트 그림 (가운데가 가장 커요)', 'middle', 10.5) + tx(x0, y + 44, 'R=' + N(o.r, 1), 'middle', 10.5, GREEN, true) + tx(x0 + L, y + 44, 'R=' + N(o.r, 1), 'middle', 10.5, GREEN, true) + dimH(x0, x0 + L, y + 62, 'L = ' + N(v.L, 1) + ' m');
  return wrap(W, H, g);
}
export function drawSection(v) {
  const W = 360, H = 230, s = Math.min(150 / Math.max(v.b, 1), 150 / Math.max(v.h, 1)), bw = v.b * s, bh = v.h * s, x0 = 120, y0 = 30;
  return wrap(W, H, rc(x0, y0, bw, bh, bl(0.2), BLUE, 2) + ln(x0 - 10, y0 + bh / 2, x0 + bw + 10, y0 + bh / 2, RED, 1.2, '5 3') + tx(x0 + bw + 14, y0 + bh / 2 + 4, '중립축', 'start', 10, RED) + dimH(x0, x0 + bw, y0 + bh + 18, 'b = ' + N(v.b, 0) + ' mm') + dimV(x0 - 10, y0, y0 + bh, 'h = ' + N(v.h, 0) + ' mm') + tx(W / 2, 14, '세워 쓰면(h가 클수록) 훨씬 강해져요', 'middle', 10.5));
}
export function drawDeflect(v, o) {
  const W = 360, H = 200, x0 = 40, L = 280, y = 70, amp = Math.min(60, 4 + o.d * 1.2); let d = `M${x0},${y}`; for (let i = 0; i <= 20; i++) { const t = i / 20; d += ` L${r1(x0 + t * L)},${r1(y + 4 * t * (1 - t) * amp)}`; }
  return wrap(W, H, ln(x0, y, x0 + L, y, 'currentColor', 1.2, '5 3') + path(d, 'none', BLUE, 5) + supports(x0, x0 + L, y + 3) + ln(x0 + L / 2, y, x0 + L / 2, y + amp, RED, 1.6) + tx(x0 + L / 2, y + amp + 18, 'δ = ' + N(o.d, 1) + ' mm', 'middle', 12, RED, true) + tx(W / 2, 20, '처짐 한도(L/360) = ' + N(v.L * 1000 / 360, 1) + ' mm', 'middle', 11.5, 'currentColor', true) + tx(W / 2, 170, o.d <= (v.L * 1000) / 360 ? '✔ 한도 이내' : '✘ 한도를 넘어요 (그림은 과장)', 'middle', 12, o.d <= (v.L * 1000) / 360 ? GREEN : RED, true));
}
export function drawStress(v, o) {
  const W = 360, H = 170, x0 = 80, bw = 200, bh = Math.max(10, Math.min(60, v.A / 40)), y0 = 75 - bh / 2, ext = Math.min(30, o.dl * 40);
  return wrap(W, H, rc(x0, y0, bw + ext, bh, bl(0.25), BLUE, 2) + arrow(x0 - 6, 75, x0 - 60, 75, RED, 3) + arrow(x0 + bw + ext + 6, 75, x0 + bw + ext + 60, 75, RED, 3) + tx(x0 - 33, 62, N(v.P, 0) + ' kN', 'middle', 11, RED, true) + tx(W / 2, 20, '응력 σ = P ÷ A = ' + N(o.s, 1) + ' MPa', 'middle', 12, 'currentColor', true) + tx(W / 2, 140, '늘어난 길이 ' + N(o.dl, 2) + ' mm (그림은 과장)', 'middle', 11, 'currentColor'));
}
export function drawColumn(v, o) {
  const W = 360, H = 230, x = 180, y0 = 30, y1 = 200; const bow = Math.min(40, Math.max(0, (v.P / Math.max(o.pcr, 1)) * 40)); let d = `M${x},${y1}`; for (let i = 1; i <= 20; i++) { const t = i / 20; d += ` L${r1(x + Math.sin(Math.PI * t) * bow)},${r1(y1 - t * (y1 - y0))}`; }
  return wrap(W, H, path(d, 'none', BLUE, 6) + poly([[x, y1 + 2], [x - 12, y1 + 16], [x + 12, y1 + 16]], gy(0.4)) + arrow(x, y0 - 22, x, y0 - 2, RED, 3) + tx(x + 14, y0 - 10, 'P = ' + N(v.P, 0) + ' kN', 'start', 11, RED, true) + tx(60, 110, '유효길이 KL', 'middle', 10.5) + tx(60, 126, '= ' + N(v.K * v.L, 1) + ' m', 'middle', 11, BLUE, true) + tx(290, 110, '좌굴하중', 'middle', 10.5) + tx(290, 126, N(o.pcr, 0) + ' kN', 'middle', 12, v.P < o.pcr ? GREEN : RED, true) + tx(290, 142, v.P < o.pcr ? '여유 있어요' : '좌굴 위험!', 'middle', 11, v.P < o.pcr ? GREEN : RED, true));
}
export function drawFooting(v, o) {
  const W = 360, H = 250, s = Math.min(170 / Math.max(o.side, 0.5), 1) * 80 / 1.5, bw = Math.max(40, Math.min(250, o.side * s)); const x = 180, gy0 = 118;
  return wrap(W, H, rc(40, gy0 + 20, 280, 90, 'rgba(160,120,70,.25)', 'none') + ln(40, gy0 + 20, 320, gy0 + 20, 'currentColor', 1.5) + rc(x - bw / 2, gy0 + 8, bw, 12, gy(0.6), 'currentColor', 1.6) + rc(x - 9, gy0 - 60, 18, 68, gy(0.45), 'currentColor', 1.4) + arrow(x, gy0 - 90, x, gy0 - 62, RED, 3) + tx(x + 14, gy0 - 76, 'N = ' + N(v.N, 0) + ' kN', 'start', 11, RED, true) + [-2, -1, 0, 1, 2].map((i) => arrow(x + i * (bw / 5), gy0 + 62, x + i * (bw / 5), gy0 + 24, GREEN, 1.6)).join('') + dimH(x - bw / 2, x + bw / 2, gy0 + 84, N(o.side, 2) + ' m (정사각형 한 변)') + tx(W / 2, 20, '지내력 ' + N(v.q, 0) + ' kN/㎡ → 필요 기초 면적 ' + N(o.area, 2) + ' ㎡', 'middle', 11.5, 'currentColor', true));
}
export function drawConcrete(v, o) {
  const W = 360, H = 160, trucks = Math.min(8, Math.ceil(o.vol / 6 - 1e-9)); let g = poly([[60, 90], [260, 90], [300, 60], [100, 60]], gy(0.3), 'currentColor', 1.6) + poly([[60, 90], [260, 90], [260, 90 + Math.max(4, Math.min(24, v.t / 12))], [60, 90 + Math.max(4, Math.min(24, v.t / 12))]], bl(0.35), 'currentColor', 1.4) + tx(W / 2, 20, '슬래브 ' + N(v.area, 0) + ' ㎡ × 두께 ' + N(v.t, 0) + ' mm = ' + N(o.vol, 1) + ' ㎥', 'middle', 12, 'currentColor', true);
  for (let i = 0; i < trucks; i++) g += rc(30 + i * 40, 135, 28, 14, sn(0.7), SUN, 1) + circ(36 + i * 40, 151, 3, 'currentColor') + circ(52 + i * 40, 151, 3, 'currentColor');
  return wrap(W, H + 10, g + tx(W / 2, 128, '레미콘 약 ' + Math.ceil(o.vol / 6 - 1e-9) + '대 (1대 6 ㎥ 가정)', 'middle', 11, 'currentColor', true));
}
export const ph = (title, sub) => wrap(360, 80, tx(180, 38, title, 'middle', 15, 'currentColor', true) + tx(180, 58, sub || '', 'middle', 11, 'currentColor'));
export { BLUE, RED, GREEN, SUN, LAV, bl, rd, gr, gy, sn, rc, ln, tx, poly, path, circ, arrow, dimH, dimV, N, fit, person, supports };
