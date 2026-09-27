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
