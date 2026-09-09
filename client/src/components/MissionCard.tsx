import { ArrowUpRight, Check, Clock3, LockKeyhole, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Mission } from "@/lib/game-data";

export default function MissionCard({ mission, completed = false, featured = false }: { mission: Mission; completed?: boolean; featured?: boolean }) {
  const locked = mission.status === "locked" && !completed;
  return (
    <article className={`group relative overflow-hidden rounded-2xl border ${featured ? "border-cyan-300/30 bg-gradient-to-br from-cyan-300/[.08] via-[#0d1727] to-violet-500/[.07]" : "border-white/[.09] bg-[#0d1422]/75"} p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-[0_20px_60px_rgba(0,0,0,.26)]`}>
      <div className="absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.14),transparent_65%)]" />
      <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] tracking-[.18em] text-cyan-300">{mission.code}</p><h3 className="mt-2 font-display text-lg font-bold text-white">{mission.title}</h3></div>{completed ? <span className="grid h-8 w-8 place-items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-300"><Check className="h-4 w-4" /></span> : locked ? <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[.04] text-slate-500"><LockKeyhole className="h-4 w-4" /></span> : <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[.08] px-2.5 py-1 font-mono text-[9px] text-cyan-200">{mission.difficulty}</span>}</div>
      <p className="mt-3 min-h-10 text-sm leading-6 text-slate-400">{mission.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">{mission.skills.map((skill) => <span key={skill} className="rounded-md bg-white/[.055] px-2 py-1 font-mono text-[9px] text-slate-300">{skill}</span>)}</div>
      <div className="mt-5 flex items-center justify-between border-t border-white/[.07] pt-4"><span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400"><Clock3 className="h-3.5 w-3.5" /> {mission.estimatedTime}</span><span className="flex items-center gap-1.5 font-mono text-[10px] text-violet-300"><Sparkles className="h-3.5 w-3.5" /> {mission.xp} XP</span></div>
      <Link href={`/missions/${mission.id}`} className={`mt-5 flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${locked ? "pointer-events-none bg-white/[.04] text-slate-500" : "bg-white/[.075] text-white hover:bg-cyan-300 hover:text-[#06111d]"}`}>{completed ? "Replay mission" : locked ? "Clear Mission 03 to unlock" : "Enter simulation"}<ArrowUpRight className="h-4 w-4" /></Link>
    </article>
  );
}
