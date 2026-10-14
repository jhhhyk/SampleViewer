/**
 * 활용 분야 카드 / 탐색 유형별 카테고리 카드 공용. 대표 이미지는 아직 없어 배경색으로 대체.
 * 피그마의 파란 카드는 호버·누름 상태
 */
export function FieldCard({ name, note, onSelect }: { name: string; note?: string; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="flex size-full flex-col items-center justify-center gap-2 rounded-md text-center bg-muted text-card-title text-accent-foreground transition-colors hover:bg-accent focus-visible:bg-accent active:bg-accent active:brightness-95"
    >
      {name}
      {note && <span className="text-card-note text-muted-foreground">{note}</span>}
    </button>
  )
}
