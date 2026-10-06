import type { Sample } from "@/data"

const base = "flex h-70 flex-1 items-center justify-center rounded-[3px] border border-line fs-16 font-bold tracking-[-0.03em]"

/** 샘플 데이터 받기 / 데이터 이용 상담 */
export function SampleActions({ sample, onInquiry }: { sample: Sample | null; onInquiry: () => void }) {
  return (
    <div className="flex gap-25 px-48 pb-26">
      {sample?.file ? (
        <a href={sample.file} download={`${sample.id}.png`} className={`${base} hover:bg-surface`}>
          샘플 데이터 받기
        </a>
      ) : (
        <button disabled className={`${base} cursor-not-allowed text-[#a8a8a8]`}>
          {sample ? "다운로드 준비 중" : "샘플 데이터 받기"}
        </button>
      )}
      <button onClick={onInquiry} className={`${base} hover:bg-surface`}>
        데이터 이용 상담
      </button>
    </div>
  )
}
