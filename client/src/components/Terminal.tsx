import { FormEvent, useState } from "react";

const commands: Record<string, string[]> = {
  help: ["Available commands: help, ls, pwd, whoami, logs, scan, decrypt, clear"],
  ls: ["evidence/  inbox/  readme.txt  recovery-key.enc"],
  pwd: ["/home/recruit/mission-lab"],
  whoami: ["cyber-recruit (sandbox agent)"],
  logs: ["02:11 failed login: alex", "02:12 failed login: admin", "02:13 login success: admin", "02:14 file transfer: evidence.zip"],
  scan: ["Simulation scan complete.", "No real targets contacted.", "Hint: inspect the local clues, not a network."],
  decrypt: ["Decoder online. Try the escape-room message: U0FGRV9NT0RF"],
};

export default function Terminal({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>(["Welcome, recruit. This terminal is simulated.", "Type 'help' to see sandbox commands."]);

  const execute = (event: FormEvent) => {
    event.preventDefault();
    const command = value.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") { setHistory([]); setValue(""); return; }
    const output = commands[command] ?? [`command not found: ${command}`, "This is a fictional terminal; only predefined commands are available."];
    setHistory((items) => [...items, `user@cybersociety:~$ ${command}`, ...output]);
    setValue("");
  };

  return <section className={`overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#050a13] shadow-[0_20px_60px_rgba(0,0,0,.24)] ${compact ? "" : "min-h-[288px]"}`} aria-label="Fictional terminal simulator"><div className="flex items-center justify-between border-b border-white/[.07] bg-white/[.025] px-4 py-3"><div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-rose-400/80" /><i className="h-2.5 w-2.5 rounded-full bg-amber-300/80" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" /></div><span className="font-mono text-[9px] tracking-[.16em] text-slate-500">SIMULATED_TERMINAL v1.0</span></div><div className={`font-mono text-[11px] leading-6 text-slate-300 ${compact ? "h-44" : "h-60"} overflow-y-auto p-4`} aria-live="polite">{history.map((line, index) => <p key={`${line}-${index}`} className={line.startsWith("user@") ? "text-cyan-300" : ""}>{line}</p>)}<form onSubmit={execute} className="mt-1 flex gap-2"><span className="text-violet-300">user@cybersociety:~$</span><input value={value} onChange={(event) => setValue(event.target.value)} aria-label="Terminal command" className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-600" placeholder="type a safe command" /></form></div></section>;
}
