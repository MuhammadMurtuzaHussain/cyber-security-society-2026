export type MissionCategory = "Password Security" | "Social Engineering" | "Incident Investigation" | "Web Security" | "Multiple Skills" | "GRC & Assurance";
export type MissionStatus = "available" | "locked" | "complete";

export type Mission = {
  id: string;
  code: string;
  title: string;
  eyebrow: string;
  difficulty: string;
  category: MissionCategory;
  xp: number;
  estimatedTime: string;
  description: string;
  skills: string[];
  status: MissionStatus;
  learning: {
    happened: string;
    concept: string;
    attackers: string;
    defenders: string;
  };
};

export const missions: Mission[] = [
  {
    id: "guess-my-password",
    code: "MISSION 01",
    title: "Guess My Password",
    eyebrow: "OSINT TRAINING",
    difficulty: "BEGINNER",
    category: "Password Security",
    xp: 100,
    estimatedTime: "4 min",
    description: "Sarah has forgotten her password. Her public profile may hold the clues.",
    skills: ["OSINT", "Passwords"],
    status: "available",
    learning: {
      happened: "You used harmless, public profile clues to identify a predictable password pattern.",
      concept: "OSINT means gathering openly available information. Passwords based on names, dates, pets, or hobbies can be guessed far more easily than random passphrases.",
      attackers: "Attackers may try public information in password-spraying or credential-stuffing attempts. This fictional exercise never contacts real accounts.",
      defenders: "Use a password manager to create unique, long passwords. Turn on multi-factor authentication and avoid personal facts in passwords.",
    },
  },
  {
    id: "catch-the-phish",
    code: "MISSION 02",
    title: "Catch the Phish",
    eyebrow: "INBOX INVESTIGATION",
    difficulty: "BEGINNER",
    category: "Social Engineering",
    xp: 150,
    estimatedTime: "6 min",
    description: "A student's inbox contains a credential-stealing email. Find the trap before it works.",
    skills: ["Email analysis", "URLs"],
    status: "available",
    learning: {
      happened: "You found an email using urgency, a lookalike sender, and a misleading sign-in link to pressure a target.",
      concept: "Phishing is social engineering: an attacker persuades a person to reveal data or take an unsafe action.",
      attackers: "Real phishing campaigns imitate familiar organisations and exploit urgency. They often use deceptive domains or unexpected links.",
      defenders: "Pause before acting. Verify the sender and destination independently, report suspicious messages, and use MFA.",
    },
  },
  {
    id: "who-hacked-us",
    code: "MISSION 03",
    title: "Who Hacked Us?",
    eyebrow: "INCIDENT CASEFILE",
    difficulty: "BEGINNER +",
    category: "Incident Investigation",
    xp: 250,
    estimatedTime: "9 min",
    description: "A fictional society server was accessed at 02:13. Reconstruct what happened from the evidence.",
    skills: ["Logs", "Timelines", "Triage"],
    status: "available",
    learning: {
      happened: "You connected login failures, a successful admin sign-in, a download, and a password change into one incident timeline.",
      concept: "Incident investigation links evidence into an explainable timeline, rather than relying on a single suspicious event.",
      attackers: "Password spraying tries a small set of common passwords across accounts to avoid repeated failures against just one target.",
      defenders: "Require MFA, monitor failed-login patterns, use strong admin controls, and quickly reset credentials after suspicious activity.",
    },
  },
  {
    id: "broken-website",
    code: "MISSION 04",
    title: "The Broken Website",
    eyebrow: "SANDBOXED WEB LAB",
    difficulty: "INTERMEDIATE",
    category: "Web Security",
    xp: 300,
    estimatedTime: "7 min",
    description: "Explore a fictional ACME Systems application and discover what a developer forgot to remove.",
    skills: ["Discovery", "Information leakage"],
    status: "available",
    learning: {
      happened: "You found a fictional debug endpoint that exposed test data which should never be visible in a production environment.",
      concept: "Information leakage happens when applications expose implementation details, configuration, or development features.",
      attackers: "Attackers may look for exposed backups, error messages, debug routes, and forgotten test environments. This mission stays entirely in the local simulation.",
      defenders: "Use release checklists, disable debug modes, restrict test endpoints, and review what each deployment exposes.",
    },
  },
  {
    id: "escape-room",
    code: "MISSION 05",
    title: "Cyber Escape Room",
    eyebrow: "INCIDENT RESPONSE SIM",
    difficulty: "INTERMEDIATE +",
    category: "Multiple Skills",
    xp: 500,
    estimatedTime: "15 min",
    description: "A fictional ransomware alarm is counting down. Follow the clues, recover the key, and contain the simulation.",
    skills: ["Decoding", "Investigation", "Defence"],
    status: "locked",
    learning: {
      happened: "You moved through a staged containment workflow: decode the alert, identify the account and entry point, verify recovery material, and stop the simulation.",
      concept: "Incident response is a sequence of calm, evidence-led decisions: identify, contain, recover, and learn.",
      attackers: "Ransomware actors commonly rely on weak credentials, exposed services, and unprepared recovery processes.",
      defenders: "Keep tested backups, practise incident plans, protect accounts with MFA, and isolate affected systems quickly.",
    },
  },
  {
    id: "shell-forensics",
    code: "MISSION 06",
    title: "Shellshock Forensics",
    eyebrow: "TERMINAL INCIDENT LAB",
    difficulty: "ADVANCED",
    category: "Incident Investigation",
    xp: 650,
    estimatedTime: "18 min",
    description: "A simulated Linux host is behaving strangely. Use a constrained terminal to reconstruct persistence, verify a hash, and contain the host.",
    skills: ["Shell", "Logs", "Hashing"],
    status: "available",
    learning: {
      happened: "You combined shell history, authentication logs, a file hash, and an isolation action into a defensible incident response sequence.",
      concept: "Forensic triage is about preserving evidence while narrowing a hypothesis. Command output must be interpreted in context, not treated as proof by itself.",
      attackers: "Attackers may establish persistence, hide in scheduled tasks, and use legitimate tools after gaining access. This lab contains no real shell or operating-system access.",
      defenders: "Capture volatile evidence, centralise logs, verify artefacts with hashes, restrict privileges, and isolate affected hosts through an approved playbook.",
    },
  },
  {
    id: "browser-lockdown",
    code: "MISSION 07",
    title: "Browser Lockdown",
    eyebrow: "BROWSER SECURITY SIM",
    difficulty: "ADVANCED +",
    category: "Web Security",
    xp: 700,
    estimatedTime: "20 min",
    description: "A fictional web app has weak browser controls. Inspect its simulated storage and headers, then choose a defensive configuration that closes three attack paths.",
    skills: ["Cookies", "CSP", "Origin policy"],
    status: "available",
    learning: {
      happened: "You applied same-origin reasoning, hardened session-cookie attributes, and selected a restrictive Content Security Policy in a browser-only simulation.",
      concept: "Browser security depends on boundaries: origins, cookie scope, content sources, and the difference between trusted UI and untrusted input.",
      attackers: "Cross-site scripting, cross-site request forgery, clickjacking, and unsafe third-party content can turn a browser into an attack surface.",
      defenders: "Use HttpOnly, Secure and SameSite cookies, a reviewed CSP, frame protections, output encoding, and explicit origin checks.",
    },
  },
  {
    id: "api-auth-lab",
    code: "MISSION 08",
    title: "API Access Maze",
    eyebrow: "AUTHORIZATION REVIEW",
    difficulty: "EXPERT",
    category: "Web Security",
    xp: 800,
    estimatedTime: "22 min",
    description: "Review a fictional API response and identify why changing an object ID exposes another user's record. Select the root cause and the correct server-side fix.",
    skills: ["HTTP", "Authorization", "Threat modelling"],
    status: "available",
    learning: {
      happened: "You distinguished authentication from authorization and selected an object-level access-control fix rather than trusting a client-supplied identifier.",
      concept: "Being logged in does not mean a user is allowed to access every resource. Authorization must be checked on the server for every object and action.",
      attackers: "Insecure direct object references and broken object-level authorization can expose records when predictable identifiers are changed.",
      defenders: "Check ownership or policy server-side, use least privilege, avoid security decisions in the client, and log denied authorization attempts.",
    },
  },
  {
    id: "packet-puzzle",
    code: "MISSION 09",
    title: "Packet Pattern",
    eyebrow: "NETWORK DEFENCE SIM",
    difficulty: "EXPERT +",
    category: "Multiple Skills",
    xp: 900,
    estimatedTime: "25 min",
    description: "A fictional capture contains a repeating outbound pattern. Correlate the source, timing, and response before choosing a containment action.",
    skills: ["Network analysis", "Correlation", "Containment"],
    status: "available",
    learning: {
      happened: "You separated a noisy DNS burst from a repeating beacon, correlated it to one internal host, and chose proportionate containment.",
      concept: "Detection engineering combines indicators, timing, context, and confidence. One unusual packet is rarely enough to make an incident decision.",
      attackers: "Command-and-control traffic may use regular callbacks, encoded subdomains, or common protocols to blend into normal activity.",
      defenders: "Baseline normal traffic, enrich alerts with asset context, preserve captures, block carefully, and investigate the host without destroying evidence.",
    },
  },
  {
    id: "base64-chain", code: "CTF 10", title: "Layer Cake", eyebrow: "ENCODING FORENSICS", difficulty: "EXPERT", category: "Multiple Skills", xp: 950, estimatedTime: "18 min", description: "A fictional evidence bundle hides a flag behind multiple transformations. Identify each layer without trusting the filename.", skills: ["Encoding", "Pattern analysis", "Shell"], status: "available", learning: { happened: "You separated encoding from encryption and followed a repeatable transformation chain to recover a local flag.", concept: "Encoding preserves data for transport; it does not provide confidentiality. Detection starts with recognising representation patterns.", attackers: "Attackers may layer encodings to frustrate casual inspection or hide content in logs and payloads.", defenders: "Normalise inputs, inspect content safely, and treat obfuscation as a signal for review rather than proof of maliciousness." },
  },
  {
    id: "xor-recovery", code: "CTF 11", title: "Two-Time Pad", eyebrow: "CRYPTO LAB", difficulty: "EXPERT", category: "Multiple Skills", xp: 1000, estimatedTime: "20 min", description: "Recover a fictional key stream from two reused XOR samples, then prove the weakness with a flag submission.", skills: ["Cryptography", "Hex", "Reasoning"], status: "available", learning: { happened: "You recognised that reusing a simple XOR key leaks relationships between plaintexts and recovered the local training flag.", concept: "XOR is not automatically encryption. Key reuse, weak keys, and predictable plaintext can destroy confidentiality.", attackers: "Weak custom cryptography can reveal patterns when the same key or nonce is reused.", defenders: "Use reviewed, modern cryptographic libraries with unique nonces and never invent production cryptography." },
  },
  {
    id: "jwt-forge", code: "CTF 12", title: "Token of Trust", eyebrow: "IDENTITY LAB", difficulty: "EXPERT +", category: "Web Security", xp: 1050, estimatedTime: "22 min", description: "Inspect a fictional JSON Web Token and explain the validation mistake that turns a signed session into a privilege escalation.", skills: ["JWT", "Identity", "Claims"], status: "available", learning: { happened: "You inspected the header and claims, identified an unsafe algorithm decision, and submitted the correct defensive finding.", concept: "Tokens are data with security properties only when the verifier enforces an allow-list of algorithms and validates claims.", attackers: "Weak token verification or trusting client-controlled claims can turn a normal account into an admin session.", defenders: "Pin algorithms, verify signatures and claims server-side, rotate keys, and keep token lifetimes short." },
  },
  {
    id: "sqli-sleuth", code: "CTF 13", title: "Query Under Pressure", eyebrow: "DATABASE INJECTION LAB", difficulty: "EXPERT +", category: "Web Security", xp: 1100, estimatedTime: "24 min", description: "Review a fictional search endpoint and identify why concatenated input changes the query plan. Submit the safe remediation flag.", skills: ["SQL", "Injection", "Code review"], status: "available", learning: { happened: "You distinguished input validation from query parameterisation and selected the server-side fix.", concept: "SQL injection occurs when data is interpreted as query structure. Escaping alone is fragile across contexts.", attackers: "Injection can alter reads, writes, authentication logic, or error paths when untrusted input reaches an interpreter.", defenders: "Use parameterised queries, least-privilege database accounts, safe error handling, and security tests." },
  },
  {
    id: "xss-escape", code: "CTF 14", title: "Markup Mirage", eyebrow: "CLIENT-SIDE SECURITY", difficulty: "EXPERT +", category: "Web Security", xp: 1150, estimatedTime: "22 min", description: "A fictional comment board renders user input in three contexts. Find the unsafe sink and choose the context-aware defensive control.", skills: ["XSS", "DOM", "Output encoding"], status: "available", learning: { happened: "You traced untrusted input to a dangerous HTML sink and selected a defence that matches the rendering context.", concept: "Cross-site scripting is a context problem. HTML, attribute, URL, and JavaScript contexts need different safe handling.", attackers: "Attackers may use stored, reflected, or DOM-based injection to execute script in another user's browser.", defenders: "Prefer safe DOM APIs, contextual encoding, strict CSP, and sanitisation only when rich HTML is genuinely required." },
  },
  {
    id: "ssrf-map", code: "CTF 15", title: "The Server Took a Detour", eyebrow: "REQUEST ROUTING LAB", difficulty: "EXPERT +", category: "Web Security", xp: 1200, estimatedTime: "24 min", description: "Map a fictional server-side fetch feature and identify how internal destinations become reachable through a public URL parameter.", skills: ["SSRF", "URL parsing", "Network boundaries"], status: "available", learning: { happened: "You separated client-side restrictions from server-side egress policy and selected layered SSRF defences.", concept: "Server-side request forgery happens when a server fetches attacker-influenced destinations with its own network position and privileges.", attackers: "SSRF can reach internal services, metadata endpoints, or administrative interfaces that are not public.", defenders: "Use allow-lists, safe URL parsing, DNS/IP validation, egress controls, and separate sensitive network zones." },
  },
  {
    id: "git-secrets", code: "CTF 16", title: "History Repeats", eyebrow: "REPOSITORY FORENSICS", difficulty: "EXPERT", category: "Incident Investigation", xp: 1250, estimatedTime: "20 min", description: "Search a fictional repository's commit history for a removed secret and decide how to rotate and contain it.", skills: ["Git", "Secrets", "IR"], status: "available", learning: { happened: "You found a secret in history rather than the current tree and chose rotation plus history-aware remediation.", concept: "Deleting a secret from the latest file does not remove old commits, forks, caches, or clones.", attackers: "Public repositories and leaked build logs are routinely searched for credentials and tokens.", defenders: "Use secret scanning, short-lived credentials, rotation, protected CI variables, and incident playbooks for exposed secrets." },
  },
  {
    id: "dns-tunnel", code: "CTF 17", title: "Names That Whisper", eyebrow: "DNS ANALYSIS", difficulty: "EXPERT +", category: "Multiple Skills", xp: 1300, estimatedTime: "25 min", description: "Analyse a fictional DNS capture where labels, entropy, and timing reveal a possible data channel.", skills: ["DNS", "Statistics", "Detection"], status: "available", learning: { happened: "You combined label length, character distribution, and query timing instead of treating one unusual domain as conclusive.", concept: "Detection is stronger when multiple weak signals correlate across time and assets.", attackers: "DNS can be abused for command-and-control or low-bandwidth data transfer because it is widely allowed.", defenders: "Log DNS centrally, baseline clients, restrict resolvers, detect high-entropy labels, and investigate with asset context." },
  },
  {
    id: "memory-artifact", code: "CTF 18", title: "Ghost in the Process Tree", eyebrow: "MEMORY TRIAGE", difficulty: "EXPERT +", category: "Incident Investigation", xp: 1350, estimatedTime: "26 min", description: "A fictional memory snapshot contains a suspicious process chain. Reconstruct the parent-child relationship and identify the persistence clue.", skills: ["Memory", "Processes", "Triage"], status: "available", learning: { happened: "You used process ancestry and command-line context to distinguish normal activity from an injected execution chain.", concept: "Memory captures preserve volatile context that may disappear from disk and can reveal process relationships and injected code.", attackers: "Living-off-the-land techniques may hide malicious actions inside trusted utilities and unusual parent-child chains.", defenders: "Capture memory carefully, compare against baselines, collect command lines, and correlate with endpoint telemetry." },
  },
  {
    id: "supply-chain", code: "CTF 19", title: "Dependency Drift", eyebrow: "SOFTWARE SUPPLY CHAIN", difficulty: "EXPERT +", category: "Multiple Skills", xp: 1400, estimatedTime: "24 min", description: "Verify a fictional package lockfile, maintainer change, and build checksum before approving a release.", skills: ["SBOM", "Integrity", "CI/CD"], status: "available", learning: { happened: "You correlated a lockfile change, a maintainer anomaly, and a checksum mismatch before stopping the release.", concept: "Software supply-chain security depends on provenance, integrity, dependency visibility, and controlled build environments.", attackers: "Compromised packages, maintainers, registries, or build pipelines can introduce malicious code upstream.", defenders: "Pin dependencies, verify provenance and checksums, generate SBOMs, review changes, and isolate build credentials." },
  },
  {
    id: "race-condition", code: "CTF 20", title: "Double-Spend", eyebrow: "CONCURRENCY LAB", difficulty: "EXPERT +", category: "Web Security", xp: 1500, estimatedTime: "28 min", description: "Replay two fictional requests against a points-transfer API and identify why a time-of-check/time-of-use gap creates duplicate credit.", skills: ["Concurrency", "API design", "State"], status: "available", learning: { happened: "You modelled interleaved requests and selected an atomic state transition instead of relying on a UI lock.", concept: "Race conditions occur when security checks and state changes are not performed as one atomic operation.", attackers: "Concurrent requests can exploit timing windows in transfers, coupons, rate limits, and workflow approvals.", defenders: "Use transactions, row locks or compare-and-swap controls, idempotency keys, and server-side invariants." },
  },
];

export type Achievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
  requirement: string;
};

export const achievements: Achievement[] = [
  { id: "password-cracker", icon: "⌘", title: "Password Cracker", description: "Solved your first password challenge.", requirement: "Mission 01" },
  { id: "phishing-hunter", icon: "◉", title: "Phishing Hunter", description: "Spotted a credential-stealing email.", requirement: "Mission 02" },
  { id: "digital-detective", icon: "⌕", title: "Digital Detective", description: "Closed an incident casefile.", requirement: "Mission 03" },
  { id: "web-explorer", icon: "◇", title: "Web Explorer", description: "Captured a flag in the local web lab.", requirement: "Mission 04" },
  { id: "ctf-survivor", icon: "✦", title: "CTF Survivor", description: "Stopped the cyber escape room simulation.", requirement: "Mission 05" },
  { id: "shell-operator", icon: "⌁", title: "Shell Operator", description: "Completed a terminal-forensics chain.", requirement: "Mission 06" },
  { id: "browser-warden", icon: "◌", title: "Browser Warden", description: "Hardened a simulated browser boundary.", requirement: "Mission 07" },
  { id: "access-architect", icon: "▣", title: "Access Architect", description: "Separated authentication from authorization.", requirement: "Mission 08" },
  { id: "packet-reader", icon: "⋈", title: "Packet Reader", description: "Correlated a simulated beacon pattern.", requirement: "Mission 09" },
  { id: "ctf-base64-chain", icon: "◈", title: "Layer Breaker", description: "Solved a multi-layer encoding challenge.", requirement: "CTF 10" },
  { id: "ctf-xor-recovery", icon: "⊕", title: "Key Reuse Hunter", description: "Exposed a reused XOR key stream.", requirement: "CTF 11" },
  { id: "ctf-jwt-forge", icon: "◉", title: "Token Inspector", description: "Found an unsafe token validation rule.", requirement: "CTF 12" },
  { id: "ctf-sqli-sleuth", icon: "▤", title: "Query Guardian", description: "Stopped a simulated injection path.", requirement: "CTF 13" },
  { id: "ctf-xss-escape", icon: "◇", title: "Context Escaper", description: "Closed a simulated browser injection sink.", requirement: "CTF 14" },
  { id: "ctf-ssrf-map", icon: "◎", title: "Boundary Mapper", description: "Hardened a server-side request boundary.", requirement: "CTF 15" },
  { id: "ctf-git-secrets", icon: "⌘", title: "History Hunter", description: "Found a secret hidden in repository history.", requirement: "CTF 16" },
  { id: "ctf-dns-tunnel", icon: "∿", title: "DNS Listener", description: "Correlated entropy and timing in DNS traffic.", requirement: "CTF 17" },
  { id: "ctf-memory-artifact", icon: "▦", title: "Volatile Analyst", description: "Reconstructed a suspicious process chain.", requirement: "CTF 18" },
  { id: "ctf-supply-chain", icon: "⬡", title: "Provenance Checker", description: "Blocked a fictional dependency integrity failure.", requirement: "CTF 19" },
  { id: "ctf-race-condition", icon: "↯", title: "Race Resolver", description: "Closed a simulated concurrency flaw.", requirement: "CTF 20" },
  { id: "signal-reader", icon: "⌁", title: "Signal Reader", description: "Reviewed every evidence tab.", requirement: "Investigation" },
  { id: "fast-learner", icon: "↗", title: "Fast Learner", description: "Earned 2,000 total XP.", requirement: "Progression" },
  { id: "curious-mind", icon: "?", title: "Curious Mind", description: "Used a hint to move forward.", requirement: "Discovery" },
];

export const leaderboard = [
  ["01", "ZeroCool", "8", "4,820", "12", "7"],
  ["02", "ByteHunter", "7", "4,210", "10", "6"],
  ["03", "RootRookie", "6", "3,850", "9", "5"],
  ["04", "PacketPanda", "6", "3,420", "8", "5"],
  ["05", "CipherNova", "5", "3,120", "7", "4"],
  ["06", "NullPointer", "5", "2,860", "7", "4"],
  ["07", "FoxyProxy", "4", "2,390", "6", "3"],
  ["08", "TraceRoute", "4", "2,170", "5", "3"],
  ["09", "BlueTeamBen", "3", "1,980", "4", "2"],
  ["10", "LogLady", "3", "1,720", "4", "2"],
] as const;

export const skillCards = [
  { name: "Investigation", level: 4, accent: "cyan" },
  { name: "Cryptography", level: 2, accent: "violet" },
  { name: "Web Security", level: 3, accent: "blue" },
  { name: "Social Engineering", level: 4, accent: "pink" },
  { name: "Defence", level: 2, accent: "lime" },
];

export function missionById(id: string) {
  return missions.find((mission) => mission.id === id);
}

export function levelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / 500) + 1);
}

export function titleForLevel(level: number) {
  const titles = ["Recruit", "Apprentice", "Analyst", "Investigator", "Operator", "Cyber Specialist", "Security Expert"];
  return titles[Math.min(level - 1, titles.length - 1)];
}
