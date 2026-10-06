import { useState, type ComponentProps, type ReactNode } from "react"
import { CATEGORY_GROUPS, FIELDS, type CategoryId, type FieldId } from "@/data"

/** 보고 있던 맥락. 관심 분야·카테고리 선택란의 초기값 */
export type InquiryContext = { field: FieldId | null; category: CategoryId | null }

const baseClass = "w-full rounded-[3px] border border-line bg-white px-[12px] text-[15px] outline-none md:text-[16px] focus:border-ink user-invalid:border-red-500"
/** 한 줄 입력·선택란 공용 높이 */
const controlClass = `${baseClass} h-[clamp(38px,5vh,46px)]`
const areaClass = `${baseClass} min-h-[40px] flex-1 resize-none py-[clamp(6px,1vh,10px)]`

/** 문의 맥락 요약 + 입력 폼 + 완료 예시. 실제 전송 없음 */
export function InquiryForm({ context, onBack, onHome }: { context: InquiryContext; onBack?: () => void; onHome: () => void }) {
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-[16px] p-5 text-center">
        <p className="text-[14px] text-[#777]">목업 화면입니다. 실제로 전송되지 않았습니다.</p>
        <h2 className="text-[32px] font-bold tracking-[-1.5px]">문의 접수 완료 예시</h2>
        <p className="text-[18px]">입력하신 이메일로 제공 가능한 데이터를 안내해드립니다.</p>
        <button onClick={onBack ?? onHome} className="mt-[16px] h-[56px] rounded-[3px] border border-line bg-white px-[32px] font-bold">
          {onBack ? "샘플 재선택" : "처음으로 돌아가기"}
        </button>
      </div>
    )
  }

  return (
    <form
      className="flex min-h-0 flex-1 flex-col gap-[clamp(8px,1.7vh,18px)] p-[clamp(14px,3.5vh,48px)]"
      onSubmit={(e) => {
        e.preventDefault()
        setDone(true)
      }}
    >
      {/* 모바일 2열: 이름·이메일 / 회사 / 분야·카테고리. lg 6칸 그리드: 위 3칸씩, 아래 2칸씩 */}
      <div className="grid grid-cols-2 gap-x-[clamp(10px,1.5vw,18px)] gap-y-[clamp(8px,1.7vh,18px)] lg:grid-cols-6">
        <Field label="이름" required className="lg:col-span-2">
          <input name="name" required autoComplete="name" className={controlClass} />
        </Field>
        <Field label="이메일" required className="lg:col-span-2">
          <input name="email" type="email" required autoComplete="email" className={controlClass} />
        </Field>
        <Field label="회사·기관명" className="col-span-2">
          <input name="org" autoComplete="organization" className={controlClass} />
        </Field>
        <Field label="관심 분야" required className="lg:col-span-3">
          <Select name="field" required defaultValue={context.field ?? ""}>
            <option value="" disabled>선택해 주세요</option>
            {FIELDS.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="관심 카테고리" className="lg:col-span-3">
          <Select name="category" defaultValue={context.category ?? ""}>
            <option value="">아직 정하지 않음</option>
            {CATEGORY_GROUPS.map((g) => (
              <optgroup key={g.id} label={g.name}>
                {g.categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>
      </div>
      {/* 세로 배치에서 화면이 낮으면 두 칸을 나란히 놓아 한 줄 절약 */}
      <div className="flex flex-1 flex-col gap-[clamp(8px,1.7vh,18px)] max-xl:[@media(max-height:900px)]:flex-row">
        <Field label="활용 목적" required className="flex-1">
          <textarea name="purpose" required rows={1} className={areaClass} />
        </Field>
        <Field label="추가 요청" className="flex-1">
          <textarea name="extra" rows={1} placeholder="기간, 범위 등" className={areaClass} />
        </Field>
      </div>

      <button type="submit" className="h-[clamp(44px,6.5vh,70px)] shrink-0 rounded-[3px] bg-ink text-[16px] font-bold tracking-[-0.48px] text-white hover:bg-ink-strong">
        문의하기
      </button>
    </form>
  )
}

function Field({ label, required, className = "", children }: { label: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <label className={`flex flex-col gap-[4px] text-[clamp(13px,1.6vh,15px)] font-medium ${className}`}>
      <span>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  )
}

/** 기본 화살표 대신 입력칸과 같은 모양 + 얇은 chevron. 필수 항목이 비어 있으면 안내 문구처럼 회색 */
function Select(props: ComponentProps<"select">) {
  return (
    <span className="relative block">
      <select {...props} className={`${controlClass} cursor-pointer appearance-none pr-9 invalid:text-[#9a9a9a] [&_option]:text-ink`} />
      <svg aria-hidden viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#777]">
        <path d="M4 6l4 4 4-4" />
      </svg>
    </span>
  )
}
