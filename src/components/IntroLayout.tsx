import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * 분야 선택·문의 화면 공용 레이아웃.
 * 모바일: 소개 → 본문 → 보조 탐색 세로 배치 / 넓은 화면(wide): 왼쪽 소개·탐색, 오른쪽 본문 (피그마)
 * wideFrom: 2단으로 바뀌는 너비. 기본 xl, 폼처럼 본문 폭이 필요 없는 화면은 lg부터 (index.css의 wide 변형)
 * fit: 화면 높이에 고정하고 본문이 남는 공간을 채움. 아주 작은 화면에서만 내부 스크롤로 대비
 */
export function IntroLayout({
  title,
  description,
  links,
  mainWidth,
  fit,
  wideFrom = "xl",
  children,
}: {
  title: string
  description: ReactNode
  links?: ReactNode
  mainWidth: string
  fit?: boolean
  wideFrom?: "lg" | "xl"
  children: ReactNode
}) {
  return (
    <main
      className={cn(
        "grid flex-1 gap-y-[clamp(14px,3vh,40px)] px-5 py-[clamp(14px,3vh,56px)] md:px-10",
        "wide:grid-cols-[auto_minmax(0,var(--main-w))] wide:grid-rows-[1fr_auto] wide:justify-between wide:gap-x-12 wide:gap-y-0 wide:px-[clamp(48px,7.9vw,144px)] wide:py-[clamp(24px,7.4vh,80px)]",
        links ? "grid-rows-[auto_1fr_auto]" : "grid-rows-[auto_1fr]",
        fit && "h-[calc(100dvh-var(--header-h))] min-h-0 flex-none overflow-y-auto",
      )}
      data-wide={wideFrom}
      style={{ "--main-w": mainWidth } as React.CSSProperties}
    >
      <div className="wide:col-start-1 wide:row-start-1 wide:pt-[clamp(0px,6.1vh,66px)]">
        <h1 className="text-display whitespace-pre">
          {title}
        </h1>
        <div className="mt-[clamp(8px,2vh,24px)] max-w-[336px] text-intro wide:mt-[clamp(16px,5.6vh,61px)] wide:ml-[7px]">
          {description}
        </div>
      </div>

      <div className="min-h-0 wide:col-start-2 wide:row-span-2 wide:row-start-1">{children}</div>

      {links && <div className="wide:col-start-1 wide:row-start-2 wide:mb-[clamp(0px,1.6vh,17px)]">{links}</div>}
    </main>
  )
}
