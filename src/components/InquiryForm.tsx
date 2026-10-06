import { useState, type ComponentProps, type ReactNode } from "react"
import { CATEGORIES, CATEGORY_GROUPS, FIELDS, type CategoryId, type FieldId } from "@/data"

/** 보고 있던 맥락. 관심 분야·카테고리 선택란의 초기값 */
export type InquiryContext = { field: FieldId | null; category: CategoryId | null }

/** 문의를 구글 시트에 한 줄씩 쌓는 Apps Script 웹 앱 (공개 페이지라 주소도 공개됨) */
const INQUIRY_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzby_Zi5__dqWObORjLFOoqEypoICcJBKKig2orJQN4CKeCQOIjECr3trISGgYcPvw/exec"

const baseClass = "w-full rounded-[3px] border border-line bg-white px-[12px] text-[15px] outline-none md:text-[16px] focus:border-ink user-invalid:border-red-500"
/** 한 줄 입력·선택란 공용 높이 */
const controlClass = `${baseClass} h-[clamp(38px,5vh,46px)]`
const areaClass = `${baseClass} min-h-[40px] flex-1 resize-none py-[clamp(6px,1vh,10px)]`

/** 문의 입력 폼 → Apps Script로 전송 → 완료 안내 */
export function InquiryForm({ context, onBack, onHome }: { context: InquiryContext; onBack?: () => void; onHome: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "done">("idle")

  if (status === "done") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-[16px] p-5 text-center">
        <h2 className="text-[32px] font-bold tracking-[-1.5px]">문의가 접수되었습니다</h2>
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
      onSubmit={async (e) => {
        e.preventDefault()
        const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
        setStatus("sending")
        try {
          // text/plain으로 보내야 브라우저 사전 요청(preflight) 없이 Apps Script에 도달
          const res = await fetch(INQUIRY_ENDPOINT, {
            method: "POST",
            body: JSON.stringify({
              ...f,
              field: FIELDS.find((x) => x.id === f.field)?.name ?? "",
              category: CATEGORIES.find((x) => x.id === f.category)?.name ?? "",
            }),
          })
          if (!res.ok) throw new Error(String(res.status))
          setStatus("done")
        } catch {
          // 입력 내용은 비제어 input이라 그대로 남음
          setStatus("error")
        }
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

      {/* 스팸 봇용 숨은 칸. 사람은 보지도 채우지도 않음 */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {status === "error" && (
        <p role="alert" className="-mb-1 shrink-0 text-[14px] font-medium text-red-600">
          전송하지 못했습니다. 잠시 후 다시 시도해 주세요. 입력하신 내용은 그대로 있습니다.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="h-[clamp(44px,6.5vh,70px)] shrink-0 rounded-[3px] bg-ink text-[16px] font-bold tracking-[-0.48px] text-white hover:bg-ink-strong disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? "전송 중…" : "문의하기"}
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
