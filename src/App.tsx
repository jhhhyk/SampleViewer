import { useState } from "react"
import { Header } from "@/components/Header"
import { availableCategories, samplesFor, type CategoryId, type FieldId, type GroupId } from "@/data"
import { FieldSelect } from "@/screens/FieldSelect"
import { Inquiry } from "@/screens/Inquiry"
import { SampleView } from "@/screens/SampleView"

type State = {
  screen: "fields" | "samples" | "inquiry"
  field: FieldId | null
  category: CategoryId | null
  sampleId: string | null
  /** 첫 화면에서 펼친 탐색 유형 */
  group: GroupId | null
}

const firstSample = (field: FieldId | null, category: CategoryId | null) =>
  category ? (samplesFor(field, category)[0]?.id ?? null) : null

/** 분야 진입·변경: 현재 카테고리에 샘플이 있으면 유지, 없으면 첫 이용 가능 카테고리 */
function enterField(field: FieldId | null, current: CategoryId | null): Omit<State, "group"> {
  const available = availableCategories(field)
  const category = current && available.includes(current) ? current : (available[0] ?? null)
  return { screen: "samples", field, category, sampleId: firstSample(field, category) }
}

export default function App() {
  const [state, setState] = useState<State>({ screen: "fields", field: null, category: null, sampleId: null, group: null })
  const update = (patch: Partial<State>) => setState((s) => ({ ...s, ...patch }))

  const changeField = (f: FieldId | null) => update(enterField(f, state.category))
  // 탐색 유형 카드에서 카테고리 직접 진입: 분야 미지정(전체 분야)
  const enterCategory = (c: CategoryId) => update({ screen: "samples", field: null, category: c, sampleId: firstSample(null, c) })

  return (
    <div className="flex min-h-dvh flex-col [--header-h:56px] md:[--header-h:64px]">
      <Header onHome={() => update({ screen: "fields", group: null })} onContact={() => update({ screen: "inquiry" })} />

      {state.screen === "fields" && (
        <FieldSelect
          group={state.group}
          onGroup={(g) => update({ group: g })}
          onField={changeField}
          onCategory={enterCategory}
        />
      )}

      {state.screen === "samples" && (
        <SampleView
          {...state}
          onField={changeField}
          onCategory={(c) => update({ category: c, sampleId: firstSample(state.field, c) })}
          onSample={(id) => update({ sampleId: id })}
          onInquiry={() => update({ screen: "inquiry" })}
        />
      )}

      {state.screen === "inquiry" && (
        <Inquiry
          key={state.sampleId}
          context={{
            field: state.field,
            category: state.category,
          }}
          // 샘플을 고른 적 없이(Contact Us) 들어왔으면 고를 곳인 첫 화면으로
          onBack={() => update({ screen: state.category ? "samples" : "fields" })}
          onHome={() => update({ screen: "fields", group: null })}
        />
      )}
    </div>
  )
}
