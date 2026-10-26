import { C1 } from './c1.js';
import { C2 } from './c2.js';
import { C3 } from './c3.js';
import { C4 } from './c4.js';
import { C5 } from './c5.js';
import { C6 } from './c6.js';
import { C7 } from './c7.js';
import { FIX, FIX2, LABFIX } from './tune.js';

export const UNITS = [...C1, ...C2, ...C3, ...C4, ...C5, ...C6, ...C7];
UNITS.forEach((u) => u.quiz.forEach((q, k) => { const f = { ...(FIX[`${u.id}:${k}`] || {}), ...(FIX2[`${u.id}:${k}`] || {}) }; if (Object.keys(f).length) Object.assign(q, f); }));
export const CHAPTERS = [
  { id: 'c1', from: 1, to: 8, icon: '📐', name: 'Chapter 1 · 공간과 도면 읽기', sub: '치수 · 축척 · 도면 · 휴먼 스케일', color: '#2f5bd7', story: '건축의 언어인 도면을 읽는 법부터 시작해요. mm·㎡·평, 축척, 평면·입면·단면도, 선과 기호, 인체 치수, 전용·공급면적까지 직접 계산하며 익혀요.' },
  { id: 'c2', from: 9, to: 16, icon: '🏙️', name: 'Chapter 2 · 건축 계획과 법규', sub: '배치 · 건폐율 · 동선 · 계단 · 피난', color: '#1a9a8a', story: '땅에 건물을 앉히는 일부터 방의 배치, 계단과 경사로, 복도와 피난, 주차까지. 한국 건축법의 기본 개념(건폐율·용적률·일조)을 도면으로 체험해요.' },
  { id: 'c3', from: 17, to: 24, icon: '🎨', name: 'Chapter 3 · 디자인 원리와 환경', sub: '비례 · 색 · 재료 · 빛 · 환기 · 단열', color: '#c0527a', story: '아름답고 쾌적한 공간의 원리를 배워요. 비례와 색채, 재료의 질감, 채광과 조명, 환기와 단열을 숫자로 확인해요.' },
  { id: 'c4', from: 25, to: 29, icon: '🖊️', name: 'Chapter 4 · 설계 과정과 도면 표현', sub: '프로세스 · 스케치 · 치수 · 일람표 · BIM', color: '#8a5cd6', story: '설계가 어떤 단계로 진행되는지, 아이디어를 어떻게 스케치와 모형으로 다듬는지, 도면 세트를 어떻게 정리하는지 살펴봐요.' },
  { id: 'c5', from: 30, to: 39, icon: '🛋️', name: 'Chapter 5 · 인테리어 실무', sub: '가구 · 주방 · 마감 · 물량 · 시공 순서 · 예산', color: '#e0703f', story: '가구 배치와 동선, 주방·욕실 설계, 마감재 선택, 도배·타일·바닥재 물량 계산, 시공 순서와 예산까지. 실전에서 바로 쓰는 인테리어 기초예요.' },
  { id: 'c6', from: 40, to: 50, icon: '🏗️', name: 'Chapter 6 · 구조 기초', sub: '하중 · 모멘트 · 보 · 기둥 · 기초 · 재료', color: '#2f4f8f', story: '건물이 서 있는 원리를 이해해요. 하중의 종류, 모멘트와 반력, 보의 휨과 처짐, 기둥의 좌굴, 기초와 지반, 철근콘크리트와 철골·목구조를 간단한 계산으로 체험해요.' },
  { id: 'c7', from: 51, to: 55, icon: '🧰', name: 'Chapter 7 · 실무와 종합', sub: '인허가 · 공사비 · 현장 · 안전 · 프로젝트', color: '#1a9a8a', story: '인허가와 전문가의 역할, 공사비 산정, 현장에서 보는 균열과 하자, 화재와 피난 안전을 살피고, 마지막으로 작은 리모델링 프로젝트를 끝까지 계획해 봐요.' },
];
UNITS.forEach((u) => { if (u.lab.type === 'case') u.lab.steps.forEach((s, k) => { const f = LABFIX[`${u.id}:${k}`]; if (f) Object.assign(s, f); }); });
