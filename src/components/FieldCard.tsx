/**
 * 활용 분야 카드 / 탐색 유형별 카테고리 카드 공용. 대표 이미지는 아직 없어 배경색으로 대체.
 * 피그마의 파란 카드는 호버·누름 상태
 */
export function FieldCard({ name, note, onSelect }: { name: string; note?: string; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="flex size-full flex-col items-center justify-center gap-2 rounded-[3px] text-center bg-surface text-[clamp(22px,min(5.5vw,5.2vh),56px)] font-medium tracking-[-0.05em] text-ink-strong transition-colors hover:bg-ocean focus-visible:bg-ocean active:bg-ocean active:brightness-95 xl:text-[clamp(28px,min(3.1vw,5.2vh),56px)]"
    >
      {name}
      {note && <span className="text-[clamp(12px,1.5vh,15px)] font-medium tracking-normal text-[#777]">{note}</span>}
    </button>
  )
}
