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
    id: "isaca-invitation",
    code: "EVENT // LIMITED TIME",
    title: "ISACA Invitation: The Fifteen-Minute Control Room",
    eyebrow: "GRC / AUDIT / RISK EVENT",
    difficulty: "EXPERT",
    category: "GRC & Assurance",
    xp: 1000,
    estimatedTime: "15 min hard limit",
    description: "A limited-time, server-verified fictional challenge across governance, audit, risk, resilience, secure design and incident response. The first 10 valid finishers secure an ISACA invitation slot.",
    skills: ["GRC", "Audit", "Risk", "IAM", "Secure Design", "IR"],
    status: "available",
    learning: {
      happened: "You made and justified a sequence of governance, security, risk and assurance decisions under time pressure.",
      concept: "Effective cyber resilience connects controls, risk appetite, evidence, technical design and accountable decision-making.",
      attackers: "Complex incidents often exploit gaps between people, processes, evidence, technology and governance—not only a single technical flaw.",
      defenders: "Strong organisations connect risk ownership, control testing, secure engineering, monitoring, recovery objectives and clear escalation paths.",
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
  { id: "isaca-control-room", icon: "◈", title: "Control Room Survivor", description: "Completed the ISACA fifteen-minute control room event.", requirement: "ISACA Event" },
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
