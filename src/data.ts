import shipSample from "@/assets/ship-sample.png"

export type FieldId = "ocean" | "agriculture" | "site" | "etc"
export type CategoryId =
  | "optical" | "sar" | "hyperspectral"
  | "detection" | "segmentation"
  | "drone-lidar" | "drone-sar"

export const FIELDS: { id: FieldId; name: string }[] = [
  { id: "ocean", name: "해양" },
  { id: "agriculture", name: "농업" },
  { id: "site", name: "부지" },
  { id: "etc", name: "기타" },
]

export const CATEGORY_GROUPS: {
  id: "sensor" | "analytics" | "drone"
  name: string
  linkLabel: string
  categories: { id: CategoryId; name: string }[]
}[] = [
  {
    id: "sensor", name: "센서", linkLabel: "Sensor",
    categories: [
      { id: "optical", name: "광학 영상" },
      { id: "sar", name: "SAR 영상" },
      { id: "hyperspectral", name: "초분광 영상" },
    ],
  },
  {
    id: "analytics", name: "분석", linkLabel: "Analytics",
    categories: [
      { id: "detection", name: "객체 탐지" },
      { id: "segmentation", name: "객체 분할" },
    ],
  },
  {
    id: "drone", name: "드론", linkLabel: "Drone",
    categories: [
      { id: "drone-lidar", name: "드론라이다" },
      { id: "drone-sar", name: "드론SAR" },
    ],
  },
]

export type GroupId = (typeof CATEGORY_GROUPS)[number]["id"]

export const CATEGORIES = CATEGORY_GROUPS.flatMap((g) => g.categories)

/** 항목 미적용은 null → '해당 없음', 값 없음은 undefined → '정보 미제공' */
export type Meta = {
  provider?: string | null
  sensor?: string | null
  resolution?: string | null
  cloud?: string | null
  bands?: string | null
  level?: string | null
  aoiCoverage?: string | null
  crs?: string | null
}

export type Sample = {
  id: string
  title: string
  thumbLabel: string
  region: string
  date: string
  country: string
  field: FieldId
  category: CategoryId
  image: string
  /** 다운로드 파일. 없으면 '다운로드 준비 중' */
  file?: string
  meta: Meta
}

const busanMeta: Meta = {
  provider: "Copernicus",
  sensor: "C - SAR",
  resolution: "10m",
  cloud: "No Data",
  bands: "VV + VH",
  level: "GRD",
  aoiCoverage: "100.0%",
  crs: "WGS 84 / UTM 52N",
}

// 예시 이미지: src/assets/samples/{카테고리}-{번호}.png (EXAMPLE 표기된 임의 PNG). 실제 데이터 연동 확정 시 교체
const exampleImages = import.meta.glob<string>("./assets/samples/*.png", { eager: true, import: "default" })
const exampleImage = (name: string) => exampleImages[`./assets/samples/${name}.png`]

/** 메타정보: 예시 이미지라 값은 비워 두고('정보 미제공'), 유형에 안 맞는 항목만 null('해당 없음') */
const exampleMeta: Record<Exclude<CategoryId, "sar">, Meta> = {
  optical: {},
  hyperspectral: {},
  // 피그마 선박 SAR 영상으로 만든 결과라 원본 메타정보를 따름
  detection: busanMeta,
  segmentation: busanMeta,
  "drone-lidar": { cloud: null, bands: null },
  "drone-sar": { cloud: null },
}

const sarSamples: Sample[] = ["01", "02", "03"].map((n) => ({
  id: `sar-${n}`,
  title: `위성 데이터 샘플 ${n}`,
  thumbLabel: `샘플 데이터_${n}`,
  region: "부산항 인근",
  date: "2025년 9월 28일",
  country: "대한민국",
  field: "ocean",
  category: "sar",
  image: shipSample,
  file: shipSample,
  meta: busanMeta,
}))

const exampleSamples: Sample[] = (Object.keys(exampleMeta) as (keyof typeof exampleMeta)[]).flatMap((category) =>
  ["01", "02"].map((n) => {
    const image = exampleImage(`${category}-${n}`)
    const name = CATEGORIES.find((c) => c.id === category)!.name
    return {
      id: `${category}-${n}`,
      title: `${name} 샘플 ${n}`,
      thumbLabel: `샘플 데이터_${n}`,
      region: `예시 지역 ${n}`,
      date: "촬영일 미정",
      country: "예시 데이터",
      field: "ocean" as const,
      category,
      image,
      file: image,
      meta: exampleMeta[category],
    }
  }),
)

export const SAMPLES: Sample[] = [...sarSamples, ...exampleSamples]

/** field가 null이면 전체 분야 */
export const samplesFor = (field: FieldId | null, category: CategoryId) =>
  SAMPLES.filter((s) => s.category === category && (field === null || s.field === field))

export const availableCategories = (field: FieldId | null) =>
  CATEGORIES.filter((c) => samplesFor(field, c.id).length > 0).map((c) => c.id)
