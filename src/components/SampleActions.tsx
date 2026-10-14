import type { Sample } from "@/data"

const base = "flex h-70 max-md:h-56 flex-1 items-center justify-center rounded-md border border-border text-panel-label"

/** 샘플 데이터 받기 / 데이터 이용 상담 */
export function SampleActions({ sample, onInquiry }: { sample: Sample | null; onInquiry: () => void }) {
  return (
    <div className="flex gap-25 px-48 pb-26 max-md:gap-12 max-md:px-20 max-md:pb-16">
      {sample?.file ? (
        <a href={sample.file} download={`${sample.id}.png`} className={`${base} hover:bg-muted`}>
          샘플 데이터 받기
        </a>
      ) : (
        <button disabled className={`${base} cursor-not-allowed text-disabled-foreground`}>
          {sample ? "다운로드 준비 중" : "샘플 데이터 받기"}
        </button>
      )}
      <button onClick={onInquiry} className={`${base} hover:bg-muted`}>
        데이터 이용 상담
      </button>
    </div>
  )
}
