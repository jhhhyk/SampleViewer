import divider from "@/assets/summary-divider.svg"
import type { Meta, Sample } from "@/data"

const META_ITEMS: { key: keyof Meta; label: string }[] = [
  { key: "provider", label: "공급사" },
  { key: "sensor", label: "센서" },
  { key: "resolution", label: "해상도" },
  { key: "cloud", label: "구름량" },
  { key: "bands", label: "밴드" },
  { key: "level", label: "처리 수준" },
  { key: "aoiCoverage", label: "AOI 커버리지" },
  { key: "crs", label: "CRS" },
]

/** 샘플 요약 카드 + 메타정보 카드. 숫자 값은 피그마 px (사이드바 배율 단위) */
export function SampleDetail({ sample }: { sample: Sample }) {
  return (
    <>
      <section className="px-74 max-md:px-20">
        <p className="text-panel-title">{sample.title}</p>
        <h2 className="mt-27 -ml-3 text-panel-display">{sample.region}</h2>
        <p className="mt-26 flex flex-wrap items-center gap-x-18 gap-y-4 text-panel-subtitle">
          <span>{sample.date}</span>
          <img src={divider} alt="" width={24} height={3} className="rotate-90" />
          <span>{sample.country}</span>
        </p>
      </section>

      <div aria-hidden className="min-h-16 grow-63" />

      <section className="pr-64 pl-74 max-md:px-20">
        <h3 className="text-panel-title">{sample.title} 세부 정보</h3>
        {/* 피그마 열 너비 83·83·83·139 비율 유지 */}
        <dl className="mt-29 grid grid-cols-2 gap-x-41 gap-y-38 @lg:grid-cols-[repeat(3,minmax(0,83fr))_minmax(0,139fr)] lg:grid-cols-[repeat(3,minmax(0,83fr))_minmax(0,139fr)]">
          {META_ITEMS.map(({ key, label }) => (
            <div key={key}>
              <dt className="text-panel-body whitespace-nowrap">{label}</dt>
              <dd className="text-panel-label type-num">{metaValue(sample.meta[key])}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}

const metaValue = (v: string | null | undefined) => (v === null ? "해당 없음" : (v ?? "정보 미제공"))
