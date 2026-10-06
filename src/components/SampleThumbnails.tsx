import type { Sample } from "@/data"

/** 영상 위에 겹치는 샘플 선택 목록. 넘치면 가로 스크롤 */
export function SampleThumbnails({ samples, selectedId, onSelect }: { samples: Sample[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <div role="radiogroup" aria-label={`샘플 목록 (${samples.length}개)`} className="flex gap-3 overflow-x-auto px-4 py-[4px] md:gap-[26px] md:px-[46px]">
      {samples.map((s) => (
        <label
          key={s.id}
          className="relative flex aspect-[351/145] w-[clamp(160px,19.2vw,351px)] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[3px] border border-[#3e4347] bg-surface outline-offset-2 has-checked:outline-3 has-checked:outline-white has-focus-visible:outline-3 has-focus-visible:outline-ocean"
        >
          <input type="radio" name="sample" className="sr-only" checked={s.id === selectedId} onChange={() => onSelect(s.id)} />
          <img src={s.image} alt="" className="absolute inset-0 size-full scale-150 object-cover brightness-75" />
          <span className="relative text-[clamp(15px,1.42vw,26px)] font-medium tracking-[-0.05em] text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]">{s.thumbLabel}</span>
        </label>
      ))}
    </div>
  )
}
