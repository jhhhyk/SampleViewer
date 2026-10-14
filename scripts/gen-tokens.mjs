// docs/tokens.json(Tokens Studio, 기준) → src/styles/tokens.generated.css
// 실행: npm run tokens (npm run dev / build 전에 자동 실행)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"

const SRC = "docs/tokens.json"
const OUT = "src/styles/tokens.generated.css"

/* ── Figma에 없는 정보 ───────────────────────────────────────────── */

// Figma 폰트 이름 → 웹폰트 이름 (index.css에서 불러오는 패키지). 한글 글리프는 Pretendard로 이어짐
const WEB_FONT = { Pretendard: "Pretendard Variable", Inter: "Inter Variable" }
const HANGUL_FALLBACK = "Pretendard Variable"

const WEIGHT = { thin: 100, extralight: 200, light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 }

// 반응형 글자 크기. max = 그 스타일의 Figma 크기. base = 기본, md·xl = 그 너비 이상
// 여기 있는 스타일은 행간·자간을 Figma 값에서 비율·em으로 바꿔 크기와 함께 줄어들게 함
const RESPONSIVE = {
  brand: (max) => ({ base: "var(--fs-18)", md: max }),
  field: (max) => ({ base: "var(--fs-15)", md: max }),
  display: (max) => ({ base: "clamp(24px, 4.2vh, var(--fs-40))", xl: `clamp(36px, min(3.4vw, 5.7vh), ${max})` }),
  intro: (max) => ({ base: "clamp(14px, 2.1vh, var(--fs-18))", xl: `clamp(16px, min(1.2vw, 2vh), ${max})` }),
  "section-title": (max) => ({ base: `clamp(16px, 2.4vh, ${max})` }),
  tab: (max) => ({ base: `clamp(16px, 2.4vh, ${max})` }),
  "card-title": (max) => ({ base: `clamp(22px, min(5.5vw, 5.2vh), ${max})`, xl: `clamp(28px, min(3.1vw, 5.2vh), ${max})` }),
  "card-note": (max) => ({ base: `clamp(12px, 1.5vh, ${max})` }),
  "thumb-label": (max) => ({ base: `clamp(15px, 1.42vw, ${max})` }),
  notice: (max) => ({ base: `clamp(13px, 1.5vh, ${max})` }),
  link: (max) => ({ base: `clamp(14px, 1.8vh, ${max})` }),
  "field-label": (max) => ({ base: `clamp(13px, 1.6vh, ${max})` }),
  consent: (max) => ({ base: `clamp(12px, 1.5vh, ${max})` }),
}
// "panel-"로 시작하는 스타일: 사이드바 배율(--spacing = 피그마 1px)로 크기·행간이 줄어듦 (최소 12px)
const isPanel = (name) => name.startsWith("panel-")

/* ── 토큰 읽기 ───────────────────────────────────────────────────── */

const json = JSON.parse(readFileSync(SRC, "utf8"))
// 세트(core, light …)를 그룹 단위로 합침. $themes·$metadata 제외
const tokens = {}
for (const [set, groups] of Object.entries(json)) {
  if (set.startsWith("$")) continue
  for (const [g, v] of Object.entries(groups)) tokens[g] = { ...tokens[g], ...v }
}

const val = (t) => t.$value ?? t.value // Tokens Studio 기본 형식과 W3C 형식 둘 다
const isToken = (t) => t && typeof t === "object" && val(t) !== undefined
/** 그룹 안의 토큰을 [이름, 토큰]으로 펼침 (하위 그룹은 이름을 -로 연결) */
const flat = (obj, prefix = "") =>
  Object.entries(obj ?? {}).flatMap(([k, t]) =>
    k.startsWith("$") ? [] : isToken(t) ? [[prefix + k, t]] : flat(t, `${prefix}${k}-`),
  )

const REF = /^\{([^}]+)\}$/
const refOf = (v) => (typeof v === "string" ? v.match(REF)?.[1] : undefined)
function resolve(v) {
  const ref = refOf(v)
  if (ref === undefined) {
    if (typeof v === "string" && v.includes("{")) throw new Error(`수식은 지원하지 않음: ${v}`)
    return v
  }
  const t = ref.split(".").reduce((o, k) => o?.[k], tokens)
  if (!isToken(t)) throw new Error(`없는 토큰 참조: ${v}`)
  return resolve(val(t))
}
/** 참조면 CSS 변수로, 아니면 fallback(값) */
const varOr = (v, fallback) => {
  const ref = refOf(v)
  return ref ? `var(--${ref.replaceAll(".", "-")})` : fallback(resolve(v))
}

const num = (v) => {
  const n = parseFloat(v)
  if (Number.isNaN(n)) throw new Error(`숫자가 아님: ${v}`)
  return n
}
const round = (n) => +n.toFixed(4)
const isPct = (v) => String(v).trim().endsWith("%")
const isAuto = (v) => String(v).trim().toUpperCase() === "AUTO"

const fontStack = (name) => {
  const web = WEB_FONT[name]
  const names = [web, name, web === HANGUL_FALLBACK ? null : HANGUL_FALLBACK].filter(Boolean)
  return `${names.map((n) => `"${n}"`).join(", ")}, sans-serif`
}
const weight = (v) => {
  if (!Number.isNaN(Number(v))) return Number(v)
  const w = WEIGHT[String(v).toLowerCase().replace(/[\s_-]/g, "")]
  if (!w) throw new Error(`모르는 굵기 이름: ${v}`)
  return w
}
const lhCss = (v) => (isAuto(v) ? "normal" : isPct(v) ? v : `${num(v)}px`)
const lsCss = (v) => (isPct(v) ? `${round(num(v) / 100)}em` : `${num(v)}px`)
/** 행간을 글자 크기 대비 비율로 (AUTO면 null) */
const lhRatio = (v, fs) => (isAuto(v) ? null : round(isPct(v) ? num(v) / 100 : num(v) / fs))
const lsEm = (v, fs) => `${round(isPct(v) ? num(v) / 100 : num(v) / fs)}em`

/* ── CSS 만들기 ──────────────────────────────────────────────────── */

const root = []
for (const [k, t] of flat(tokens.ff)) root.push(`--ff-${k}: ${fontStack(resolve(val(t)))};`)
for (const [k, t] of flat(tokens.feat)) root.push(`--feat-${k}: ${resolve(val(t))};`)
for (const [k, t] of flat(tokens.fw)) root.push(`--fw-${k}: ${weight(resolve(val(t)))};`)
for (const [k, t] of flat(tokens.fs)) root.push(`--fs-${k}: ${num(resolve(val(t)))}px;`)
for (const [k, t] of flat(tokens.lh)) root.push(`--lh-${k}: ${lhCss(resolve(val(t)))};`)
for (const [k, t] of flat(tokens.ls)) root.push(`--ls-${k}: ${lsCss(resolve(val(t)))};`)
// radius는 기준값만. sm~xl 계산식은 index.css
root.push(`--radius: ${num(resolve(val(tokens.radius.base)))}px;`)
const colors = flat(tokens.color)
for (const [k, t] of colors) root.push(`--${k}: ${resolve(val(t))};`)

const theme = colors.map(([k]) => `--color-${k}: var(--${k});`)

const utilities = flat(tokens.text).map(([name, t]) => {
  if (colors.some(([c]) => c === name)) throw new Error(`text-${name}: 같은 이름의 색 토큰과 클래스가 겹침`)
  const s = val(t)
  const fs = num(resolve(s.fontSize))
  const lh = resolve(s.lineHeight ?? "AUTO")
  const ls = s.letterSpacing ?? "0"
  const decl = {
    "font-family": varOr(s.fontFamily, fontStack),
    "font-size": varOr(s.fontSize, (v) => `${num(v)}px`),
    "line-height": isAuto(lh) ? null : varOr(s.lineHeight, lhCss),
    "font-weight": varOr(s.fontWeight, weight),
    "letter-spacing": varOr(ls, lsCss),
  }
  const variants = {}
  if (isPanel(name)) {
    decl["font-size"] = `max(12px, calc(var(--spacing) * ${fs}))`
    const lhPx = isAuto(lh) ? null : isPct(lh) ? round((fs * num(lh)) / 100) : num(lh)
    decl["line-height"] = lhPx === null ? null : `calc(var(--spacing) * ${lhPx})`
    decl["letter-spacing"] = lsEm(resolve(ls), fs)
  } else if (RESPONSIVE[name]) {
    const { base, ...bp } = RESPONSIVE[name](decl["font-size"])
    decl["font-size"] = base
    Object.assign(variants, bp)
    decl["line-height"] = lhRatio(lh, fs)
    decl["letter-spacing"] = lsEm(resolve(ls), fs)
  }
  const body = Object.entries(decl)
    .filter(([, v]) => v !== null)
    .map(([p, v]) => `  ${p}: ${v};`)
  for (const [bp, size] of Object.entries(variants)) body.push(`  @variant ${bp} {\n    font-size: ${size};\n  }`)
  return `@utility text-${name} {\n${body.join("\n")}\n}`
})

const indent = (lines) => lines.map((l) => `  ${l}`).join("\n")
const css = `/* 자동 생성 파일: ${SRC} → npm run tokens. 직접 고치지 말 것 */

:root {
${indent(root)}
}

@theme inline {
${indent(theme)}
}

${utilities.join("\n")}
`
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, css)
console.log(`${OUT}: 변수 ${root.length}개, 텍스트 스타일 ${utilities.length}개`)
