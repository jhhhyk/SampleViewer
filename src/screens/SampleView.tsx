import { ExploreFilter } from "@/components/ExploreFilter"
import { ImageViewer } from "@/components/ImageViewer"
import { SampleActions } from "@/components/SampleActions"
import { SampleDetail } from "@/components/SampleDetail"
import { SampleThumbnails } from "@/components/SampleThumbnails"
import { FIELDS, availableCategories, samplesFor, type CategoryId, type FieldId } from "@/data"

export function SampleView({
  field,
  category,
  sampleId,
  onField,
  onCategory,
  onSample,
  onInquiry,
}: {
  field: FieldId | null
  category: CategoryId | null
  sampleId: string | null
  onField: (id: FieldId | null) => void
  onCategory: (id: CategoryId) => void
  onSample: (id: string) => void
  onInquiry: () => void
}) {
  const samples = category ? samplesFor(field, category) : []
  const sample = samples.find((s) => s.id === sampleId) ?? null
  const available = availableCategories(field)

  return (
    <main className="flex flex-1 flex-col lg:h-[calc(100dvh-var(--header-h))] lg:flex-none lg:flex-row">
      <section className="h-[60vh] min-h-[360px] lg:h-auto lg:min-w-0 lg:flex-1">
        {sample ? (
          <ImageViewer
            key={sample.id}
            src={sample.image}
            alt={`${sample.title} ${sample.region}`}
            overlay={<SampleThumbnails samples={samples} selectedId={sample.id} onSelect={onSample} />}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-[12px] bg-surface p-5 text-center">
            <p className="text-[24px] font-bold">이 조건의 샘플이 없습니다.</p>
            <p className="text-[18px]">{available.length ? "다른 카테고리를 선택하거나 " : "다른 분야를 선택하거나 "}데이터 이용 상담을 요청해 주세요.</p>
          </div>
        )}
      </section>

      {/*
        사이드바 배율 단위: --spacing = 피그마 1px. 패널 너비(649 기준)와 높이(내용 708 + 최소 여백 60 = 768 기준) 중
        작은 쪽에 맞춰 0.6~1배로 줄어 스크롤 없이 한 화면에 들어옴. 남는 높이는 아래 spacer들이 피그마 여백 비율로 나눠 가짐
      */}
      <aside className="@container flex flex-col [--spacing:clamp(0.6px,100cqw/649,1px)] lg:w-[clamp(480px,35.6vw,649px)] lg:shrink-0 lg:overflow-y-auto lg:[container-type:size] lg:[--spacing:clamp(0.6px,min(100cqh/768,100cqw/649),1px)]">
        <div className="relative">
          <label className="absolute top-36 right-64 flex items-center gap-8 fs-15 font-medium">
            활용 분야
            <select
              value={field ?? ""}
              onChange={(e) => onField((e.target.value || null) as FieldId | null)}
              className="h-32 rounded-[3px] border border-line px-8 font-bold"
            >
              <option value="">전체 분야</option>
              {FIELDS.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </label>
          <ExploreFilter selected={category} available={available} onSelect={onCategory} />
        </div>

        <div aria-hidden className="min-h-24 grow-85" />
        {sample && <SampleDetail sample={sample} />}
        <div aria-hidden className="min-h-20 grow-104" />

        <div className="sticky bottom-0 border-t border-line-soft bg-white pt-20 lg:border-t-0 lg:pt-0">
          <SampleActions sample={sample} onInquiry={onInquiry} />
        </div>
      </aside>
    </main>
  )
}
