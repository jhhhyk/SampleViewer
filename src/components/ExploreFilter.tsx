import { CATEGORY_GROUPS, type CategoryId } from "@/data"

/**
 * 탐색 필터: 7개 칩 전체가 하나의 라디오 그룹 (단일 선택, 방향키 이동은 네이티브 동작)
 * 숫자 값은 피그마 px. 사이드바의 배율 단위(--spacing)로 함께 줄고 늘어남
 */
export function ExploreFilter({
  selected,
  available,
  onSelect,
}: {
  selected: CategoryId | null
  available: CategoryId[]
  onSelect: (id: CategoryId) => void
}) {
  return (
    <fieldset className="px-74 pt-36">
      <legend className="float-left fs-19 leading-32 font-bold tracking-[-0.06em]">탐색 필터</legend>
      <div className="clear-both flex flex-col gap-20 pt-21">
        {CATEGORY_GROUPS.map((g) => (
          <div key={g.id} className="flex items-start gap-28">
            <span className="shrink-0 fs-16 leading-32 font-bold tracking-[-0.03em]">{g.name}</span>
            <div className="flex flex-wrap gap-15">
              {g.categories.map((c) => (
                <CategoryChip
                  key={c.id}
                  name={c.name}
                  checked={selected === c.id}
                  disabled={!available.includes(c.id)}
                  onSelect={() => onSelect(c.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

function CategoryChip({ name, checked, disabled, onSelect }: { name: string; checked: boolean; disabled: boolean; onSelect: () => void }) {
  return (
    <label
      title={disabled ? "이 분야의 샘플 없음" : undefined}
      className="flex h-32 w-120 cursor-pointer items-center justify-center rounded-full bg-chip fs-16 font-bold tracking-[-0.03em] whitespace-nowrap text-white transition-colors hover:not-has-checked:bg-[#b0b0b0] has-checked:bg-ink has-disabled:cursor-not-allowed has-disabled:bg-[#e6e6e6] has-disabled:text-[#a8a8a8] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
    >
      <input type="radio" name="category" className="sr-only" checked={checked} disabled={disabled} onChange={onSelect} />
      {name}
      {disabled && <span className="sr-only"> (이 분야의 샘플 없음)</span>}
    </label>
  )
}
