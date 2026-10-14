import logoOuter from "@/assets/logo-outer.svg"
import logoInner from "@/assets/logo-inner.svg"

export function Header({ onHome, onContact }: { onHome: () => void; onContact: () => void }) {
  return (
    <header className="grid h-(--header-h) shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-border-soft px-4 md:px-8">
      <button onClick={onHome} aria-label="StellarVision 처음으로" className="relative h-[48px] w-[48px] origin-left scale-[0.6] md:scale-[0.67]">
        <img src={logoOuter} alt="" className="absolute inset-0" width={47.96} height={48.04} />
        <img src={logoInner} alt="" className="absolute left-[1.72px] top-[1.75px]" width={44.5} height={44.54} />
      </button>
      <p className="font-en text-brand text-foreground-strong">StellarVision</p>
      <button
        onClick={onContact}
        className="justify-self-end rounded-full px-3 py-1.5 font-en text-label text-foreground-strong transition-colors hover:bg-muted"
      >
        Contact Us
      </button>
    </header>
  )
}
