import { InquiryForm, type InquiryContext } from "@/components/InquiryForm"
import { IntroLayout } from "@/components/IntroLayout"

const linkClass = "block text-[clamp(14px,1.8vh,16px)] font-bold underline underline-offset-4"

export function Inquiry({
  context,
  onBack,
  onHome,
}: {
  context: InquiryContext
  /** 없으면(Contact Us로 진입) 샘플 재선택 링크를 숨김 */
  onBack?: () => void
  onHome: () => void
}) {
  return (
    <IntroLayout
      fit
      title={"스텔라비전\n위성 데이터 이용 문의"}
      description={
        <>
          {/* 세로 배치에서 화면이 낮으면 폼 공간을 위해 숨김 */}
          <p className="max-w-[297px] max-xl:[@media(max-height:720px)]:hidden">관심 분야와 활용 목적을 기준으로 제공 가능한 데이터를 안내해드립니다.</p>
          <p className="mt-[clamp(6px,1.2vh,12px)] text-[clamp(13px,1.5vh,15px)] xl:mt-[clamp(6px,2.4vh,28px)] font-bold tracking-[-0.04em]">* 11월 30일까지 이메일로 회신 예정</p>
          <div className="mt-[clamp(10px,2.2vh,24px)] flex flex-wrap items-start gap-x-5 gap-y-[10px] xl:flex-col">
            {onBack && (
              <button onClick={onBack} className={linkClass}>
                ← 샘플 재선택
              </button>
            )}
            <button onClick={onHome} className={linkClass}>
              ← 처음으로 돌아가기
            </button>
          </div>
        </>
      }
      mainWidth="906px"
    >
      <section className="flex h-full flex-col rounded-[3px] bg-surface xl:mt-[clamp(0px,5vh,54px)] xl:h-[calc(100%-clamp(0px,5vh,54px))]">
        <InquiryForm context={context} onBack={onBack} onHome={onHome} />
      </section>
    </IntroLayout>
  )
}
