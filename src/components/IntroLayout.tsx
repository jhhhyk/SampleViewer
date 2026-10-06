import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * 분야 선택·문의 화면 공용 레이아웃.
 * 모바일: 소개 → 본문 → 보조 탐색 세로 배치 / xl: 왼쪽 소개·탐색, 오른쪽 본문 (피그마)
 * fit: 화면 높이에 고정하고 본문이 남는 공간을 채움. 아주 작은 화면에서만 내부 스크롤로 대비
 */
export function IntroLayout({
  title,
  description,
  links,
  mainWidth,
  fit,
  children,
}: {
  title: string
  description: ReactNode
  links?: ReactNode
  mainWidth: string
  fit?: boolean
  children: ReactNode
}) {
  return (
    <main
      className={cn(
        "grid flex-1 gap-y-[clamp(14px,3vh,40px)] px-5 py-[clamp(14px,3vh,56px)] md:px-10",
        "xl:grid-cols-[auto_minmax(0,var(--main-w))] xl:grid-rows-[1fr_auto] xl:justify-between xl:gap-x-12 xl:gap-y-0 xl:px-[clamp(48px,7.9vw,144px)] xl:py-[clamp(24px,7.4vh,80px)]",
        links ? "grid-rows-[auto_1fr_auto]" : "grid-rows-[auto_1fr]",
        fit && "h-[calc(100dvh-var(--header-h))] min-h-0 flex-none overflow-y-auto",
      )}
      style={{ "--main-w": mainWidth } as React.CSSProperties}
    >
      <div className="xl:col-start-1 xl:row-start-1 xl:pt-[clamp(0px,6.1vh,66px)]">
        <h1 className="text-[clamp(24px,4.2vh,40px)] leading-[1.26] font-medium tracking-[-0.06em] whitespace-pre xl:text-[clamp(36px,min(3.4vw,5.7vh),62px)]">
          {title}
        </h1>
        <div className="mt-[clamp(8px,2vh,24px)] max-w-[336px] text-[clamp(14px,2.1vh,18px)] leading-[1.73] font-medium tracking-[-0.07em] xl:mt-[clamp(16px,5.6vh,61px)] xl:ml-[7px] xl:text-[clamp(16px,min(1.2vw,2vh),22px)]">
          {description}
        </div>
      </div>

      <div className="min-h-0 xl:col-start-2 xl:row-span-2 xl:row-start-1">{children}</div>

      {links && <div className="xl:col-start-1 xl:row-start-2 xl:mb-[clamp(0px,1.6vh,17px)]">{links}</div>}
    </main>
  )
}
