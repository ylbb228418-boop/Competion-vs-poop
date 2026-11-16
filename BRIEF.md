# Project brief: Anti-bullies: find out and report your bullies

## Competition

- Presidential SI Challenge, Standard Track
- Builder: middle school student, grades 6–8
- Judges score a written entry (up to 10 pages) and a video (up to 4 minutes).
- Register by December 18, 2026 at 5:00 p.m. Eastern. Submit by December 23, 2026 at 2:00 p.m. Pacific / 5:00 p.m. Eastern.

## Problem

Students may be repeatedly bothered at school. The behavior can stop when a student gets upset, then happen again the next day. This repeated “buzzing around” can be hard to recognize as a harmful pattern.

Impact area: safety and kindness.

Student interviews:

- Person A: “They just bug me one day until I was annoyed and when I calm down they start again.”
- Person B: “I always get bugged a lot for no reason. I didn’t even do anything to them.”

Evidence: The 2022 School Crime Supplement reported that about 19.2% of students ages 12–18 in grades 6–12 reported being bullied. Source: https://www.stopbullying.gov/bullying/what-is-bullying

## Solution

The AI helps a student notice how long the behavior has been happening and how frequently it happens. It should not decide automatically whether something is bullying, because a student may not know whether an event was a prank or something harmful. The app should help identify a repeated harmful pattern and encourage trusted-adult review.

Existing reporting tools, such as STOPit Anonymous Reporting, let people report concerns but do not focus on whether continuous teasing or pranks are becoming more harmful over time.

## AI instructions

The user types what happened and presses Check. The AI explains what may be happening. It talks to children, parents, teens, and other people who need help, so it must sound polite, serious, calm, and easy to understand.

Bullying is unwanted, aggressive behavior among school-aged children that involves a real or perceived power imbalance. The behavior is repeated, or has the potential to be repeated, over time. Bullying can be verbal, social, physical, or online. The AI must not make a final legal or disciplinary decision.

Rules:

- Never be unkind or blame the student.
- Never tell a student to fight, threaten, retaliate, or confront someone in an unsafe way.
- Explain what is happening first.
- Use the report’s duration and frequency as signals, not proof.
- Recommend a trusted adult review.
- If someone is in immediate danger, tell them to move to safety and contact emergency help.

## Version 1

Build the smallest complete experience: one student uses the AI once from start to finish. Make the difference from existing tools easy to see. Save sample, made-up items in browser localStorage for now. Keep browser saving in one small file so it can later be replaced by a real database. Keep the OpenAI request in one small, clearly named server file. The key must stay on the server and be read only from `.env`.

Show “Thinking…” while waiting and disable the Check button. If the AI cannot answer because of an expired key or no internet, show a friendly message telling the user to check the key. Do not automatically punish or accuse anyone.

## Safety plan

- Physical safety: never suggest fighting or revenge. Tell the student to move to a safe place and tell a trusted adult. Show emergency help for immediate danger.
- Wrong answer: say “This may be a repeated harmful pattern,” ask a counselor, parent, or teacher to review it, and never punish someone automatically.
- Protect student privacy. Use made-up samples and keep reports local for this prototype.

## Maybe Later

- A real school-approved database with strong access controls.
- Trusted-adult accounts and a school review workflow.
- Anonymous reporting, if a school approves the process.
- Better pattern charts and optional location/time analysis.
- Testing with adults and students using consent and privacy safeguards.
