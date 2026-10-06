import { ExploreTypeLinks } from "@/components/ExploreTypeLinks"
import { FieldCard } from "@/components/FieldCard"
import { IntroLayout } from "@/components/IntroLayout"
import { CATEGORY_GROUPS, FIELDS, samplesFor, type CategoryId, type FieldId, type GroupId } from "@/data"

/** 첫 화면. 탐색 유형을 고르면 오른쪽이 해당 유형의 카테고리 세로 카드로 바뀜 (피그마 1:843) */
export function FieldSelect({
  group,
  onGroup,
  onField,
  onCategory,
}: {
  group: GroupId | null
  onGroup: (id: GroupId | null) => void
  onField: (id: FieldId) => void
  onCategory: (id: CategoryId) => void
}) {
  const current = CATEGORY_GROUPS.find((g) => g.id === group)

  return (
    <IntroLayout
      fit
      title={"스텔라비전\n위성 데이터 탐색"}
      description="스텔라비전이 제공하는 위성 데이터 샘플과 주요 정보를 확인하고, 필요한 데이터의 제공 여부를 문의할 수 있습니다."
      links={<ExploreTypeLinks title="탐색 유형" selected={group} onSelect={onGroup} />}
      mainWidth="1030px"
    >
      <section className="flex h-full flex-col">
        <h2 className="text-[clamp(16px,2.4vh,22px)] leading-[1.73] font-bold tracking-[-0.08em] xl:ml-[10px]">
          {current ? `${current.name} 데이터` : "관심 있는 활용 분야"}
        </h2>

        {current ? (
          <div
            className="mt-[clamp(8px,1.5vh,16px)] grid min-h-0 flex-1 gap-3 md:gap-[26px]"
            style={{ gridTemplateColumns: `repeat(${current.categories.length}, minmax(0, 1fr))` }}
          >
            {current.categories.map((c) => (
              <FieldCard
                key={c.id}
                name={c.name}
                note={samplesFor(null, c.id).length ? undefined : "샘플 준비 중"}
                onSelect={() => onCategory(c.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-[clamp(8px,1.5vh,16px)] grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 md:gap-x-[26px] md:gap-y-[22px]">
            {FIELDS.map((f) => (
              <FieldCard key={f.id} name={f.name} onSelect={() => onField(f.id)} />
            ))}
          </div>
        )}
      </section>
    </IntroLayout>
  )
}
