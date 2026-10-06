import { useEffect, useRef, useState, type ReactNode } from "react"

const MIN = 1
const MAX = 8
const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v))

/** 선택 영상 표시 + 확대·이동. 샘플이 바뀌면 key로 재마운트해 시점 초기화 */
export function ImageViewer({ src, alt, overlay }: { src: string; alt: string; overlay?: ReactNode }) {
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 })
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const drag = useRef<{ x: number; y: number } | null>(null)
  const surface = useRef<HTMLDivElement>(null)

  const zoom = (factor: number) => setView((v) => ({ ...v, scale: clamp(v.scale * factor) }))
  const reset = () => setView({ scale: 1, x: 0, y: 0 })

  // React onWheel은 passive라 페이지 스크롤을 막지 못함 → 네이티브 리스너
  useEffect(() => {
    const el = surface.current!
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setView((v) => ({ ...v, scale: clamp(v.scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15)) }))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  return (
    <div className="relative h-full overflow-hidden bg-black">
      <div
        ref={surface}
        // 확대 전에는 세로 스와이프를 페이지 스크롤에 양보 (모바일)
        className={`size-full cursor-grab active:cursor-grabbing ${view.scale > 1 ? "touch-none" : "touch-pan-y"}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          drag.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerMove={(e) => {
          if (!drag.current) return
          const dx = e.clientX - drag.current.x
          const dy = e.clientY - drag.current.y
          drag.current = { x: e.clientX, y: e.clientY }
          setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }))
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          className="size-full object-cover object-left-bottom select-none"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        />
      </div>

      {status !== "ready" && (
        <p className="absolute inset-0 flex items-center justify-center text-[18px] text-white/70">
          {status === "loading" ? "영상을 불러오는 중…" : "영상을 불러오지 못했습니다."}
        </p>
      )}

      {overlay && <div className="absolute inset-x-0 top-3 md:top-[51px]">{overlay}</div>}

      <div className="absolute right-3 bottom-3 md:right-[24px] md:bottom-[24px] flex overflow-hidden rounded-[3px] border border-white/30 bg-black/60 text-white">
        <ViewerButton label="확대" onClick={() => zoom(1.5)}>+</ViewerButton>
        <ViewerButton label="축소" onClick={() => zoom(1 / 1.5)}>−</ViewerButton>
        <ViewerButton label="초기화" onClick={reset}>초기화</ViewerButton>
      </div>
    </div>
  )
}

function ViewerButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button aria-label={label} onClick={onClick} className="h-[40px] min-w-[40px] px-[12px] text-[16px] hover:bg-white/15">
      {children}
    </button>
  )
}
