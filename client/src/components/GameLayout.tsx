import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Activity, Award, BarChart3, ChevronRight, Crosshair, LayoutDashboard, Menu, Shield, Trophy, UserRound, X } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Missions", href: "/missions", icon: Crosshair },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Achievements", href: "/achievements", icon: Award },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3 focus-visible:outline-none">
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-cyan-300/40 bg-cyan-300/10 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,.18)]">
        <Shield className="h-5 w-5" strokeWidth={1.8} />
        <span className="absolute inset-x-0 top-1/2 h-px bg-cyan-200/40" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-sm font-bold tracking-[0.16em] text-white">CYBER SECURITY</span>
          <span className="mt-1 block font-mono text-[9px] tracking-[0.25em] text-cyan-300">SOCIETY // 01</span>
        </span>
      )}
    </Link>
  );
}

export default function GameLayout({ children, title, eyebrow, actions }: { children: ReactNode; title?: string; eyebrow?: string; actions?: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { player, level, levelTitle } = useGame();

  const nav = (
    <nav aria-label="Primary navigation" className="space-y-1.5">
      <p className="mb-3 px-3 font-mono text-[10px] tracking-[0.22em] text-slate-500">NAVIGATION</p>
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = location === item.href || (item.href === "/missions" && location.startsWith("/missions/"));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-white/[.08] text-white shadow-[inset_0_0_0_1px_rgba(34,211,238,.18)]" : "text-slate-400 hover:bg-white/[.045] hover:text-slate-100"}`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-cyan-300" : "text-slate-500 group-hover:text-cyan-300"}`} />
            <span>{item.label}</span>
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <div className="fixed inset-0 pointer-events-none cyber-grid opacity-70" />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[258px] flex-col border-r border-white/[.08] bg-[#090f1d]/90 px-5 py-6 backdrop-blur-xl lg:flex">
        <BrandMark />
        <div className="mt-10">{nav}</div>
        <div className="mt-auto rounded-2xl border border-white/[.09] bg-gradient-to-br from-white/[.06] to-transparent p-4">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.16em] text-slate-500"><span>AGENT STATUS</span><span className="flex items-center gap-1.5 text-emerald-300"><i className="h-1.5 w-1.5 rounded-full bg-emerald-300 pulse-dot" /> ONLINE</span></div>
          <p className="mt-3 text-sm font-semibold text-white">Cyber Recruit</p>
          <p className="mt-0.5 font-mono text-[10px] text-cyan-300">LVL {level} // {levelTitle.toUpperCase()}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[.08]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${(player.xp % 500) / 5}%` }} /></div>
          <p className="mt-2 font-mono text-[10px] text-slate-400">{player.xp.toLocaleString()} XP TOTAL</p>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-white/[.08] bg-[#070b14]/80 px-4 backdrop-blur-xl lg:ml-[258px] lg:px-8">
        <div className="flex items-center gap-3 lg:hidden"><button onClick={() => setOpen(true)} aria-label="Open navigation" className="rounded-lg border border-white/[.1] p-2 text-slate-300"><Menu className="h-5 w-5" /></button><BrandMark compact /></div>
        <div className="hidden lg:block"><p className="font-mono text-[10px] tracking-[0.18em] text-cyan-300">{eyebrow || "OPS // LIVE ENVIRONMENT"}</p><h1 className="mt-1 font-display text-xl font-bold text-white">{title || "Command centre"}</h1></div>
        <div className="flex items-center gap-3">{actions}<span className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[.06] px-3 py-1.5 font-mono text-[10px] text-emerald-300 sm:flex"><Activity className="h-3.5 w-3.5" /> SAFE SIMULATION</span><Link href="/admin" aria-label="Open admin prototype" className="grid h-9 w-9 place-items-center rounded-full border border-white/[.1] bg-white/[.05] text-xs font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10">CR</Link></div>
      </header>

      {open && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/70" aria-label="Close navigation" onClick={() => setOpen(false)} /><div className="relative flex h-full w-[290px] flex-col border-r border-white/[.1] bg-[#0a1020] p-5 shadow-2xl"><div className="flex items-center justify-between"><BrandMark /><button onClick={() => setOpen(false)} aria-label="Close navigation" className="rounded-lg p-2 text-slate-400 hover:bg-white/[.06]"><X className="h-5 w-5" /></button></div><div className="mt-10">{nav}</div></div></div>}

      <main className="relative pb-12 lg:ml-[258px]">{children}</main>
      <footer className="relative border-t border-white/[.07] px-5 py-5 text-center font-mono text-[10px] tracking-[0.12em] text-slate-500 lg:ml-[258px]">FICTIONAL SANDBOX · NO REAL SYSTEMS · LEARN SAFELY <ChevronRight className="mb-0.5 inline h-3 w-3 text-cyan-500" /></footer>
    </div>
  );
}
