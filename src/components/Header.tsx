import logo from "@/assets/logo-stellarvision.png"

export function Header({ onHome, onContact }: { onHome: () => void; onContact: () => void }) {
  return (
    <header className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-border-soft px-4 md:px-8">
      <button onClick={onHome} aria-label="Stellarvision 처음으로" className="rounded-sm">
        <img src={logo} alt="" width={656} height={113} className="h-7 w-auto md:h-8" />
      </button>
      <button
        onClick={onContact}
        className="rounded-full px-3 py-1.5 text-label text-foreground-strong transition-colors hover:bg-muted"
      >
        Contact Us
      </button>
    </header>
  )
}
