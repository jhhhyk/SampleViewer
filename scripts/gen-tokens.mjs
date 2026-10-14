// Primitive CSS + index.css 색 → Tokens Studio JSON. 실행: npm run tokens
// ponytail: STYLES 표는 index.css의 @utility text-*를 손으로 옮긴 것. 스타일 추가·변경 시 같이 수정
import { readFileSync, writeFileSync } from "node:fs"
const [prim, index, out] = ["src/styles/typography-primitives.css", "src/index.css", "docs/tokens.json"]

const vars = (css) => Object.fromEntries([...css.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))
const p = vars(readFileSync(prim, "utf8"))
const root = vars(readFileSync(index, "utf8").split("@theme")[0])

const FIGMA_WEIGHT = { 100: "Thin", 200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black" }
const figmaFont = (v) => v.split(",")[1].trim().replaceAll('"', "") // "Pretendard Variable", "Pretendard", ... → Pretendard
const group = (prefix, type, map = (v) => v.replace("px", "")) =>
  Object.fromEntries(Object.entries(p).filter(([k]) => k.startsWith(prefix + "-")).map(([k, v]) => [k.slice(prefix.length + 1), { value: map(v), type }]))

const core = {
  radius: {
    base: { value: root.radius.replace("px", ""), type: "borderRadius" },
    sm: { value: "{radius.base} - 4", type: "borderRadius" },
    md: { value: "{radius.base} - 2", type: "borderRadius" },
    lg: { value: "{radius.base}", type: "borderRadius" },
    xl: { value: "{radius.base} + 4", type: "borderRadius" },
  },
  ff: Object.fromEntries(["ko", "en", "num", "display"].map((k) => [k, { value: k === "display" ? "Degular" : figmaFont(p["ff-" + k]), type: "fontFamilies" }])),
  fw: group("fw", "fontWeights", (v) => FIGMA_WEIGHT[v]),
  fs: group("fs", "fontSizes"),
  lh: group("lh", "lineHeights"),
  ls: group("ls", "letterSpacing"),
  text: {},
}

// [이름, ff, fw, fs, lh(null=AUTO), ls] — Figma(데스크톱 최대) 값. index.css의 @utility text-* 와 1:1
const STYLES = [
  ["brand", "en", 600, 20, null, "negative-0-4"],
  ["title", "ko", 700, 32, null, "negative-1-5"],
  ["heading", "ko", 700, 24, null, "0"],
  ["subtitle", "ko", 700, 16, null, "0"],
  ["body-lg", "ko", 400, 18, null, "0"],
  ["body", "ko", 400, 16, null, "0"],
  ["body-sm", "ko", 400, 14, 24, "0"],
  ["caption", "ko", 400, 13, null, "0"],
  ["label", "ko", 500, 14, null, "0"],
  ["button", "ko", 700, 16, null, "negative-0-5"],
  ["field", "ko", 400, 16, null, "0"],
  ["type-label", "en", 500, 16, null, "negative-0-8"],
  ["display", "ko", 500, 62, 78, "negative-3-7"],
  ["intro", "ko", 500, 22, 38, "negative-1-5"],
  ["section-title", "ko", 700, 22, 38, "negative-1-8"],
  ["tab", "ko", 500, 22, 38, "negative-0-7"],
  ["card-title", "ko", 500, 56, null, "negative-2-8"],
  ["card-note", "ko", 500, 15, null, "0"],
  ["thumb-label", "ko", 500, 26, null, "negative-1-3"],
  ["notice", "ko", 700, 15, 26, "negative-0-6"],
  ["link", "ko", 700, 16, 28, "negative-1-1"],
  ["field-label", "ko", 500, 15, null, "0"],
  ["consent", "ko", 400, 14, null, "0"],
  ["panel-display", "ko", 500, 56, 41, "negative-3-9"],
  ["panel-title", "ko", 700, 19, 32, "negative-1-1"],
  ["panel-subtitle", "ko", 500, 27, 32, "negative-1-9"],
  ["panel-label", "ko", 700, 16, 32, "negative-0-5"],
  ["panel-body", "ko", 500, 16, 32, "negative-0-5"],
  ["panel-caption", "ko", 500, 15, null, "0"],
]
for (const [name, ff, fw, fs, lh, ls] of STYLES) {
  for (const [g, k] of [["fw", fw], ["fs", fs], ["lh", lh], ["ls", ls]]) if (k !== null && !core[g][k]) throw new Error(`${name}: ${g}-${k} 없음`)
  core.text[name] = {
    value: { fontFamily: `{ff.${ff}}`, fontWeight: `{fw.${fw}}`, fontSize: `{fs.${fs}}`, lineHeight: lh ? `{lh.${lh}}` : "AUTO", letterSpacing: `{ls.${ls}}` },
    type: "typography",
  }
}

const light = { color: Object.fromEntries(Object.entries(root).filter(([k, v]) => v.startsWith("#")).map(([k, v]) => [k, { value: v, type: "color" }])) }

writeFileSync(out, JSON.stringify({ core, light, $themes: [], $metadata: { tokenSetOrder: ["core", "light"] } }, null, 2) + "\n")
console.log(Object.keys(core.text).length, "text styles,", Object.keys(light.color).length, "colors")
