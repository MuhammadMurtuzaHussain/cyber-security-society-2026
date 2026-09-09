import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, ArrowLeft, Check, Clock3, LockKeyhole, Medal, ShieldCheck, Sparkles, Trophy, UserCheck } from "lucide-react";
import GameLayout from "@/components/GameLayout";
import EventTerminal, { EventTerminalStage } from "@/components/EventTerminal";
import { startLogin } from "@/const";
import { useGame } from "@/contexts/GameContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const londonDeadline = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(Date.UTC(2026, 8, 12, 16, 0)));

type Run = {
  id: string;
  currentStage: number;
  attemptsInStage: number;
  status: "active" | "completed" | "failed";
  failedReason: string | null;
  startedAt: Date | string;
  deadlineAt: Date | string;
  stage: EventTerminalStage | null;
};

type Claim = { status: "reserved" | "submitted"; studentIdSubmitted: boolean } | null;

function formatRemaining(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function StatusPanel({ run, claimedSlots, capacity }: { run: Run | null; claimedSlots: number; capacity: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const interval = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(interval); }, []);
  const remaining = run?.status === "active" ? new Date(run.deadlineAt).getTime() - now : 0;
  const danger = remaining < 2 * 60 * 1000;
  return <aside className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"><div className={`rounded-2xl border p-4 ${danger && run?.status === "active" ? "border-rose-300/30 bg-rose-300/[.07]" : "border-white/[.08] bg-white/[.025]"}`}><div className="flex items-center gap-2"><Clock3 className={`h-4 w-4 ${danger ? "text-rose-200" : "text-cyan-300"}`} /><p className="font-mono text-[9px] tracking-[.14em] text-slate-500">MISSION CLOCK</p></div><p className={`mt-5 font-mono text-3xl font-semibold ${danger ? "text-rose-100" : "text-white"}`}>{run?.status === "active" ? formatRemaining(remaining) : "15:00"}</p><p className="mt-1 font-mono text-[9px] text-slate-500">SERVER-ENFORCED TIMER</p></div><div className="rounded-2xl border border-white/[.08] bg-white/[.025] p-4"><div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-200" /><p className="font-mono text-[9px] tracking-[.14em] text-slate-500">STAGE LIMIT</p></div><p className="mt-5 font-mono text-3xl font-semibold text-white">{run ? Math.max(0, 3 - run.attemptsInStage) : 3}<span className="text-base text-slate-600">/3</span></p><p className="mt-1 font-mono text-[9px] text-slate-500">ATTEMPTS REMAINING</p></div><div className="rounded-2xl border border-violet-300/18 bg-violet-300/[.045] p-4"><div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-violet-200" /><p className="font-mono text-[9px] tracking-[.14em] text-slate-500">INVITATION SLOTS</p></div><p className="mt-5 font-mono text-3xl font-semibold text-violet-100">{Math.max(0, capacity - claimedSlots)}<span className="text-base text-slate-600">/{capacity}</span></p><p className="mt-1 font-mono text-[9px] text-slate-500">REMAINING FOR VALID FINISHERS</p></div></aside>;
}

function StudentIdCapture({ onSubmitted }: { onSubmitted: () => void }) {
  const [studentId, setStudentId] = useState("");
  const [consent, setConsent] = useState(false);
  const submit = trpc.isacaEvent.submitStudentId.useMutation({ onSuccess: onSubmitted });
  const handleSubmit = (event: FormEvent) => { event.preventDefault(); if (!consent) return; submit.mutate({ studentId }); };
  return <section className="mt-6 rounded-3xl border border-violet-300/24 bg-gradient-to-br from-violet-300/[.1] via-[#0d1422] to-cyan-300/[.06] p-6 sm:p-7"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/25 bg-violet-300/[.1] text-violet-100"><Medal className="h-5 w-5" /></span><div><p className="font-mono text-[10px] tracking-[.16em] text-violet-200">INVITATION SLOT RESERVED</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-.04em] text-white">You are one of the first 10 valid finishers.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Submit your student ID to verify eligibility. You will be contacted with the ISACA event invitation.</p></div></div><form onSubmit={handleSubmit} className="mt-6 max-w-xl"><label className="block"><span className="font-mono text-[10px] tracking-[.14em] text-slate-400">STUDENT ID</span><input value={studentId} onChange={(event) => setStudentId(event.target.value)} required maxLength={64} pattern="[A-Za-z0-9-]+" placeholder="e.g. 24012345" className="mt-2 h-11 w-full rounded-lg border border-white/[.12] bg-[#050a13] px-3 font-mono text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-violet-300/60" /></label><label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/[.08] bg-black/10 p-3"><input checked={consent} onChange={(event) => setConsent(event.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 accent-violet-300" /><span className="text-xs leading-5 text-slate-400">I consent to the Cyber Security Society using this student ID to verify my eligibility and contact me about this invitation. It is collected only for this event.</span></label>{submit.error && <p role="alert" className="mt-3 text-xs text-rose-200">{submit.error.message}</p>}<button type="submit" disabled={!consent || submit.isPending} className="mt-5 rounded-xl bg-violet-300 px-4 py-3 text-xs font-bold text-[#160b25] transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50">{submit.isPending ? "SECURING DETAILS…" : "SUBMIT STUDENT ID"} <UserCheck className="ml-1 inline h-4 w-4" /></button></form></section>;
}

function EventStart({ onStart, loading, authenticated }: { onStart: () => void; loading: boolean; authenticated: boolean }) {
  return <section className="relative overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-br from-violet-400/[.11] via-[#0d1422] to-cyan-300/[.06] p-6 sm:p-8"><div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-violet-300/[.1] blur-3xl" /><div className="relative grid gap-7 lg:grid-cols-[1fr_.72fr]"><div><p className="font-mono text-[10px] tracking-[.2em] text-violet-200">ISACA EVENT // SEALED COMPETITION</p><h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight tracking-[-.045em] text-white">The Fifteen-Minute <span className="text-violet-300">Control Room.</span></h2><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">Fifteen stages. No hints. Three attempts per stage. Your run is uniquely seeded and validated by the server, so copying another student’s response will not unlock your case.</p><div className="mt-6 flex flex-wrap gap-2"><span className="rounded-full border border-rose-300/18 bg-rose-300/[.06] px-3 py-1.5 font-mono text-[9px] text-rose-100">15-MINUTE HARD LIMIT</span><span className="rounded-full border border-amber-300/18 bg-amber-300/[.06] px-3 py-1.5 font-mono text-[9px] text-amber-100">3 ATTEMPTS / STAGE</span><span className="rounded-full border border-cyan-300/18 bg-cyan-300/[.06] px-3 py-1.5 font-mono text-[9px] text-cyan-100">NO HINTS</span></div><button onClick={onStart} disabled={loading} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-300 px-5 py-3.5 text-xs font-bold text-[#160b25] transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "OPENING SEALED CASE…" : authenticated ? "OPEN SEALED CASE" : "SIGN IN TO COMPETE"} <LockKeyhole className="h-4 w-4" /></button><p className="mt-3 font-mono text-[9px] tracking-[.1em] text-slate-500">STARTING THE CASE BEGINS YOUR SERVER-ENFORCED TIMER.</p></div><div className="rounded-2xl border border-white/[.09] bg-[#060a12]/70 p-5"><p className="font-mono text-[10px] tracking-[.16em] text-cyan-300">CASE DOMAINS</p><div className="mt-5 grid grid-cols-2 gap-2">{["GOVERNANCE", "IT AUDIT", "RISK", "IAM", "SECURE DESIGN", "RESILIENCE", "NETWORK", "INCIDENT RESPONSE"].map((domain) => <span key={domain} className="rounded-lg border border-white/[.07] bg-white/[.025] px-2.5 py-2 font-mono text-[9px] text-slate-400">{domain}</span>)}</div><p className="mt-5 text-xs leading-5 text-slate-500">All facts, files, systems and scenarios are fictional. The terminal runs a sealed command set only.</p></div></div></section>;
}

export default function IsacaEvent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { completeMission } = useGame();
  const status = trpc.isacaEvent.status.useQuery(undefined, { refetchInterval: 20_000, refetchOnWindowFocus: true });
  const start = trpc.isacaEvent.start.useMutation();
  const submitStage = trpc.isacaEvent.submitStage.useMutation();
  const expire = trpc.isacaEvent.expire.useMutation();
  const [run, setRun] = useState<Run | null>(null);
  const [claim, setClaim] = useState<Claim>(null);
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const [slotReserved, setSlotReserved] = useState<boolean | null>(null);
  const [clock, setClock] = useState(() => Date.now());
  const timeoutReported = useRef(false);
  const timeRemaining = run?.status === "active" ? new Date(run.deadlineAt).getTime() - clock : 1;

  useEffect(() => {
    if (run?.status !== "active") return;
    setClock(Date.now());
    const interval = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [run?.status]);

  const loadResult = (result: { run?: Run | null; claim?: Claim }) => {
    if (result.run) setRun(result.run);
    if (result.claim !== undefined) setClaim(result.claim ?? null);
  };

  const handleStart = () => {
    if (!isAuthenticated) { startLogin(); return; }
    setNotice("");
    start.mutate(undefined, { onSuccess: (result) => { loadResult(result); if (result.outcome === "event_closed") setNotice("This limited-time event closed at Saturday 17:00 Europe/London."); if (result.outcome === "expired") setNotice("Your 15-minute run has expired. The sealed case cannot be restarted."); }, onError: (error) => setNotice(error.message) });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!answer.trim() || !run?.stage) return;
    setNotice("");
    submitStage.mutate({ answer }, { onSuccess: (result) => {
      if (result.run) setRun(result.run as Run);
      setAnswer("");
      if (result.outcome === "advanced") setNotice("Response verified. The next sealed evidence pack is unlocked.");
      if (result.outcome === "incorrect") setNotice(`Response rejected. ${result.attemptsRemaining} attempt${result.attemptsRemaining === 1 ? "" : "s"} remains for this stage.`);
      if (result.outcome === "attempt_limit") setNotice("Attempt limit reached. This competition run is now closed.");
      if (result.outcome === "time_expired") setNotice("The 15-minute server timer has expired. This competition run is closed.");
      if (result.outcome === "event_closed") setNotice("The event cutoff has passed. This competition run is closed.");
      if (result.outcome === "completed") { completeMission("isaca-invitation", 1000, "isaca-control-room"); setSlotReserved(Boolean(result.slotReserved)); if (result.slotReserved) setClaim({ status: "reserved", studentIdSubmitted: false }); }
    }, onError: (error) => setNotice(error.message) });
  };

  useEffect(() => {
    if (!run || run.status !== "active" || timeRemaining > 0 || timeoutReported.current || expire.isPending) return;
    timeoutReported.current = true;
    expire.mutate(undefined, { onSuccess: (result) => { if (result.run) setRun(result.run as Run); setNotice(result.outcome === "event_closed" ? "The event cutoff has passed. This competition run is closed." : "The 15-minute server timer has expired. This competition run is closed."); } });
  }, [expire, run, timeRemaining]);

  const closeReason = status.data?.closed ? "This limited-time event closed at Saturday 17:00 Europe/London." : "";
  const completion = run?.status === "completed";
  const failure = run?.status === "failed";
  const canPlay = run?.status === "active" && Boolean(run.stage) && timeRemaining > 0;
  const feedbackTone = notice.includes("verified") || notice.includes("unlocked") ? "border-emerald-300/18 bg-emerald-300/[.06] text-emerald-100" : "border-rose-300/18 bg-rose-300/[.055] text-rose-100";

  return <GameLayout title="ISACA Invitation Event" eyebrow="LIMITED TIME // SERVER-VERIFIED COMPETITION"><div className="container py-7 sm:py-9"><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><Link href="/missions" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-cyan-200"><ArrowLeft className="h-4 w-4" /> BACK TO MISSION CONTROL</Link><div className="flex items-center gap-2 rounded-full border border-amber-300/18 bg-amber-300/[.06] px-3 py-1.5 font-mono text-[9px] text-amber-100"><Clock3 className="h-3.5 w-3.5" /> ENDS {londonDeadline.toUpperCase()} BST</div></div><section className="mb-6 rounded-2xl border border-white/[.08] bg-white/[.025] p-5"><p className="font-mono text-[10px] tracking-[.16em] text-cyan-300">ELITE SIMULATION</p><h1 className="mt-2 font-display text-2xl font-bold tracking-[-.035em] text-white sm:text-3xl">ISACA Invitation: The Fifteen-Minute Control Room</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">A challenging, fictional scenario that combines technical security with GRC, audit, risk, continuity, governance, incident management and secure design. It contains no real systems or attack capability.</p></section><div className="grid gap-6 xl:grid-cols-[1fr_260px]"> <main>{!run && !status.data?.closed && <EventStart onStart={handleStart} loading={authLoading || start.isPending} authenticated={isAuthenticated} />}{!run && status.data?.closed && <section className="rounded-3xl border border-white/[.09] bg-[#0d1422]/75 p-8 text-center"><LockKeyhole className="mx-auto h-8 w-8 text-slate-600" /><p className="mt-4 font-mono text-[10px] tracking-[.17em] text-slate-500">EVENT CLOSED</p><h2 className="mt-2 font-display text-2xl font-bold text-white">The invitation window has ended.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">This limited-time simulation was available until Saturday 12 September 2026, 17:00 Europe/London.</p>{isAuthenticated && <button onClick={handleStart} disabled={start.isPending} className="mt-5 rounded-xl border border-white/[.12] bg-white/[.04] px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/[.08] disabled:opacity-50">{start.isPending ? "LOADING…" : "VIEW SAVED RUN"}</button>}</section>}{run && failure && <section className="rounded-3xl border border-rose-300/20 bg-gradient-to-br from-rose-300/[.08] via-[#0d1422] to-[#0d1422] p-7"><p className="font-mono text-[10px] tracking-[.17em] text-rose-200">RUN CLOSED</p><h2 className="mt-3 font-display text-3xl font-bold text-white">The sealed case remains sealed.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{run.failedReason === "attempt_limit" ? "A stage reached its three-attempt limit." : run.failedReason === "event_closed" ? "The event deadline was reached." : "The fifteen-minute server timer elapsed."} Competition controls prevent restarting or resetting the run.</p><Link href="/missions" className="mt-6 inline-block rounded-xl bg-white/[.08] px-4 py-3 text-xs font-semibold text-white hover:bg-white/[.12]">RETURN TO MISSION CONTROL</Link></section>}{run && completion && <section className="rounded-3xl border border-emerald-300/22 bg-gradient-to-br from-emerald-300/[.11] via-[#0d1422] to-violet-300/[.08] p-7"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-emerald-300/24 bg-emerald-300/[.08] text-emerald-100"><Check className="h-6 w-6" /></span><div><p className="font-mono text-[10px] tracking-[.17em] text-emerald-200">FIFTEEN STAGES VERIFIED</p><h2 className="mt-2 font-display text-3xl font-bold tracking-[-.04em] text-white">Control room cleared.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Your server-validated competition run is complete. A 1,000 XP accolade is also recorded in your local agent profile. {slotReserved === false ? "The invitation capacity was already reached before this completion, so no student ID is requested." : claim?.studentIdSubmitted ? "Your student ID is recorded. You will be contacted with the invitation." : "Your invitation position is secured pending the consent form below."}</p></div></div>{(slotReserved || claim?.status === "reserved") && !claim?.studentIdSubmitted && <StudentIdCapture onSubmitted={() => setClaim({ status: "submitted", studentIdSubmitted: true })} />}{claim?.studentIdSubmitted && <div className="mt-6 rounded-2xl border border-emerald-300/18 bg-emerald-300/[.06] p-5"><ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" /><span className="text-sm font-semibold text-emerald-100">Student ID received.</span><p className="mt-2 text-sm text-slate-400">You will be contacted with the ISACA invitation.</p></div>}</section>}{canPlay && run.stage && <section className="animate-enter"><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] tracking-[.16em] text-cyan-300">STAGE {String(run.currentStage).padStart(2, "0")} / 15</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-.035em] text-white">{run.stage.title}</h2><p className="mt-1 text-sm text-slate-400">{run.stage.discipline} · {run.stage.difficulty}</p></div><span className="rounded-full border border-white/[.1] bg-white/[.035] px-3 py-1.5 font-mono text-[9px] text-slate-400">UNIQUE CASE: SERVER-SEEDED</span></div><div className="mb-5 rounded-2xl border border-cyan-300/14 bg-cyan-300/[.045] p-5"><p className="font-mono text-[10px] tracking-[.14em] text-cyan-300">MISSION BRIEF</p><p className="mt-3 text-sm leading-6 text-slate-300">{run.stage.briefing}</p></div><EventTerminal stage={run.stage} /><form onSubmit={handleSubmit} className="mt-5 rounded-2xl border border-violet-300/18 bg-violet-300/[.045] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end"><label className="block flex-1"><span className="font-mono text-[10px] tracking-[.14em] text-violet-200">SEALED RESPONSE</span><input autoFocus value={answer} onChange={(event) => setAnswer(event.target.value)} required maxLength={256} spellCheck={false} placeholder="response:case-xxxxxx" className="mt-2 h-11 w-full rounded-lg border border-white/[.12] bg-[#050a13] px-3 font-mono text-xs text-white outline-none transition placeholder:text-slate-700 focus:border-violet-300/65" /></label><button type="submit" disabled={submitStage.isPending} className="h-11 rounded-lg bg-violet-300 px-4 text-xs font-bold text-[#170c26] transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-60">{submitStage.isPending ? "VERIFYING…" : "SUBMIT RESPONSE"}</button></div><p className="mt-3 font-mono text-[9px] text-slate-500">No hints. Responses are verified server-side. Read <span className="text-cyan-300">case.tag</span> and include it exactly.</p>{notice && <p role="status" className={`mt-4 rounded-lg border p-3 text-xs leading-5 ${feedbackTone}`}>{notice}</p>}</form></section>}{notice && !canPlay && !completion && !failure && <p role="status" className={`rounded-xl border p-4 text-sm ${feedbackTone}`}>{notice || closeReason}</p>}</main><StatusPanel run={run} claimedSlots={status.data?.claimedSlots ?? 0} capacity={status.data?.invitationCapacity ?? 10} /></div></div></GameLayout>;
}
