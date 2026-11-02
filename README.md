# CFA Community Demo

A static, session-only community prototype. Open `index.html` in a browser; no build step is required.

- The browsing region starts at **Nationwide**. Profile city and society membership are separate.
- Use the **•••** button in the top-right corner to choose 中文 or English. The language preference is saved locally when browser storage is available.
- Interface labels and supplied example content are translated. Drafts and submitted member content stay in their original language.
- Matching spaces reuse the homepage request records; publishing, approval, edits and closure share the same data.
- All member records, reviews and messaging are demonstrations and reset on refresh. Language preference persists.

## Checks

- `node matching.test.cjs` checks category separation, filters, closure and expiry.
- `node language.test.cjs` uses Playwright with installed Chrome to check language persistence, preserved drafts, canonical select values, publishing and filters, plus layout boundaries at 320, 390, 600 and 1280px.
- Install Playwright in your development environment, or set `PLAYWRIGHT_MODULE` to its module path. Optionally set `CHROME_PATH` to a Chrome executable.

Translation entries live in `translations.js`; `language.js` localizes display text without changing application state values. Responsive bilingual rules live in `language.css`.
