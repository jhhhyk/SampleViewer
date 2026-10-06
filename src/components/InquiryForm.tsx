import { useState, type ReactNode } from "react"

export type InquiryContext = { field: string; category: string | null; sample: string | null; region: string }

const inputClass = "w-full rounded-[3px] border border-line bg-white px-[12px] py-[clamp(6px,1vh,10px)] text-[15px] outline-none md:text-[16px] focus:border-ink user-invalid:border-red-500"

/** 문의 맥락 요약 + 입력 폼 + 완료 예시. 실제 전송 없음 */
export function InquiryForm({ context, onBack }: { context: InquiryContext; onBack: () => void }) {
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-[16px] p-5 text-center">
        <p className="text-[14px] text-[#777]">목업 화면입니다. 실제로 전송되지 않았습니다.</p>
        <h2 className="text-[32px] font-bold tracking-[-1.5px]">문의 접수 완료 예시</h2>
        <p className="text-[18px]">입력하신 이메일로 제공 가능한 데이터를 안내해드립니다.</p>
        <button onClick={onBack} className="mt-[16px] h-[56px] rounded-[3px] border border-line bg-white px-[32px] font-bold">
          샘플 재선택
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
      <dl className="flex flex-wrap gap-x-[32px] gap-y-1 rounded-[3px] bg-white px-[clamp(12px,1.5vw,20px)] py-[clamp(6px,1.3vh,14px)] text-[clamp(13px,1.5vh,15px)]">
        <Summary label="분야" value={context.field} />
        <Summary label="카테고리" value={context.category ?? "선택 없음"} />
        <Summary label="샘플" value={context.sample ?? "선택 없음"} />
      </dl>

      <div className="grid grid-cols-2 gap-x-[clamp(10px,1.5vw,18px)] gap-y-[clamp(8px,1.7vh,18px)]">
        <Field label="이름" required><input name="name" required autoComplete="name" className={inputClass} /></Field>
        <Field label="이메일" required><input name="email" type="email" required autoComplete="email" className={inputClass} /></Field>
        <Field label="회사·기관명"><input name="org" autoComplete="organization" className={inputClass} /></Field>
        <Field label="관심 지역" required><input name="region" required defaultValue={context.region} className={inputClass} /></Field>
      </div>
      <Field label="활용 목적" required grow><textarea name="purpose" required className={`${inputClass} min-h-[44px] flex-1 resize-none`} /></Field>
      <Field label="추가 요청" grow><textarea name="extra" placeholder="기간, 범위, 필요한 결과 등" className={`${inputClass} min-h-[44px] flex-1 resize-none`} /></Field>

      <button type="submit" className="h-[clamp(44px,6.5vh,70px)] shrink-0 rounded-[3px] bg-ink text-[16px] font-bold tracking-[-0.48px] text-white hover:bg-ink-strong">
        문의하기
      </button>
    </form>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-[8px]">
      <dt className="text-[#777]">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  )
}

/** grow: 남는 높이를 나눠 가짐 (textarea용) */
function Field({ label, required, grow, children }: { label: string; required?: boolean; grow?: boolean; children: ReactNode }) {
  return (
    <label className={`flex flex-col gap-[4px] text-[clamp(13px,1.6vh,15px)] font-medium ${grow ? "min-h-0 flex-1" : ""}`}>
      <span>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  )
}
