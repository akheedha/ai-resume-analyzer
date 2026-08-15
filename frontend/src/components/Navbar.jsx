import { BriefcaseBusiness, ChevronDown } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-3" aria-label="ResumeForge AI home">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-brand-primary/30 bg-brand-primary/10 text-brand-soft transition group-hover:border-brand-primary/60 group-hover:bg-brand-primary/15"><BriefcaseBusiness size={19} strokeWidth={2.2} /></span>
          <span className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">ResumeForge <span className="text-brand-soft">AI</span></span>
        </a>
        <div className="hidden items-center gap-1 p-1 text-sm font-medium text-text-secondary md:flex">
          <a href="#top" className="rounded-lg bg-brand-primary/10 px-3 py-2 text-brand-soft transition">Dashboard</a>
          <a href="#features" className="rounded-lg px-3 py-2 transition hover:bg-elevated hover:text-text-primary">Features</a>
          <a href="#about" className="rounded-lg px-3 py-2 transition hover:bg-elevated hover:text-text-primary">About</a>
        </div>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1.5 text-sm text-text-secondary transition hover:border-brand-primary/30 hover:text-text-primary" aria-label="Open account menu"><span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-primary text-[10px] font-bold text-background">AK</span><span className="hidden sm:inline">Account</span><ChevronDown size={15} className="hidden sm:block" /></button>
      </nav>
    </header>
  );
}

export default Navbar;
