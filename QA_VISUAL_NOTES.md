# Visual Validation Notes

Desktop previews were captured at 1280×720 on 9 September 2026.

The landing page renders as a high-contrast, asymmetric cyber operations entry point with a legible hero, navigation, and simulated command panel. The dashboard, mission hub, leaderboard, and four inspected mission routes all preserve the dark command-centre hierarchy, readable type, clear controls, and visible safety labelling. No clipped primary controls, overlapping panels, broken layouts, or low-contrast critical text were observed in the captured desktop views.

The password, inbox, investigation, and web-lab simulations all expose the intended interaction affordances in the first viewport. The web-lab's developer note and simulated path bar are visible, and the phishing mission clearly separates inbox selection from evidence-based classification.

Next validation: confirm the narrow mobile layout and then save the final project checkpoint.

Mobile previews were captured at 390×844. The landing page keeps the CTA hierarchy visible without horizontal overflow. The mission hub converts to a single column with accessible filter chips and a full-width search control. The password mission preserves readable profile evidence; the inbox remains a coherent vertically stacked investigation layout; and the profile metrics compress cleanly without clipping. The mobile navigation menu trigger and compact status controls are present in all internal app previews.

Visual validation is complete. No responsive corrections were required.

Gameplay validation was performed in the browser on the password mission. Entering the fictional profile-derived solution `Bruno1407` and submitting it transitioned to the mission-complete learning screen, added 100 XP (1,420 to 1,520), changed the player from Level 3 Analyst to Level 4 Investigator, and presented the expected OSINT, attacker, and defender explanations. This verifies the primary solve → XP → learning outcome path end to end.

The phishing mission's error path was also verified. Classifying the safe University Library message as phishing retained the message state and surfaced specific, non-punitive corrective feedback that directs the player to review sender, destination, urgency, and credential-request evidence.

The phishing completion path was then verified by opening the simulated IT Support email, examining its lookalike domain, urgency, credential request, and destination, then classifying it as phishing. The app awarded 150 XP (1,520 to 1,670) and displayed the expected social-engineering learning screen.

## ISACA Event Extension

The limited-time ISACA Invitation route was checked at desktop (1280×720) and mobile (390×844). The event card is discoverable in Mission Control; the entry screen cleanly presents the one-hour limit, three attempts per stage, no-hint rule, server verification, deadline, first-ten capacity, and the GRC/audit/risk domain coverage. The mobile layout keeps the deadline, mission briefing, event rules, and navigation readable without horizontal overflow.

The unauthenticated access guard was confirmed in the browser: the event presents a “Sign in to compete” control rather than starting or exposing any stage. Unit tests verify fifteen numbered seeded stages, unique cross-seed tags, server-only answers, response normalisation, the one-hour deadline, and the Saturday 12 September 2026 17:00 Europe/London cutoff. The production build, TypeScript check, and all 10 unit tests pass.

Failed runs now present a restart control while the event remains open. The server replaces only failed runs with a fresh one-hour, Stage 01, uniquely seeded case; completed runs and their invitation claims remain immutable. Restart eligibility is unit-tested for failed, active, completed, and post-cutoff states.
