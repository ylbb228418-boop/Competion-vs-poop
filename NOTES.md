# Anti-bullies notes

After each save point, push it to GitHub.

## How to run

Open PowerShell in this folder and run:

```text
node server.js
```

Then open http://localhost:3000 in a browser.

## How it goes online with Vercel

- Vercel serves the existing `public` page through `vercel.json` rewrites.
- Vercel runs `api/analyze.mjs` as the `/api/analyze` serverless function.
- Add Vercel Environment Variables named `KEYGEN_URL` and `KEYGEN_TOKEN` for the Production, Preview, and Development environments you use. No OpenAI key is placed in this project.
- The server gets the AI key from `getKey()` in `keygen.js`. `getKey()` calls `KEYGEN_URL/api/lookup-key`, caches the returned key until `expiresAt`, and refreshes once when OpenAI reports an invalid key.
- The local server loads the ignored `.env` file only when running on this computer. The keygen token and returned AI key never go to the page.
- Browser notes still use localStorage, so saved reports stay in the browser for now.

## Done

- Version 1 is built: a student can enter what happened, duration, frequency, and location, then press Check.
- The server gets a temporary OpenAI key from MindDo through `getKey()` and keeps it away from the browser.
- The server sends `BRIEF.md` as the AI instructions for every check.
- The OpenAI model is `gpt-5.6-luna`.
- The Check button shows “Thinking…” and cannot be pressed twice while waiting.
- Reports and two made-up sample items save in browser localStorage.
- Saves on this computer only for now.
- The app gives safety guidance and tells users to involve a trusted adult.
- The screen now uses a children’s storybook style with chapter labels, story language, no emojis, and a colorful illustrated background while keeping the safety rules.
- The small choice area now uses pastel storybook cards and friendlier selection controls.
- Added a repeated-pattern signal meter from “Probably not” to “Yes, very possible,” clearly marked as a clue rather than proof.
- Verified the MVP end to end: a made-up report reaches the server, gets an AI summary, shows the result and signal meter, and remains saved in browser localStorage.
- Duration, frequency, and location are now colorful clickable choice buttons that visibly show the selected answer.
- Choice cards now use soft paper-like colors, hand-drawn shapes, rounded buttons, and a warm selected state for a more storybook feel.
- The AI error message now clearly explains that a trusted adult should check the local key or internet connection.
- Added one behavior-type choice list so the student can give the AI more context: verbal teasing, social exclusion or rumors, physical or belongings, online messages, or not sure.
- Polished the choice colors so each storybook section has its own matching selected color.
- Added a tiny CSS-drawn bee with a dotted flight path behind it.
- Refined the bee into a small illustrated SVG with a clean dotted flight path.
- Enlarged the ANTI-BULLIES cover label and made the bee more like a friendly picture-book character.
- Warmed the palette to cream, honey, peach, and sage, and simplified the bee for a neater cozy picture-book look.
- Added a softer cozy background, sun glow, and warmer paper-card colors.
- Reserved visible space for the bee and placed it above the title so it cannot hide behind the large cover label.
- Made ANTI-BULLIES the large main title and changed the subtitle to “Find the pattern. Find support.”
- Styled ANTI-BULLIES as a bold colorful picture-book cover label so it stands out first.
- Made the title much larger and simplified the bee illustration so it reads clearly at a small size.

## How to check the main job

1. Run `node server.js`.
2. Open `http://localhost:3000`.
3. Use the made-up example in the text box or write a made-up report.
4. Choose a duration and frequency, then press **Check the pattern**.
5. Confirm the button changes to “Thinking…” while waiting.
6. Confirm the AI explains the possible repeated pattern and suggests a trusted adult.
7. Refresh the page and confirm the report is still in **Saved patterns**.

## Maybe Later

- A school-approved database with strong access controls.
- Trusted-adult accounts and a school review workflow.
- Anonymous reporting, if a school approves the process.
- Better pattern charts and optional location/time analysis.
- Testing with adults and students using consent and privacy safeguards.
