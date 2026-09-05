---
name: write-competitive
description: Transcribe a handwritten problem/solution into the site's Competitive section (IOQM/RMO, JEE, AIME, IMO). Preserves the user's prose verbatim, adds no figures, uses `.intuition` callouts wherever the notebook has a 💡 mark, registers the note in script.js, and deploys.
---

# Write a competitive-section note

Invoke when the user sends one or more images of a handwritten
problem-and-solution for the site's **Competitive** section and asks to
add it. Typical trigger: image path (HEIC / JPG / PNG) plus a one-liner
identifying the subject (IOQM/RMO, JEE, AIME, IMO) and the desired slug.

## 1. Read the image

If the file is HEIC, convert to JPEG first — macOS `sips` handles it in
one line:

```bash
mkdir -p /tmp/handnotes
sips -s format jpeg -Z 1600 <path>.HEIC --out /tmp/handnotes/<name>.jpg
```

Then read the JPEG with the Read tool. If handwriting is unclear on any
mathematical claim, ask the user before writing — don't guess.

## 2. Transcribe verbatim

- Follow the user's prose **as closely as possible**. Fix only grammar,
  spelling, and clearly-illegible math.
- Do **not** paraphrase, add framing sentences, or expand steps the user
  did not write.
- Convert handwritten math to KaTeX (`$…$` and `$$…$$`).
- No editorial adjectives ("astonishing", "beautiful"). Direct facts.

## 3. Highlight 💡 marks as `.intuition` callouts

Wherever the notebook has a 💡 (or ☼, star, exclamation, or any "notice
this" symbol) next to an idea, wrap that idea as a lavender **Key
insight.** callout — the site's always-visible highlight:

```markdown
<div class="intuition"><strong>Key insight.</strong> <the idea, in one paragraph></div>
```

Do NOT use the site's `.bulb` (`<details class="bulb">`) for these — that
component is a *collapsed off-ramp*, the opposite intent of a 💡 mark.

After writing an `.intuition` for an insight, **delete the plain prose
line beneath it that says the same thing**. Never let a callout and the
paragraph below it duplicate each other.

## 4. No figures

Competitive notes carry **no** Python-generated figures or interactive
visualisations by default (AUTHORING.md §7a). Do not create:

- `scripts/notes/competition-math/**/*.py`
- `assets/notes/competition-math/**/*.svg`
- `!interactive[…]` blocks

Only add a figure if the user explicitly asks for one on a specific note.

## 5. File location and slug

```
notes/competition-math/<subject>/<slug>.md
```

- `<subject>` is one of the site's current competitive subjects — currently
  `ioqm-rmo`, `jee`, `aime`, `imo`. If the user names a subject that does
  not exist, add it to `notesCategories` in `script.js` at the same time.
- `<slug>` is lexicographically ordered — the site displays a number by
  lex order in the subject dropdown. Examples:
  `polynomials-solved-1`, `polynomials-solved-2`, `number-theory-solved-1`.

## 6. Markdown template

```markdown
# <Subject> Mock — <Topic>, Q<N>

*Published: <Month D, YYYY>*
*Category: <Subject> — <Topic>*

---

## Problem

<Verbatim problem statement with KaTeX math.>

---

## Solution

<div class="intuition"><strong>Key insight.</strong> <first 💡-marked idea></div>

<working, verbatim from the notebook>

<div class="intuition"><strong>Key insight.</strong> <second 💡-marked idea, if any></div>

<remaining working, ending with the final answer>
```

Rules that apply site-wide and must not be broken:

- `*Published:*` is immutable (AUTHORING.md §2a). If a note is later
  updated, do NOT change this line. Add an optional `*Updated: <date>*`
  line if the change is substantive.
- Sections separated by `---`.
- First-appearance Wikipedia links on math terms (AUTHORING.md §6).
  Competitive notes tend to need few — use judgement, e.g. link
  `monotone`, `floor function`, `pigeonhole`, but skip everyday words.

## 7. KaTeX gotchas (must-follow)

- Prefer fixed-size `\Big|…\Big|` over stretchy `\left|…\right|` for
  short absolute values.
- Prefer `|a_k|^{1/k}` over `\sqrt[k]{|a_k|}`.
- Never use `\;` inside `$$…$$` — the parser eats the backslash and
  leaves a literal `;`.

See memory: [[feedback-katex-rendering]].

## 8. Register the note in script.js

Add an entry to the subject's `pages` array inside `notesCategories` in
`script.js`, matching the slug of the new file:

```js
{ id: 'ioqm-rmo', title: 'IOQM / RMO', ...,
  pages: [
      { id: 'polynomials-solved-1', title: 'Polynomials — Solved Problem 1' },
      { id: 'polynomials-solved-2', title: 'Polynomials — Solved Problem 2' }
  ] }
```

Titles listed here are fallbacks. On the subject page, the site
auto-fetches the `#` heading from each md so the displayed name always
matches the file.

## 9. Deploy

```bash
./deploy.sh "IOQM/RMO polynomials note N: <one-line description>"
```

`deploy.sh` also bumps the `?v=<timestamp>` cache-buster on every HTML,
so readers pick up any change immediately.

## 10. Related conventions (all still apply)

- AUTHORING.md — canonical site conventions.
- Memory: [[feedback-competitive-notes-no-visuals]] — the "no figures"
  rule this skill enforces.
- Memory: [[feedback-creation-date-immutable]] — `Published:` never
  changes on edits.
- Memory: [[feedback-katex-rendering]] — KaTeX construct rules.
- Memory: [[project-tensortheorist-site]] — site overview.
