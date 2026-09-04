# Authoring conventions

Every blog post and every note follows the same rules so they look, read, and
regenerate the same way. When you (or Claude) author a new piece of content,
follow these.

## 1. File layout mirrors the site tabs

| Content              | Markdown                                     | Assets                                        | Scripts                                              |
|----------------------|----------------------------------------------|-----------------------------------------------|------------------------------------------------------|
| Blog post `<slug>`   | `blog/<slug>/index.md`                       | `assets/blogs/<slug>/`                        | `scripts/blog/<slug>/*.py`                           |
| Note page            | `notes/<cat>/<sub>/<slug>.md`                | `assets/notes/<cat>/<sub>/`                   | `scripts/notes/<cat>/<sub>/*.py`                     |

Note page slugs sort **lexicographically** — this is the number the site
displays next to the title. Prefix with `1-`, `2-`, `3-…` to control ordering.

## 2. Markdown header (required)

```markdown
# <Human title — becomes the H1 and the search index title>

*Published: <Month D, YYYY>*
*Category: <freeform label — shown as a tag>*

<Lead paragraph>
```

### 2a. `Published:` is immutable

The `*Published:*` line is the **creation date** of the piece. It is tied to
the file's slug / URL — that is, to the unique ID of the post. It **must
not be changed** when the content is later edited. All of the following
depend on this rule:

- The date printed at the top of the article.
- The default (empty-box) sort order on the search page.
- The date shown next to search results.

If you want to signal that a post has been substantively updated, add an
extra `*Updated:*` line beneath `Published:`. It is purely informational —
neither the sort order nor the primary date on the article uses it.

For blog posts, the same date lives in `script.js` under the post's entry
in `blogPosts` as the `date` field. Keep the two in sync at creation time,
and never edit either after. HTTP `Last-Modified` is deliberately ignored
by the search index so that re-deploys do not shift ordering.

## 3. Sections and dividers

Break each post into thematic sections, and separate every section with a
`---` horizontal rule. If you use in-page anchors, put an `<a id="…"></a>`
directly above the heading and link to it from a "Contents" list near the top.

## 4. Tone — direct facts, no editorial

Write mathematical exposition as statements of fact.

- Declarative, present tense: *"Euler's identity rewrites the sum as a product over primes."*
- **Never** hype the math itself: no "astonishing", "beautiful", "deepest secret", "everything falls out".
- No exclamations. No adjectives about the subject.
- If a fact is important, state it. Do not tell the reader it is important.
- If a claim needs justification, either prove it or point at a reference. Do not gesture.

## 5. Callouts — three kinds

Three distinct visual callouts. Use them sparingly and only where the rule fits.

### 5.1 Intuition (lavender, always visible)

A specific takeaway. One sentence, at most one paragraph. Reserved for the
"if you remember one thing" moment.

```markdown
<div class="intuition"><strong>Intuition.</strong> A pre-order is the
simplest kind of category: at most one arrow between any two objects.</div>
```

Rules:

- **At most one per section.** Often zero.
- Never a running commentary. Never appears immediately after every definition.
- Lead with `<strong>Intuition.</strong>`.

### 5.2 Sneak peek (mint, always visible)

A forward pointer to something the piece deliberately defers.

```markdown
<div class="sneak-peek"><strong>Sneak peek.</strong> The exponential object
$b^a$ turns "$a \Rightarrow b$" into a first-class arrow. Covered in
the next note.</div>
```

Rules:

- Only when there is a **concrete later item** to point at.
- Lead with `<strong>Sneak peek.</strong>`.
- Ends the section or the file.

### 5.3 Bulb (amber, collapsed by default)

An expandable off-ramp for a reader who needs it: small example, short
derivation, or plain-language version. Uses the HTML5 `<details>` element so
the flow of the main text stays intact.

```markdown
<details class="bulb">
<summary>Show a small example</summary>

Concrete example goes here. Blank lines around markdown so the parser
handles it.

</details>
```

Rules:

- Default state is **collapsed**. Do not add `open`.
- Summary is a short imperative: `Show a small example`, `Short derivation`,
  `Explained without jargon`, `See the calculation`.
- CSS auto-prepends the 💡 icon — do not include it in the summary text.
- Use freely where a curious reader might stumble but the main line should
  not stop.

## 6. Wikipedia links on first appearance

The **first time** a mathematical term appears in a note or blog, link it to
its Wikipedia page. Once per term per file.

```markdown
A [pre-order](https://en.wikipedia.org/wiki/Preorder) on a set …
```

Do not re-link the same term again. Do not link common English words.

## 7. Figures come from Python

Every non-photographic figure is produced by a Python script that lives next
to the content it illustrates. Every figure imports the shared style in
`scripts/lib/svg_style.py` so the whole site shares one visual language
(pastel lavender background, JetBrains Mono labels, violet edges, amber
nodes, muted text, rose highlight).

Template:

```python
"""One-line description of what the figure shows."""
import argparse, os, sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__),
                                                "..", "..", "..", "lib")))

from svg_style import PALETTE, open_svg, close_svg, line, circle, text, rect


def render(...):
    parts = [open_svg(width, height, aria="Short human description")]
    # ... use line/circle/text/rect, always with colors from PALETTE.
    parts.append(close_svg())
    return "".join(parts)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=None)
    args = parser.parse_args()
    svg = render()
    if args.out:
        with open(args.out, "w") as f:
            f.write(svg)
    else:
        print(svg)
```

Caption every generated figure with a GitHub link to the script. The
caption is a paragraph whose entire body is italicized — `*…*` on its
own line, nothing else. CSS auto-renders any such paragraph in a smaller,
muted, centered style so figures stay visually anchored to their caption:

```markdown
![Alt text describing what the reader sees](assets/…/figure.svg)

*Generated by [`figure_name.py`](https://github.com/TensorTheorist/TensorTheorist.github.io/blob/main/scripts/…/figure_name.py).*
```

The same rule applies to the caption after an `!interactive[…]` block.

## 8. Interactive figures

Reference from markdown as `!interactive[<slug>]` on its own line. Ship the
hydration script at `assets/<blog-or-notes>/<parent>/<slug>.js`. The script
self-hydrates: finds `[data-interactive="<slug>"]` and fills the container.
Reuse the same palette by defining `const PALETTE = { bg: '#f5f1ff', … }` at
the top of the JS. Link to a Python reference from the widget header.

## 9. Site-wide image sizing

`style.css` caps every image and canvas inside an article at
`max-width: 480px` and centers it. Do not override this in markdown.

**Do NOT add a bare `.blog-post-body svg` (or `.blog-post-body *` etc.) rule
to size figures.** KaTeX draws `\left|`, `\right|`, `\sqrt`, and other
stretchy shapes as inline `<svg>` elements *inside the article body*. Any
outer rule that forces `width: 100%`, `max-width`, `height: auto`, or
`display: block` on those SVGs shreds the math (bars detach, surds vanish,
overlines slide onto text). The current sizing rule intentionally targets
only `img` and `.interactive-slot canvas`.

## 9a. KaTeX authoring rules — avoid the fragile constructs

The parts of KaTeX that render as auto-stretched inline SVG are the source
of every math bug we have hit. Write around them:

- **Absolute values / delimiters.** Prefer fixed-size `\Big|…\Big|` (or
  `\bigl|…\bigr|`) over `\left|…\right|` for short expressions. `\left/\right`
  triggers KaTeX's SVG delimiter pipeline; `\Big` uses a plain font glyph.
- **k-th roots.** Prefer the power form `|a_k|^{1/k}` over `\sqrt[k]{|a_k|}`.
  The `\sqrt[…]` surd uses SVG; the power form is pure font glyphs.
- **Square roots.** `\sqrt{x}` (no index) is usually fine; if it acts up,
  switch to `x^{1/2}`.
- **No `\;` spacing** inside `$$…$$` — the markdown parser eats the backslash
  and leaves a literal `;` in the output. Use plain space or `\,` if you need it.
- **Math inside `<details>` still works** because a `toggle` listener
  re-renders KaTeX on first open (see `blog-post.html` /
  `note-post.html`). Leave that in place.

When in doubt, write the math the fragile way once, load the page, hard-refresh
(Cmd+Shift+R) once, and check every `<details>` after opening it.

## 10. Handwritten notes → site content pipeline

The intended flow when you send hand-drawn notes:

1. You send: **screenshots** of your handwritten pages **+ one line** stating
   where they belong, e.g.
   > *This is a note for `notes/algebra/abstract-algebra/`, page 2 of the
   > groups series. Slug: `2-subgroups`.*
2. Claude transcribes:
   - Prose → direct-tone markdown.
   - Math → KaTeX.
   - Any hand-drawn figure → a new Python script under
     `scripts/<same-path>/`, output SVG under `assets/<same-path>/`, using
     `svg_style` so it matches the rest of the site.
3. Callouts are applied only where the rules in §5 fit — not automatically
   after every definition.
4. First-appearance Wikipedia links are added.
5. The page is registered in `script.js` under the right subject; the file is
   deployed via `./deploy.sh`.
6. If any hand-written line is ambiguous, Claude asks a targeted question
   before writing.

## 11. Publishing

```bash
./deploy.sh "Short imperative commit message"
```

Rewrites `?v=<timestamp>` cache-buster on `script.js` and `style.css`;
stages, commits, pushes to `main`. Live at https://tensortheorist.github.io.
