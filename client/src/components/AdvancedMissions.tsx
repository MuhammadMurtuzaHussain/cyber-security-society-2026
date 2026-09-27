import { FormEvent, useState } from "react";
import { Check, Globe2, KeyRound, LockKeyhole, Network, ShieldCheck, TerminalSquare } from "lucide-react";

function Panel({ children, tone = "cyan" }: { children: React.ReactNode; tone?: "cyan" | "violet" | "amber" | "rose" }) {
  const styles = { cyan: "border-cyan-300/16 bg-cyan-300/[.045]", violet: "border-violet-300/16 bg-violet-300/[.045]", amber: "border-amber-300/16 bg-amber-300/[.045]", rose: "border-rose-300/16 bg-rose-300/[.045]" };
  return <section className={`rounded-2xl border p-5 ${styles[tone]}`}>{children}</section>;
}

function Choice({ selected, children, onClick }: { selected: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className={`rounded-xl border p-3 text-left text-xs transition ${selected ? "border-cyan-300/50 bg-cyan-300/[.11] text-cyan-100" : "border-white/[.1] bg-white/[.025] text-slate-300 hover:bg-white/[.06]"}`}>{children}</button>;
}

export function ShellForensicsMission({ onSolved }: { onSolved: () => void }) {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>(["forensics@host-17:~$ terminal attached", "Evidence is local. Chain the correct commands."]);
  const [step, setStep] = useState(0);
  const sequence = [
    ["history", "1  sudo cat /var/log/auth.log\n2  systemctl list-timers\n3  sha256sum /tmp/update.sh"],
    ["authlog", "03:14 accepted publickey for deploy from 10.0.4.19\n03:16 sudo: deploy : COMMAND=/usr/bin/curl"],
    ["timers", "backup-sync.timer   enabled\ncache-refresh.timer enabled\nupdate-check.timer  enabled -> /tmp/update.sh"],
    ["hash", "9b1d3f0d9e8c4c9a...  /tmp/update.sh\nKnown-good: 7f2a1b4c..."],
    ["isolate", "Containment queued for host-17. Preserve evidence before rebuild."],
  ];
  const execute = (event: FormEvent) => {
    event.preventDefault();
    const input = command.trim().toLowerCase();
    if (!input) return;
    const [expected, output] = sequence[step] ?? [];
    if (input === expected || (step === 0 && input === "cat ~/.bash_history")) {
      setHistory((items) => [...items, `forensics@host-17:~$ ${input}`, output]);
      setStep((value) => value + 1);
    } else setHistory((items) => [...items, `forensics@host-17:~$ ${input}`, `permission denied: expected the next evidence command (${expected})`]);
    setCommand("");
  };
  const solved = step >= sequence.length;
  return <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]"><Panel tone="violet"><div className="flex items-center gap-3"><TerminalSquare className="h-5 w-5 text-violet-200" /><div><p className="font-mono text-[10px] tracking-[.15em] text-violet-200">HOST-17 // RESTRICTED SHELL</p><h3 className="mt-1 font-semibold text-white">Follow the evidence chain</h3></div></div><div className="mt-5 h-64 overflow-y-auto rounded-xl border border-white/[.08] bg-[#050a13] p-4 font-mono text-[11px] leading-6 text-slate-300">{history.map((line, index) => <p key={`${line}-${index}`} className={line.startsWith("forensics@") ? "text-cyan-300" : "whitespace-pre-line"}>{line}</p>)}{!solved && <form onSubmit={execute} className="mt-2 flex gap-2"><span className="text-violet-300">$</span><input autoFocus value={command} onChange={(event) => setCommand(event.target.value)} aria-label="Forensics command" className="min-w-0 flex-1 bg-transparent text-white outline-none" placeholder="type the next command" /></form>}</div></Panel><Panel tone={solved ? "cyan" : "amber"}><p className="font-mono text-[10px] tracking-[.15em] text-amber-200">FORENSIC PLAYBOOK // {Math.min(step, sequence.length)}/5</p><h3 className="mt-2 font-semibold text-white">{solved ? "Containment approved" : "No hints. Use command semantics."}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{solved ? "You preserved the timeline, found persistence, rejected the altered hash and queued isolation." : "Use normal read-only investigation commands in this fictional shell. The simulator advances only when each evidence step is correct."}</p>{solved && <button onClick={onSolved} className="mt-5 rounded-xl bg-emerald-300 px-4 py-3 text-xs font-bold text-[#07140f]"><ShieldCheck className="mr-2 inline h-4 w-4" /> CLOSE FORENSIC CASE</button>}</Panel></div>;
}

export function BrowserLockdownMission({ onSolved }: { onSolved: () => void }) {
  const [cookie, setCookie] = useState("");
  const [policy, setPolicy] = useState("");
  const [origin, setOrigin] = useState("");
  const [feedback, setFeedback] = useState("");
  const submit = () => {
    if (cookie === "HttpOnly; Secure; SameSite=Lax" && policy === "self-only" && origin === "same-origin") onSolved();
    else setFeedback("The boundary is still open. Check every simulated control: cookie flags, content sources, and request origin.");
  };
  return <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]"><Panel tone="cyan"><div className="flex items-center gap-3"><Globe2 className="h-5 w-5 text-cyan-200" /><div><p className="font-mono text-[10px] tracking-[.15em] text-cyan-200">DEVTOOLS // SIMULATED</p><h3 className="mt-1 font-semibold text-white">Inspect the browser boundary</h3></div></div><div className="mt-5 space-y-3 font-mono text-[11px]"><div className="rounded-xl border border-white/[.08] bg-[#050a13] p-4"><p className="text-slate-500">document.cookie</p><p className="mt-2 text-rose-200">session=eyJ...; path=/</p></div><div className="rounded-xl border border-white/[.08] bg-[#050a13] p-4"><p className="text-slate-500">Content-Security-Policy</p><p className="mt-2 text-amber-200">default-src * 'unsafe-inline'</p></div><div className="rounded-xl border border-white/[.08] bg-[#050a13] p-4"><p className="text-slate-500">request origin</p><p className="mt-2 text-rose-200">https://mirror.example</p></div></div></Panel><Panel tone="violet"><p className="font-mono text-[10px] tracking-[.15em] text-violet-200">HARDEN CONFIGURATION</p><h3 className="mt-2 font-semibold text-white">Close all three paths</h3><div className="mt-5 space-y-4"><label className="block text-xs text-slate-400">Session cookie<select value={cookie} onChange={(event) => setCookie(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/[.1] bg-[#070b14] px-3 text-xs text-white"><option value="">Select a safe flag set</option><option>HttpOnly; Secure; SameSite=Lax</option><option>Path=/; Domain=example</option></select></label><label className="block text-xs text-slate-400">Content policy<select value={policy} onChange={(event) => setPolicy(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/[.1] bg-[#070b14] px-3 text-xs text-white"><option value="">Select a policy</option><option value="self-only">default-src 'self'; script-src 'self'</option><option value="open">default-src *</option></select></label><label className="block text-xs text-slate-400">Request validation<select value={origin} onChange={(event) => setOrigin(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/[.1] bg-[#070b14] px-3 text-xs text-white"><option value="">Select a rule</option><option value="same-origin">Require same-origin / approved origin</option><option value="any-origin">Accept any Origin header</option></select></label></div><button onClick={submit} className="mt-5 w-full rounded-xl bg-cyan-300 px-4 py-3 text-xs font-bold text-[#06111d]"><LockKeyhole className="mr-2 inline h-4 w-4" /> APPLY HARDENING</button>{feedback && <p role="status" className="mt-3 text-xs text-rose-100">{feedback}</p>}</Panel></div>;
}

export function ApiAuthMission({ onSolved }: { onSolved: () => void }) {
  const [cause, setCause] = useState("");
  const [fix, setFix] = useState("");
  const submit = () => { if (cause === "bola" && fix === "server-check") onSolved(); };
  return <div className="grid gap-6 xl:grid-cols-[1fr_1fr]"><Panel tone="amber"><div className="flex items-center gap-3"><KeyRound className="h-5 w-5 text-amber-200" /><div><p className="font-mono text-[10px] tracking-[.15em] text-amber-200">REQUEST REPLAY // LOCAL</p><h3 className="mt-1 font-semibold text-white">Why did object 1042 leak?</h3></div></div><pre className="mt-5 overflow-x-auto rounded-xl border border-white/[.08] bg-[#050a13] p-4 font-mono text-[11px] leading-6 text-slate-300">{`GET /api/v1/records/1042\nAuthorization: Bearer demo-user\n\n200 OK\n{ "ownerId": "student-7", "grade": "A" }`}</pre><p className="mt-4 text-xs leading-5 text-slate-400">The user is authenticated, but should not own record 1042. Identify the vulnerability and the missing control.</p></Panel><Panel tone="violet"><p className="font-mono text-[10px] tracking-[.15em] text-violet-200">REVIEW FINDING</p><div className="mt-4 grid gap-2"><Choice selected={cause === "bola"} onClick={() => setCause("bola")}>Broken object-level authorization (BOLA)</Choice><Choice selected={cause === "xss"} onClick={() => setCause("xss")}>Stored cross-site scripting</Choice><Choice selected={cause === "csrf"} onClick={() => setCause("csrf")}>Cross-site request forgery</Choice></div><p className="mt-5 font-mono text-[10px] text-slate-500">SERVER-SIDE FIX</p><div className="mt-2 grid gap-2"><Choice selected={fix === "server-check"} onClick={() => setFix("server-check")}>Check ownership and policy for every object</Choice><Choice selected={fix === "client-hide"} onClick={() => setFix("client-hide")}>Hide the ID field in the client</Choice></div><button onClick={submit} className="mt-5 w-full rounded-xl bg-violet-300 px-4 py-3 text-xs font-bold text-[#160b25]">SUBMIT AUTHORIZATION REVIEW</button></Panel></div>;
}

export function PacketPuzzleMission({ onSolved }: { onSolved: () => void }) {
  const [host, setHost] = useState("");
  const [pattern, setPattern] = useState("");
  const [action, setAction] = useState("");
  const submit = () => { if (host === "10.4.7.23" && pattern === "beacon" && action === "isolate") onSolved(); };
  return <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]"><Panel tone="cyan"><div className="flex items-center gap-3"><Network className="h-5 w-5 text-cyan-200" /><div><p className="font-mono text-[10px] tracking-[.15em] text-cyan-200">PCAP // 47 PACKETS</p><h3 className="mt-1 font-semibold text-white">Find the repeating signal</h3></div></div><div className="mt-5 overflow-x-auto rounded-xl border border-white/[.08] bg-[#050a13] p-4 font-mono text-[11px] leading-6 text-slate-300"><p className="text-slate-500">time       source       destination          info</p><p>10:01:00   10.4.7.23   203.0.113.8:443     TLS application data</p><p>10:01:30   10.4.7.23   203.0.113.8:443     TLS application data</p><p>10:02:00   10.4.7.23   203.0.113.8:443     TLS application data</p><p>10:02:01   10.4.7.19   8.8.8.8:53           DNS response</p><p>10:02:04   10.4.7.23   203.0.113.8:443     TLS application data</p></div><p className="mt-4 text-xs leading-5 text-slate-400">One host repeats at a 30-second interval. Correlate the pattern and choose a proportionate first action.</p></Panel><Panel tone="rose"><p className="font-mono text-[10px] tracking-[.15em] text-rose-200">SOC DECISION</p><label className="mt-4 block text-xs text-slate-400">Source host<select value={host} onChange={(event) => setHost(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/[.1] bg-[#070b14] px-3 text-xs text-white"><option value="">Select host</option><option>10.4.7.19</option><option>10.4.7.23</option></select></label><label className="mt-4 block text-xs text-slate-400">Pattern<select value={pattern} onChange={(event) => setPattern(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/[.1] bg-[#070b14] px-3 text-xs text-white"><option value="">Select pattern</option><option value="dns">DNS burst</option><option value="beacon">30-second beacon</option></select></label><label className="mt-4 block text-xs text-slate-400">First action<select value={action} onChange={(event) => setAction(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/[.1] bg-[#070b14] px-3 text-xs text-white"><option value="">Select action</option><option value="block">Block every external IP</option><option value="isolate">Isolate host and preserve capture</option></select></label><button onClick={submit} className="mt-5 w-full rounded-xl bg-rose-300 px-4 py-3 text-xs font-bold text-[#231017]"><Check className="mr-2 inline h-4 w-4" /> COMMIT SOC FINDING</button></Panel></div>;
}
