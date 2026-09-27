import { FormEvent, ReactNode, useMemo, useState } from "react";
import { Check, Flag, LockKeyhole, TerminalSquare } from "lucide-react";

type Challenge = { command: string; output: string[]; flag: string; objective: string; artifact: string };

const challenges: Record<string, Challenge> = {
  "base64-chain": { command: "decode payload.b64", output: ["layer 1: base64 -> QVd...", "layer 2: rot13 -> YNT...", "layer 3: hex -> flag candidate", "Artifact chain verified. Submit the recovered flag."], flag: "FLAG{layered_encoding}", objective: "Follow the transformation chain and separate encoding from encryption.", artifact: "payload.b64 · checksum: 4b7e..." },
  "xor-recovery": { command: "xor key=0x2a sample.bin", output: ["sample A xor sample B reveals repeated plaintext positions", "key stream fragment: 2a 2a 2a 2a", "Warning: reused key material detected.", "Submit the cryptographic finding flag."], flag: "FLAG{xor_is_not_encryption}", objective: "Prove why reusing a simple XOR key leaks relationships between samples.", artifact: "sample.bin · 2 fictional ciphertexts · hex view" },
  "jwt-forge": { command: "jwt inspect token.txt", output: ["header.alg = none", "payload.role = admin", "signature = absent", "Verifier accepts the client-selected algorithm.", "Submit the identity finding flag."], flag: "FLAG{algorithm_confusion_is_bad}", objective: "Inspect the token and identify the validation failure behind privilege escalation.", artifact: "token.txt · header / payload / signature panes" },
  "sqli-sleuth": { command: "replay query=report", output: ["GET /reports?owner=student-7", "SQL: SELECT * FROM reports WHERE owner='student-7'", "Input reaches query structure without a bound parameter.", "Submit the safe remediation flag."], flag: "FLAG{parameterize_everything}", objective: "Trace untrusted input into the query and choose the server-side fix.", artifact: "query.log · review.sql · fictional API request" },
  "xss-escape": { command: "render payload", output: ["context: innerHTML", "input: <img src=x onerror=demo()> ", "sink: comment-preview", "Trusted Types: not configured. Context-aware output handling required.", "Submit the browser defence flag."], flag: "FLAG{context_aware_output}", objective: "Find the unsafe sink and match the defence to the rendering context.", artifact: "comment-preview · DOM sink map · CSP snapshot" },
  "ssrf-map": { command: "fetch internal://metadata", output: ["server-side fetch accepted attacker-controlled destination", "route: public proxy -> internal metadata service", "egress policy: unrestricted", "Submit the boundary-control flag."], flag: "FLAG{egress_controls_matter}", objective: "Map the server request path and identify why client-side filtering is insufficient.", artifact: "fetch.log · URL parser trace · network zones" },
  "git-secrets": { command: "git log --all", output: ["commit 7a1f: remove temporary token", "commit 4d2c: add deploy token", "refs/backup still contains the old blob", "Rotation required; deletion alone is not remediation.", "Submit the repository finding flag."], flag: "FLAG{secrets_in_history}", objective: "Search history and refs for a removed credential, then choose containment.", artifact: ".git graph · refs/backup · secret-scan report" },
  "dns-tunnel": { command: "dns inspect capture.pcap", output: ["client: 10.7.0.44", "labels: 48-63 chars, high entropy, 30s cadence", "resolver: approved; destination: unusual authoritative NS", "Submit the detection flag."], flag: "FLAG{entropy_and_timing}", objective: "Correlate label shape and timing to identify a possible DNS data channel.", artifact: "capture.pcap · query histogram · asset context" },
  "memory-artifact": { command: "volatility pslist", output: ["winword.exe -> powershell.exe -> rundll32.exe", "parent PID 1840 exited before capture", "command line contains an encoded script block", "Submit the volatile-evidence flag."], flag: "FLAG{triage_the_process_tree}", objective: "Use process ancestry and command-line context to find the suspicious chain.", artifact: "mem.raw · pslist.txt · cmdline view" },
  "supply-chain": { command: "verify package-lock", output: ["package: fictional-parser@4.2.1", "maintainer changed 2 hours before release", "lockfile checksum != registry provenance", "Build approval blocked. Submit the integrity flag."], flag: "FLAG{verify_dependencies}", objective: "Correlate package provenance, lockfile integrity, and build approval.", artifact: "package-lock.json · SBOM · provenance statement" },
  "race-condition": { command: "replay transfer", output: ["request A: balance check = 100", "request B: balance check = 100", "request A: debit 100 -> success", "request B: debit 100 -> success", "Invariant violated: balance below zero.", "Submit the concurrency flag."], flag: "FLAG{atomic_state_transition}", objective: "Model interleaved requests and identify the missing atomic state transition.", artifact: "request-A.json · request-B.json · event timeline" },
};

function ShellLine({ children }: { children: ReactNode }) {
  return <p className="whitespace-pre-line"><span className="text-cyan-300">ctf@lab:~$</span> {children}</p>;
}

export default function CtfChallengeMission({ challengeId, onSolved }: { challengeId: string; onSolved: () => void }) {
  const challenge = challenges[challengeId];
  const [command, setCommand] = useState("");
  const [flag, setFlag] = useState("");
  const [history, setHistory] = useState<string[]>(["CTF LAB // isolated browser simulation", "No real shell, network, or target is accessible."]);
  const [inspected, setInspected] = useState(false);
  const [message, setMessage] = useState("");
  const normalized = useMemo(() => flag.trim().toUpperCase(), [flag]);

  if (!challenge) return null;
  const execute = (event: FormEvent) => {
    event.preventDefault();
    const input = command.trim().toLowerCase();
    if (!input) return;
    if (input === challenge.command) {
      setHistory((items) => [...items, `ctf@lab:~$ ${input}`, ...challenge.output]);
      setInspected(true);
      setMessage("");
    } else {
      setHistory((items) => [...items, `ctf@lab:~$ ${input}`, "command not recognised in this challenge instance. Read the artifact manifest and choose the relevant analysis command."]);
      setMessage("The lab only accepts the intended safe analysis command for this artifact.");
    }
    setCommand("");
  };
  const submitFlag = (event: FormEvent) => {
    event.preventDefault();
    if (inspected && normalized === challenge.flag) onSolved();
    else setMessage(inspected ? "Flag rejected. Compare your finding with the artifact output and preserve exact punctuation." : "Inspect the local artifact first; the flag is gated until the evidence is reviewed.");
  };

  return <div className="grid gap-6 xl:grid-cols-[1.12fr_.88fr]"><section className="overflow-hidden rounded-2xl border border-rose-300/18 bg-[#070b14] shadow-[0_24px_80px_rgba(0,0,0,.28)]"><div className="flex items-center justify-between border-b border-white/[.08] bg-white/[.03] px-4 py-3"><div className="flex items-center gap-2"><TerminalSquare className="h-4 w-4 text-rose-200" /><span className="font-mono text-[10px] tracking-[.16em] text-rose-200">CTF TERMINAL // OFFLINE</span></div><span className="font-mono text-[9px] text-slate-500">NO HINTS</span></div><div className="h-72 overflow-y-auto p-5 font-mono text-[11px] leading-6 text-slate-300">{history.map((line, index) => <p key={`${line}-${index}`} className={line.startsWith("ctf@") ? "text-cyan-300" : "whitespace-pre-line"}>{line}</p>)}<form onSubmit={execute} className="mt-2 flex gap-2"><span className="text-violet-300">ctf@lab:~$</span><input autoFocus value={command} onChange={(event) => setCommand(event.target.value)} aria-label="CTF analysis command" className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-600" placeholder="run the relevant analysis command" /></form></div></section><section className="space-y-5"><div className="rounded-2xl border border-amber-300/16 bg-amber-300/[.045] p-5"><div className="flex items-center gap-3"><LockKeyhole className="h-5 w-5 text-amber-200" /><div><p className="font-mono text-[10px] tracking-[.16em] text-amber-200">ARTIFACT MANIFEST</p><h3 className="mt-1 font-semibold text-white">No guided hints</h3></div></div><p className="mt-4 text-sm leading-6 text-slate-300">{challenge.objective}</p><p className="mt-4 rounded-lg border border-white/[.08] bg-[#070b14] p-3 font-mono text-[10px] text-slate-400">{challenge.artifact}</p></div><div className="rounded-2xl border border-violet-300/16 bg-violet-300/[.045] p-5"><p className="font-mono text-[10px] tracking-[.16em] text-violet-200">FLAG SUBMISSION</p><form onSubmit={submitFlag} className="mt-4"><label className="font-mono text-[10px] text-slate-500">{inspected ? "ENTER RECOVERED FLAG" : "LOCKED UNTIL INSPECTION"}</label><input value={flag} onChange={(event) => setFlag(event.target.value)} disabled={!inspected} placeholder={inspected ? "FLAG{...}" : "Run the analysis command first"} className="mt-2 h-11 w-full rounded-lg border border-white/[.12] bg-white/[.035] px-3 font-mono text-xs text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50" /><button disabled={!inspected} className="mt-3 w-full rounded-xl bg-violet-300 px-4 py-3 text-xs font-bold text-[#160b25] transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-40"><Flag className="mr-2 inline h-4 w-4" /> SUBMIT FLAG</button></form>{message && <p role="status" className="mt-3 text-xs leading-5 text-rose-100">{message}</p>}</div></section></div>;
}
