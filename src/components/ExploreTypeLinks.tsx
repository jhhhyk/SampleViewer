import { useEffect, useRef } from "react"
import ellipse from "@/assets/ellipse.svg"
import { CATEGORY_GROUPS, type GroupId } from "@/data"

/** 마우스가 이 거리(px) 안으로 들어오면 원이 진해지기 시작 */
const NEAR_RANGE = 220

/**
 * 첫 화면 오른쪽 내용 선택기: 활용 분야 탭(null) + Sensor / Analytics / Drone. 하나만 선택, 선택된 것은 커지고 강조.
 * 원은 마우스와의 거리에 따라 진해짐 (--near 0~1). 터치 기기는 선택·누름 상태만 표시
 */
export function ExploreTypeLinks({
  title,
  selected,
  onSelect,
}: {
  title: string
  /** null = 활용 분야 탭 */
  selected: GroupId | null
  onSelect: (group: GroupId | null) => void
}) {
  const circles = useRef<HTMLDivElement>(null)
  // 선택 안 된 쪽은 연하게
  const dim = (on: boolean) => (on ? "text-ink-strong" : "text-[#9a9a9a]")
  // '활용 분야' 탭과 '탐색 유형' 제목 공용: 선택되면 1.15배 + 굵게 + 밑줄
  const tab = (on: boolean) =>
    `block w-fit origin-left text-[clamp(16px,2.4vh,22px)] leading-[1.73] tracking-[-0.03em] transition-[color,scale] motion-reduce:transition-none xl:ml-[9px] ${on ? "scale-115 font-bold" : "font-medium"} ${dim(on)}`
  const underline = (on: boolean) =>
    `mt-0.5 block h-[2px] w-full origin-left bg-ocean-strong transition-[scale] motion-reduce:transition-none ${on ? "scale-x-100" : "scale-x-0"}`

  useEffect(() => {
    // 리렌더 없이 CSS 변수만 갱신
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      circles.current?.querySelectorAll<HTMLElement>("[data-circle]").forEach((el) => {
        const r = el.getBoundingClientRect()
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
        el.style.setProperty("--near", Math.max(0, 1 - d / NEAR_RANGE).toFixed(3))
      })
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  return (
    <section>
      <button
        aria-pressed={selected === null}
        onClick={() => onSelect(null)}
        className={`${tab(selected === null)} hover:text-ink`}
      >
        활용 분야
        <span className={underline(selected === null)} />
      </button>

      <h2 className={`mt-[clamp(10px,2.6vh,28px)] ${tab(selected !== null)}`}>
        {title}
        <span className={underline(selected !== null)} />
      </h2>

      <div ref={circles} className="mt-[clamp(8px,2.6vh,30px)] flex gap-[22px]">
        {CATEGORY_GROUPS.map((g) => (
          <button
            key={g.id}
            aria-pressed={selected === g.id}
            onClick={() => onSelect(g.id)}
            className="group flex flex-col items-center gap-[clamp(6px,1.8vh,19px)] rounded-full"
          >
            <span className={`text-[16px] font-medium tracking-[-0.05em] transition-[color,scale] group-hover:text-ink group-aria-pressed:scale-110 group-aria-pressed:font-bold motion-reduce:transition-none ${dim(selected === g.id)}`}>
              {g.linkLabel}
            </span>
            <img
              data-circle
              src={ellipse}
              alt=""
              width={88}
              height={88}
              className="size-[clamp(44px,8.1vh,88px)] rounded-full bg-[color-mix(in_srgb,var(--color-ocean)_calc(var(--near,0)*100%),transparent)] transition-[scale] group-active:bg-ocean group-aria-pressed:scale-115 group-aria-pressed:bg-ocean-strong motion-reduce:transition-none"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
