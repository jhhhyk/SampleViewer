# 디자인 토큰

> Figma 스타일 ↔ Tailwind v4 토큰 1:1 매핑. 원본 템플릿: `design-tokens-template.md`
> 코드: [src/index.css](../src/index.css), [src/styles/typography-primitives.css](../src/styles/typography-primitives.css)
> Figma(Tokens Studio): [docs/tokens.json](tokens.json)

**규칙**
- 토큰 이름은 Figma · CSS 변수 · Tailwind 클래스에서 동일 (`primary` → `--primary` → `bg-primary`)
- 색은 `xxx` / `xxx-foreground` 쌍. 값은 hex
- 타이포는 Primitive(`--fs-15` …) → Semantic(`text-body` …). 컴포넌트에서는 Semantic만 사용
- 다크모드 없음 (`.dark` 블록 생략, 이름은 shadcn 규칙을 따르므로 나중에 값만 추가하면 됨)

---

## 1. 색상

| 토큰 | Tailwind | 용도 | Light |
|---|---|---|---|
| background | `bg-background` | 페이지·입력창 배경 | `#ffffff` |
| foreground | `text-foreground` | 기본 텍스트 | `#383838` |
| card / card-foreground | `bg-card` | 카드 (현재 미사용) | `#ffffff` / `#383838` |
| popover / popover-foreground | `bg-popover` | 개인정보 안내 팝오버 | `#ffffff` / `#383838` |
| primary / primary-foreground | `bg-primary` | 문의하기 버튼, 선택된 칩, 체크박스 | `#383838` / `#ffffff` |
| secondary / secondary-foreground | `bg-secondary` | 선택 안 된 칩 | `#c9c9c9` / `#383838` |
| muted / muted-foreground | `bg-muted` | 카드·폼 영역 배경, hover / 보조 텍스트 | `#eeeeee` / `#777777` |
| accent / accent-foreground | `bg-accent` | 분야 카드 hover, 원 근접 강조 / 카드 텍스트 | `#d4e2ec` / `#262626` |
| destructive / destructive-foreground | `text-destructive` | 필수 표시, 오류 문구, 잘못된 입력 테두리 | `#e7000b` / `#ffffff` |
| border | `border-border` | 기본 테두리 | `#d9d9d9` |
| input | `border-input` | 입력창 테두리 | `#d9d9d9` |
| ring | `outline-ring` | 포커스 링, 입력창 포커스 테두리 | `#383838` |

### 프로젝트 커스텀 색

| 토큰 | Tailwind | 용도 | Light |
|---|---|---|---|
| foreground-strong | `text-foreground-strong` | 강조 텍스트(헤더, 선택된 탭), primary hover | `#262626` |
| foreground-subtle | `text-foreground-subtle` | 선택 안 된 탭, 선택 전 select 문구 | `#9a9a9a` |
| border-soft | `border-border-soft` | 헤더·하단 고정 영역 구분선 | `#e3e3e3` |
| accent-strong | `bg-accent-strong` | 선택된 탭 밑줄·원 | `#a9c5da` |
| secondary-hover | `bg-secondary-hover` | 칩 hover | `#b0b0b0` |
| disabled / disabled-foreground | `bg-disabled` | 샘플 없는 칩, 다운로드 준비 중 버튼 | `#e6e6e6` / `#a8a8a8` |
| overlay-border | `border-overlay-border` | 영상 위 썸네일 테두리 | `#3e4347` |

영상 뷰어 위의 흰 글자·반투명 검정(`text-white`, `bg-black/60` 등)은 테마와 무관한 오버레이라 Tailwind 기본 색을 그대로 씀.

---

## 2. Radius

| 토큰 | Tailwind | 용도 | 값 |
|---|---|---|---|
| (기준) | `--radius` | — | `5px` |
| sm | `rounded-sm` | (미사용) | `1px` |
| md | `rounded-md` | 버튼·인풋·카드·썸네일 | `3px` |
| lg | `rounded-lg` | 팝오버 | `5px` |
| xl | `rounded-xl` | (미사용) | `9px` |
| — | `rounded-full` | 칩, Contact Us, 원 | — |

---

## 3. 타이포그래피

### 3-1. Primitive

[src/styles/typography-primitives.css](../src/styles/typography-primitives.css)를 그대로 사용. 원본에서 바꾼 것:

- 폰트 이름: 웹폰트 패키지가 등록하는 이름을 앞에 추가 (`"Pretendard Variable"`, `"Inter Variable"`). en·num은 한글 fallback으로 Pretendard 추가
- 이 프로젝트에만 있는 값을 "SampleViewer 추가분"으로 덧붙임 (Exception)
  - fs: `19` `27` `56` `62`
  - lh: `38` `41` `78`
  - ls: `negative-3-9` `negative-3-7` `negative-2-8` `negative-1-9` `negative-0-7` `negative-0-6`
- `.type-num`은 `@utility type-num`으로 옮김, 예시 클래스는 제외

| 토큰 | 폰트 | 상태 |
|---|---|---|
| `--ff-ko` | Pretendard | 기본 (`body`, `font-sans`) |
| `--ff-en` | Inter | 영문 전용 요소에 `font-en` (브랜드명, Contact Us, Sensor/Analytics/Drone) |
| `--ff-num` | Inter + `tnum` `zero` | `type-num` (메타정보 값) |
| `--ff-display` | Degular | 미설치(유료) — 사용 안 함 |

사용 굵기: 400 · 500 · 600 · 700. Tailwind `font-medium/semibold/bold`도 `--fw-*`를 따름.

### 3-2. 텍스트 스타일 (Semantic)

`@utility text-<이름>` = Figma Text Style 이름. 값은 Figma(데스크톱) 기준.

**반응형 처리**
- 고정: Primitive 직접 참조
- 유동(clamp): 크기 최대값만 Primitive. 행간·자간은 크기에 비례해야 해서 비율·em으로 쓰고 주석에 대응 Primitive 기록
- panel-*: 샘플 화면 사이드바 전용. `--spacing`이 피그마 1px인 영역에서 0.6~1배로 줄어듦 (최소 12px)

| 스타일 | 크기 | 행간 | 두께 | 자간 | 반응형 | 사용처 |
|---|---|---|---|---|---|---|
| brand | `fs-18` → md `fs-20` | — | 600 | `negative-0-4` | 고정 | 헤더 StellarVision |
| title | `fs-32` | — | 700 | `negative-1-5` | 고정 | 문의 접수 완료 |
| heading | `fs-24` | — | 700 | — | 고정 | 샘플 없음 안내 |
| subtitle | `fs-16` | — | 700 | — | 고정 | 팝오버 제목 |
| body-lg | `fs-18` | — | 400 | — | 고정 | 안내 문구, 영상 로딩 |
| body | `fs-16` | — | 400 | — | 고정 | 뷰어 버튼 |
| body-sm | `fs-14` | `lh-24` | 400 | — | 고정 | 팝오버 본문 |
| caption | `fs-13` | — | 400 | — | 고정 | 팝오버 부가 문구 |
| label | `fs-14` | — | 500 | — | 고정 | Contact Us, 오류 문구 |
| button | `fs-16` | — | 700 | `negative-0-5` | 고정 | 문의하기, 완료 화면 버튼 |
| field | `fs-15` → md `fs-16` | — | 400 | — | 고정 | 입력창 |
| type-label | `fs-16` | — | 500 | `negative-0-8` | 고정 | Sensor·Analytics·Drone |
| display | `fs-62` (모바일 최대 `fs-40`) | `lh-78` (1.26) | 500 | `negative-3-7` (-0.06em) | 유동 | 첫 화면·문의 h1 |
| intro | `fs-22` (모바일 최대 `fs-18`) | `lh-38` (1.73) | 500 | `negative-1-5` (-0.07em) | 유동 | h1 아래 소개 |
| section-title | `fs-22` | `lh-38` (1.73) | 700 | `negative-1-8` (-0.08em) | 유동 | 관심 있는 활용 분야 |
| tab | `fs-22` | `lh-38` (1.73) | 500 (선택 700) | `negative-0-7` (-0.03em) | 유동 | 활용 분야 / 탐색 유형 탭 |
| card-title | `fs-56` | — | 500 | `negative-2-8` (-0.05em) | 유동 | 분야·카테고리 카드 |
| card-note | `fs-15` | — | 500 | `0` | 유동 | 샘플 준비 중 |
| thumb-label | `fs-26` | — | 500 | `negative-1-3` (-0.05em) | 유동 | 썸네일 라벨 |
| notice | `fs-15` | (상속 1.73) | 700 | `negative-0-6` (-0.04em) | 유동 | 회신 예정 안내 |
| link | `fs-16` | (상속 1.73) | 700 | (상속 -0.07em) | 유동 | ← 처음으로 돌아가기 |
| field-label | `fs-15` | — | 500 | — | 유동 | 폼 라벨 |
| consent | `fs-14` | — | 400 | — | 유동 | 개인정보 동의 줄 |
| panel-display | `fs-56` | `lh-41` | 500 | `negative-3-9` (-0.07em) | 사이드바 | 지역명 |
| panel-title | `fs-19` | `lh-32` | 700 | `negative-1-1` (-0.06em) | 사이드바 | 탐색 필터, 샘플명 |
| panel-subtitle | `fs-27` | `lh-32` | 500 | `negative-1-9` (-0.07em) | 사이드바 | 날짜 · 국가 |
| panel-label | `fs-16` | `lh-32` | 700 | `negative-0-5` (-0.03em) | 사이드바 | 그룹명, 칩, 하단 버튼, 메타 값 |
| panel-body | `fs-16` | `lh-32` | 500 | `negative-0-5` (-0.03em) | 사이드바 | 메타 항목명 |
| panel-caption | `fs-15` | — | 500 | — | 사이드바 | 활용 분야 선택 |

`—` = 지정 안 함(상속). Tokens Studio에서는 행간 `AUTO`, 자간 `ls.0`.

---

## 4. 간격 · 레이아웃

Tailwind 기본 스케일 + 화면 높이 기반 `clamp`. 사이드바는 `--spacing` = 피그마 1px.

| 용도 | 값 |
|---|---|
| 페이지 좌우 여백 | `px-5`(20) → md `px-10`(40) → xl `clamp(48px, 7.9vw, 144px)` |
| 섹션 간 간격 | `clamp(14px, 3vh, 40px)` |
| 카드 간 간격 | `gap-3`(12) → md `26px` |
| 입력창 내부 패딩 | 좌우 `12px` |
| 본문 최대 너비 | 첫 화면 `1030px`, 문의 `906px` |
| 사이드바 너비 | `clamp(480px, 35.6vw, 649px)` |

브레이크포인트: Tailwind 기본값 (sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536)

---

## 5. 그림자

| Tailwind | 값 | 용도 |
|---|---|---|
| `shadow-xl` | Tailwind 기본 | 팝오버 |
| `[text-shadow:0_1px_4px_rgb(0_0_0/0.6)]` | — | 영상 위 썸네일 라벨 |

---

## 6. Tokens Studio

[docs/tokens.json](tokens.json) — 세트 `core`(radius·ff·fw·fs·lh·ls·text) + `light`(color). 다크 세트 없음.
Tokens Studio에서 테마 **Light** = core + light 로 만들고 `text.*`를 Figma Text Style로 내보냄.

재생성: `npm run tokens` ([scripts/gen-tokens.mjs](../scripts/gen-tokens.mjs)). 텍스트 스타일을 추가·변경하면 스크립트의 `STYLES` 표도 같이 수정.

---

## 새 토큰 추가 체크리스트

색상
- [ ] `index.css` `:root`에 값
- [ ] `@theme inline`에 `--color-<이름>`
- [ ] `npm run tokens`
- [ ] 이 문서 1장

타이포그래피
- [ ] `typography-primitives.css`에 Primitive (없을 때만, "SampleViewer 추가분"에)
- [ ] `index.css`에 `@utility text-<이름>`
- [ ] `scripts/gen-tokens.mjs` `STYLES`에 추가 후 `npm run tokens`
- [ ] 이 문서 3장
