import { createHash } from "crypto";

export const ISACA_EVENT = {
  key: "isaca-invite-september-2026",
  title: "ISACA Invitation: The One-Hour Control Room",
  deadlineMs: Date.UTC(2026, 8, 12, 16, 0, 0), // 17:00 Europe/London (BST)
  durationMs: 60 * 60 * 1000,
  maxAttemptsPerStage: 3,
  maxInvitationSlots: 10,
  stageCount: 15,
} as const;

export type EventStage = {
  number: number;
  title: string;
  discipline: string;
  difficulty: string;
  briefing: string;
  files: Record<string, string>;
  answer: string;
};

export type PublicEventStage = Omit<EventStage, "answer">;

function hash(seed: string) {
  return createHash("sha256").update(seed).digest("hex");
}

function pick<T>(seed: string, salt: string, items: readonly T[]): T {
  const index = parseInt(hash(`${seed}:${salt}`).slice(0, 8), 16) % items.length;
  return items[index]!;
}

function numberPick(seed: string, salt: string, values: readonly number[]) {
  return pick(seed, salt, values);
}

function caseTag(seed: string, stage: number) {
  return `case-${hash(`${seed}:tag:${stage}`).slice(0, 6)}`;
}

function answer(value: string, tag: string) {
  return `${value}:${tag}`;
}

function files(tag: string, content: Record<string, string>) {
  return {
    "case.tag": `RUN IDENTIFIER\n${tag}\n\nUse this identifier after a colon in every submitted response.`,
    ...content,
  };
}

export function normaliseEventAnswer(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export function getEventCloseReason(now = Date.now()) {
  if (now >= ISACA_EVENT.deadlineMs) return "event_closed" as const;
  return null;
}

export function getRunDeadline(startedAt: Date | number) {
  const start = startedAt instanceof Date ? startedAt.getTime() : startedAt;
  return Math.min(start + ISACA_EVENT.durationMs, ISACA_EVENT.deadlineMs);
}

export function isRunActive(startedAt: Date | number, now = Date.now()) {
  return now < getRunDeadline(startedAt);
}

/**
 * Builds all content deterministically from a server-stored seed. Answers stay
 * server-only; the browser receives only public briefing and local terminal files.
 */
export function buildEventStages(seed: string): EventStage[] {
  const s1Tag = caseTag(seed, 1);
  const accountable = pick(seed, "raci-owner", ["ciso", "cio", "head-of-operations"] as const);
  const consulted = pick(seed, "raci-consulted", ["head-of-operations", "cio", "ciso"].filter((role) => role !== accountable));

  const s2Tag = caseTag(seed, 2);
  const rto = numberPick(seed, "rto", [2, 4, 6, 8] as const);
  const service = pick(seed, "service", ["student-records", "finance-ledger", "research-vault"] as const);

  const s3Tag = caseTag(seed, 3);
  const likelihood = numberPick(seed, "likelihood", [3, 4, 5] as const);
  const impact = numberPick(seed, "impact", [3, 4, 5] as const);

  const s4Tag = caseTag(seed, 4);
  const control = pick(seed, "control", ["preventive", "detective", "corrective"] as const);
  const controlScenario: Record<typeof control, string> = {
    preventive: "A conditional-access rule blocks legacy authentication before a session can begin.",
    detective: "A correlation rule raises an alert when a privileged account signs in from two countries within ten minutes.",
    corrective: "An automation revokes an exposed access token after a confirmed alert.",
  };

  const s5Tag = caseTag(seed, 5);
  const evidence = pick(seed, "evidence", ["system-log", "signed-report", "ticket-export"] as const);
  const evidenceDetails: Record<typeof evidence, string> = {
    "system-log": "Immutable, time-stamped export taken directly from the identity platform with a documented extraction path.",
    "signed-report": "Monthly manager attestation with a digital signature and retained review date.",
    "ticket-export": "Change ticket export containing approval, implementation date, and reviewer identity.",
  };

  const s6Tag = caseTag(seed, 6);
  const compromised = pick(seed, "account", ["svc-reporting", "svc-enrolment", "svc-payments"] as const);
  const decoy = compromised === "svc-reporting" ? "svc-enrolment" : "svc-reporting";

  const s7Tag = caseTag(seed, 7);
  const artefact = `release-${hash(`${seed}:artefact`).slice(0, 5)}`;
  const safeHash = hash(`${seed}:safe`).slice(0, 12);
  const changedHash = hash(`${seed}:changed`).slice(0, 12);

  const s8Tag = caseTag(seed, 8);
  const segment = pick(seed, "segment", ["research-vault", "finance-db", "identity-core"] as const);
  const permittedPort = pick(seed, "port", [443, 5432, 636] as const);
  const source = pick(seed, "source", ["audit-jump", "reporting-api", "backup-worker"] as const);

  const s9Tag = caseTag(seed, 9);
  const credential = pick(seed, "credential", ["refresh-token", "vpn-certificate", "api-key"] as const);

  const s10Tag = caseTag(seed, 10);
  const riskDecision = pick(seed, "risk-treatment", ["mitigate", "transfer", "avoid"] as const);
  const treatmentScenario: Record<typeof riskDecision, string> = {
    mitigate: "Residual risk is above appetite, but a technical safeguard can reduce likelihood within the delivery window.",
    transfer: "A contractually insurable third-party exposure remains; policy requires a supplier indemnity and cyber insurance review.",
    avoid: "The proposed processing has no lawful basis and exceeds the organisation’s stated risk appetite; no viable safeguard removes the issue.",
  };

  const s11Tag = caseTag(seed, 11);
  const severity = pick(seed, "severity", ["sev-1", "sev-2", "sev-3"] as const);
  const severityScenario: Record<typeof severity, string> = {
    "sev-1": "Confirmed exfiltration of restricted student records is ongoing across two critical services.",
    "sev-2": "A privileged account is compromised; access is contained but an internal service has been interrupted.",
    "sev-3": "A suspicious message was reported, and no account access or service impact is confirmed.",
  };

  const s12Tag = caseTag(seed, 12);
  const stride = pick(seed, "stride", ["tampering", "spoofing", "elevation-of-privilege"] as const);
  const strideScenario: Record<typeof stride, string> = {
    tampering: "An attacker alters a grade-change request between approval and submission.",
    spoofing: "A fake identity service presents a lookalike sign-in prompt to staff.",
    "elevation-of-privilege": "A standard user discovers a local workflow that grants an administrator-only export.",
  };

  const s13Tag = caseTag(seed, 13);
  const codingControl = pick(seed, "coding-control", ["parameterized-queries", "output-encoding", "allowlist-validation"] as const);
  const codingScenario: Record<typeof codingControl, string> = {
    "parameterized-queries": "A data-access function joins a user-provided record identifier into a database query string.",
    "output-encoding": "A support portal renders a user-submitted display name directly into an HTML activity feed.",
    "allowlist-validation": "A service accepts a callback destination and should only permit documented internal hostnames.",
  };

  const s14Tag = caseTag(seed, 14);
  const rpo = numberPick(seed, "rpo", [15, 30, 45, 60] as const);

  const s15Tag = caseTag(seed, 15);
  const finalAction = pick(seed, "final-action", ["escalate", "accept", "remediate"] as const);
  const finalScenario: Record<typeof finalAction, string> = {
    escalate: "The residual risk is above appetite, ownership is disputed, and the proposed exception crosses two business units.",
    accept: "Residual risk is within documented appetite, a named risk owner accepts it, and the expiry/review date is recorded.",
    remediate: "A control gap has an identified owner, feasible corrective action, and a mandatory deadline before the service can continue.",
  };

  return [
    {
      number: 1, title: "Control ownership", discipline: "GRC / Governance", difficulty: "ENTRY", briefing: "Establish accountability before touching the incident response plan.",
      files: files(s1Tag, {
        "raci.txt": `RACI EXTRACT\nControl: privileged-access review\nAccountable: ${accountable}\nConsulted: ${consulted}\nInformed: service-owner\n\nQuestion: identify the accountable role.`,
        "rule.txt": "Submit the accountable role in the exact response format shown in case.tag.",
      }), answer: answer(accountable, s1Tag),
    },
    {
      number: 2, title: "Recovery objective", discipline: "Business Continuity", difficulty: "FOUNDATION", briefing: "Translate a business impact assessment into a recovery objective.",
      files: files(s2Tag, {
        "bia.md": `BUSINESS IMPACT ASSESSMENT\nPriority service: ${service}\nMaximum tolerable downtime: ${rto} hours\nApproved recovery time objective: ${rto} hours\n\nQuestion: submit the RTO as a compact value, e.g. 4h.`,
        "context.txt": "RTO measures the maximum acceptable time to restore a service after disruption.",
      }), answer: answer(`${rto}h`, s2Tag),
    },
    {
      number: 3, title: "Inherent risk", discipline: "Risk Management", difficulty: "ANALYTIC", briefing: "Calculate an inherent risk score using the event’s scoring model.",
      files: files(s3Tag, {
        "risk-register.csv": `RISK=unreviewed privileged access\nLIKELIHOOD=${likelihood}\nIMPACT=${impact}\nMODEL=inherent risk = likelihood × impact\n\nQuestion: submit the numerical inherent score.`,
        "scale.txt": "Use the supplied model. Do not subtract control effectiveness at this stage.",
      }), answer: answer(String(likelihood * impact), s3Tag),
    },
    {
      number: 4, title: "Control intent", discipline: "Control Design", difficulty: "ANALYTIC", briefing: "Classify a control by when it acts in the threat lifecycle.",
      files: files(s4Tag, {
        "control-narrative.txt": controlScenario[control],
        "question.txt": "Classify the control: preventive, detective, or corrective.",
      }), answer: answer(control, s4Tag),
    },
    {
      number: 5, title: "Audit evidence", discipline: "IT Audit", difficulty: "ASSURANCE", briefing: "Identify the most reliable audit evidence for the stated control test.",
      files: files(s5Tag, {
        "test-objective.txt": "Test whether the access-review control operated throughout the quarter.",
        "evidence.txt": `Selected evidence: ${evidenceDetails[evidence]}`,
        "question.txt": "Submit the evidence type: system-log, signed-report, or ticket-export.",
      }), answer: answer(evidence, s5Tag),
    },
    {
      number: 6, title: "Signal in the noise", discipline: "SOC / Detection", difficulty: "INVESTIGATION", briefing: "Use a compressed authentication log to identify the account requiring containment.",
      files: files(s6Tag, {
        "auth.log": `08:10 ${decoy} success source=campus-north\n08:13 ${compromised} fail source=external-a\n08:14 ${compromised} success source=external-a mfa=not-enrolled\n08:15 ${compromised} token-issued scope=admin-report\n08:17 ${decoy} success source=campus-north\n`,
        "triage.txt": "Contain the account with the failed-to-successful external sign-in and elevated token issuance.",
      }), answer: answer(compromised, s6Tag),
    },
    {
      number: 7, title: "Integrity chain", discipline: "Cryptography / Supply Chain", difficulty: "FORENSIC", briefing: "Identify the artefact whose observed digest no longer matches the approved release manifest.",
      files: files(s7Tag, {
        "manifest.sha256": `${artefact}-api.tar.gz  ${safeHash}\n${artefact}-ui.tar.gz  ${changedHash}`,
        "observed.sha256": `${artefact}-api.tar.gz  ${changedHash}\n${artefact}-ui.tar.gz  ${changedHash}`,
        "question.txt": "Submit the artefact stem that fails integrity verification (without .tar.gz).",
      }), answer: answer(`${artefact}-api`, s7Tag),
    },
    {
      number: 8, title: "Least privilege path", discipline: "Network Security", difficulty: "ARCHITECTURE", briefing: "Choose the narrowest fictional rule that preserves the documented business flow.",
      files: files(s8Tag, {
        "flow.txt": `Approved dependency: ${source} -> ${segment} over TCP/${permittedPort}\nAll other cross-segment access must be denied by default.`,
        "question.txt": "Submit the permitted route as source-destination-port, using hyphens.",
      }), answer: answer(`${source}-${segment}-${permittedPort}`, s8Tag),
    },
    {
      number: 9, title: "Offboarding blast radius", discipline: "IAM", difficulty: "IDENTITY", briefing: "Determine the credential artefact that must be revoked after an offboarding failure.",
      files: files(s9Tag, {
        "offboarding.txt": `A contractor left 18 days ago. Their primary account is disabled, but a ${credential} was issued independently and remains valid for 30 days.`,
        "question.txt": "Submit the still-valid artefact that creates the residual access path.",
      }), answer: answer(credential, s9Tag),
    },
    {
      number: 10, title: "Third-party treatment", discipline: "Vendor Risk", difficulty: "GRC DECISION", briefing: "Select the risk treatment that follows policy and the supplied risk posture.",
      files: files(s10Tag, {
        "supplier-risk.txt": treatmentScenario[riskDecision],
        "question.txt": "Submit the treatment: mitigate, transfer, or avoid.",
      }), answer: answer(riskDecision, s10Tag),
    },
    {
      number: 11, title: "Declare the incident", discipline: "Incident Management", difficulty: "TRIAGE", briefing: "Assign a severity using impact, scope, and containment evidence.",
      files: files(s11Tag, {
        "situation-report.txt": severityScenario[severity],
        "severity-guide.txt": "SEV-1 = active critical compromise or regulated data loss.\nSEV-2 = contained privileged compromise or significant internal impact.\nSEV-3 = suspicious activity without confirmed impact.",
        "question.txt": "Submit the incident severity, e.g. sev-2.",
      }), answer: answer(severity, s11Tag),
    },
    {
      number: 12, title: "Threat-model lens", discipline: "Secure Design / STRIDE", difficulty: "MODELLING", briefing: "Map an abuse case to the most precise STRIDE category.",
      files: files(s12Tag, {
        "abuse-case.txt": strideScenario[stride],
        "question.txt": "Submit the STRIDE category: tampering, spoofing, or elevation-of-privilege.",
      }), answer: answer(stride, s12Tag),
    },
    {
      number: 13, title: "Engineering guardrail", discipline: "Secure Coding", difficulty: "APPLICATION", briefing: "Identify the primary defensive control suited to the described implementation flaw.",
      files: files(s13Tag, {
        "review-note.txt": codingScenario[codingControl],
        "question.txt": "Submit the primary control: parameterized-queries, output-encoding, or allowlist-validation.",
      }), answer: answer(codingControl, s13Tag),
    },
    {
      number: 14, title: "Recovery point", discipline: "Resilience / Backup", difficulty: "CONTINUITY", briefing: "Translate backup timing into the maximum acceptable data-loss window.",
      files: files(s14Tag, {
        "backup-timeline.txt": `Incident declared: 14:00\nLast verified recoverable backup: ${rpo} minutes before declaration\n\nQuestion: submit the RPO in a compact form, e.g. 30m.`,
        "definition.txt": "RPO is the maximum acceptable age of recoverable data at the time of an incident.",
      }), answer: answer(`${rpo}m`, s14Tag),
    },
    {
      number: 15, title: "Board-level decision", discipline: "Integrated Risk & Assurance", difficulty: "FINAL", briefing: "Make the governing decision using risk appetite, ownership, and remediation evidence.",
      files: files(s15Tag, {
        "executive-brief.txt": finalScenario[finalAction],
        "decision-rule.txt": "Escalate when authority or appetite is unclear. Accept only with named ownership within appetite. Remediate when corrective action is mandatory and feasible.",
        "question.txt": "Submit the required action: escalate, accept, or remediate.",
      }), answer: answer(finalAction, s15Tag),
    },
  ];
}

export function toPublicStage(stage: EventStage): PublicEventStage {
  const { answer: _answer, ...publicStage } = stage;
  return publicStage;
}
