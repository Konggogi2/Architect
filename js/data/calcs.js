// 계산기 탭: 과제 없이 자유롭게 쓰는 도구들
import { areaLab, scaleLab, supplyLab, covLab, stairLab, rampLab, daylightLab, lightLab, heatLab, furnLab, matLab, floorLab, ibudLab, beamLab, secLab, footLab } from './labdefs.js';

const C = (icon, title, desc, lab) => ({ icon, desc, ...lab, title, goal: desc });
export const CALCS = [
  C('📐', '면적·평수', '가로·세로로 방 면적(㎡)과 평수를 구해요.', areaLab({})),
  C('📏', '축척 환산', '도면에서 잰 길이로 실제 길이를 구해요.', scaleLab({})),
  C('🏢', '전용·공급면적', '전용면적과 전용률로 공급면적을 계산해요.', supplyLab({})),
  C('🏙️', '건폐율·용적률', '대지와 건물 크기로 건폐율·용적률을 봐요.', covLab({})),
  C('🪜', '계단 설계', '층고로 계단 단 수와 디딤판 너비를 구해요.', stairLab({})),
  C('♿', '경사로', '높이와 기울기로 경사로 길이를 구해요.', rampLab({})),
  C('☀️', '채광 창 면적', '방 크기에 맞는 창 면적을 확인해요.', daylightLab({})),
  C('💡', '조명 수량', '목표 조도에 필요한 등기구 수를 구해요.', lightLab({})),
  C('🌡️', '열손실', '단열 성능(U값)에 따른 열손실을 계산해요.', heatLab({})),
  C('🛏️', '침대 배치', '방과 침대 크기로 통로 폭을 확인해요.', furnLab({})),
  C('🎨', '도배·페인트 물량', '벽 면적으로 도배지와 페인트 양을 구해요.', matLab({})),
  C('🪵', '바닥재 물량', '마루 박스 수와 자재비를 계산해요.', floorLab({})),
  C('💰', '인테리어 예산', '평당 단가와 예비비로 총 예산을 구해요.', ibudLab({})),
  C('🏗️', '단순보 하중', '등분포하중에서 반력과 휨모멘트를 구해요.', beamLab({})),
  C('📦', '단면 성질', '보 단면의 I·S 값을 계산해 비교해요.', secLab({})),
  C('🧱', '기초 면적', '기둥 하중과 지내력으로 기초 크기를 구해요.', footLab({})),
];
