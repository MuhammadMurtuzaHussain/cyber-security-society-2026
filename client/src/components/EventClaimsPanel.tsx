import { Download, LockKeyhole, UsersRound } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function EventClaimsPanel() {
  const { user, loading } = useAuth();
  const allowed = user?.role === "admin";
  const claims = trpc.isacaEvent.adminClaims.useQuery(undefined, { enabled: allowed, refetchOnWindowFocus: true });

  if (loading) return <section className="mt-7 rounded-2xl border border-white/[.08] bg-[#0d1422]/75 p-5"><p className="font-mono text-[10px] text-slate-500">VERIFYING COMMITTEE ACCESS…</p></section>;
  if (!allowed) return <section className="mt-7 rounded-2xl border border-white/[.08] bg-[#0d1422]/75 p-5"><div className="flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[.05] text-slate-500"><LockKeyhole className="h-4 w-4" /></span><div><p className="text-sm font-semibold text-slate-300">Invitation claims are restricted</p><p className="mt-1 text-sm leading-6 text-slate-500">Only committee accounts with an administrator role can view submitted student IDs.</p></div></div></section>;
  if (claims.isLoading) return <section className="mt-7 rounded-2xl border border-white/[.08] bg-[#0d1422]/75 p-5"><p className="font-mono text-[10px] text-slate-500">LOADING INVITATION CLAIMS…</p></section>;
  if (claims.error) return <section className="mt-7 rounded-2xl border border-rose-300/15 bg-rose-300/[.05] p-5"><p className="text-sm text-rose-100">Unable to load invitation claims: {claims.error.message}</p></section>;

  const data = claims.data;
  const exportRows = () => {
    if (!data) return;
    const rows = [["Slot", "Student ID", "Status", "Reserved at", "Consent recorded"], ...data.claims.map((claim, index) => [String(index + 1), claim.studentId ?? "Pending", claim.status, new Date(claim.reservedAt).toISOString(), claim.consentedAt ? new Date(claim.consentedAt).toISOString() : "Pending"])];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "isaca-invitation-claims.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return <section className="mt-7 overflow-hidden rounded-2xl border border-violet-300/18 bg-[#0d1422]/75"><header className="flex flex-col gap-4 border-b border-white/[.07] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-300/10 text-violet-200"><UsersRound className="h-4 w-4" /></span><div><p className="font-mono text-[10px] tracking-[.15em] text-violet-300">ISACA EVENT / PERSONAL DATA</p><h3 className="mt-1 text-sm font-semibold text-white">Reserved invitation places</h3></div></div><div className="flex items-center gap-3"><span className="font-mono text-xs text-violet-100">{data?.claimedSlots ?? 0}<span className="text-slate-600">/{data?.capacity ?? 10}</span> RESERVED</span><button onClick={exportRows} disabled={!data?.claims.length} className="rounded-lg border border-white/[.1] bg-white/[.04] px-3 py-2 text-[10px] font-bold text-slate-200 transition hover:bg-white/[.08] disabled:cursor-not-allowed disabled:opacity-40"><Download className="mr-1 inline h-3.5 w-3.5" /> EXPORT CSV</button></div></header><div className="overflow-x-auto"><div className="min-w-[620px]"><div className="grid grid-cols-[.4fr_1fr_.8fr_1fr_1fr] gap-3 border-b border-white/[.06] px-5 py-3 font-mono text-[9px] tracking-[.12em] text-slate-500"><span>SLOT</span><span>STUDENT ID</span><span>STATUS</span><span>RESERVED</span><span>CONSENT</span></div>{data?.claims.map((claim, index) => <div key={claim.id} className="grid grid-cols-[.4fr_1fr_.8fr_1fr_1fr] gap-3 border-b border-white/[.055] px-5 py-4 text-xs"><span className="font-mono text-slate-500">{String(index + 1).padStart(2, "0")}</span><span className="font-mono text-cyan-100">{claim.studentId ?? "Awaiting submission"}</span><span className={claim.status === "submitted" ? "font-mono text-emerald-300" : "font-mono text-amber-200"}>{claim.status.toUpperCase()}</span><span className="font-mono text-slate-400">{new Date(claim.reservedAt).toLocaleString()}</span><span className="font-mono text-slate-400">{claim.consentedAt ? "Recorded" : "Awaiting"}</span></div>)}{!data?.claims.length && <div className="px-5 py-8 text-center text-sm text-slate-500">No event places have been reserved yet.</div>}</div></div><p className="border-t border-white/[.07] px-5 py-3 text-[11px] leading-5 text-slate-500">Student IDs appear here only after a qualifying student has secured a first-ten slot and recorded explicit consent. Export responsibly and delete local copies when no longer required.</p></section>;
}
