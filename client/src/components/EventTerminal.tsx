import { FormEvent, useMemo, useState } from "react";
import { TerminalSquare } from "lucide-react";

export type EventTerminalStage = {
  number: number;
  title: string;
  discipline: string;
  difficulty: string;
  briefing: string;
  files: Record<string, string>;
};

type TerminalLine = { tone?: "prompt" | "error" | "signal" | "muted"; text: string };

function commandOutput(command: string, stage: EventTerminalStage): TerminalLine[] {
  const normal = command.trim().replace(/\s+/g, " ");
  const [verb, ...args] = normal.split(" ");
  const target = args.join(" ");
  if (!normal) return [];
  if (verb === "clear") return [{ text: "__CLEAR__" }];
  if (verb === "help") return [
    { tone: "signal", text: "SAFE TERMINAL COMMANDS" },
    { text: "ls                 list stage evidence" },
    { text: "cat <file>         read a supplied local evidence file" },
    { text: "open <file>        alias for cat" },
    { text: "status             show stage and response rules" },
    { text: "verify             confirm safe simulation boundary" },
    { text: "clear              clear this terminal view" },
  ];
  if (verb === "ls") return Object.keys(stage.files).sort().map((file) => ({ text: file }));
  if (verb === "status") return [
    { tone: "signal", text: `STAGE ${String(stage.number).padStart(2, "0")} / 15 · ${stage.discipline.toUpperCase()}` },
    { text: "Attempts are limited to 3 for this stage." },
    { text: "Every required response includes the unique case tag from case.tag." },
    { text: "No hints, no external targets, no arbitrary commands." },
  ];
  if (verb === "verify") return [
    { tone: "signal", text: "SIMULATION VERIFIED" },
    { text: "All files, systems and evidence are fictional and local to this event." },
    { text: "The terminal executes no shell commands and contacts no external services." },
  ];
  if (verb === "cat" || verb === "open") {
    if (!target) return [{ tone: "error", text: `usage: ${verb} <file>` }];
    const content = stage.files[target];
    if (!content) return [{ tone: "error", text: `file not found: ${target}` }];
    return content.split("\n").map((text) => ({ text }));
  }
  return [{ tone: "error", text: `command unavailable: ${verb}` }, { tone: "muted", text: "Use help to view the sealed terminal's safe command set." }];
}

export default function EventTerminal({ stage }: { stage: EventTerminalStage }) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    { tone: "signal", text: "ISACA_EVENT TERMINAL // SEALED CASE ACCESS" },
    { text: "A fresh evidence set is loaded for this authenticated run." },
    { tone: "muted", text: "Type help, then inspect evidence without leaving the simulation." },
  ]);
  const fileNames = useMemo(() => Object.keys(stage.files).sort(), [stage.files]);

  const execute = (event: FormEvent) => {
    event.preventDefault();
    const command = value.trim();
    if (!command) return;
    const output = commandOutput(command.toLowerCase(), stage);
    if (output.some((item) => item.text === "__CLEAR__")) {
      setHistory([]);
    } else {
      setHistory((items) => [...items, { tone: "prompt", text: `analyst@sealed-case:~$ ${command}` }, ...output]);
    }
    setValue("");
  };

  return <section className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#03070e] shadow-[0_26px_80px_rgba(0,0,0,.3)]" aria-label="Sealed event terminal"><header className="flex items-center justify-between border-b border-white/[.07] bg-white/[.025] px-4 py-3"><div className="flex items-center gap-2"><TerminalSquare className="h-4 w-4 text-cyan-300" /><span className="font-mono text-[10px] tracking-[.13em] text-cyan-100">SEALED_CASE_TERMINAL</span></div><span className="font-mono text-[9px] text-slate-600">NO KEYS EXPOSED</span></header><div className="grid min-h-[390px] lg:grid-cols-[1fr_210px]"><div className="flex min-h-0 flex-col p-4"><div className="min-h-[260px] flex-1 overflow-y-auto font-mono text-[11px] leading-6 text-slate-300" aria-live="polite">{history.map((line, index) => <p key={`${line.text}-${index}`} className={line.tone === "prompt" ? "text-cyan-300" : line.tone === "error" ? "text-rose-300" : line.tone === "signal" ? "text-violet-200" : line.tone === "muted" ? "text-slate-600" : ""}>{line.text}</p>)}</div><form onSubmit={execute} className="mt-3 flex items-center gap-2 border-t border-white/[.07] pt-3"><span className="shrink-0 font-mono text-[10px] text-violet-300">analyst@sealed-case:~$</span><input value={value} onChange={(event) => setValue(event.target.value)} spellCheck={false} aria-label="Sealed terminal command" placeholder="type a safe command" className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-white outline-none placeholder:text-slate-700" /></form></div><aside className="border-t border-white/[.07] bg-white/[.02] p-4 lg:border-l lg:border-t-0"><p className="font-mono text-[9px] tracking-[.14em] text-slate-500">STAGE EVIDENCE</p><p className="mt-2 text-xs font-semibold text-white">{stage.title}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{stage.discipline}</p><div className="mt-5 space-y-2">{fileNames.map((file) => <button key={file} onClick={() => { const output = commandOutput(`cat ${file}`, stage); setHistory((items) => [...items, { tone: "prompt", text: `analyst@sealed-case:~$ cat ${file}` }, ...output]); }} className="block w-full rounded-lg border border-white/[.07] bg-white/[.025] px-2.5 py-2 text-left font-mono text-[10px] text-slate-400 transition hover:border-cyan-300/30 hover:bg-cyan-300/[.06] hover:text-cyan-100">{file}</button>)}</div><p className="mt-5 font-mono text-[9px] leading-4 text-slate-600">Evidence buttons type local <em>cat</em> commands; no operating-system shell is available.</p></aside></div></section>;
}
