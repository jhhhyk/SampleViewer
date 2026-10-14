# 디자인 토큰

> Figma 스타일 ↔ Tailwind v4 토큰 1:1 매핑. 원본 템플릿: `design-tokens-template.md`

## 0. 흐름 — 기준은 `docs/tokens.json` 하나

```
Figma Tokens Studio ──Push / Pull (main)──┐
                                          ▼
                                docs/tokens.json   ← 유일한 기준
                                          ▲
코드에서 직접 수정 ───────────────────────┘
                                          │  npm run tokens (dev·build 전에 자동)
                                          ▼
                     src/styles/tokens.generated.css   (git에 안 올림)
```

- **Figma에서 수정** (둘 중 아무거나)
  - Tokens Studio 화면에서 토큰 값 수정 → Push
  - Figma 변수·텍스트 스타일을 직접 수정 → Tokens Studio **Import variables / Import styles** → Push
  - → main에 커밋 → GitHub Pages 배포 빌드가 CSS를 만들어 바로 반영
  - **Push 뒤에는 Tokens Studio에서 Pull** (배포가 세트를 정리해 다시 커밋하므로, 아래 "세트 자동 정리")
- **코드에서 수정**: `docs/tokens.json`을 고침 (생성된 CSS는 고치지 않음) → 푸시 → Figma에서 Pull
- 로컬 개발 중 JSON을 바꿨거나 pull했다면 `npm run tokens` (dev 서버가 바뀐 CSS를 바로 반영)
- 생성 파일에 들어가는 것: 색, `--radius`, 타이포 Primitive(`--ff-*` `--fw-*` `--fs-*` `--lh-*` `--ls-*` `--feat-*`), 텍스트 스타일 `@utility text-*`
- [src/index.css](../src/index.css)에 남는 것: radius 단계(sm~xl 계산식), 기본 폰트, 굵기 클래스 매핑, `type-num`, body·포커스 기본값
- Figma에 없는 정보(웹폰트 이름, 반응형 크기 규칙)는 [scripts/gen-tokens.mjs](../scripts/gen-tokens.mjs) 위쪽에 있음

**규칙**
- 토큰 이름은 Figma · CSS 변수 · Tailwind 클래스에서 동일 (`primary` → `--primary` → `bg-primary`)
- 색은 `xxx` / `xxx-foreground` 쌍. 값은 hex
- 타이포는 Primitive(`--fs-15` …) → Semantic(`text-body` …). 컴포넌트에서는 Semantic만 사용
- 다크모드 없음 (`.dark` 블록 생략, 이름은 shadcn 규칙을 따르므로 나중에 값만 추가하면 됨)

---

## 1. 색상

> 2026-10-14부터 Stellarhub 팔레트(`Stellarhub_260506.css`) 적용. 아래 기존 이름들은 이제 Stellarhub semantic 토큰을 참조하며(예: `background` → `bg-page` → `bg-canvas`), 표의 hex는 적용 전 값. 현재 값은 `docs/tokens.json`의 `light` 세트가 기준
> - Stellarhub primitive: `bg-canvas`, `surface-100~500`, `stroke-100~600`, `stroke-highlight`, `text-100~400`
> - semantic: `bg-page`, `surface-*`, `border-*`, `text-*` / 컴포넌트: `button-*`, `card-*`, `input-*` (CSS 변수 이름은 원본 CSS와 같음)
> - 탐색 유형 동그라미 테두리: `border-active`

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

`tokens.json`의 `core.ff` `fw` `fs` `lh` `ls` `feat`. 공용 Primitive 파일(`primitive-typography-token.css`)에서 시작했고, 이 프로젝트에만 있는 값을 추가함 (Exception)
- fs: `19` `27` `56` `62`
- lh: `38` `41` `78`
- ls: `negative-3-9` `negative-3-7` `negative-2-8` `negative-1-9` `negative-0-7` `negative-0-6`

JSON에는 Figma 이름(`Inter`, `Semi Bold`)으로 적고 (굵기 이름은 Inter 기준: `Extra Light` `Semi Bold` `Extra Bold`처럼 띄어 씀), CSS로 만들 때 웹폰트 이름(`"Inter Variable"`)과 숫자 굵기(600)로 바꿈.

| 토큰 | 폰트 | 상태 |
|---|---|---|
| `--ff-ko` | Noto Sans KR | **기본 글꼴** (`body`, 영문 전용 2개를 뺀 모든 텍스트 스타일) |
| `--ff-en` | Inter | 영문 전용 스타일 `brand`(StellarVision), `type-label`(Sensor·Analytics·Drone) |
| `--ff-num` | Inter + `tnum` `zero` | `type-num` (메타정보 값). Figma에는 없는 코드 전용 처리 |
| `--ff-display` | Degular | 미설치(유료) — 사용 안 함 |

사용 굵기: 400 · 500 · 600 · 700. Tailwind `font-medium/semibold/bold`도 `--fw-*`를 따름.

### 3-2. 텍스트 스타일 (Semantic)

`tokens.json`의 `core.text.<이름>` → `@utility text-<이름>`. 값은 Figma(데스크톱) 기준. 폰트는 `ff.ko`(Noto Sans KR), 영문만 쓰는 `brand`·`type-label`만 `ff.en`(Inter).

Figma 텍스트 스타일은 글꼴을 하나만 지정할 수 있어서(웹처럼 한글만 다른 글꼴로 대체하는 기능이 없음), 한글이 들어가는 스타일은 한글 글꼴 하나로 통일함. Noto Sans KR은 Figma 기본 제공(Google Fonts)이라 설치 없이 쓸 수 있음.

**반응형 처리** (생성 스크립트가 처리)
- 고정: Primitive를 CSS 변수로 그대로 참조
- 반응형(스크립트의 `RESPONSIVE`에 있는 스타일): Figma 크기가 최대값. 행간·자간은 Figma 값을 크기 대비 비율·em으로 계산해서 크기와 함께 줄어듦
- `panel-`로 시작하는 스타일: 샘플 화면 사이드바 전용. `--spacing`이 피그마 1px인 영역에서 0.6~1배로 줄어듦 (최소 12px)
- Figma에서 새 텍스트 스타일을 만들면 고정 크기 유틸로 자동 생성됨. 화면에 따라 줄어들어야 하면 `RESPONSIVE`에 추가

| 스타일 | 크기 | 행간 | 두께 | 자간 | 반응형 | 사용처 |
|---|---|---|---|---|---|---|
| brand | `fs-20` (md 미만 `fs-18`) | — | 600 | `negative-0-4` | 반응형 | 헤더 StellarVision |
| title | `fs-32` | — | 700 | `negative-1-5` | 고정 | 문의 접수 완료 |
| heading | `fs-24` | — | 700 | — | 고정 | 샘플 없음 안내 |
| subtitle | `fs-16` | — | 700 | — | 고정 | 팝오버 제목 |
| body-lg | `fs-18` | — | 400 | — | 고정 | 안내 문구, 영상 로딩 |
| body | `fs-16` | — | 400 | — | 고정 | 뷰어 버튼 |
| body-sm | `fs-14` | `lh-24` | 400 | — | 고정 | 팝오버 본문 |
| caption | `fs-13` | — | 400 | — | 고정 | 팝오버 부가 문구 |
| label | `fs-14` | — | 500 | — | 고정 | Contact Us, 오류 문구 |
| button | `fs-16` | — | 700 | `negative-0-5` | 고정 | 문의하기, 완료 화면 버튼 |
| field | `fs-16` (md 미만 `fs-15`) | — | 500 | — | 반응형 | 입력창 |
| type-label | `fs-16` | — | 500 | `negative-0-8` | 고정 | Sensor·Analytics·Drone |
| display | `fs-62` (xl 미만 최대 `fs-40`) | `lh-78` | 500 | `negative-3-7` | 반응형 | 첫 화면·문의 h1 |
| intro | `fs-22` (xl 미만 최대 `fs-18`) | `lh-38` | 500 | `negative-1-5` | 반응형 | h1 아래 소개 |
| section-title | `fs-22` | `lh-38` | 700 | `negative-1-8` | 반응형 | 관심 있는 활용 분야 |
| tab | `fs-22` | `lh-38` | 500 (선택 700) | `negative-0-7` | 반응형 | 활용 분야 / 탐색 유형 탭 |
| card-title | `fs-56` | — | 500 | `negative-2-8` | 반응형 | 분야·카테고리 카드 |
| card-note | `fs-15` | — | 500 | `0` | 반응형 | 샘플 준비 중 |
| thumb-label | `fs-26` | — | 500 | `negative-1-3` | 반응형 | 썸네일 라벨 |
| notice | `fs-15` | `lh-26` | 700 | `negative-0-6` | 반응형 | 회신 예정 안내 |
| link | `fs-16` | `lh-28` | 700 | `negative-1-1` | 반응형 | ← 처음으로 돌아가기 |
| field-label | `fs-15` | — | 500 | — | 반응형 | 폼 라벨 |
| consent | `fs-14` | — | 400 | — | 반응형 | 개인정보 동의 줄 |
| panel-display | `fs-56` | `lh-41` | 500 | `negative-3-9` | 사이드바 | 지역명 |
| panel-title | `fs-19` | `lh-32` | 700 | `negative-1-1` | 사이드바 | 탐색 필터, 샘플명 |
| panel-subtitle | `fs-27` | `lh-32` | 500 | `negative-1-9` | 사이드바 | 날짜 · 국가 |
| panel-label | `fs-16` | `lh-32` | 700 | `negative-0-5` | 사이드바 | 그룹명, 칩, 하단 버튼, 메타 값 |
| panel-body | `fs-16` | `lh-32` | 500 | `negative-0-5` | 사이드바 | 메타 항목명 |
| panel-caption | `fs-15` | — | 500 | — | 사이드바 | 활용 분야 선택 |

`—` = 행간 `AUTO`(지정 안 함, 상속) / 자간 `ls.0`.

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

세트 `core`(radius·ff·feat·fw·fs·lh·ls·text) + `light`(color). 다크 세트 없음 → 두 세트를 모두 켜면 됨.

**GitHub 연결** (Settings → Sync providers → GitHub)

| 항목 | 값 |
|---|---|
| Repository | `jhhhyk/SampleViewer` |
| Branch | `main` (Push하면 바로 배포됨) |
| File path | `docs/tokens.json` |

토큰은 Fine-grained token, 이 저장소만, Contents Read and write.

**세트 자동 정리**

Import variables는 Figma 컬렉션·모드를 `컬렉션/모드` 이름의 세트로 가져온다. 이 파일의 세트(`core`, `light`)를 Export하면 컬렉션 `core`·모드 `core`가 되므로, Import하면 `core/core`·`light/light` 세트가 새로 생긴다.

- 배포 워크플로가 Push마다 `npm run tokens:normalize`([scripts/normalize-tokens.mjs](../scripts/normalize-tokens.mjs))로 `X/X` 세트를 `X`에 합치고(가져온 값이 우선) 지운 뒤 다시 커밋한다 (커밋 메시지 "Merge token sets imported from Figma variables")
- 그래서 저장소에는 항상 `core`, `light` 두 세트만 남는다. Tokens Studio에서 Pull하면 플러그인도 정리된 상태가 된다
- Pull 없이 다시 Import·Push해도 가져온 값이 우선이라 결과는 맞다. 다만 Pull 전 플러그인의 옛 `core`/`light` 세트를 직접 고치면, 남아 있는 `core/core`가 그 값을 덮어쓰므로 **Push 뒤 Pull**을 습관으로
- 모드가 여럿인 컬렉션(`colors/dark` 등)은 합치지 않는다
- 같은 토큰이 여러 세트에서 값이 다르면 빌드 로그(Actions 경고)에 표시된다
- Figma에서 지운 변수는 합칠 때 저장소에서 지워지지 않는다. 지우려면 Tokens Studio에서도 지우고 Push

**주의**
- 수식(`{radius.base} - 4` 등)은 `radius`의 sm~xl에만 쓸 수 있음. 다른 토큰 값에 수식을 넣으면 생성 단계에서 오류가 나서 배포가 멈춤
- 텍스트 스타일 이름이 색 토큰 이름과 같으면 클래스가 겹쳐서 오류 처리함
- 동시에 같은 값을 양쪽에서 고치면 git 충돌 → Pull 후 다시 Push

---

## 새 토큰 추가 체크리스트

- [ ] `docs/tokens.json`(또는 Figma Tokens Studio)에 추가
- [ ] 색: 이름이 `xxx` / `xxx-foreground` 쌍인지
- [ ] 텍스트 스타일: 화면 크기에 따라 줄어들어야 하면 `scripts/gen-tokens.mjs`의 `RESPONSIVE`에 추가
- [ ] 이 문서 표에 기록
