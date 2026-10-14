// Tokens Studio의 "Import variables"가 만든 세트를 원래 세트로 합침: docs/tokens.json을 직접 고침
// 실행: npm run tokens:normalize (배포 워크플로가 Push마다 실행하고 결과를 다시 커밋)
//
// 피그마 변수 Import는 "컬렉션/모드" 이름으로 세트를 만든다. 이 파일의 세트를 Export하면
// 컬렉션 이름 = 모드 이름 = 세트 이름이 되므로, Import 결과는 항상 "core/core" 같은 꼴이 된다.
// → "X/X" 세트를 "X"에 합치고(가져온 값이 우선) 지운다. 모드가 여럿인 "colors/dark" 같은 세트는 건드리지 않음.
import { readFileSync, writeFileSync } from "node:fs"

const FILE = "docs/tokens.json"

const isToken = (t) => t && typeof t === "object" && ("value" in t || "$value" in t)
/** b의 토큰을 a에 덮어씀 (토큰 단위로 통째 교체, 그룹은 재귀) */
function merge(a, b) {
  for (const [k, v] of Object.entries(b)) {
    if (isToken(v) || !a[k] || isToken(a[k]) || typeof v !== "object") a[k] = v
    else merge(a[k], v)
  }
  return a
}

export function normalize(json) {
  const merged = []
  for (const name of Object.keys(json)) {
    const [base, mode, ...rest] = name.split("/")
    if (rest.length || mode !== base) continue
    json[base] = merge(json[base] ?? {}, json[name])
    delete json[name]
    merged.push(`${name} → ${base}`)
  }
  if (merged.length && json.$metadata?.tokenSetOrder) {
    const rename = Object.fromEntries(merged.map((m) => m.split(" → ")))
    json.$metadata.tokenSetOrder = [...new Set(json.$metadata.tokenSetOrder.map((s) => rename[s] ?? s))].filter((s) => s in json)
  }
  return merged
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const json = JSON.parse(readFileSync(FILE, "utf8"))
  const merged = normalize(json)
  if (merged.length) writeFileSync(FILE, JSON.stringify(json, null, 2) + "\n")
  console.log(merged.length ? `합친 세트: ${merged.join(", ")}` : "합칠 세트 없음")
}
