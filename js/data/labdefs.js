// 계산·도면 실습의 틀(시뮬레이터) 공장. 유닛별로 제목·목표·과제만 바꿔 쓴다. draw(vals, outs)는 SVG 도면을 돌려준다.
import * as A from '../arch.js';
import * as D from '../draw.js';

const I = (k, label, min, max, step, value, fmt) => ({ k, label, min, max, step, value, fmt });
const SEL = (k, label, options, value) => ({ k, label, kind: 'select', options, value });
const O = (k, label, fn, fmt, big) => ({ k, label, fn, fmt, big });
const withSet = (inputs, set) => inputs.map((i) => (set && set[i.k] ? { ...i, ...set[i.k] } : i));
const make = (base, o) => ({ type: 'calc', title: o.title, badge: o.badge, goal: o.goal, after: o.after, note: o.note || base.note, toolTitle: base.toolTitle, tbl: o.tbl, tblTitle: o.tblTitle, inputs: withSet(base.inputs, o.set), outputs: base.outputs, draw: base.draw, tasks: o.tasks || [] });

// 면적(㎡ · 평)
const area = { toolTitle: '방 면적 계산기', note: '1평 = 약 3.3058㎡ (400/121). 면적 = 가로 × 세로예요.',
  inputs: [I('w', '가로', 2, 12, 0.5, 4, 'm1'), I('d', '세로', 2, 12, 0.5, 3, 'm1')],
  outputs: [O('area', '면적', (v) => v.w * v.d, 'm2', true), O('py', '평수', (v) => A.toPy(v.w * v.d), 'py'), O('per', '둘레(벽 길이)', (v) => 2 * (v.w + v.d), 'm1')], draw: (v) => D.drawPlan(v) };
export const areaLab = (o) => make(area, o);

// 축척
const scale = { toolTitle: '축척 계산기', note: '실제 길이 = 도면상 길이 × 축척의 분모예요. 1:100이면 도면 1mm = 실제 100mm = 10cm.',
  inputs: [SEL('sc', '축척', [['50', '1 : 50'], ['100', '1 : 100'], ['200', '1 : 200']], '100'), I('L', '도면에서 잰 길이', 5, 120, 5, 40, 'mm')],
  outputs: [O('real', '실제 길이', (v) => A.realLen(v.L, Number(v.sc)), 'm', true), O('one', '실제 1 m는 도면에서', (v) => A.drawLen(1, Number(v.sc)), 'mm1'), O('big', '도면 A3(420mm)에 담기는 실제 길이', (v) => A.realLen(420, Number(v.sc)), 'm1')], draw: (v) => D.drawScale(v) };
export const scaleLab = (o) => make(scale, o);

// 방의 면적·부피
const room = { toolTitle: '방 크기 계산기', note: '부피는 환기·냉난방을 생각할 때 중요해요. 거실의 천장 높이는 법적으로 2.1m 이상이에요.',
  inputs: [I('w', '가로', 2, 10, 0.5, 4, 'm1'), I('d', '세로', 2, 10, 0.5, 3.5, 'm1'), I('h', '천장 높이', 2.1, 3.5, 0.1, 2.4, 'm1')],
  outputs: [O('area', '바닥 면적', (v) => v.w * v.d, 'm2', true), O('vol', '공기의 부피', (v) => v.w * v.d * v.h, 'm3'), O('py', '평수', (v) => A.toPy(v.w * v.d), 'py')], draw: (v) => D.drawPlan(v) };
export const roomLab = (o) => make(room, o);

// 천장 높이
const height = { toolTitle: '천장고 계산기', note: '바닥 마감과 천장 마감이 두꺼워질수록 실제 천장 높이는 낮아져요.',
  inputs: [I('fh', '층고(바닥~위층 바닥)', 2400, 3600, 100, 2800, 'mm'), I('slab', '슬래브 두께', 150, 300, 10, 210, 'mm'), I('fin', '바닥 마감 두께', 50, 150, 10, 100, 'mm'), I('drop', '천장 내림(설비·조명 등)', 0, 300, 10, 0, 'mm')],
  outputs: [O('ch', '실제 천장 높이', (v) => A.ceilingHeight(v.fh, v.slab, v.fin, v.drop), 'mm', true), O('m', '미터로', (v) => A.ceilingHeight(v.fh, v.slab, v.fin, v.drop) / 1000, 'm'), O('margin', '법정 최소(2.1m)와의 여유', (v) => A.ceilingHeight(v.fh, v.slab, v.fin, v.drop) - 2100, 'mm')], draw: (v) => D.drawHeight(v) };
export const heightLab = (o) => make(height, o);

// 전용·공급면적
const supply = { toolTitle: '공급면적 계산기', note: '공급면적 = 전용면적 + 공용면적(복도·계단·엘리베이터 등)이에요. 전용률 = 전용 ÷ 공급.',
  inputs: [I('net', '전용면적', 30, 150, 1, 84, 'm2'), I('r', '전용률', 60, 90, 1, 75, 'pct0n')],
  outputs: [O('sup', '공급면적', (v) => A.supplyArea(v.net, v.r / 100), 'm2', true), O('com', '공용면적', (v) => A.supplyArea(v.net, v.r / 100) - v.net, 'm2'), O('py', '공급면적(평)', (v) => A.toPy(A.supplyArea(v.net, v.r / 100)), 'py')], draw: (v) => D.drawSupply({ net: v.net, ratio: v.r / 100 }) };
export const supplyLab = (o) => make(supply, o);

// 건폐율·용적률
const cov = { toolTitle: '건폐율·용적률 계산기', note: '건폐율 상한은 지역마다 조례로 달라요. 여기 숫자는 연습용 가정이에요. 건축면적은 건물을 위에서 본 면적이에요.',
  inputs: [I('sw', '대지 가로', 10, 40, 1, 20, 'm1'), I('sd', '대지 세로', 10, 40, 1, 20, 'm1'), I('bw', '건물 가로', 5, 35, 1, 12, 'm1'), I('bd', '건물 세로', 5, 35, 1, 10, 'm1'), I('fl', '지상 층수', 1, 6, 1, 3, 'int'), I('cap', '건폐율 상한(가정)', 40, 70, 5, 60, 'pct0n')],
  outputs: [O('bcr', '건폐율', (v) => A.bcr(Math.min(v.bw, v.sw) * Math.min(v.bd, v.sd), v.sw * v.sd), 'pct1', true), O('far', '용적률', (v) => A.far(Math.min(v.bw, v.sw) * Math.min(v.bd, v.sd) * v.fl, v.sw * v.sd), 'pct0'), O('gfa', '연면적', (v) => Math.min(v.bw, v.sw) * Math.min(v.bd, v.sd) * v.fl, 'm2'), O('room', '건폐율 여유(상한−현재)', (v, o) => v.cap / 100 - o.bcr, 'pct1')], draw: (v) => D.drawSite({ sw: v.sw, sd: v.sd, bw: v.bw, bd: v.bd, cap: v.cap / 100 }) };
export const covLab = (o) => make(cov, o);

// 정북 일조 이격
const sun = { toolTitle: '일조 이격 계산기', note: '전용·일반주거지역의 정북 방향 일조 규정을 단순화했어요: 높이 9m 이하는 1.5m 이상, 9m를 넘는 부분은 높이의 1/2 이상 띄워요. 실제 적용은 법규를 확인하세요.',
  inputs: [I('h', '건물 높이', 3, 30, 1, 12, 'm1'), I('s', '북쪽 경계에서 띄운 거리', 0, 15, 0.5, 3, 'm1')],
  outputs: [O('need', '필요한 최소 이격', (v) => A.northSetback(v.h), 'm1', true), O('gap', '여유(띄운 거리−필요)', (v) => v.s - A.northSetback(v.h), 'm1'), O('ok', '기준 충족(1=예, 0=아니오)', (v) => (v.s >= A.northSetback(v.h) - 1e-9 ? 1 : 0), 'int')], draw: (v) => D.drawSun(v) };
export const sunLab = (o) => make(sun, o);

// 계단
const stair = { toolTitle: '계단 계산기', note: '편안한 계단은 2R + T ≈ 600~650mm(R 챌판 높이, T 디딤판 너비)예요. 여기서는 630mm로 계산해요.',
  inputs: [I('H', '오를 높이(층고)', 2400, 3600, 100, 2800, 'mm'), I('R', '원하는 챌판 높이', 150, 200, 5, 170, 'mm')],
  outputs: [O('n', '챌판(오르는 단) 수', (v) => A.stairCount(v.H, v.R), 'ea'), O('R', '실제 챌판 높이', (v) => A.stairRiser(v.H, A.stairCount(v.H, v.R)), 'mm1'), O('T', '디딤판 너비(2R+T=630)', (v) => A.stairTread(A.stairRiser(v.H, A.stairCount(v.H, v.R))), 'mm1'), O('run', '계단의 수평 길이', (v) => ((A.stairCount(v.H, v.R) - 1) * A.stairTread(A.stairRiser(v.H, A.stairCount(v.H, v.R)))) / 1000, 'm', true)],
  draw: (v) => { const n = A.stairCount(v.H, v.R), R = A.stairRiser(v.H, n); return D.drawStair({ n, R, T: A.stairTread(R) }); } };
export const stairLab = (o) => make(stair, o);

// 경사로
const ramp = { toolTitle: '경사로 계산기', note: '휠체어 이용 경사로는 기울기 1/12 이하(완만할수록 좋아요)가 일반적인 기준이에요.',
  inputs: [I('H', '오를 높이', 0.1, 0.75, 0.05, 0.3, 'm'), I('d', '기울기의 분모(1/○)', 8, 20, 1, 12, 'int')],
  outputs: [O('L', '필요한 경사로 길이', (v) => A.rampLength(v.H, v.d), 'm', true), O('ang', '경사각', (v) => A.rampAngle(v.d), 'deg'), O('pc', '기울기(%)', (v) => 100 / v.d, 'n1pct')], draw: (v) => D.drawRamp(v) };
export const rampLab = (o) => make(ramp, o);

// 주차
const park = { toolTitle: '주차장 계산기', note: '직각주차 한 칸을 2.5×5.0m, 통로를 6.0m로 가정했어요. 실제 기준은 주차장법령과 조례를 확인하세요.',
  inputs: [I('W', '주차장 가로', 10, 60, 1, 25, 'm1'), I('D', '주차장 세로', 5, 40, 1, 17, 'm1')],
  outputs: [O('per', '한 줄에 들어가는 대수', (v) => A.stallsPerRow(v.W, 2.5), 'ea'), O('rows', '주차 줄 수', (v) => A.parkRows(v.D, 5, 6), 'ea'), O('tot', '전체 주차 대수', (v) => A.stallsPerRow(v.W, 2.5) * A.parkRows(v.D, 5, 6), 'ea', true), O('apc', '한 대당 면적', (v, o) => (o.tot ? (v.W * v.D) / o.tot : 0), 'm2')], draw: (v) => D.drawParking(v) };
export const parkLab = (o) => make(park, o);

// 비례·황금비
const golden = { toolTitle: '비례 계산기', note: '황금비는 1 : 1.618이에요. A4 용지처럼 √2(≈1.414) 비례도 자주 쓰여요.',
  inputs: [I('w', '가로 길이', 100, 2000, 100, 1000, 'mm'), SEL('r', '가로 : 세로 비', [['1.618', '황금비 1.618'], ['1.414', 'A 규격 √2 ≈ 1.414'], ['1.5', '3 : 2'], ['1.333', '4 : 3'], ['1', '정사각형']], '1.618')],
  outputs: [O('h', '세로 길이', (v) => A.heightFromRatio(v.w, Number(v.r)), 'mm', true), O('a', '면적', (v) => (v.w * A.heightFromRatio(v.w, Number(v.r))) / 1e6, 'm2b'), O('sq', '가로에서 정사각형을 뺀 나머지 폭', (v) => v.w - A.heightFromRatio(v.w, Number(v.r)), 'mm')], draw: (v) => D.drawGolden({ w: v.w, r: Number(v.r) }) };
export const goldenLab = (o) => make(golden, o);

// 색채 60-30-10
const color = { toolTitle: '색 배분 계산기', note: '주조색 60% · 보조색 30% · 강조색 10%는 실내 색을 정할 때 자주 쓰는 어림 비율이에요.',
  inputs: [I('hue', '색상(각도)', 0, 350, 10, 30, 'deg0'), I('sat', '채도', 0, 100, 5, 30, 'pct0n'), I('lit', '명도', 20, 95, 5, 70, 'pct0n'), I('wall', '칠할 벽 전체 면적', 10, 80, 5, 40, 'm2')],
  outputs: [O('a60', '주조색 면적(60%)', (v) => v.wall * 0.6, 'm2', true), O('a30', '보조색 면적(30%)', (v) => v.wall * 0.3, 'm2'), O('a10', '강조색 면적(10%)', (v) => v.wall * 0.1, 'm2')], draw: (v) => D.drawColor(v) };
export const colorLab = (o) => make(color, o);

// 채광
const daylight = { toolTitle: '채광 계산기', note: '거실의 채광을 위한 창 면적은 바닥 면적의 1/10 이상이 일반 기준이에요(용도·법규에 따라 다를 수 있어요).',
  inputs: [I('w', '방 가로', 2, 8, 0.5, 4, 'm1'), I('d', '방 세로', 2, 8, 0.5, 4, 'm1'), I('ww', '창 폭', 0.5, 4, 0.1, 1.6, 'm1'), I('wh', '창 높이', 0.5, 2.5, 0.1, 1.2, 'm1')],
  outputs: [O('ratio', '창 면적 ÷ 바닥 면적', (v) => A.daylightRatio(v.ww * v.wh, v.w * v.d), 'pct1', true), O('need', '필요한 최소 창 면적(1/10)', (v) => (v.w * v.d) / 10, 'm2b'), O('gap', '여유(현재 창 면적−필요)', (v) => v.ww * v.wh - (v.w * v.d) / 10, 'm2b')], draw: (v) => D.drawDaylight(v) };
export const daylightLab = (o) => make(daylight, o);

// 조명
const light = { toolTitle: '조명 수량 계산기', note: '광속법: 등기구 수 N = (목표 조도 E × 면적 A) ÷ (등기구 1개 광속 F × 조명률 U × 보수율 M).',
  inputs: [I('E', '목표 조도', 100, 750, 50, 300, 'lx'), I('A', '바닥 면적', 5, 60, 1, 20, 'm2'), I('F', '등기구 1개 광속', 500, 4000, 100, 2000, 'lm'), I('U', '조명률(빛이 작업면에 닿는 비율)', 0.4, 0.8, 0.05, 0.5, 'n2'), I('M', '보수율(먼지·노후 감안)', 0.6, 0.9, 0.05, 0.8, 'n2')],
  outputs: [O('n', '필요한 등기구 수(소수)', (v) => A.lampCount(v.E, v.A, v.F, v.U, v.M), 'n1', true), O('ceil', '올림한 개수', (v) => Math.ceil(A.lampCount(v.E, v.A, v.F, v.U, v.M) - 1e-9), 'ea')], draw: (v, o) => D.drawLight(v, o) };
export const lightLab = (o) => make(light, o);

// 환기
const vent = { toolTitle: '환기 계산기', note: '환기 창은 바닥 면적의 1/20 이상이 일반 기준이에요. 환기량(㎥/h) = 실 부피 × 시간당 환기 횟수.',
  inputs: [I('vol', '실 부피', 20, 200, 5, 50, 'm3'), I('ach', '시간당 환기 횟수', 0.5, 6, 0.5, 2, 'n1'), I('fl', '바닥 면적', 5, 60, 1, 20, 'm2')],
  outputs: [O('q', '필요한 환기량', (v) => A.airflow(v.vol, v.ach), 'm3h', true), O('win', '환기 창 최소 면적(1/20)', (v) => v.fl / 20, 'm2b'), O('per', '1시간에 공기가 바뀌는 비율', (v) => v.ach, 'n1x')], draw: (v) => D.drawVent(v) };
export const ventLab = (o) => make(vent, o);

// 단열
const heat = { toolTitle: '열손실 계산기', note: 'Q = U × A × ΔT. U(열관류율)가 낮을수록 열이 덜 새요. 단위는 U[W/㎡·K], A[㎡], ΔT[K].',
  inputs: [I('U', '열관류율 U', 0.1, 3, 0.1, 1, 'n1'), I('A', '벽·창 면적', 5, 60, 1, 20, 'm2'), I('dT', '실내외 온도차', 5, 40, 1, 20, 'k')],
  outputs: [O('q', '열손실', (v) => A.heatLoss(v.U, v.A, v.dT), 'w', true), O('kwh', '하루 열손실량', (v) => (A.heatLoss(v.U, v.A, v.dT) * 24) / 1000, 'kwh')], draw: (v) => D.drawHeat(v) };
export const heatLab = (o) => make(heat, o);

// 가구 배치
const furn = { toolTitle: '침대 배치 계산기', note: '침대 옆 통로는 최소 0.6m 이상이 일반적인 권장이에요. 침대 머리를 한쪽 벽 중앙에 붙였다고 가정해요.',
  inputs: [I('w', '방 가로', 2, 6, 0.1, 3.2, 'm1'), I('d', '방 세로', 2, 6, 0.1, 3.6, 'm1'), I('bw', '침대 폭', 0.9, 2, 0.1, 1.5, 'm1'), I('bl', '침대 길이', 1.9, 2.2, 0.1, 2, 'm1')],
  outputs: [O('side', '침대 양옆 통로 폭', (v) => A.clearance(v.w, v.bw), 'm', true), O('foot', '침대 발치 여유', (v) => v.d - v.bl, 'm'), O('free', '침대를 뺀 남는 바닥 면적', (v) => v.w * v.d - v.bw * v.bl, 'm2')], draw: (v) => D.drawFurn(v) };
export const furnLab = (o) => make(furn, o);

// 주방 작업삼각형
const kit = { toolTitle: '작업삼각형 계산기', note: '싱크·레인지·냉장고 세 지점을 잇는 삼각형의 세 변 합은 일반적으로 4~7m 정도가 편하다고 해요(설계 가이드).',
  inputs: [I('a', '싱크~레인지', 1, 3, 0.1, 1.8, 'm1'), I('b', '레인지~냉장고', 1, 3, 0.1, 1.6, 'm1'), I('c', '냉장고~싱크', 1, 3, 0.1, 1.9, 'm1')],
  outputs: [O('sum', '세 변의 합', (v) => A.triangleSum(v.a, v.b, v.c), 'm1', true), O('avg', '한 변 평균', (v) => A.triangleSum(v.a, v.b, v.c) / 3, 'm')], draw: (v) => D.drawKitchen(v) };
export const kitLab = (o) => make(kit, o);

// 도배·페인트
const mat = { toolTitle: '벽 마감 물량 계산기', note: '벽면적 = 둘레 × 높이 − 문·창 면적. 자투리·손실(로스)을 더해 사요. 도배지 1롤 면적, 페인트 도포 면적은 제품마다 달라요(가정값).',
  inputs: [I('w', '방 가로', 2, 8, 0.5, 3.5, 'm1'), I('d', '방 세로', 2, 8, 0.5, 3, 'm1'), I('h', '벽 높이', 2.2, 3, 0.1, 2.4, 'm1'), I('open', '문·창 면적', 0, 10, 0.5, 3, 'm2'), I('cover', '도배지 1롤 면적', 5, 20, 0.5, 16.5, 'm2'), I('loss', '로스(여유)', 0, 20, 5, 10, 'pct0n'), I('coats', '페인트 칠하는 횟수', 1, 3, 1, 2, 'int'), I('pc', '페인트 1L당 칠하는 면적', 5, 15, 1, 10, 'm2')],
  outputs: [O('wall', '벽면적', (v) => A.wallArea(v.w, v.d, v.h, v.open), 'm2', true), O('rolls', '필요한 도배지', (v) => A.rollsNeeded(A.wallArea(v.w, v.d, v.h, v.open), v.loss / 100, v.cover), 'roll'), O('paint', '필요한 페인트(손실 제외)', (v) => A.paintLiters(A.wallArea(v.w, v.d, v.h, v.open), v.coats, v.pc), 'l')], draw: (v, o) => D.drawWalls(v, o) };
export const matLab = (o) => make(mat, o);

// 마루 물량
const floor = { toolTitle: '바닥재 물량 계산기', note: '바닥재도 자르고 맞추는 손실이 생겨요. 박스 단위로 올려서 사요.',
  inputs: [I('w', '방 가로', 2, 10, 0.5, 4, 'm1'), I('d', '방 세로', 2, 10, 0.5, 3.5, 'm1'), I('loss', '로스(여유)', 0, 20, 5, 10, 'pct0n'), I('box', '1박스 시공 면적', 1.5, 3.5, 0.1, 2.2, 'm2b'), I('price', '1박스 가격', 20000, 60000, 5000, 35000, 'won')],
  outputs: [O('area', '시공 면적', (v) => v.w * v.d, 'm2'), O('boxes', '필요한 박스', (v) => A.boxCount(v.w * v.d, v.loss / 100, v.box), 'box', true), O('cost', '자재비', (v) => A.boxCount(v.w * v.d, v.loss / 100, v.box) * v.price, 'won')], draw: (v) => D.drawPlanks(v) };
export const floorLab = (o) => make(floor, o);

// 타일
const tile = { toolTitle: '타일 수량 계산기', note: '타일 수 = 면적 ×(1+로스) ÷ 타일 1장 면적(줄눈은 무시한 어림).',
  inputs: [I('w', '바닥 가로', 1, 6, 0.5, 2.5, 'm1'), I('d', '바닥 세로', 1, 6, 0.5, 2, 'm1'), I('tw', '타일 가로', 100, 600, 50, 300, 'mm'), I('th', '타일 세로', 100, 1200, 50, 600, 'mm'), I('loss', '로스(여유)', 0, 20, 5, 10, 'pct0n')],
  outputs: [O('area', '시공 면적', (v) => v.w * v.d, 'm2'), O('n', '필요한 타일 수', (v) => A.tileCount(v.w * v.d, v.tw, v.th, v.loss / 100), 'ea', true)], draw: (v) => D.drawTiles(v) };
export const tileLab = (o) => make(tile, o);

// 인테리어 예산
const ibud = { toolTitle: '인테리어 예산 계산기', note: '단가는 가상의 예시예요. 실제 견적은 업체·자재·지역에 따라 크게 달라요. 예비비는 예상 밖 공사를 위한 여유예요.',
  inputs: [I('py', '시공 면적', 10, 60, 1, 25, 'py0'), I('u', '평당 공사 단가', 1e6, 6e6, 1e5, 3e6, 'won2'), I('c', '예비비율', 0, 20, 5, 10, 'pct0n'), I('f', '가구·가전 별도 예산', 0, 5e7, 5e6, 1e7, 'won2')],
  outputs: [O('cons', '공사비', (v) => v.py * v.u, 'won2'), O('cont', '예비비', (v) => v.py * v.u * (v.c / 100), 'won2'), O('tot', '총 예산', (v) => v.py * v.u * (1 + v.c / 100) + v.f, 'won2', true)], draw: (v) => D.drawBudget([{ l: '공사비', v: v.py * v.u }, { l: '예비비', v: v.py * v.u * (v.c / 100) }, { l: '가구·가전', v: v.f }]) };
export const ibudLab = (o) => make(ibud, o);

// 하중
const load = { toolTitle: '바닥 하중 계산기', note: '고정하중 D(자중·마감)와 활하중 L(사람·가구)을 구해 설계용 계수하중 1.2D + 1.6L로 합쳐요. 활하중 값은 용도별 기준(예: 주거 약 2.0 kN/㎡)을 확인하세요.',
  inputs: [I('t', '슬래브 두께', 100, 300, 10, 150, 'mm'), I('fin', '마감 하중', 0.5, 3, 0.5, 1.5, 'kpa'), I('L', '활하중', 1, 5, 0.5, 2, 'kpa'), I('area', '바닥 면적', 10, 100, 5, 20, 'm2')],
  outputs: [O('self', '슬래브 자중(24 kN/㎥ × 두께)', (v) => A.slabSelfWeight(v.t), 'kpa'), O('D', '고정하중 D', (v) => A.slabSelfWeight(v.t) + v.fin, 'kpa'), O('fac', '계수하중 1.2D+1.6L', (v) => A.factoredLoad(A.slabSelfWeight(v.t) + v.fin, v.L), 'kpa', true), O('tot', '바닥 전체의 계수하중', (v) => A.factoredLoad(A.slabSelfWeight(v.t) + v.fin, v.L) * v.area, 'kn0')], draw: (v, o) => D.drawLoad({ D: o.D, L: v.L }) };
export const loadLab = (o) => make(load, o);

// 모멘트
const lever = { toolTitle: '모멘트(시소) 계산기', note: '모멘트 = 힘 × 거리. 받침점을 기준으로 왼쪽·오른쪽 모멘트가 같으면 균형이에요.',
  inputs: [I('F1', '왼쪽 힘', 1, 20, 1, 10, 'kn0'), I('d1', '왼쪽 거리', 0.5, 5, 0.5, 2, 'm1'), I('F2', '오른쪽 힘', 1, 20, 1, 5, 'kn0'), I('d2', '오른쪽 거리', 0.5, 5, 0.5, 4, 'm1')],
  outputs: [O('m1', '왼쪽 모멘트', (v) => A.moment(v.F1, v.d1), 'knm'), O('m2', '오른쪽 모멘트', (v) => A.moment(v.F2, v.d2), 'knm'), O('diff', '차이(오른쪽−왼쪽)', (v) => A.moment(v.F2, v.d2) - A.moment(v.F1, v.d1), 'knm', true)], draw: (v) => D.drawLever(v) };
export const leverLab = (o) => make(lever, o);

// 지점 반력
const react = { toolTitle: '보의 반력 계산기', note: '단순보에 집중하중 P가 왼쪽에서 a만큼 떨어져 있을 때: RA = P(L−a)/L, RB = P·a/L.',
  inputs: [I('L', '보의 길이', 6, 10, 0.5, 6, 'm1'), I('P', '하중 P', 5, 100, 5, 40, 'kn0'), I('a', '하중 위치(왼쪽에서)', 0.5, 5.5, 0.5, 3, 'm1')],
  outputs: [O('ra', '왼쪽 반력 RA', (v) => A.reactionPoint(v.P, v.L, v.a).ra, 'kn', true), O('rb', '오른쪽 반력 RB', (v) => A.reactionPoint(v.P, v.L, v.a).rb, 'kn'), O('m', '최대 휨모멘트(하중 위치)', (v) => A.momentPoint(v.P, v.L, v.a), 'knm')], draw: (v, o) => D.drawReaction(v, o) };
export const reactLab = (o) => make(react, o);

// 등분포 하중 보
const beam = { toolTitle: '단순보 계산기', note: '등분포하중 w를 받는 단순보: 반력 R = wL/2, 최대 휨모멘트 M = wL²/8(가운데). 길이가 두 배면 모멘트는 네 배예요.',
  inputs: [I('w', '등분포하중 w', 5, 50, 1, 10, 'knm1'), I('L', '지간(보의 길이)', 2, 10, 0.5, 5, 'm1')],
  outputs: [O('r', '받침 반력 R', (v) => A.beamUdl(v.w, v.L).r, 'kn'), O('v', '최대 전단력 V', (v) => A.beamUdl(v.w, v.L).v, 'kn'), O('m', '최대 휨모멘트 M', (v) => A.beamUdl(v.w, v.L).m, 'knm', true)], draw: (v, o) => D.drawBeam(v, o) };
export const beamLab = (o) => make(beam, o);

// 단면 성질
const sec = { toolTitle: '단면 성질 계산기', note: '단면2차모멘트 I = b·h³/12, 단면계수 S = b·h²/6. 높이 h가 휨 강도에 가장 크게 영향을 줘요.',
  inputs: [I('b', '폭 b', 100, 400, 50, 200, 'mm'), I('h', '높이 h', 100, 800, 50, 400, 'mm')],
  outputs: [O('A', '단면적', (v) => A.secArea(v.b, v.h) / 100, 'cm2'), O('I', '단면2차모멘트 I', (v) => A.secI(v.b, v.h) / 1e4, 'cm4', true), O('S', '단면계수 S', (v) => A.secS(v.b, v.h) / 1e3, 'cm3')], draw: (v) => D.drawSection(v) };
export const secLab = (o) => make(sec, o);

// 처짐
const defl = { toolTitle: '보의 처짐 계산기', note: '등분포하중 단순보의 처짐 δ = 5wL⁴ / (384EI). 재료의 E(탄성계수)와 단면의 I가 클수록 덜 처져요. 균열 등은 무시한 단순 계산이에요.',
  inputs: [I('w', '등분포하중 w', 2, 20, 1, 8, 'knm1'), I('L', '지간 L', 2, 8, 0.5, 4, 'm1'), SEL('E', '재료', [['25000', '콘크리트 E≈25,000 MPa'], ['210000', '강재 E=210,000 MPa'], ['10000', '목재 E≈10,000 MPa']], '25000'), I('b', '폭 b', 100, 400, 50, 200, 'mm'), I('h', '높이 h', 150, 600, 50, 300, 'mm')],
  outputs: [O('d', '중앙 처짐 δ', (v) => A.deflUdl(v.w, v.L, Number(v.E), A.secI(v.b, v.h)), 'mm2', true), O('lim', '처짐 한도(L/360)', (v) => (v.L * 1000) / 360, 'mm1'), O('ratio', '한도 대비', (v, o) => o.d / ((v.L * 1000) / 360), 'x')], draw: (v, o) => D.drawDeflect(v, o) };
export const deflLab = (o) => make(defl, o);

// 응력·변형
const strs = { toolTitle: '응력 계산기', note: '응력 σ = P/A (MPa = N/mm²). 변형률 ε = σ/E, 늘어난 길이 ΔL = ε × L.',
  inputs: [I('P', '인장력 P', 10, 500, 10, 100, 'kn0'), I('Am', '단면적 A', 500, 10000, 500, 2000, 'mm2u'), SEL('E', '재료', [['210000', '강재 210,000 MPa'], ['25000', '콘크리트 25,000 MPa'], ['10000', '목재 10,000 MPa']], '210000'), I('Lm', '부재 길이', 1, 10, 1, 3, 'm1')],
  outputs: [O('s', '응력 σ', (v) => A.stress(v.P, v.Am), 'mpa', true), O('eps', '변형률 ε', (v) => (A.stress(v.P, v.Am) / Number(v.E)) * 100, 'pct3'), O('dl', '늘어난 길이 ΔL', (v) => (A.stress(v.P, v.Am) / Number(v.E)) * v.Lm * 1000, 'mm2')], draw: (v, o) => D.drawStress({ P: v.P, A: v.Am }, o) };
export const strsLab = (o) => make(strs, o);

// 기둥 좌굴
const col = { toolTitle: '기둥 좌굴 계산기', note: '오일러 좌굴하중 Pcr = π²EI / (KL)². 가늘고 길수록, 양 끝이 덜 잡혀 있을수록(K가 클수록) 좌굴하중이 작아져요.',
  inputs: [SEL('E', '재료', [['210000', '강재 210,000 MPa'], ['25000', '콘크리트 25,000 MPa'], ['10000', '목재 10,000 MPa']], '210000'), I('b', '정사각 단면 한 변', 50, 400, 10, 100, 'mm'), I('L', '기둥 길이', 2, 6, 0.5, 3, 'm1'), SEL('K', '양 끝 조건', [['1', '양단 핀 (K=1.0)'], ['0.5', '양단 고정 (K=0.5)'], ['0.7', '일단 고정·타단 핀 (K=0.7)'], ['2', '일단 고정·타단 자유 (K=2.0)']], '1'), I('P', '실제 작용하는 하중', 10, 1000, 10, 100, 'kn0')],
  outputs: [O('pcr', '좌굴하중 Pcr', (v) => A.eulerLoad(Number(v.E), A.secI(v.b, v.b), Number(v.K), v.L), 'kn0', true), O('lam', '세장비 KL/r', (v) => (Number(v.K) * v.L * 1000) / A.radiusGyration(A.secI(v.b, v.b), A.secArea(v.b, v.b)), 'n0'), O('mg', '여유(Pcr÷P)', (v, o) => o.pcr / v.P, 'x')], draw: (v, o) => D.drawColumn(v, o) };
export const colLab = (o) => make(col, o);

// 기초
const foot = { toolTitle: '기초 면적 계산기', note: '필요한 기초 면적 = 기둥 하중 ÷ 지반의 허용 지지력(지내력). 지내력은 지반조사로 확인하며, 여기 값은 연습용이에요.',
  inputs: [I('N', '기둥이 전하는 하중', 100, 3000, 100, 800, 'kn0'), I('q', '지반 허용 지지력(지내력)', 50, 400, 10, 150, 'kpa0')],
  outputs: [O('area', '필요한 기초 면적', (v) => A.footingArea(v.N, v.q), 'm2b'), O('side', '정사각형이면 한 변', (v) => Math.sqrt(A.footingArea(v.N, v.q)), 'm', true)], draw: (v, o) => D.drawFooting(v, o) };
export const footLab = (o) => make(foot, o);

// 콘크리트 물량
const conc = { toolTitle: '콘크리트 물량 계산기', note: '부피 = 면적 × 두께. 철근콘크리트 단위 무게는 약 24 kN/㎥(≈2.4 t/㎥)로 봐요. 레미콘 1대 6㎥는 가정이에요.',
  inputs: [I('area', '슬래브 면적', 10, 200, 10, 50, 'm2'), I('t', '두께', 100, 300, 10, 150, 'mm')],
  outputs: [O('vol', '콘크리트 부피', (v) => (v.area * v.t) / 1000, 'm3', true), O('wt', '무게', (v) => ((v.area * v.t) / 1000) * 24, 'kn0'), O('trk', '레미콘 차(6㎥/대)', (v) => Math.ceil(((v.area * v.t) / 1000) / 6 - 1e-9), 'ea')], draw: (v, o) => D.drawConcrete(v, o) };
export const concLab = (o) => make(conc, o);

// 공사비 개산
const cost = { toolTitle: '공사비 개산 계산기', note: '연면적 × 평당 단가로 대략 잡아요. 단가·요율은 가상의 예시이며 실제는 규모·구조·마감·시기에 따라 크게 달라요.',
  inputs: [I('gfa', '연면적', 20, 200, 5, 40, 'py0'), I('u', '평당 건축비', 5e6, 2e7, 5e5, 1e7, 'won2'), I('des', '설계비율', 3, 10, 1, 5, 'pct0n'), I('sup', '감리비율', 1, 5, 1, 2, 'pct0n')],
  outputs: [O('build', '건축 공사비', (v) => v.gfa * v.u, 'won2'), O('fee', '설계·감리비', (v) => v.gfa * v.u * ((v.des + v.sup) / 100), 'won2'), O('tot', '합계', (v) => v.gfa * v.u * (1 + (v.des + v.sup) / 100), 'won2', true)], draw: (v) => D.drawBudget([{ l: '공사비', v: v.gfa * v.u }, { l: '설계비', v: v.gfa * v.u * (v.des / 100) }, { l: '감리비', v: v.gfa * v.u * (v.sup / 100) }]) };
export const costLab = (o) => make(cost, o);

// 리모델링 종합
const renov = { toolTitle: '리모델링 예산 계산기', note: '철거·설비, 마감, 가구·조명 순으로 예산을 쌓고 예비비를 더해요. 단가는 가상의 예시예요.',
  inputs: [I('py', '시공 면적', 10, 40, 1, 15, 'py0'), I('a', '철거·설비 단가(평당)', 5e5, 2e6, 1e5, 1e6, 'won2'), I('b', '마감 단가(평당)', 5e5, 3e6, 1e5, 1.5e6, 'won2'), I('f', '가구·조명 예산', 0, 5e7, 5e6, 1.5e7, 'won2'), I('c', '예비비율', 0, 20, 5, 10, 'pct0n')],
  outputs: [O('p1', '철거·설비', (v) => v.py * v.a, 'won2'), O('p2', '마감', (v) => v.py * v.b, 'won2'), O('res', '예비비', (v) => (v.py * (v.a + v.b)) * (v.c / 100), 'won2'), O('tot', '총 예산', (v) => v.py * (v.a + v.b) * (1 + v.c / 100) + v.f, 'won2', true), O('per', '평당 총액', (v) => (v.py * (v.a + v.b) * (1 + v.c / 100) + v.f) / v.py, 'won2')], draw: (v) => D.drawBudget([{ l: '철거설비', v: v.py * v.a }, { l: '마감', v: v.py * v.b }, { l: '예비비', v: v.py * (v.a + v.b) * (v.c / 100) }, { l: '가구조명', v: v.f }]) };
export const renovLab = (o) => make(renov, o);

export const FACTORIES = { areaLab, scaleLab, roomLab, heightLab, supplyLab, covLab, sunLab, stairLab, rampLab, parkLab, goldenLab, colorLab, daylightLab, lightLab, ventLab, heatLab, furnLab, kitLab, matLab, floorLab, tileLab, ibudLab, loadLab, leverLab, reactLab, beamLab, secLab, deflLab, strsLab, colLab, footLab, concLab, costLab, renovLab };
