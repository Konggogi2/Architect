// 개념 카드·사례 판단에 쓰는 정적 도해(SVG). 값은 모두 예시예요.
import * as D from '../draw.js';
const { wrap, rc, ln, tx, poly, path, circ, arrow, dimH, dimV, bl, rd, gr, gy, sn, BLUE, RED, GREEN, SUN, LAV, supports } = D;
const door = (x, y, w, dir = 0) => ln(x, y, x, y - w, 'currentColor', 1.5) + path(`M${x},${y - w} A${w},${w} 0 0 ${dir} ${x + w},${y}`, 'none', 'currentColor', 0.8);
const win = (x, y, w, vert) => (vert ? rc(x - 2, y, 4, w, '#fff', 'currentColor', 1) : rc(x, y - 2, w, 4, '#fff', 'currentColor', 1));

export const FIG = {
  plan: () => wrap(360, 235,
    rc(40, 30, 280, 170, 'none', 'currentColor', 4) + ln(40, 110, 130, 110, 'currentColor', 2.5) + ln(130, 30, 130, 110, 'currentColor', 2.5) + ln(130, 110, 130, 120, 'none') +
    win(160, 30, 70, false) + win(250, 30, 50, false) + win(320, 90, 60, true) + door(130, 100, 0) +
    path('M130,95 L130,75 A20,20 0 0 1 150,95 Z', 'none', 'currentColor', 0.8) +
    path('M70,110 A20,20 0 0 0 90,130', 'none', 'currentColor', 0.8) + ln(70, 110, 70, 130, 'currentColor', 1.5) + ln(70, 110, 90, 110, 'none') +
    rc(160, 150, 90, 40, bl(0.2), BLUE, 1.2) + rc(40, 155, 40, 45, gy(0.25), 'currentColor', 1) + rc(200, 34, 90, 14, rd(0.2), RED, 1) +
    tx(85, 68, '욕실', 'middle', 12, 'currentColor', true) + tx(220, 108, '방 · 거실', 'middle', 12, 'currentColor', true) + tx(205, 175, '침대', 'middle', 11) + tx(60, 182, '현관', 'middle', 11) + tx(245, 62, '주방', 'middle', 11, RED, true) + tx(160, 221, '창(이중선) · 문(문짝 궤적) · 벽(굵은 선)', 'middle', 10.5)),
  symbols: () => wrap(360, 150,
    ln(20, 40, 60, 40, 'currentColor', 4) + ln(100, 40, 140, 40, 'currentColor', 4) + ln(60, 40, 60, 12, 'currentColor', 1.5) + path('M60,12 A28,28 0 0 1 88,40', 'none', 'currentColor', 0.8) + tx(80, 70, '여닫이문', 'middle', 11, 'currentColor', true) +
    ln(160, 40, 195, 40, 'currentColor', 4) + ln(255, 40, 290, 40, 'currentColor', 4) + rc(195, 36, 60, 4, '#fff', 'currentColor', 1) + rc(195, 41, 60, 0, 'none', 'none') + ln(195, 38, 255, 38, 'currentColor', 1) + tx(225, 70, '창(이중선)', 'middle', 11, 'currentColor', true) +
    ln(300, 40, 335, 40, 'currentColor', 4) + rc(315, 33, 40, 5, 'none', 'currentColor', 1.2) + rc(315, 40, 40, 5, bl(0.2), 'currentColor', 1.2) + tx(330, 70, '미닫이', 'middle', 11, 'currentColor', true) +
    ln(20, 120, 140, 120, 'currentColor', 1) + [0, 1, 2, 3, 4, 5, 6].map((i) => ln(30 + i * 15, 100, 30 + i * 15, 120, 'currentColor', 1)).join('') + arrow(30, 135, 120, 135, BLUE, 1.5) + tx(80, 99, '계단(올라가는 방향 화살표)', 'middle', 10.5) +
    circ(210, 112, 10, gy(0.3), 'currentColor', 1.2) + tx(210, 140, '기둥', 'middle', 11, 'currentColor', true) + rc(260, 100, 40, 24, gy(0.3), 'currentColor', 1.2) + tx(280, 140, '가구', 'middle', 11, 'currentColor', true)),
  lines: () => wrap(360, 190,
    ln(20, 24, 200, 24, 'currentColor', 4) + tx(210, 28, '굵은 실선 — 절단된 벽·외곽선', 'start', 11) +
    ln(20, 54, 200, 54, 'currentColor', 1.2) + tx(210, 58, '가는 실선 — 마감선·치수선', 'start', 11) +
    ln(20, 84, 200, 84, 'currentColor', 1.4, '7 5') + tx(210, 88, '파선 — 안 보이는 부분', 'start', 11) +
    ln(20, 114, 200, 114, 'currentColor', 1.2, '14 4 3 4') + tx(210, 118, '일점쇄선 — 중심선·기준선', 'start', 11) +
    ln(20, 144, 200, 144, 'currentColor', 1.2, '14 4 3 4 3 4') + tx(210, 148, '이점쇄선 — 가상선·경계', 'start', 11) +
    tx(180, 178, '선의 굵기와 모양에 뜻이 있어요', 'middle', 11, BLUE, true)),
  section: () => wrap(400, 250, '<g transform="translate(40 0)">' +
    ln(10, 215, 350, 215, 'currentColor', 2.5) + rc(40, 200, 270, 15, gy(0.35), 'currentColor', 1.2) + rc(40, 130, 270, 12, gy(0.35), 'currentColor', 1.2) + rc(40, 60, 270, 12, gy(0.35), 'currentColor', 1.2) + poly([[30, 60], [175, 20], [320, 60]], rd(0.25), RED, 1.6) +
    ln(40, 60, 40, 200, 'currentColor', 3) + ln(310, 60, 310, 200, 'currentColor', 3) + dimV(30, 142, 200, '2,800') + dimV(30, 72, 130, '2,800') +
    ln(60, 200, 130, 142, 'currentColor', 1.2) + ln(130, 130, 200, 72, 'currentColor', 1.2) + tx(175, 105, '2층', 'middle', 12, 'currentColor', true) + tx(175, 175, '1층', 'middle', 12, 'currentColor', true) + tx(175, 12, '지붕', 'middle', 11) + tx(330, 215, 'GL', 'start', 10) +
    tx(175, 238, '단면도: 건물을 수직으로 잘라 층고·계단·지붕을 봐요', 'middle', 10.5) + '</g>'),
  elev: () => wrap(360, 220,
    rc(60, 70, 240, 120, 'none', 'currentColor', 2.5) + poly([[50, 70], [180, 25], [310, 70]], rd(0.2), RED, 1.8) + rc(85, 95, 40, 40, bl(0.15), 'currentColor', 1.4) + rc(155, 95, 40, 40, bl(0.15), 'currentColor', 1.4) + rc(235, 95, 40, 40, bl(0.15), 'currentColor', 1.4) + rc(155, 150, 40, 40, sn(0.4), 'currentColor', 1.4) + ln(20, 190, 340, 190, 'currentColor', 2.5) + tx(175, 210, '입면도: 건물 바깥면을 정면에서 본 모습(창·문·지붕)', 'middle', 10.5) + tx(335, 188, 'GL', 'end', 10)),
  human: () => wrap(360, 220,
    D.person(70, 200, 170) + ln(110, 200, 110, 200 - 210 * 0.85 * 1.0, 'currentColor', 1.5) + rc(120, 200 - 210 * 0.85, 40, 210 * 0.85, 'none', 'currentColor', 1.4) + tx(140, 200 - 210 * 0.85 - 6, '문 2,100', 'middle', 10.5, BLUE, true) +
    rc(185, 200 - 72 * 0.85 * 1.0 - 4, 70, 4, sn(0.7), 'currentColor', 1.2) + ln(190, 200, 190, 200 - 72 * 0.85, 'currentColor', 2) + ln(250, 200, 250, 200 - 72 * 0.85, 'currentColor', 2) + tx(220, 200 - 72 * 0.85 - 10, '책상 720', 'middle', 10.5, BLUE, true) +
    rc(270, 200 - 43 * 0.85, 22, 3, gr(0.8), 'currentColor', 1.2) + ln(272, 200, 272, 200 - 43 * 0.85, 'currentColor', 2) + ln(290, 200, 290, 200 - 43 * 0.85, 'currentColor', 2) + tx(281, 200 - 43 * 0.85 - 8, '의자 430', 'middle', 10.5, BLUE, true) +
    rc(305, 200 - 90 * 0.85, 40, 90 * 0.85, gy(0.3), 'currentColor', 1.4) + tx(325, 200 - 90 * 0.85 - 6, '싱크 900', 'middle', 10.5, BLUE, true) + ln(10, 200, 350, 200, 'currentColor', 2) + tx(70, 214, '사람 1,700', 'middle', 10.5, BLUE, true)),
  module: () => { let o = rc(30, 30, 300, 150, 'none', 'currentColor', 1); for (let i = 1; i < 10; i++) o += ln(30 + i * 30, 30, 30 + i * 30, 180, gy(0.5), 0.7, '3 3'); for (let j = 1; j < 5; j++) o += ln(30, 30 + j * 30, 330, 30 + j * 30, gy(0.5), 0.7, '3 3'); return wrap(360, 235, o + rc(60, 60, 120, 90, bl(0.2), BLUE, 3) + rc(180, 60, 90, 90, sn(0.25), SUN, 3) + dimH(60, 180, 52, '4모듈') + dimH(180, 270, 52, '3모듈') + tx(180, 205, '벽·문·창이 격자선에 맞으면 자재를 덜 자르고 도면도 단순해져요', 'middle', 10.5)); },
  site: () => wrap(360, 250,
    rc(0, 190, 360, 60, gy(0.3), 'none') + tx(180, 232, '도로', 'middle', 12, 'currentColor', true) + rc(50, 30, 260, 150, gy(0.08), 'currentColor', 2, 'stroke-dasharray="7 4"') + rc(100, 60, 160, 90, bl(0.25), BLUE, 2.5) + tx(180, 108, '건물', 'middle', 13, 'currentColor', true) +
    dimH(50, 100, 52, '이격') + dimV(36, 150, 180, '앞마당') + tx(320, 24, 'N↑', 'middle', 14, 'currentColor', true) + tx(180, 20, '대지(파선) 안에서 건물의 위치·방향·진입을 정해요', 'middle', 10.5) + arrow(180, 245, 180, 156, GREEN, 2) + tx(215, 170, '출입', 'start', 11, GREEN, true)),
  zoning: () => wrap(360, 220,
    circ(90, 110, 52, bl(0.22), BLUE, 2) + tx(90, 107, '공적 영역', 'middle', 12, 'currentColor', true) + tx(90, 123, '거실·현관', 'middle', 10.5) +
    circ(270, 70, 44, gr(0.25), GREEN, 2) + tx(270, 67, '사적 영역', 'middle', 12, 'currentColor', true) + tx(270, 83, '침실·서재', 'middle', 10.5) +
    circ(270, 160, 44, sn(0.35), SUN, 2) + tx(270, 157, '서비스', 'middle', 12, 'currentColor', true) + tx(270, 173, '욕실·주방', 'middle', 10.5) +
    ln(135, 95, 228, 75, 'currentColor', 1.6) + ln(135, 125, 228, 150, 'currentColor', 1.6) + tx(180, 205, '버블 다이어그램: 방끼리의 관계를 동그라미와 선으로 먼저 정리해요', 'middle', 10.5)),
  circ: () => wrap(360, 240,
    rc(30, 30, 300, 170, 'none', 'currentColor', 3) + ln(30, 110, 170, 110, 'currentColor', 2.5) + ln(170, 30, 170, 200, 'currentColor', 2.5) +
    path('M45,195 L45,150 L100,150 L100,90 L200,90 L200,60', 'none', RED, 2.5) + path('M45,195 L45,150 L100,150 L100,160 L250,160 L250,170', 'none', GREEN, 2.5) + tx(80, 195, '현관', 'middle', 11, 'currentColor', true) + tx(100, 60, '침실', 'middle', 11, 'currentColor', true) + tx(250, 60, '거실', 'middle', 11, 'currentColor', true) + tx(250, 140, '주방', 'middle', 11, 'currentColor', true) +
    tx(180, 225, '선이 꼬이거나 길수록 불편해요(빨강·초록 동선)', 'middle', 10.5)),
  loadPath: () => wrap(360, 250,
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => arrow(50 + i * 36, 18, 50 + i * 36, 56, RED, 1.6)).join('') + rc(40, 58, 280, 10, gy(0.5), 'currentColor', 1.4) + tx(335, 66, '슬래브', 'start', 10.5) +
    rc(40, 70, 280, 18, bl(0.3), BLUE, 1.6) + tx(335, 83, '보', 'start', 10.5) + rc(60, 90, 16, 100, gy(0.45), 'currentColor', 1.4) + rc(284, 90, 16, 100, gy(0.45), 'currentColor', 1.4) + tx(335, 150, '기둥', 'start', 10.5) +
    rc(40, 190, 56, 14, gy(0.6), 'currentColor', 1.4) + rc(264, 190, 56, 14, gy(0.6), 'currentColor', 1.4) + tx(335, 202, '기초', 'start', 10.5) + rc(0, 204, 360, 40, 'rgba(160,120,70,.3)', 'none') + tx(180, 232, '지반', 'middle', 11, 'currentColor', true) + arrow(68, 236, 68, 208, GREEN, 2) + arrow(292, 236, 292, 208, GREEN, 2) + tx(180, 138, '하중 → 슬래브 → 보 → 기둥 → 기초 → 지반', 'middle', 10.5, 'currentColor', true)),
  supports: () => wrap(360, 170,
    poly([[60, 50], [44, 80], [76, 80]], gy(0.4), 'currentColor', 1.6) + ln(20, 82, 100, 82, 'currentColor', 1.5) + tx(60, 105, '핀(회전 가능)', 'middle', 10.5, 'currentColor', true) + tx(60, 120, '수평·수직 반력', 'middle', 9.5) +
    poly([[180, 50], [164, 76], [196, 76]], gy(0.4), 'currentColor', 1.6) + circ(168, 80, 3.5, 'none') + circ(180, 80, 3.5, 'none') + circ(192, 80, 3.5, 'none') + ln(140, 85, 220, 85, 'currentColor', 1.5) + tx(180, 105, '롤러(좌우 이동)', 'middle', 10.5, 'currentColor', true) + tx(180, 120, '수직 반력만', 'middle', 9.5) +
    rc(280, 30, 12, 52, gy(0.5), 'currentColor', 1.6) + ln(292, 56, 340, 56, 'currentColor', 5) + tx(300, 105, '고정단(회전도 못 함)', 'middle', 10.5, 'currentColor', true) + tx(300, 120, '수직·수평·모멘트 반력', 'middle', 9.5)),
  structTypes: () => wrap(360, 180,
    rc(15, 40, 60, 80, 'none', 'currentColor', 3) + ln(15, 80, 75, 80, 'currentColor', 3) + tx(45, 140, '라멘', 'middle', 11, 'currentColor', true) + tx(45, 155, '기둥+보', 'middle', 9.5) +
    rc(100, 40, 10, 80, gy(0.5), 'currentColor', 1.4) + rc(150, 40, 10, 80, gy(0.5), 'currentColor', 1.4) + rc(98, 36, 64, 6, gy(0.7), 'currentColor', 1.4) + rc(98, 78, 64, 5, gy(0.7), 'currentColor', 1.4) + tx(130, 140, '벽식', 'middle', 11, 'currentColor', true) + tx(130, 155, '벽+바닥판', 'middle', 9.5) +
    poly([[190, 120], [250, 120], [220, 55]], 'none', 'currentColor', 2.4) + ln(205, 120, 220, 85, 'currentColor', 1.6) + ln(235, 120, 220, 85, 'currentColor', 1.6) + tx(220, 140, '트러스', 'middle', 11, 'currentColor', true) + tx(220, 155, '삼각형 뼈대', 'middle', 9.5) +
    path('M275,120 A40,70 0 0 1 345,120', 'none', 'currentColor', 3) + tx(310, 140, '아치', 'middle', 11, 'currentColor', true) + tx(310, 155, '압축으로 버팀', 'middle', 9.5)),
  rebar: () => wrap(360, 220,
    rc(110, 30, 140, 150, gy(0.25), 'currentColor', 2.5) + rc(122, 42, 116, 126, 'none', RED, 1.6) + [0, 1, 2].map((i) => circ(140 + i * 40, 155, 7, '#555', '#222', 1)).join('') + [0, 1].map((i) => circ(140 + i * 80, 55, 5, '#555', '#222', 1)).join('') +
    dimH(110, 122, 22, '') + tx(116, 14, '피복', 'middle', 10.5, RED, true) + tx(180, 205, 'RC 보 단면: 아래쪽 굵은 철근이 당기는 힘(인장)을 맡아요', 'middle', 10.5) + tx(290, 155, '인장 철근', 'start', 10.5, 'currentColor', true) + tx(290, 55, '압축부', 'start', 10.5, 'currentColor', true) + tx(290, 105, '스터럽(전단)', 'start', 10.5, RED, true)),
  proc: () => wrap(360, 170,
    ['기획', '계획·기본설계', '실시설계', '인허가', '시공', '준공'].map((t, i) => rc(10 + (i % 3) * 118, 20 + Math.floor(i / 3) * 70, 108, 40, i < 3 ? bl(0.2) : sn(0.3), 'currentColor', 1.5) + tx(64 + (i % 3) * 118, 45 + Math.floor(i / 3) * 70, t, 'middle', 11.5, 'currentColor', true)).join('') +
    arrow(118, 40, 128, 40, BLUE, 2) + arrow(236, 40, 246, 40, BLUE, 2) + arrow(300, 62, 300, 88, BLUE, 2) + arrow(246, 110, 236, 110, BLUE, 2) + arrow(128, 110, 118, 110, BLUE, 2) + tx(180, 160, '설계는 점점 구체적으로, 시공 중에는 감리가 함께해요', 'middle', 10.5)),
  sequence: () => wrap(360, 190,
    ['철거', '설비·전기', '목공', '타일·방수', '도장·도배', '바닥', '가구·조명'].map((t, i) => rc(8 + (i % 4) * 88, 18 + Math.floor(i / 4) * 66, 80, 38, i % 2 ? sn(0.3) : bl(0.2), 'currentColor', 1.4) + tx(48 + (i % 4) * 88, 41 + Math.floor(i / 4) * 66, t, 'middle', 11, 'currentColor', true) + tx(14 + (i % 4) * 88, 14 + Math.floor(i / 4) * 66, String(i + 1), 'start', 10, RED, true)).join('') +
    tx(180, 165, '큰 먼지·물·소음 작업 → 마감 → 가구 순서가 일반적이에요', 'middle', 10.5)),
  seasonSun: () => wrap(360, 220,
    rc(60, 80, 160, 110, 'none', 'currentColor', 2.5) + ln(40, 190, 340, 190, 'currentColor', 2.5) + poly([[50, 80], [140, 40], [230, 80]], rd(0.15), RED, 1.6) + rc(220, 76, 70, 5, gy(0.7), 'currentColor', 1.2) + rc(216, 110, 6, 55, sn(0.8), SUN, 1) +
    ln(335, 20, 296, 76, SUN, 2.5, '5 3') + tx(340, 14, '여름(높은 해)', 'end', 10.5, SUN, true) + ln(345, 100, 224, 152, RED, 2.5) + tx(345, 94, '겨울(낮은 해)', 'end', 10.5, RED, true) + tx(150, 212, '남쪽 처마가 여름 햇빛은 막고 겨울 햇빛은 들여요', 'middle', 10.5) + tx(120, 140, '실내', 'middle', 11)),
  colorWheel: () => { let o = ''; for (let i = 0; i < 12; i++) { const a0 = ((i * 30 - 90) * Math.PI) / 180, a1 = (((i + 1) * 30 - 90) * Math.PI) / 180, R = 80, r0 = 40, cx = 180, cy = 105; o += `<path d="M${cx + r0 * Math.cos(a0)},${cy + r0 * Math.sin(a0)} L${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 0 1 ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} L${cx + r0 * Math.cos(a1)},${cy + r0 * Math.sin(a1)} A${r0},${r0} 0 0 0 ${cx + r0 * Math.cos(a0)},${cy + r0 * Math.sin(a0)} Z" style="fill:${D.hsl(i * 30, 70, 55)};stroke:#fff;stroke-width:1"/>`; } return wrap(360, 215, o + ln(180, 25, 180, 185, 'currentColor', 1, '3 3') + tx(180, 207, '마주 보는 색(보색)은 대비가 커요', 'middle', 11, 'currentColor', true)); },
  fire: () => wrap(360, 220,
    rc(30, 30, 300, 130, 'none', 'currentColor', 3) + ln(30, 95, 180, 95, 'currentColor', 2) + ln(180, 30, 180, 160, 'currentColor', 2) + rc(18, 120, 14, 28, gr(0.6), GREEN, 1.4) + rc(328, 40, 14, 28, gr(0.6), GREEN, 1.4) + tx(24, 172, '출구 A', 'middle', 10.5, GREEN, true) + tx(335, 82, '출구 B', 'middle', 10.5, GREEN, true) + circ(250, 120, 12, rd(0.6), RED, 1.5) + tx(250, 150, '화원', 'middle', 10.5, RED, true) + path('M80,60 L40,60 L24,134', 'none', GREEN, 2.5) + path('M80,60 L170,60 L240,60', 'none', 'rgba(130,140,170,.7)', 2, ) + tx(180, 200, '피난 경로는 서로 반대 방향 두 곳 이상이면 안전해요', 'middle', 10.5)),
  kitchenTypes: () => wrap(360, 170,
    rc(10, 30, 70, 14, bl(0.3), BLUE, 1.4) + tx(45, 70, '일자', 'middle', 11, 'currentColor', true) + path('M110,30 L170,30 L170,90 L156,90 L156,44 L110,44 Z', bl(0.3), BLUE, 1.4) + tx(140, 112, 'ㄱ자', 'middle', 11, 'currentColor', true) +
    path('M200,30 L260,30 L260,100 L200,100 L200,86 L246,86 L246,44 L200,44 Z', bl(0.3), BLUE, 1.4) + tx(230, 120, 'ㄷ자', 'middle', 11, 'currentColor', true) + rc(290, 30, 60, 14, bl(0.3), BLUE, 1.4) + rc(290, 74, 60, 14, bl(0.3), BLUE, 1.4) + tx(320, 112, '병렬(11자)', 'middle', 11, 'currentColor', true) + tx(180, 155, '주방 배치 유형', 'middle', 10.5)),
};
